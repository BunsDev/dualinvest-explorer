import { useState, useCallback, useEffect, useMemo } from 'react'
import { DovRecordRaw, OrderRecord } from 'utils/fetch/record'
import { Axios } from 'utils/axios'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { getOtherNetworkLibrary } from 'connectors/multiNetworkConnectors'
import DEFI_VAULT_ABI from 'constants/abis/defi_vault.json'
import { getContract } from 'utils'
import { getMappedSymbol } from 'constants/currencies'

export enum InvestStatus {
  Confirming = 1,
  Ordered = 2,
  ReadyToSettle = 3,
  Settled = 4,
  OrderFailed = 5,
  OrderSuccess = 6,
  EverythingFailed = 7
}

export enum INVEST_TYPE {
  DO_NOT_USE_THIS,
  dualInvest,
  recur,
  dov
}

export function useOrderRecords({
  address,
  orderId,
  productId,
  pageNum,
  pageSize,
  chainId
}: {
  address?: string
  orderId?: string
  productId?: string
  pageNum?: number
  pageSize?: number
  chainId?: string
}) {
  const [orderList, setOrderList] = useState<OrderRecord[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const promiseFn = useCallback(() => {
    return Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>('getOrderRecord', {
      pageNum,
      pageSize,
      address,
      orderId,
      productId,
      chainId
    })
  }, [pageNum, pageSize, address, orderId, productId, chainId])

  const callbackFn = useCallback(r => {
    setOrderList(r.data.data.records)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return useMemo(() => {
    return {
      orderList,
      pageParams
    }
  }, [orderList, pageParams])
}

const defaultPageSize = 8

export const getDovDetails = (record: DovRecordRaw) => {
  if (!record) return undefined
  const library = getOtherNetworkLibrary(record.chainId)
  const contract = record.swapAddress && library ? getContract(record.vaultAddress, DEFI_VAULT_ABI, library) : null
  return new Promise(async (resolve, reject) => {
    try {
      const res = await contract?.vaultParams()
      const { asset, underlying } = res
      const assetContract = library ? getContract(asset, DEFI_VAULT_ABI, library) : null
      const assetSymbol = await assetContract?.symbol()
      if (asset === underlying) {
        resolve({ asset: assetSymbol, underlying: assetSymbol })
        return
      }
      const underlyingContract = library ? getContract(underlying, DEFI_VAULT_ABI, library) : null
      const underlyingSymbol = await underlyingContract?.symbol()
      resolve({ asset: assetSymbol, underlying: underlyingSymbol })
      return
    } catch (e) {
      reject()
      return null
    }
  })
}

export function useDovOrderRecords({
  address,
  orderId,
  productId,
  chainId,
  currentPage,
  pageSize
}: {
  address?: string
  orderId?: string
  productId?: string
  chainId?: string
  currentPage?: number
  pageSize?: number
}) {
  const [orderList, setOrderList] = useState<DovRecordRaw[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })
  const perPage = pageSize ?? defaultPageSize
  const promiseFn = useCallback(() => {
    return Axios.post<{ records: DovRecordRaw[]; pages: string; size: string; total: string }>('vaultOrderList', {
      address,
      orderId,
      productId,
      chainId
    })
  }, [address, orderId, productId, chainId])

  const callbackFn = useCallback(async r => {
    const res: { underlying: string; asset: string }[] = await Promise.all(
      r.data.data.map((data: DovRecordRaw) => getDovDetails(data))
    )

    const mapped = r.data.data.map((data: DovRecordRaw, index: number) => {
      const r: { underlying: string; asset: string } = res[index]
      return {
        ...data,
        currency: getMappedSymbol(r.underlying),
        investCurrency: getMappedSymbol(r.asset)
      }
    })
    setOrderList(mapped.reverse())
  }, [])

  useEffect(() => {
    setPageParams({
      count: orderList ? Math.ceil(orderList.length / perPage) : 0,
      perPage: perPage,
      total: orderList ? orderList.length : 0
    })
  }, [orderList, perPage])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  const res = useMemo(() => {
    const curPage = currentPage ?? 1
    return {
      dovOrderList: orderList?.slice((curPage - 1) * perPage, curPage * perPage),
      pageParams
    }
  }, [currentPage, orderList, pageParams, perPage])

  return res
}

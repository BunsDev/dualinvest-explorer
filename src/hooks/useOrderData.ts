import { useState, useCallback } from 'react'
import { OrderRecord } from 'utils/fetch/record'
import { Axios } from 'utils/axios'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'

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
  recur
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
  }, [pageNum, pageSize, address, orderId, productId])

  const callbackFn = useCallback(r => {
    setOrderList(r.data.data.records)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return {
    orderList,
    pageParams
  }
}

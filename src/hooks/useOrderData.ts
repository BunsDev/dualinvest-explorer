import { useState, useCallback, useMemo } from 'react'
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

const PageSize = 8

export type FilterType = 'All'

export function useOrderRecords(
  investType: INVEST_TYPE,
  currency: FilterType,
  investStatus?: number | number[],
  address?: string,
  orderId?: string,
  productId?: string,
  pageNum?: number,
  pageSize?: number
) {
  const [orderList, setOrderList] = useState<OrderRecord[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const filteredOrderList = useMemo(() => {
    if (!Array.isArray(investStatus) || !orderList) return undefined
    return orderList.reduce((acc, order) => {
      if (currency !== 'All' && order.currency !== currency) {
        return acc
      }
      if (investStatus.includes(order.investStatus) && order.investStatus === InvestStatus.ReadyToSettle) {
        acc.unshift(order)
        return acc
      }
      if (investStatus.includes(order.investStatus)) {
        acc.push(order)
        return acc
      }
      return acc
    }, [] as OrderRecord[])
  }, [currency, investStatus, orderList])

  const pageCount = useMemo(() => {
    if (!filteredOrderList) return 0

    return Math.ceil(filteredOrderList.length / PageSize)
  }, [filteredOrderList])

  const promiseFn = useCallback(() => {
    return Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>('getOrderRecord', {
      investType,
      investStatus: Array.isArray(investStatus) ? undefined : investStatus,
      pageNum: Array.isArray(investStatus) ? undefined : pageNum,
      pageSize: pageSize,
      currency: currency === 'All' ? undefined : currency,
      address,
      orderId,
      productId
    })
  }, [currency, investStatus, investType, pageNum, pageSize, address, orderId, productId])

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
    if (Array.isArray(investStatus)) {
      return {
        orderList:
          pageNum && filteredOrderList
            ? filteredOrderList.slice((pageNum - 1) * PageSize, pageNum * PageSize)
            : undefined,
        pageParams: { count: pageCount, perPage: PageSize, total: filteredOrderList?.length ?? 0 }
      }
    } else {
      return {
        orderList,
        pageParams
      }
    }
  }, [filteredOrderList, investStatus, orderList, pageCount, pageNum, pageParams])
}

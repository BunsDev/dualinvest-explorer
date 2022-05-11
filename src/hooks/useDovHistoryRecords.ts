import { useState, useMemo, useCallback } from 'react'
import { DefiRecord } from 'utils/fetch/defiRecord'
import { Axios } from 'utils/axios'
import usePollingWithMaxRetries from './usePollingWithMaxRetries'
import { DEFAULT_COIN_SYMBOL, SUPPORTED_CURRENCIES } from 'constants/currencies'
import { parsePrecision } from 'utils/parseAmount'
import { trimNumberString } from 'utils/trimNumberString'
import qs from 'qs'

const PageSize = 8
const types = [5, 6, 7, 8].join('&types=')
// const types = [5, 6, 7, 8].join(',')

export function useHistoryRecords(pageNum: number, account?: string, chainId?: number) {
  const [orderList, setOrderList] = useState<DefiRecord[] | undefined>(undefined)
  const [pageParams, setPageParams] = useState<{ count: number; perPage: number; total: number }>({
    count: 0,
    perPage: 0,
    total: 0
  })

  const filteredOrderList = useMemo(() => {
    if (!orderList) return undefined
    return orderList.reduce((acc, order) => {
      const currency = DEFAULT_COIN_SYMBOL[order.chainId as keyof typeof DEFAULT_COIN_SYMBOL]
      const isCall = [5, 6].includes(order.type)
      const investCurrency = isCall ? currency : 'USDC'
      if ([5, 6, 7, 8].includes(order.type)) {
        acc.push({
          ...order,
          timestamp: +order.timestamp * 1000,
          actionType: [6, 8].includes(order.type) ? 'withdraw' : 'deposit',
          currency: currency,
          callPut: isCall ? 'CALL' : 'PUT',
          investCurrency: investCurrency,
          amount: trimNumberString(
            parsePrecision(trimNumberString(order.amount, 0), SUPPORTED_CURRENCIES[investCurrency].decimals),
            6
          )
        })
        return acc
      }
      return acc
    }, [] as DefiRecord[])
  }, [orderList])

  // const pageCount = useMemo(() => {
  //   if (!filteredOrderList) return 0

  //   return Math.ceil(filteredOrderList.length / PageSize)
  // }, [filteredOrderList])

  const promiseFn = useCallback(() => {
    const params = account
      ? { account, pageSize: PageSize, pageNum, chainId }
      : {
          pageSize: PageSize,
          pageNum,
          chainId
        }
    return Axios.get<{ records: DefiRecord[] }>('getAccountRecord?' + qs.stringify(params) + '&types=' + types)
  }, [account, chainId, pageNum])

  const callbackFn = useCallback(r => {
    setOrderList(r.data.data.list)
    setPageParams({
      count: parseInt(r.data.data.pages, 10),
      perPage: parseInt(r.data.data.size, 10),
      total: parseInt(r.data.data.total, 10)
    })
  }, [])

  usePollingWithMaxRetries(promiseFn, callbackFn, 50000)

  return useMemo(() => {
    return {
      orderList: filteredOrderList,
      pageParams
    }
  }, [filteredOrderList, pageParams])
}

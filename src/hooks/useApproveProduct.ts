//import { NETWORK_CHAIN_ID } from 'constants/chain'
import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useMemo } from 'react'
import { INVEST_TYPE, useOrderRecords } from './useOrderData'
import { useProduct } from './useProduct'

export function useApproveProduct(productId: string) {
  const { orderList } = useOrderRecords({
    investType: INVEST_TYPE.dualInvest,
    productId: productId,
    pageNum: 1,
    pageSize: 999999
  })

  const order = useMemo(() => {
    if (!orderList || orderList.length === 0) return

    return orderList[0]
  }, [orderList])

  const chainId = order ? order.chainId : NETWORK_CHAIN_ID

  const product = useProduct(chainId, productId)

  if (!orderList || orderList.length === 0) return

  return product
}

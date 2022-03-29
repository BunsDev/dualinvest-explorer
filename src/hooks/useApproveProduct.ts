//import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useEffect, /* useMemo */ useState } from 'react'
/* import { Axios } from 'utils/axios'
import { Product, productFormatter } from 'utils/fetch/product'
import { OrderRecord } from 'utils/fetch/record' */
import { useOrderRecords } from './useOrderData'
import { useProduct } from './useProduct'
const PER_PAGE = 8
export function useApproveProduct(productId: string, page: number) {
  const [chainId, setChainId] = useState(0)
  const { orderList, pageParams } = useOrderRecords({
    productId: productId,
    pageNum: page,
    pageSize: PER_PAGE
  })

  useEffect(() => {
    if (orderList && orderList.length > 0) {
      setChainId(orderList[0].chainId)
    } else {
      setChainId(0)
    }
  }, [orderList])

  const product = useProduct(chainId, productId)

  return { product: chainId ? product : undefined, orderList, pageParams }
}

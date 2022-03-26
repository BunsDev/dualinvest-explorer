//import { NETWORK_CHAIN_ID } from 'constants/chain'
import { useEffect, useMemo, useState } from 'react'
import { Axios } from 'utils/axios'
import { Product, productFormatter } from 'utils/fetch/product'
import { OrderRecord } from 'utils/fetch/record'
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
  const product = useProduct(chainId, productId)

  useEffect(() => {
    if (orderList && orderList.length > 0) {
      setChainId(orderList[0].chainId)
    } else {
      setChainId(0)
    }
  }, [orderList])

  return { product: chainId ? product : undefined, orderList, pageParams }
}

export function useApproveProduct2(productId: string, page: number) {
  const [orderList, setOrderList] = useState<OrderRecord[] | undefined | null>(undefined)
  const [product, setProduct] = useState<Product | undefined | null>(undefined)

  useEffect(() => {
    ;(async () => {
      const orderList = await Axios.get<{ records: OrderRecord[]; pages: string; size: string; total: string }>(
        'getOrderRecord',
        {
          productId
        }
      )
      const orders = orderList?.data?.data?.records
      if (!orders || orders.length === 0) {
        setProduct(null)
        setOrderList(null)
        return
      }
      setOrderList(orders)

      const product = await Axios.get('getProducts', { productId: orders[0].productId, chainId: orders[0].chainId })
      setProduct(productFormatter(product.data.data))
    })()
  }, [productId])

  return useMemo(() => {
    return { product, orderList, pageParams: { count: 2, perPage: PER_PAGE, total: 5 } }
  }, [orderList, product])
}

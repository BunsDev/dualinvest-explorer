import { useState, useCallback } from 'react'
import { Axios } from 'utils/axios'
import { productFormatter, Product, TopProduct, TopProductRaw, topProductFomatter } from 'utils/fetch/product'
import { ChainId } from 'constants/chain'

import usePollingWithMaxRetries from './usePollingWithMaxRetries'

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get('getProducts?productId=' + productId), [productId])
  const callbackFn = useCallback(r => setProduct(productFormatter(r.data.data)), [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return product
}

export function useTopProducts(chainId: ChainId) {
  const [products, setProducts] = useState<TopProduct[]>([])

  const promiseFn = useCallback(() => Axios.get('topProducts', { chainId }), [chainId])
  const callbackFn = useCallback(
    r => setProducts(r.data.data.map((datum: TopProductRaw) => topProductFomatter(datum))),
    []
  )

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return products
}

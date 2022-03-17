import { useState, useCallback } from 'react'
import { Axios } from 'utils/axios'
import { productFormatter, Product } from 'utils/fetch/product'

import usePollingWithMaxRetries from './usePollingWithMaxRetries'

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined)

  const promiseFn = useCallback(() => Axios.get('getProducts?productId=' + productId), [productId])
  const callbackFn = useCallback(r => setProduct(productFormatter(r.data.data)), [])

  usePollingWithMaxRetries(promiseFn, callbackFn)

  return product
}

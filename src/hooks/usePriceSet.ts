import { useEffect, useState } from 'react'
import { SUPPORTED_CURRENCY_SYMBOL } from 'constants/currencies'

export function usePrice(symbol: string | undefined, delay = 15000) {
  const [price, setPrice] = useState<undefined | string>(undefined)

  useEffect(() => {
    if (!symbol) return undefined
    let isMounted = true
    const call = () => {
      if (symbol === 'USDT') {
        setPrice('1')

        return new Promise(() => {
          return new Response(null, { status: 200, statusText: '' })
        })
      }
      return fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}USDT`, {
        method: 'GET',
        mode: 'cors',
        headers: {}
      })
        .then(r => {
          return r.clone().json()
        })
        .then(json => {
          if (isMounted) {
            setPrice(json.price)
          }
        })
        .catch(e => console.error(e))
    }
    call()
    const id = setInterval(call, delay)

    return () => {
      clearInterval(id)
      isMounted = false
    }
  }, [delay, symbol])
  return price
}

export function usePriceForAll() {
  const [prices, setPrices] = useState({})

  useEffect(() => {
    let isMounted = true
    const call = async () => {
      try {
        const r = await Promise.all(
          SUPPORTED_CURRENCY_SYMBOL.map(symbol => {
            if (symbol === 'USDT') {
              return new Promise(() => {
                return new Response(null, { status: 200, statusText: '' })
              })
            }
            return fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}USDT`, {
              method: 'GET',
              mode: 'cors',
              headers: {}
            })
          })
        )

        const res = await Promise.all(
          r.map((item: any) => {
            return item.clone().json()
          })
        )
        const priceMap = res.reduce((acc, { price }, idx) => {
          if (SUPPORTED_CURRENCY_SYMBOL[idx] === 'USDT') {
            return acc
          }
          acc[SUPPORTED_CURRENCY_SYMBOL[idx]] = price
          return acc
        }, {})

        if (isMounted) {
          setPrices({ ...priceMap, USDT: 1 })
        }
      } catch (e) {
        console.error(e)
      }
    }
    call()
    const id = setInterval(call, 120000)
    return () => {
      clearInterval(id)
      isMounted = false
    }
  }, [])

  return prices
}

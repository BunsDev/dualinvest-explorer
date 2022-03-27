import { useEffect, useState } from 'react'

export function usePrice(symbol: string | undefined, delay = 15000) {
  const [price, setPrice] = useState<undefined | string>(undefined)

  useEffect(() => {
    if (!symbol) return undefined
    let isMounted = true
    const call = () => {
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

import { usePrice } from 'hooks/usePriceSet'

export default function PriceU({ symbol, amount }: { symbol: string; amount: number }) {
  const price = usePrice(symbol)

  return <>{price ? (+price * amount).toFixed(2) : amount.toFixed(2)}</>
}

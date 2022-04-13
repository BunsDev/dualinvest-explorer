import dayjs from 'dayjs'

export interface createOrder {
  address: string
  amount: number
  currency: string
  investStatus: 1 | 2 | 3 | 4 | 5 | 6
  orderId: number
  productId: number
}

interface ProductRaw {
  annual_ror: string
  currency: string
  chain: string
  expired_at: string
  expired_str: string
  index_price: string
  invest_currency: string
  source: string
  is_active: boolean
  re_invest: boolean
  multiplier: string
  order_limit: string
  order_limit_u: string
  price: string
  product_id: number
  strike_currency: string
  strike_price: string
  ts: number
  type: string
  gt_strike_price: string
  lt_strike_price: string
}

export interface Product {
  productId: number
  expiredAt: string
  apy: string
  type: string
  chain: string
  source: string
  isActive: boolean
  isRecur: boolean
  strikePrice: string
  currentPrice: string
  multiplier: string
  currency: string
  investCurrency: string
  orderLimit: string
  ts: number
  gtStrikePrice: string
  ltStrikePrice: string
  strikeCurrency: string
  price: string
}

export const productFormatter = (raw: ProductRaw): Product => {
  return {
    price: raw.price,
    currentPrice: raw.index_price,
    productId: raw.product_id,
    expiredAt: dayjs(+raw.expired_at * 1000).format('MMM DD, YYYY'),
    apy: (+raw.annual_ror * 100).toFixed(2) + '%' ?? '-',
    type: raw.type,
    chain: raw.chain,
    source: raw.source,
    isActive: raw.is_active,
    isRecur: raw.re_invest,
    strikePrice: raw.strike_price,
    multiplier: raw.multiplier,
    currency: raw.currency,
    investCurrency: raw.invest_currency,
    orderLimit: raw.order_limit,
    ts: raw.ts * 1000,
    gtStrikePrice: raw.gt_strike_price,
    ltStrikePrice: raw.lt_strike_price,
    strikeCurrency: raw.strike_currency
  }
}

export interface TopProductRaw {
  invest_currency: string
  amount: string
  invest_status: number
  multiplier: string
  amount_raw: string
  product_id: number
  invest_type: number
  amount_u: string
  strike_price: string
  expired_at: string
  ts: string
  order_id: number
  type: string
}

export interface TopProduct {
  investCurrency: string
  amount: string
  investStatus: number
  multiplier: string
  amountRaw: string
  productId: number
  investType: number
  amountU: string
  strikePrice: string
  expiredAt: string
  ts: string
  orderId: number
  type: string
}

export const topProductFomatter = ({
  invest_currency,
  amount,
  invest_status,
  multiplier,
  amount_raw,
  product_id,
  invest_type,
  amount_u,
  strike_price,
  expired_at,
  ts,
  order_id,
  type
}: TopProductRaw): TopProduct => {
  return {
    investCurrency: invest_currency,
    amount,
    investStatus: invest_status,
    multiplier,
    amountRaw: amount_raw,
    productId: product_id,
    investType: invest_type,
    amountU: amount_u,
    strikePrice: strike_price,
    ts,
    expiredAt: expired_at,
    orderId: order_id,
    type
  }
}

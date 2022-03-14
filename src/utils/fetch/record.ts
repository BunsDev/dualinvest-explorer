import { INVEST_TYPE } from 'hooks/useOrderData'

export interface OrderRecord {
  address: string
  amount: number
  annualRor: string
  confirmOrderHash: string
  createdAt: number
  currency: string
  deliveryPrice: string
  earn: string
  expiredAt: number
  hash: string
  indexPrice: string
  investStatus: number
  investCurrency: string
  isLiquidated: string
  multiplier: string
  orderId: number
  price: string
  productId: number
  returnedAmount: string
  returnedCurrency: string
  signCount: string
  status: string
  strikeCurrency: string
  strikePrice: string
  ts: number
  type: string
  investType: INVEST_TYPE
}

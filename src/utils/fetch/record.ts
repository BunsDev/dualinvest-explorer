import { INVEST_TYPE } from 'hooks/useOrderData'

export interface OrderRecord {
  address: string
  amount: number
  annualRor: number
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
  multiplier: number
  orderId: number
  price: string
  productId: number
  returnedAmount: string
  returnedCurrency: string
  signCount: string
  status: string
  strikeCurrency: string
  strikePrice: number
  ts: number
  type: string
  investType: INVEST_TYPE
}

export interface DefiRecordRaw {
  id: string
  account: string
  hash: string
  symbol: string
  currency: string
  amount: string
  timestamp: string
  type: number
  investCurrency: string
  chainId: number
}

export interface DefiRecord {
  id: string
  account: string
  hash: string
  symbol: string
  currency: string
  amount: string
  timestamp: number
  type: number
  investCurrency: string
  chainId: number
  actionType: 'deposit' | 'withdraw'
  callPut: 'CALL' | 'PUT'
}

// @flow

export type OrderError = {
  key: string,
  message: string
}

export type NewOrderParams = {
  marketId: string,
  action?: 'BUY' | 'SELL',
  type: string,         // 'LIMIT' | 'MARKET' | 'BOX_TOP' | 'SNAP_TO_PRIMARY' | 'SNAP_TO_MARKET',
  timeInForce: string,  // 'GTC' | 'IOC' | 'FOK',
  priceStr?: string,
  quantityStr?: string,
  amountStr?: string
}

export type NewOrderResult = {
  params: NewOrderParams,
  error?: OrderError,
}

export type NewOrderHandler = (params: NewOrderParams) => Promise<NewOrderResult>

export type CancelOrderParams = {
  marketId: string,
  orderId: string
}

export type CancelOrderResult = {
  params: CancelOrderParams,
  error?: OrderError,
}

export type CancelOrderHandler = (params: CancelOrderParams) => Promise<CancelOrderResult>
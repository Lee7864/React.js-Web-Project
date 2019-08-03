// @flow
import Decimal from 'decimal.js'
import type { Order } from '../types/Trading'
import type { NewOrderParams } from '../types/OrderRequest'

export type OrderNumbers = {
  price: Decimal | null,
  quantity: Decimal | null,
  amount: Decimal | null,
  filledQuantity: Decimal | null,
  filledAmount: Decimal | null,
}

export const tryGreaterThanZero = (s?: string): Decimal | null => {
  try {
    if (s) {
      const d = new Decimal(s)
      if (d.greaterThan(0)) {
        return d
      }
    }
  } catch (e) {
    // not a decimal
    // console.error(s, e)
  }
  return null
}

export const firstGreaterThanZero = (a?: string, b?: string): Decimal | null => {
  const d = tryGreaterThanZero(a)
  if (d) {
    return d
  }
  return tryGreaterThanZero(b)
}

export const presentationalOrderNumbers = (order: Order): OrderNumbers => {
  const price: Decimal | null = firstGreaterThanZero(order.effectivePrice, order.orderedPrice)
  const quantity: Decimal | null = firstGreaterThanZero(order.effectiveQuantity, order.orderedQuantity)
  let amount: Decimal | null = firstGreaterThanZero(order.effectiveAmount, order.orderedAmount)
  if (!amount && price && quantity) {
    amount = Decimal.mul(price, quantity)
  }
  return {
    price: price,
    quantity: quantity,
    amount: amount,
    filledQuantity: tryGreaterThanZero(order.filledQuantity),
    filledAmount: tryGreaterThanZero(order.filledAmount),
  }
}


export const normalizeNewOrderParams = (params: NewOrderParams): NewOrderParams | null => {
  if (params.action !== 'BUY' && params.action !== 'SELL') {
    return null
  }
  const normalized: NewOrderParams = {
    marketId: params.marketId,
    action: params.action,
    type: params.type,
    timeInForce: params.timeInForce,
  }

  if (params.type == 'LIMIT') {
    normalized.type = params.type
    normalized.priceStr = params.priceStr
    normalized.quantityStr = params.quantityStr
    return normalized
  } else if (
    params.type == 'MARKET'
    || params.type == 'BOX_TOP'
    || params.type == 'SNAP_TO_PRIMARY'
    || params.type == 'SNAP_TO_MARKET'
  ) {
    normalized.type = params.type

    switch (params.action) {
    case 'BUY':
      normalized.amountStr = params.amountStr
      return normalized
    case 'SELL':
      normalized.quantityStr = params.quantityStr
      return normalized
    }
  }

  return null
}
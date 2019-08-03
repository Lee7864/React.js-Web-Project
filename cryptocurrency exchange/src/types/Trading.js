// @flow
import Decimal from 'decimal.js'

type TickSize = {
  low_closed: string,
  high_open: string,
  tick_size: string
}

type Currency = {
  decimalPlaces: number,
  names: { [string]: string },
  pricingLimitMinAmount: string,
  symbol: string,
  tickSizeRanges: TickSize[],
  transeferable: boolean,
  transferFee: string,
  type: string,
}

type Market = {
  baseDecimalPlaces: number,
  baseNames: { [string]: string },
  baseNonLimitMinQuantity: string,
  baseSymbol: string,
  feeRatio: string,
  marketId: string,
  marketSymbol: string,
  pricingCurrency: Currency,
  status: 'PREPARED' | 'OPENING' | 'OPEN' | 'VI_OPEN' | 'CLOSING' | 'CLOSED' | 'TERMINATED' | 'SUSPENDED'
}

type MarketDetails = {  // ticker
  price: string,
  changeRate: string
}

type MarketSummary = {  // 24h
  open: string,
  close: string,
  high: string,
  low: string,
  amount: string,
  volume: string
}

type MarketCap = {
  marketId: string,
  supply: number,
  marketCap: number
}

type Order = {
  id: string,
  baseSymbol: string,
  marketSymbol: string,
  marketId: string,
  action: 'BUY' | 'SELL' | 'KILL',
  type?: 'LIMIT' | 'MARKET' | 'BOX_TOP' | 'SNAP_TO_PRIMARY' | 'SNAP_TO_MARKET',
  orderedPrice?: string,
  orderedQuantity?: string,
  orderedAmount?: string,
  effectivePrice?: string,
  effectiveQuantity?: string,
  effectiveAmount?: string,
  bookedQuantity?: string,
  filledQuantity?: string,
  filledAmount?: string,
  invalidatedQuantity?: string,
  invalidatedAmount?: string,
  stateRevision: number,
  status: 'OPEN' | 'FILLED' | 'CANCELLED' | 'KILLED' | 'REJECTED' | 'REFUTED' | 'DROPPED',
  createdAt: string,
  closedAt?: string
}

type TradePrice = {
  changeAmount: string,
  changeRate: string,
  price: string,
  quantity: string,
  volumePower: string,
}

type Trade = {
  marketId: string,
  sequence: number,
  direction: 'BUY' | 'SELL' | 'NONE',
  priceList: TradePrice[],
  occurredAt: string
}

type Balance = {
  currencySymbol: string,
  amount: string,
  frozen: string,
  revision: string
}

type BookedPriceAndQuantity = {
  sequence: number,
  price: Decimal,
  quantity: Decimal
}

type OrderBook = {
  maxSequence: number,
  loaded: boolean,
  sellItems: BookedPriceAndQuantity[],
  buyItems: BookedPriceAndQuantity[],
  estimatedVIInfo: BookedPriceAndQuantity | null,
  marketStatus: 'LOADING' | 'PREPARED' | 'OPENING' | 'OPEN' | 'VI_OPEN' | 'CLOSING' | 'CLOSED' | 'TERMINATED' | 'SUSPENDED'
}

export type {
  TickSize,
  Market,
  MarketDetails,
  MarketSummary,
  MarketCap,
  Order,
  Trade,
  TradePrice,
  Balance,
  BookedPriceAndQuantity,
  OrderBook
}

// @flow
import type { Order } from './Trading'

type OrderEphemeralStatus = 'BEING_KILLED' | 'FAIL_TO_KILL' | 'HIGHLIGHTED'

type EphemeralOrder = {
  order: Order,
  timestamp: number,
  ephemeralStatus: OrderEphemeralStatus,
}

type HighlightableOrderList = {
  list: Order[],
  highlightedOrders: { [string]: EphemeralOrder },
}

export type {
  EphemeralOrder,
  HighlightableOrderList,
}
// @flow

import Decimal from 'decimal.js'
import type {BookedPriceAndQuantity, OrderBook} from '../types/Trading'

export const calculateOrderBook = (orderBook: OrderBook, tradeType: string, condition: string, selectedPrice: Decimal, quantity: Decimal, isBuy: boolean, baseAvailable: Decimal, pricingAvailable: Decimal) => {
  if (selectedPrice === null) {
    return {}
  }

  const sliderValue = isBuy ? (pricingAvailable.equals(0) ? new Decimal(0) : selectedPrice.mul(quantity).mul(100).dividedBy(pricingAvailable)) : (baseAvailable.equals(0) ? new Decimal(0) : quantity.mul(100).dividedBy(baseAvailable))

  const targetList: Array<BookedPriceAndQuantity> = isBuy ? orderBook.sellItems.filter(item => item.quantity.comparedTo('0') > 0).sort((a, b) => a.price.lessThan(b.price) ? -1 : 1)
    : orderBook.buyItems.filter(item => item.quantity.comparedTo('0') > 0).sort((a, b) => a.price.lessThan(b.price) ? 1 : -1)
  const expectedTotalAvailable = isBuy ? selectedPrice.mul(quantity) : quantity

  if (tradeType === 'LIMIT') {
    let consumingAmount = new Decimal(0)
    let consumingQuantity = new Decimal(0)

    for (let idx = 0; idx < targetList.length; idx++) {
      if (isBuy ? targetList[idx].price.greaterThan(selectedPrice) : targetList[idx].price.lessThan(selectedPrice)) {
        break
      } else {
        let currentTotalAmount = consumingAmount.add(targetList[idx].quantity.mul(selectedPrice))
        let currentTotalQuantity = consumingQuantity.add(targetList[idx].quantity)

        if (isBuy) {
          if (expectedTotalAvailable.greaterThanOrEqualTo(currentTotalAmount)) {
            consumingAmount = currentTotalAmount
            consumingQuantity = consumingQuantity.add(targetList[idx].quantity)
          } else {
            consumingQuantity = consumingQuantity.add((expectedTotalAvailable.sub(consumingAmount)).dividedBy(selectedPrice))
            consumingAmount = expectedTotalAvailable
          }
        } else {
          if (expectedTotalAvailable.greaterThanOrEqualTo(currentTotalQuantity)) {
            consumingQuantity = currentTotalQuantity
            consumingAmount = consumingAmount.add(targetList[idx].quantity.mul(selectedPrice))
          } else {
            consumingAmount = consumingAmount.add((expectedTotalAvailable.sub(consumingQuantity)).mul(selectedPrice))
            consumingQuantity = expectedTotalAvailable
          }
        }
      }
    }

    const standbyQuantity = isBuy ? (expectedTotalAvailable.sub(consumingAmount)).dividedBy(selectedPrice) : expectedTotalAvailable.sub(consumingQuantity)

    if (condition === 'GTC') {
      return {
        sliderValue: Decimal.floor(sliderValue).toNumber(),
        quantity: consumingQuantity.add(standbyQuantity),
        consumingQuantity: consumingQuantity,
        standbyQuantity: standbyQuantity,
        expectedAvgPrice: consumingQuantity.equals(0) ? new Decimal(0) : consumingAmount.dividedBy(consumingQuantity),
        amount: consumingAmount.add(standbyQuantity.mul(selectedPrice))
      }
    } else if (condition === 'IOC') {
      return {
        sliderValue: Decimal.floor(sliderValue).toNumber(),
        quantity: consumingQuantity,
        consumingQuantity: consumingQuantity,
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: consumingQuantity.equals(0) ? new Decimal(0) : consumingAmount.dividedBy(consumingQuantity),
        amount: consumingAmount
      }
    } else if (condition === 'FOK') {
      if (standbyQuantity.lessThanOrEqualTo(0)) {
        return {
          sliderValue: Decimal.floor(sliderValue).toNumber(),
          quantity: consumingQuantity,
          consumingQuantity: consumingQuantity,
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: consumingQuantity.equals(0) ? new Decimal(0) : consumingAmount.dividedBy(consumingQuantity),
          amount: consumingAmount
        }
      } else {
        return {
          sliderValue: Decimal.floor(sliderValue).toNumber(),
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          amount: new Decimal(0)
        }
      }
    }
  } else if (tradeType === 'MARKET') {
    let consumingAmount = new Decimal(0)
    let consumingQuantity = new Decimal(0)

    for (let idx = 0; idx < targetList.length; idx++) {
      let currentTotalAmount = consumingAmount.add(targetList[idx].quantity.mul(targetList[idx].price))
      let currentTotalQuantity = consumingQuantity.add(targetList[idx].quantity)

      if (isBuy) {
        if (expectedTotalAvailable.greaterThanOrEqualTo(currentTotalAmount)) {
          consumingAmount = currentTotalAmount
          consumingQuantity = consumingQuantity.add(targetList[idx].quantity)
        } else {
          consumingQuantity = consumingQuantity.add((expectedTotalAvailable.sub(consumingAmount)).dividedBy(targetList[idx].price))
          consumingAmount = expectedTotalAvailable
        }
      } else {
        if (expectedTotalAvailable.greaterThanOrEqualTo(currentTotalQuantity)) {
          consumingQuantity = currentTotalQuantity
          consumingAmount = consumingAmount.add(targetList[idx].quantity.mul(targetList[idx].price))
        } else {
          consumingAmount = consumingAmount.add((expectedTotalAvailable.sub(consumingQuantity)).mul(targetList[idx].price))
          consumingQuantity = expectedTotalAvailable
        }
      }
    }

    const standbyQuantity = isBuy ? (expectedTotalAvailable.sub(consumingAmount)).dividedBy(selectedPrice) : expectedTotalAvailable.sub(consumingQuantity)
    const expectedAvgPrice = consumingQuantity.equals(0) ? new Decimal(0) : consumingAmount.dividedBy(consumingQuantity)

    if (condition === 'IOC') {
      return {
        sliderValue: Decimal.floor(sliderValue).toNumber(),
        quantity: consumingQuantity,
        consumingQuantity: consumingQuantity,
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: expectedAvgPrice,
        amount: consumingAmount
      }
    } else if (condition === 'FOK') {
      if (standbyQuantity.lessThanOrEqualTo(0)) {
        return {
          sliderValue: Decimal.floor(sliderValue).toNumber(),
          quantity: consumingQuantity,
          consumingQuantity: consumingQuantity,
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: expectedAvgPrice,
          amount: consumingAmount
        }
      } else {
        return {
          sliderValue: Decimal.floor(sliderValue).toNumber(),
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          amount: new Decimal(0)
        }
      }
    }
  } else if (tradeType === 'BOX_TOP') {
    if (targetList.length <= 0) {
      return {}
    }

    const currentTargetAmount = targetList[0].quantity.mul(targetList[0].price)
    let consumingAmount = new Decimal(0)
    let consumingQuantity = new Decimal(0)
    let standbyQuantity = new Decimal(0)

    if (isBuy) {
      if (expectedTotalAvailable.greaterThanOrEqualTo(currentTargetAmount)) {
        consumingAmount = currentTargetAmount
        consumingQuantity = targetList[0].quantity
        standbyQuantity = targetList[0].price === null || targetList[0].price.equals(0) ? new Decimal(0) : (expectedTotalAvailable.sub(currentTargetAmount)).dividedBy(targetList[0].price)
      } else {
        consumingAmount = expectedTotalAvailable
        consumingQuantity = targetList[0].price === null || targetList[0].price.equals(0) ? new Decimal(0) : expectedTotalAvailable.dividedBy(targetList[0].price)
      }
    } else {
      if (expectedTotalAvailable.greaterThanOrEqualTo(targetList[0].quantity)) {
        consumingAmount = targetList[0].price === null ? new Decimal(0) : targetList[0].quantity.mul(targetList[0].price)
        consumingQuantity = targetList[0].quantity
        standbyQuantity = expectedTotalAvailable.sub(consumingQuantity)
      } else {
        consumingAmount = targetList[0].price === null ? new Decimal(0) : expectedTotalAvailable.mul(targetList[0].price)
        consumingQuantity = expectedTotalAvailable
      }
    }

    if (condition === 'GTC') {
      return {
        sliderValue: Decimal.floor(sliderValue).toNumber(),
        quantity: consumingQuantity.add(standbyQuantity),
        consumingQuantity: consumingQuantity,
        standbyQuantity: standbyQuantity,
        expectedAvgPrice: targetList[0].price,
        amount: consumingAmount.add(standbyQuantity.mul(targetList[0].price))
      }
    } else if (condition === 'IOC') {
      return {
        sliderValue: Decimal.floor(sliderValue).toNumber(),
        quantity: consumingQuantity,
        consumingQuantity: consumingQuantity,
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: targetList[0].price,
        amount: consumingAmount
      }
    } else if (condition === 'FOK') {
      if (standbyQuantity.lessThanOrEqualTo(0)) {
        return {
          sliderValue: Decimal.floor(sliderValue).toNumber(),
          quantity: consumingQuantity,
          consumingQuantity: consumingQuantity,
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: consumingQuantity.equals(0) ? new Decimal(0) : consumingAmount.dividedBy(consumingQuantity),
          amount: consumingAmount
        }
      } else {
        return {
          sliderValue: Decimal.floor(sliderValue).toNumber(),
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          amount: new Decimal(0)
        }
      }
    }
  } else if (tradeType === 'SNAP_TO_PRIMARY' || tradeType === 'SNAP_TO_MARKET') {
    if (selectedPrice === null) {
      return {}
    }

    const standbyQuantity = isBuy ? expectedTotalAvailable.dividedBy(selectedPrice) : expectedTotalAvailable

    if (condition === 'GTC') {
      return {
        sliderValue: Decimal.floor(sliderValue).toNumber(),
        quantity: standbyQuantity,
        consumingQuantity: new Decimal(0),
        standbyQuantity: standbyQuantity,
        expectedAvgPrice: selectedPrice,
        amount: standbyQuantity.mul(selectedPrice)
      }
    }
  }

  return {}
}

export const indexOfPriceIn = (price: Decimal, list: Array<BookedPriceAndQuantity>) => {
  let idx = 0
  for (; idx < list.length; idx++) {
    const sign = price.comparedTo(list[idx].price)
    if (sign > 0) {
      return -1 - idx   // not found in list, but get to know where to be
    } else if (sign < 0) {
      continue          // should check next
    } else {
      return idx        // found
    }
  }
  return -1 - idx
}

export const applyBookPrices =(changeSequence: number, changedPrices: Array<Object>, outSellItems: Array<BookedPriceAndQuantity>, outBuyItems: Array<BookedPriceAndQuantity>) => {
  changedPrices.forEach(newPrice => {
    const list: Array<BookedPriceAndQuantity> = newPrice.sell ? outSellItems : outBuyItems
    const p: Decimal = new Decimal(newPrice.price)
    const qty: Decimal = new Decimal(newPrice.quantity)
    const idxInList = indexOfPriceIn(p, list)
    if (idxInList >= 0) {
      list[idxInList] = {
        sequence: changeSequence,
        price: p,
        quantity: qty
      }
    } else {
      list.splice(-1 - idxInList, 0, {
        sequence: changeSequence,
        price: p,
        quantity: qty
      })
    }
  })
}

export const applyOrderBookChanges = (prevBook: OrderBook, bookChanges: Array<Object>) => {
  const newBook: OrderBook = {
    ...prevBook,
    sellItems: prevBook.sellItems.slice(),
    buyItems: prevBook.buyItems.slice()
  }

  for (let i = 0; i < bookChanges.length; i++) {
    const change = bookChanges[i]

    newBook.marketStatus = change.marketStatus

    if (change.marketStatus === 'VI_OPEN' && change.estimatedVIPrice && change.estimatedVIQuantity) {
      newBook.estimatedVIInfo = {
        sequence: change.sequence,
        price: new Decimal(change.estimatedVIPrice),
        quantity: new Decimal(change.estimatedVIQuantity)
      }
    }

    const newSellItems: Array<BookedPriceAndQuantity> = change.partial ? newBook.sellItems : []
    const newBuyItems: Array<BookedPriceAndQuantity> = change.partial ? newBook.buyItems : []

    applyBookPrices(change.sequence, change.priceList, newSellItems, newBuyItems)

    newBook.sellItems = newSellItems
    newBook.buyItems = newBuyItems
  }

  return newBook
}
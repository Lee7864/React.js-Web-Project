// @flow
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'
import type {TickSize} from '../types/Trading'

export const formatPrice = (val: Decimal | null, decimalPlaces: number) => {
  return val ? commaNumber(val.toFixed(decimalPlaces).toString()) : '-'
}

export const formatQuantity = (val: Decimal | null, decimalPlaces: number) => {
  return val ? commaNumber(val.toFixed(decimalPlaces).toString()) : '-'
}

export const formatAmount = (val: Decimal | null, decimalPlaces: number) => {
  if (!val) {
    return '-'
  }
  if (decimalPlaces > 0) {
    let integralDigits = val.precision() - val.decimalPlaces()
    if (integralDigits === 0) integralDigits = 1
    return commaNumber(
      val.toFixed(Math.max(Math.min(9 - integralDigits, 8), 0), Decimal.ROUND_DOWN).toString()
    )
  } else {
    return commaNumber(val.toFixed(0).toString())
  }
}

export const formatPriceToTickSize = (price: Decimal, tickSizeRanges: TickSize[]) => {
  for (let idx = 0; idx < tickSizeRanges.length; idx++) {
    const tickSize = tickSizeRanges[idx]
    const highOpen = new Decimal(tickSize.high_open)
    const lowClosed = new Decimal(tickSize.low_closed)
    const tickSizeNumber = new Decimal(tickSize.tick_size)

    if ((lowClosed.equals(0) || price.greaterThanOrEqualTo(lowClosed)) && (highOpen.equals(0) || price.lessThan(highOpen))) {
      return price.toFixed(tickSizeNumber.decimalPlaces()).toString()
    }
  }

  return '0'
}

export const isPriceGoodToTickSize = (price: Decimal, tickSizeRanges: TickSize[]) => {
  for (let idx = 0; idx < tickSizeRanges.length; idx++) {
    const tickSize = tickSizeRanges[idx]
    const highOpen = new Decimal(tickSize.high_open)
    const lowClosed = new Decimal(tickSize.low_closed)
    const tickSizeNumber = new Decimal(tickSize.tick_size)

    if ((lowClosed.equals(0) || price.greaterThanOrEqualTo(lowClosed)) && (highOpen.equals(0) || price.lessThan(highOpen))) {
      return (price.mod(tickSizeNumber)).equals(0)
    }
  }

  return false
}

export const roundPriceToTickSize = (price: Decimal, tickSizeRanges: TickSize[], rounding: Decimal.Rounding): Decimal => {
  for (let idx = 0; idx < tickSizeRanges.length; idx++) {
    const tickSize = tickSizeRanges[idx]
    const highOpen = new Decimal(tickSize.high_open)
    const lowClosed = new Decimal(tickSize.low_closed)
    const tickSizeNumber = new Decimal(tickSize.tick_size)

    if ((lowClosed.equals(0) || price.greaterThanOrEqualTo(lowClosed)) && (highOpen.equals(0) || price.lessThan(highOpen))) {
      const mod = price.mod(tickSizeNumber)

      if (mod.equals(0)) {
        return price
      }

      switch(rounding) {
      case Decimal.ROUND_UP:
        return price.sub(mod).add(tickSizeNumber)
      case Decimal.ROUND_DOWN:
        return price.sub(mod)
      case Decimal.ROUND_HALF_UP:
      case Decimal.ROUND_HALF_DOWN:
        if (mod.greaterThanOrEqualTo(tickSizeNumber.dividedBy(2))) {
          return price.sub(mod).add(tickSizeNumber)
        } else {
          return price.sub(mod)
        }
      }
    }
  }

  return price
}

export const findPriceForSnapToMarket = (price: Decimal, tickSizeRanges: TickSize[], direction: 1 | -1) => {
  for (let idx = 0; idx < tickSizeRanges.length; idx++) {
    const tickSize = tickSizeRanges[idx]
    const highOpen = new Decimal(tickSize.high_open)
    const lowClosed = new Decimal(tickSize.low_closed)
    const tickSizeNumber = new Decimal(tickSize.tick_size)

    if ((lowClosed.equals(0) || price.greaterThanOrEqualTo(lowClosed)) && (highOpen.equals(0) || price.lessThan(highOpen))) {
      return price.add(tickSizeNumber.mul(direction))
    }
  }

  return null
}

export const formatAmountAbbreviation = (val: string, lang: string) => {
  const valDecimal = new Decimal(val)
  if (valDecimal.equals(0)) {
    return '0'
  }

  let divideCount = 4
  let langArray = []
  switch(lang) {
  case 'en':
    divideCount = 3
    langArray = ['', 'K', 'M', 'B', 'T']
    break
  case 'ko':
  default:
    divideCount = 4
    langArray = ['', '만', '억', '조', '경']
    break
  }

  const d = Decimal.log10(val).div(divideCount).toDecimalPlaces(0, Decimal.ROUND_DOWN)

  if (d > 4) {
    return val
  }

  return commaNumber(valDecimal.div(Decimal.pow(10, d.mul(divideCount))).toDecimalPlaces(0, Decimal.ROUND_DOWN).toString()) + langArray[d]
}
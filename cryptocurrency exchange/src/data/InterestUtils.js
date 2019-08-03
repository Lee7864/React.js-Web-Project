// @flow
import Decimal from 'decimal.js'
import moment from 'moment'
import type { UserLastInterest } from '../types/Interest'

export const parseUserLastInterest = (strRateOrAmount?: string | null, strDate?: string | null, strDateFormat: string): UserLastInterest => {
  if (strRateOrAmount && new Decimal(strRateOrAmount).greaterThan(0)) {
    const date: moment | null = strDate ? moment(strDate, strDateFormat) : null;
    return {
      rateOrAmount: strRateOrAmount, // TODO formating
      yearMonth: date && date.isValid() ? date.subtract(1, 'months').format('YYYY/MM') : null,
    }
  } else {
    return {
      rateOrAmount: '0',
      yearMonth: null,
    }
  }
}
// @flow

import * as React from 'react'
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'
import moment from 'moment'

import LocalizedStrings from 'localized-strings'

import { View, Text, Divider } from '../controls'

import styles from '../../styles/StyleGuide.css'
import type {TickSize, Trade} from '../../types/Trading'
import {formatPriceToTickSize} from '../../data/NumberUtils'

const strings = new LocalizedStrings({
  en: {
    header: {
      tradeFeed: 'TRADE FEED',
      amount: 'Amount',
      price: 'Price',
      time: 'Time'
    }
  },
  ko: {
    header: {
      tradeFeed: '실시간 체결 내역',
      amount: '체결량',
      price: '체결가',
      time: '체결시각'
    }
  }
})

type RowProps = {
  direction: string,
  price: string,
  amount: string,
  time: string,
  baseDecimalPlaces: number,
  pricingCurrencyDecimalPlaces: number,
  tickSizeRanges: TickSize[]
}

const Row = ({direction, price, amount, time, baseDecimalPlaces, pricingCurrencyDecimalPlaces, tickSizeRanges}: RowProps) => {
  const textColor = (val) => {
    switch (val) {
    case 'BUY':
      return 'up-red'
    case 'SELL':
      return 'down-blue'
    default:
      return 'dark-gray'
    }
  }

  const formatAmount = (val) => {
    return commaNumber(new Decimal(val).toFixed(baseDecimalPlaces).toString())
  }

  return (
    <View flexHorizontal style={styles.dontshrink} alignItems='center' height={39} paddingHorizontalNum={15}>
      <Text flex='fill' textColor='dark-gray' textAlign="center">{moment(time).format('YY-MM-DD kk:mm:ss')}</Text>
      <Text flex='fill' textColor={textColor(direction)} textAlign="right">{commaNumber(formatPriceToTickSize(new Decimal(price), tickSizeRanges))}</Text>
      <Text flex='fill' textColor='dark-gray' textAlign="right">{formatAmount(amount)}</Text>
    </View>
  )
}

type Props = {
  tradeFeedList: Trade[] | null,
  language: string,
  baseDecimalPlaces: number,
  pricingCurrencyDecimalPlaces: number,
  tickSizeRanges: TickSize[]
}

class TradeFeedCard extends React.PureComponent<Props> {
  render() {
    const {tradeFeedList, language, baseDecimalPlaces, pricingCurrencyDecimalPlaces, tickSizeRanges} = this.props
    strings.setLanguage(language)

    return (
      <View flex='fill' backgroundColor='white'>
        <View height={40} justifyContent='center' paddingHorizontalNum={15}>
          <View flexHorizontal style={styles.dontshrink}>
            <Text textColor='dark-gray' flex='fill' textAlign="center" fontSize='xsmall'>{strings.header.time}</Text>
            <Text textColor='dark-gray' flex='fill' textAlign="center" fontSize='xsmall'>{strings.header.price}</Text>
            <Text textColor='dark-gray' flex='fill' textAlign="center" fontSize='xsmall'>{strings.header.amount}</Text>
          </View>
        </View>

        <Divider/>

        <View flex='fill' overflow='auto'>
          <View style={{position: 'absolute', width: '100%'}}>
            {tradeFeedList && tradeFeedList.reduce((acc, trade) =>
              acc.concat(
                trade.priceList.reduceRight((priceAcc, item, index) => priceAcc.concat((
                  <React.Fragment key={`${trade.sequence}_${index}`}>
                    <Row
                      direction={trade.direction}
                      price={item.price}
                      amount={item.quantity}
                      time={trade.occurredAt}
                      baseDecimalPlaces={baseDecimalPlaces}
                      pricingCurrencyDecimalPlaces={pricingCurrencyDecimalPlaces}
                      tickSizeRanges={tickSizeRanges}
                    />
                  </React.Fragment>
                )), [])
              ), [])}
          </View>
        </View>
      </View>
    )
  }
}

export default TradeFeedCard

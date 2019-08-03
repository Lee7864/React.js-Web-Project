// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import type {MarketSummary} from '../../types/Trading'
import {Spacer, Text, View} from '../controls'
import commaNumber from 'comma-number'
import Decimal from 'decimal.js'
import Candle from '../controls/Candle'
import styles from '../../styles/StyleGuide.css'
import {formatAmountAbbreviation} from '../../data/NumberUtils'

const strings = new LocalizedStrings({
  en: {
    header: {
      price: 'Price',
      change: 'Day Change',
      _24hHigh: '24h High',
      _24hLow: '24h Low',
      _24hTotal: '24h Total',
      total: 'Total',
      _24hVolume: '24h Volume'
    }
  },
  ko: {
    header: {
      price: '현재가',
      change: '전일대비',
      _24hHigh: '24h 고가',
      _24hLow: '24h 저가',
      _24hTotal: '24h 거래대금',
      total: '거래대금',
      _24hVolume: '24h 거래량'
    }
  }
})

type Props = {
  open: string,
  close: string,
  high: string,
  low: string,
  amount: string,
  marketSymbol: string,
  baseName: string,
  marketPrice: string,
  marketChangeRate: string,
  baseDecimalPlaces: number,
  pricingCurrencyDecimalPlaces: number,
  onTabClick: (tabIndex: number) => void,
  language: string
}

class MobileMarketInfoCard extends React.PureComponent<Props> {

  render() {

    const {open, close, high, low, amount, marketSymbol, baseName, marketPrice, marketChangeRate, pricingCurrencyDecimalPlaces, onTabClick, language} = this.props

    strings.setLanguage(language)

    const marketPriceDecimal = new Decimal(marketPrice)
    const marketChangeRateDecimal = new Decimal(marketChangeRate)

    return (
      <View paddingNum={10} backgroundColor='white' alignItems="center" flexHorizontal height={55} style={styles.dontshrink} onClick={() => onTabClick(0)}>

        <View width={7} height={26} style={styles.dontshrink}>
          <Candle open={open} close={close} high={high} low={low}/>
        </View>

        <Spacer size='xsmall'/>

        <View flexGrow={103} justifyContent='center'>
          <View position='absolute' width='100%'>
            <View width='100%' height={17} justifyContent='center'>
              <Text fontWeight="semibold" fontSizeNum={14} textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>{baseName}</Text>
            </View>
            <View width='100%' height={17} justifyContent='center'>
              <Text textColor='dark-gray' fontSizeNum={12}>{marketSymbol}</Text>
            </View>
          </View>
        </View>

        <View flexGrow={72} justifyContent='center'>
          <View position='absolute' width='100%'>
            <View width='100%' height={17} justifyContent='center'>
              <Text fontSizeNum={11} textAlign='right'>{strings.header.price}</Text>
            </View>
            <View width='100%' height={17} justifyContent='center'>
              <Text textColor={marketChangeRateDecimal.greaterThan(0) ? 'up-red' : marketChangeRateDecimal.lessThan(0) ? 'down-blue' : 'dark-gray'} textAlign='right' fontWeight="semibold" fontSizeNum={14}>{commaNumber(marketPriceDecimal.toFixed(pricingCurrencyDecimalPlaces).toString())}</Text>
            </View>
          </View>
        </View>

        <View flexGrow={55} justifyContent='center'>
          <View position='absolute' width='100%'>
            <View width='100%' height={17} justifyContent='center'>
              <Text fontSizeNum={11} textAlign='right'>{strings.header.change}</Text>
            </View>
            <View width='100%' height={17} justifyContent='center'>
              <Text textColor={marketChangeRateDecimal.greaterThan(0) ? 'up-red' : marketChangeRateDecimal.lessThan(0) ? 'down-blue' : 'dark-gray'} textAlign='right' fontWeight="semibold" fontSizeNum={14}>{(marketChangeRateDecimal.greaterThan(0) ? '+' : '') +  marketChangeRateDecimal.toFixed(2) + '%'}</Text>
            </View>
          </View>
        </View>

        <View flexGrow={55} justifyContent='center'>
          <View position='absolute' width='100%'>
            <View width='100%' height={17} justifyContent='center'>
              <Text fontSizeNum={11} textAlign='right' phoneHidden>{strings.header.total}</Text>
            </View>
            <View width='100%' height={17} justifyContent='center'>
              <Text textColor='dark-gray' textAlign='right' fontSizeNum={14}>{formatAmountAbbreviation(amount, language)}</Text>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

export default MobileMarketInfoCard
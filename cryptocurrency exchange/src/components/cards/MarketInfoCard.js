// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import {Image, Text, View} from '../controls'
import commaNumber from 'comma-number'
import Decimal from 'decimal.js'
import styles from '../../styles/StyleGuide.css'

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
  marketPrice: string,
  marketChangeRate: string,
  high: string,
  low: string,
  amount: string,
  volume: string,
  marketSymbol: string,
  baseSymbol: string,
  baseName: string,
  prevDayClosePrice: string,
  baseDecimalPlaces: number,
  pricingCurrencyDecimalPlaces: number,
  language: string
}

class MarketInfoCard extends React.PureComponent<Props> {

  render() {

    const {high, low, amount, volume, marketSymbol, baseSymbol, baseName, marketPrice, marketChangeRate, prevDayClosePrice, baseDecimalPlaces, pricingCurrencyDecimalPlaces, language} = this.props

    strings.setLanguage(language)

    const marketPriceDecimal = new Decimal(marketPrice)
    const marketChangeRateDecimal = new Decimal(marketChangeRate)
    const marketHigh = new Decimal(high)
    const marketLow = new Decimal(low)
    const marketTotal = new Decimal(amount)
    const marketVolume = new Decimal(volume)

    return (
      <View paddingNum={20} backgroundColor='white' alignItems="center" flexHorizontal minWidth={820} height={60} style={styles.dontshrink}>
        <View width={20}>
          <Image source={`/images/coins/${baseSymbol}.svg`} width={20} height={20}/>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View flex='fill' justifyContent='center'>
          <View height={20} justifyContent='center'>
            <Text textColor='black' fontWeight="semibold" fontSizeNum={14} textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>{baseName}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor='dark-gray' fontSizeNum={12}>{marketSymbol}</Text>
          </View>
        </View>

        <View width={110} style={styles.dontshrink}>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={13} textAlign='right' textColor='dark-gray'>{strings.header.price}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor={marketChangeRateDecimal.greaterThan(0) ? 'up-red' : marketChangeRateDecimal.lessThan(0) ? 'down-blue' : 'dark-gray'} textAlign='right' fontWeight="semibold" fontSizeNum={16}>{commaNumber(marketPriceDecimal.toFixed(pricingCurrencyDecimalPlaces).toString())}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={80} style={styles.dontshrink}>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={13} textAlign='right' textColor='dark-gray'>{strings.header.change}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor={marketChangeRateDecimal.greaterThan(0) ? 'up-red' : marketChangeRateDecimal.lessThan(0) ? 'down-blue' : 'dark-gray'} textAlign='right' fontWeight="semibold" fontSizeNum={16}>{(marketChangeRateDecimal.greaterThan(0) ? '+' : '') +  marketChangeRateDecimal.toFixed(2) + '%'}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={110} style={styles.dontshrink}>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={13} textAlign='right' textColor='dark-gray'>{strings.header._24hHigh}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor={marketHigh.greaterThan(prevDayClosePrice) ? 'up-red' : marketHigh.lessThan(prevDayClosePrice) ? 'down-blue' : 'dark-gray'} textAlign='right' fontSizeNum={16}>{commaNumber(marketHigh.toFixed(pricingCurrencyDecimalPlaces).toString())}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={110} style={styles.dontshrink}>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={13} textAlign='right' textColor='dark-gray'>{strings.header._24hLow}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor={marketLow.greaterThan(prevDayClosePrice) ? 'up-red' : marketLow.lessThan(prevDayClosePrice) ? 'down-blue' : 'dark-gray'} textAlign='right' fontSizeNum={16}>{commaNumber(marketLow.toFixed(pricingCurrencyDecimalPlaces).toString())}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={110} style={styles.dontshrink}>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={13} textAlign='right' textColor='dark-gray'>{strings.header._24hTotal}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor='dark-gray' textAlign='right' fontSizeNum={16}>{commaNumber(marketTotal.toFixed(pricingCurrencyDecimalPlaces).toString())}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={110} style={styles.dontshrink}>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={13} textAlign='right' textColor='dark-gray'>{strings.header._24hVolume}</Text>
          </View>
          <View height={20} justifyContent='center'>
            <Text textColor='dark-gray' textAlign='right' fontSizeNum={16}>{commaNumber(marketVolume.toFixed(baseDecimalPlaces).toString())}</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default MarketInfoCard
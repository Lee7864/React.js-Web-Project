// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import {Divider, Spacer, Text, View} from '../controls'
import styles from '../../styles/StyleGuide.css'
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'
import { Link as RouterLink } from 'react-router-dom'

import {formatAmountAbbreviation, formatPriceToTickSize} from '../../data/NumberUtils'
import Candle from '../controls/Candle'

const strings = new LocalizedStrings({
  en: {
    headers: {
      assetName: 'Asset Names',
      price: 'Last Price',
      change: 'Change',
      amount: 'Total',
      cap: 'Cap'
    }
  },
  ko: {
    headers: {
      assetName: '자산명',
      price: '현재가',
      change: '전일대비',
      amount: '거래대금',
      cap: '시가총액'
    }
  }
})

type RowProps = {
  market: Object,
  language: string,
  isCapVisible?: boolean
}

const Row = ({market, language, isCapVisible}: RowProps) => {
  const changeRate = new Decimal(market.changeRate)
  const textColor = changeRate.greaterThanOrEqualTo(0) ? (changeRate.equals(0) ? 'dark-gray' : 'up-red') : 'down-blue'
  const changeRateString = (changeRate.greaterThan(0) ? '+' : '') + changeRate.toFixed(2).toString() + '%'

  return (
    <View>
      <Divider/>
      <View component={RouterLink} to={`/exchange/${market.marketId}`} flex='fill' flexHorizontal>
        <View width={10} style={styles.dontshrink}/>

        <View flexGrow={118} height={55} style={styles.dontshrink}>
          <View width={15} height={55} position='absolute' flexHorizontal alignItems='center' style={styles.dontshrink}>
            <View width={7} height={26} style={styles.dontshrink}>
              <Candle open={market.marketSummary.open} close={market.marketSummary.close} high={market.marketSummary.high} low={market.marketSummary.low}/>
            </View>

            <View width={8} style={styles.dontshrink}/>
          </View>
          <View style={{top: 0, left: '15px', right:0, bottom: 0}} height={55} position='absolute' justifyContent='center' cursor='pointer'>
            <Text fontWeight='semibold' fontSize='xsmall' textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap' cursor='pointer'>{market.currencyNames[strings.getLanguage()]}</Text>
            <Spacer size='tiny'/>
            <Text fontSize='tiny' textColor='dark-gray' cursor='pointer'>{market.marketId.replace('_', '/')}</Text>
          </View>
        </View>

        <View flexGrow={72} height={55} style={styles.dontshrink} cursor='pointer'>
          <View width='100%' height={55} justifyContent='center' position='absolute' cursor='pointer'>
            <Text textColor={textColor} fontSize='xsmall' textAlign='right' cursor='pointer'>{commaNumber(formatPriceToTickSize(new Decimal(market.price), market.tickSizeRanges))}</Text>
          </View>
        </View>

        <View flexGrow={55} height={55} style={styles.dontshrink} cursor='pointer'>
          <View width='100%' height={55} justifyContent='center' position='absolute' cursor='pointer'>
            <Text textColor={textColor} fontSize='xsmall' textAlign='right' cursor='pointer'>{changeRateString}</Text>
          </View>
        </View>

        <View flexGrow={55} height={55} style={styles.dontshrink} cursor='pointer'>
          <View width='100%' height={55} justifyContent='center' position='absolute' cursor='pointer'>
            <Text fontSize='xsmall' textAlign='right' textColor='dark-gray' cursor='pointer'>{formatAmountAbbreviation((isCapVisible ? market.cap : market.amount24h), language)}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>
      </View>
    </View>
  )
}

type Props = {
  marketList: Array<Object | null>,
  language: string,
  isCapVisible?: boolean
}

class MarketDisplayCard extends React.PureComponent<Props> {

  render() {
    const { marketList, language, isCapVisible } = this.props

    strings.setLanguage(language)

    return (
      <View width='100%'>
        <View flexHorizontal>
          <View width={10} style={styles.dontshrink}/>

          <View flex='fill' flexHorizontal>
            <View flexGrow={118} height={40} style={styles.dontshrink}>
              <View width='100%' height='100%' justifyContent='center' alignItems='center' position='absolute'>
                <Text textColor='dark-gray' fontSizeNum={11}>{strings.headers.assetName}</Text>
              </View>
            </View>

            <View flexGrow={72} height={40} justifyContent='center' alignItems='center' style={styles.dontshrink}>
              <View width='100%' height='100%' justifyContent='center' alignItems='center' position='absolute'>
                <Text textColor='dark-gray' fontSizeNum={11}>{strings.headers.price}</Text>
              </View>
            </View>

            <View flexGrow={55} height={40} justifyContent='center' alignItems='center' style={styles.dontshrink}>
              <View width='100%' height='100%' justifyContent='center' alignItems='center' position='absolute'>
                <Text textColor='dark-gray' fontSizeNum={11}>{strings.headers.change}</Text>
              </View>
            </View>

            <View flexGrow={55} height={40} justifyContent='center' alignItems='center' style={styles.dontshrink}>
              <View width='100%' height='100%' justifyContent='center' alignItems='center' position='absolute'>
                <Text textColor='dark-gray' fontSizeNum={11}>{isCapVisible ? strings.headers.cap : strings.headers.amount }</Text>
              </View>
            </View>
          </View>

          <View width={10} style={styles.dontshrink}/>
        </View>

        <View>
          {marketList.map((market) => {
            if (market !== null) {
              return <Row market={market} key={market.marketId} language={language} isCapVisible={isCapVisible}/>
            }
          })}
        </View>

        <Divider/>
      </View>
    )
  }
}

export default MarketDisplayCard
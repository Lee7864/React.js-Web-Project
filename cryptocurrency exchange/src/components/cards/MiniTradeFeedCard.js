// @flow

import * as React from 'react'
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'

import LocalizedStrings from 'localized-strings'

import { View, Text } from '../controls'

import type {TickSize, Trade} from '../../types/Trading'
import {formatPriceToTickSize} from '../../data/NumberUtils'
import tradingStyles from '../../styles/TradingPage.css'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    header: {
      amount: 'Amount',
      price: 'Price'
    }
  },
  ko: {
    header: {
      amount: '체결량',
      price: '체결가'
    }
  }
})

type RowProps = {
  direction: string,
  price: string,
  amount: string,
  tickSizeRanges: TickSize[],
  fontSize?: number
}

const Row = ({
  direction, price, amount, tickSizeRanges, fontSize
}: RowProps) => {
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

  return (
    <View flexHorizontal style={styles.dontshrink} height={25}>
      <View flexGrow={75}>
        <View position='absolute' width='100%' height='100%' justifyContent='center' padding='tiny'>
          <Text textColor={textColor(direction)} fontSizeNum={fontSize ? fontSize : 12} textAlign='right'>{commaNumber(formatPriceToTickSize(new Decimal(price), tickSizeRanges))}</Text>
        </View>
      </View>
      <View flexGrow={45}>
        <View position='absolute' width='100%' height='100%' justifyContent='center' padding='tiny'>
          <Text fontSizeNum={fontSize ? fontSize : 12} textAlign='right' textColor='dark-gray'>{new Decimal(amount).toFixed(3, Decimal.ROUND_DOWN)}</Text>
        </View>
      </View>
    </View>
  )
}

type Props = {
  tradeFeedList: Trade[] | null,
  language: string,
  tickSizeRanges: TickSize[],
  hiddenHeader?: boolean,
  fontSize?: number
}

class MiniTradeFeedCard extends React.PureComponent<Props> {
  render() {
    const {tradeFeedList, language, tickSizeRanges, hiddenHeader, fontSize} = this.props

    strings.setLanguage(language)

    return (
      <View flex='fill' style={styles.dontshrink}>
        <View flexHorizontal hidden={hiddenHeader ? hiddenHeader : false} style={styles.dontshrink} height={25}>
          <View flexGrow={75}>
            <View position='absolute' width='100%' height='100%' justifyContent='center'>
              <Text fontSizeNum={fontSize ? fontSize : 12} textAlign='center' textColor='dark-gray'>{strings.header.price}</Text>
            </View>
          </View>
          <View flexGrow={45}>
            <View position='absolute' width='100%' height='100%' justifyContent='center'>
              <Text fontSizeNum={fontSize ? fontSize : 12} textAlign='center' textColor='dark-gray'>{strings.header.amount}</Text>
            </View>
          </View>
        </View>

        <View flex='fill' overflow='hidden'>
          <View style={{position: 'absolute', width: '100%'}}>
            {tradeFeedList && tradeFeedList.reduce((acc, trade) =>
              acc.concat(
                trade.priceList.reduceRight((priceAcc, item, index) => priceAcc.concat((
                  <React.Fragment key={`${trade.sequence}_${index}`}>
                    <Row
                      direction={trade.direction}
                      price={item.price}
                      amount={item.quantity}
                      tickSizeRanges={tickSizeRanges}
                      fontSize={fontSize}
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

export default MiniTradeFeedCard

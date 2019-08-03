// @flow

import * as React from 'react'
import {Divider, Tab, Text, View} from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import MarketDisplayCard from './MarketDisplayCard'
import type {TabData} from '../controls/Tab'
import Decimal from 'decimal.js'
import type {MarketCap} from '../../types/Trading'

const strings = new LocalizedStrings({
  en: {
    headers: {
      amount: 'Volume 5',
      caps: 'Market Cap 5'
    }
  },
  ko: {
    headers: {
      amount: '거래상위',
      caps: '시총상위'
    }
  }
})

type ElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: ElementProps) => {
  return (
    <View flex='fill' height={50} onClick={onPress}>
      <View height='100%' justifyContent='center' alignItems='center'>
        <Text textColor='black' fontWeight='bold'>{item.key}</Text>
      </View>

      {selected &&
      <View position='absolute' width='100%' height='100%' justifyContent='flex-end'>
        <View width='100%' height={3} style={styles.dontshrink} backgroundColor='iris'/>
      </View>
      }
    </View>
  )
}

type Props = {
  marketList: Array<Object | null>,
  marketCaps: {[string]: MarketCap},
  language: string
}

type State = {
  tabIndex: number
}

class AmountNTotalMarketListCard extends React.PureComponent<Props, State> {
  state = {
    tabIndex: 0
  }

  static getDerivedStateFromProps(nextProps: Props) {
    nextProps.marketList.map((market) => {
      if (market !== null) {
        if (nextProps.marketCaps[market.marketId]) {
          market['cap'] = nextProps.marketCaps[market.marketId].marketCap
        } else {
          market['cap'] = 0
        }
      }
    })
  }

  handleTabClick = (value: string) => {
    this.setState({
      tabIndex: value === 'amount' ? 0 : 1
    })
  }

  render() {
    const {marketList, language} = this.props
    const {tabIndex} = this.state

    strings.setLanguage(language)

    const data = [{key: strings.headers.amount, value: 'amount'}, {key: strings.headers.caps, value: 'caps'}]

    if (tabIndex === 0) {
      this.props.marketList.sort((a, b) => a && b && new Decimal(a['amount24h']).greaterThan(new Decimal(b['amount24h'])) ? -1 : 1)
    } else {
      this.props.marketList.sort((a, b) => a && b && new Decimal(a['cap']).greaterThan(new Decimal(b['cap'])) ? -1 : 1)
    }

    return (
      <View width='100%'>
        <View flexHorizontal height={50}>
          <View width={10} style={styles.dontshrink}/>
          <View flex='fill'>
            <Tab data={data} onPress={this.handleTabClick} selectedIndex={tabIndex} tabElement={TabElement} flex='fill'/>
          </View>
          <View width={10} style={styles.dontshrink}/>
        </View>

        <Divider color='divider'/>

        <MarketDisplayCard marketList={marketList.slice(0, 5)} language={language} isCapVisible={tabIndex === 1}/>
      </View>
    )
  }
}

export default AmountNTotalMarketListCard
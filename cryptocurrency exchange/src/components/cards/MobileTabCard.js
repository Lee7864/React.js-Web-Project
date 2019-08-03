// @flow

import * as React from 'react'
import {Text, View} from '../controls'
import LocalizedStrings from 'localized-strings'

const strings = new LocalizedStrings({
  en: {
    menu: {
      market: 'Market',
      buysell: 'Buy/Sell',
      orderbook: 'Orderbook',
      chart: 'Chart',
      tradefeed: 'Tradefeed',
      orders: 'Orders'
    }
  },
  ko: {
    menu: {
      market: '마켓',
      buysell: '주문',
      orderbook: '호가',
      chart: '차트',
      tradefeed: '시세',
      orders: '내역'
    }
  }
})

type Props = {
  onTabClick: (tabIndex: number) => void,
  tabIndex: number,
  language: string
}

class MobileTabCard extends React.Component<Props> {

  render() {
    const {onTabClick, tabIndex, language} = this.props

    strings.setLanguage(language)

    return (
      <View height={54} backgroundColor="iris" style={{flexShrink: 0}}>
        <View flex="fill" flexHorizontal>
          <View flex="fill" onClick={() => onTabClick(1)} backgroundColor='iris' padding='tiny' height='100%'>
            <View justifyContent="center" alignItems="center" backgroundColor={tabIndex === 1 ? 'white' : 'iris'} borderRadius='xsmall' overflow='hidden' height='100%'>
              <Text fontSize='xsmall' textColor={tabIndex === 1 ? 'iris' : 'white'}>{strings.menu.orderbook}</Text>
            </View>
          </View>
          <View flex="fill" onClick={() => onTabClick(3)} backgroundColor='iris' padding='tiny' height='100%'>
            <View justifyContent="center" alignItems="center" backgroundColor={tabIndex === 3 ? 'white' : 'iris'} borderRadius='xsmall' overflow='hidden' height='100%'>
              <Text fontSize='xsmall' textColor={tabIndex === 3 ? 'iris' : 'white'}>{strings.menu.buysell}</Text>
            </View>
          </View>
          <View flex="fill" onClick={() => onTabClick(6)} backgroundColor='iris' padding='tiny' height='100%'>
            <View justifyContent="center" alignItems="center" backgroundColor={tabIndex === 6 ? 'white' : 'iris'} borderRadius='xsmall' overflow='hidden' height='100%'>
              <Text fontSize='xsmall' textColor={tabIndex === 6 ? 'iris' : 'white'}>{strings.menu.chart}</Text>
            </View>
          </View>
          <View flex="fill" onClick={() => onTabClick(4)} backgroundColor='iris' padding='tiny' height='100%'>
            <View justifyContent="center" alignItems="center" backgroundColor={tabIndex === 4 ? 'white' : 'iris'} borderRadius='xsmall' overflow='hidden' height='100%'>
              <Text fontSize='xsmall' textColor={tabIndex === 4 ? 'iris' : 'white'}>{strings.menu.orders}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default MobileTabCard
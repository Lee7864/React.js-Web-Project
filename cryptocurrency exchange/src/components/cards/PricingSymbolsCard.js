// @flow

import * as React from 'react'
import {Divider, Spacer, View} from '../controls'

import styles from '../../styles/BalancePage.css'
import Image from '../controls/Image'

type Props = {
  selectedSymbol: string,
  onSymbolClick: (symbol: string) => void
}

class PricingSymbolsCard extends React.PureComponent<Props> {

  render() {
    const {selectedSymbol, onSymbolClick} = this.props

    return (
      <View>
        <View flexHorizontal borderColor='light-blue' border='normal' borderRadius='xsmall' backgroundColor='white' overflow='hidden' style={styles.button}>
          <View onClick={() => onSymbolClick('KRW')} backgroundColor={selectedSymbol === 'KRW' ? 'iris' : 'white'}>
            <Image source={selectedSymbol === 'KRW' ? '/images/coins/KRW.svg' : '/images/coins/KRW_reverse.svg'} style={styles.pricing_symbol_size}/>
          </View>
          <Divider color='light-blue'/>
          <View onClick={() => onSymbolClick('BTC')} backgroundColor={selectedSymbol === 'BTC' ? 'iris' : 'white'}>
            <Image source={selectedSymbol === 'BTC' ? '/images/coins/BTC.svg' : '/images/coins/BTC_reverse.svg'} style={styles.pricing_symbol_size}/>
          </View>
          <Divider color='light-blue'/>
          <View onClick={() => onSymbolClick('ETH')} backgroundColor={selectedSymbol === 'ETH' ? 'iris' : 'white'}>
            <Image source={selectedSymbol === 'ETH' ? '/images/coins/ETH.svg' : '/images/coins/ETH_reverse.svg'} style={styles.pricing_symbol_size}/>
          </View>
        </View>
      </View>
    )
  }
}

export default PricingSymbolsCard
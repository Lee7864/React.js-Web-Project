// @flow

import * as React from 'react'

import LocalizedStrings from 'localized-strings'
import Decimal from 'decimal.js'

import {View, Text, Spacer, Divider, Tab} from '../controls'

import type {Market, MarketDetails, MarketSummary} from '../../types/Trading'
import commaNumber from 'comma-number'
import {formatAmountAbbreviation, formatPriceToTickSize} from '../../data/NumberUtils'
import Candle from '../controls/Candle'
import type {TabData} from '../controls/Tab'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    headers: {
      assetName: 'Asset Names',
      price: 'Last Price',
      change: 'Change',
      amount: 'Total'
    }
  },
  ko: {
    headers: {
      assetName: '자산명',
      price: '현재가',
      change: '전일대비',
      amount: '거래대금'
    }
  }
})

type RowProps = {
  market: Market,
  marketDetails: MarketDetails,
  marketSummary: MarketSummary,
  onSelectMarket: (value: string) => void,
  selected: boolean,
  language: string
}

const Row = ({market, marketDetails, marketSummary, onSelectMarket, selected, language}: RowProps) => {
  const changeRate = new Decimal(marketDetails.changeRate)
  const textColor = changeRate.greaterThanOrEqualTo(0) ? (changeRate.equals(0) ? 'dark-gray' : 'up-red') : 'down-blue'
  const changeRateString = (changeRate.greaterThan(0) ? '+' : '') + changeRate.toFixed(2).toString() + '%'

  const onRowClick = () => {
    onSelectMarket(market.marketId)
  }

  return (
    <View height={60} backgroundColor={selected ? 'light-gray' : undefined}>
      <View onClick={onRowClick} flex='fill' flexHorizontal paddingHorizontalNum={10}>
        <View width={10} style={styles.dontshrink}/>

        <View flexGrow={116} height={60} style={styles.dontshrink} >
          <View width={15} height={60} position='absolute' flexHorizontal alignItems='center' style={styles.dontshrink}>
            <View width={7} height={26} style={styles.dontshrink}>
              <Candle open={marketSummary.open} close={marketSummary.close} high={marketSummary.high} low={marketSummary.low}/>
            </View>

            <View width={8} style={styles.dontshrink}/>
          </View>
          <View style={{top: '10px', left: '15px', right:0, bottom: '10px'}} height={40} position='absolute' justifyContent='space-around'>
            <Text fontWeight='semibold' fontSize='xsmall' textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>{market.baseNames[strings.getLanguage()]}</Text>
            <Text fontSize='tiny' textColor='dark-gray'>{market.marketId.replace('_', '/')}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View flexGrow={64} height={60} style={styles.dontshrink}>
          <View width='100%' height={60} justifyContent='center' position='absolute'>
            <Text textColor={textColor} fontSize='xsmall' textAlign='right'>{commaNumber(formatPriceToTickSize(new Decimal(marketDetails.price), market.pricingCurrency.tickSizeRanges))}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View flexGrow={45} height={60} style={styles.dontshrink}>
          <View width='100%' height={60} justifyContent='center' position='absolute'>
            <Text textColor={textColor} fontSize='xsmall' textAlign='right'>{changeRateString}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View flexGrow={45} height={60} style={styles.dontshrink}>
          <View width='100%' height={60} justifyContent='center' position='absolute'>
            <Text fontSize='xsmall' textAlign='right' textColor='dark-gray'>{formatAmountAbbreviation(marketSummary.amount, language)}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>
      </View>
      <Divider/>
    </View>
  )
}

type ElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: ElementProps) => {
  return (
    <View flex='fill' height={50} onClick={onPress}>
      <View height={50} justifyContent='center' alignItems='center'>
        <Text fontSize='small' textColor='black' fontWeight='semibold'>{item.key}</Text>
      </View>

      {selected &&
      <View position='absolute' width='100%' height='100%' justifyContent='flex-end'>
        <View width='100%' height={3} style={styles.dontshrink} backgroundColor='iris'/>
      </View>
      }
    </View>
  )
}

type HeaderProps = {

}

class Header extends React.PureComponent<HeaderProps> {
  render() {
    return (
      <View flexHorizontal paddingHorizontalNum={10}>

        <View flex='fill' flexHorizontal>
          <View flexGrow={128} height={40} style={styles.dontshrink}>
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

          <View flexGrow={65} height={40} justifyContent='center' alignItems='center' style={styles.dontshrink}>
            <View width='100%' height='100%' justifyContent='center' alignItems='center' position='absolute'>
              <Text textColor='dark-gray' fontSizeNum={11}>{strings.headers.amount}</Text>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

type Props = {
  markets: Market[],
  marketsObject: { [string]: Market },
  marketsDetails: { [string]: MarketDetails },
  marketsSummary: { [string]: MarketSummary },
  selectedMarketId: string,
  onSelectMarket: (marketId: string) => void,
  language: string
}

type State = {
  pricingSymbol: string
}

class CurrenciesCard extends React.PureComponent<Props, State> {
  state = {
    pricingSymbol: this.props.selectedMarketId && this.props.selectedMarketId !== '' ? this.props.selectedMarketId.split('_')[1] : 'KRW'
  }

  handlePricingSymbolClick = (symbol: string) => {
    this.setState({
      pricingSymbol: symbol
    })
  }

  render() {
    const {markets, marketsObject, marketsDetails, marketsSummary, selectedMarketId, onSelectMarket, language} = this.props
    const {pricingSymbol} = this.state

    strings.setLanguage(language)

    return (
      <View flex='fill' backgroundColor='white'>
        <View flexHorizontal height={50} paddingHorizontalNum={10}>
          <View flex='fill'>
            <Tab
              data={[{key: 'KRW', value: 'KRW'}, {key: 'BTC', value: 'BTC'}, {key: 'ETH', value: 'ETH'}]}
              selectedIndex={pricingSymbol === 'ETH' ? 2 : pricingSymbol === 'BTC' ? 1 : 0}
              onPress={this.handlePricingSymbolClick}
              tabElement={TabElement}
              flex='fill'
            />
          </View>
        </View>

        <Divider/>

        <Header/>

        <Divider/>

        <View flex='fill' overflow='auto'>
          <View width='100%' position='absolute'>
            {markets && markets.filter(market => market.marketSymbol.includes(`/${pricingSymbol}`))
              .sort((a, b) => a !== null && b !== null && a.baseSymbol > b.baseSymbol ? 1 : -1)
              .map((market) => {
                if (market !== null) {
                  return <Row
                    market={marketsObject[market.marketId]}
                    marketDetails={marketsDetails[market.marketId]}
                    marketSummary={marketsSummary[market.marketId]}
                    onSelectMarket={onSelectMarket}
                    selected={selectedMarketId === market.marketId}
                    language={language}
                    key={market.marketId}/>
                }
              })}
          </View>
        </View>
      </View>
    )
  }
}

export default CurrenciesCard

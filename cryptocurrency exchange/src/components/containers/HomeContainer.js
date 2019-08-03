// @flow

import * as React from 'react'
import HomePage from '../pages/HomePage'
import {API_URL} from '../../config'
import type {Currency} from '../../types/Balance'
import {connect} from 'react-redux'
import Decimal from 'decimal.js'
import type {Market, MarketCap} from '../../types/Trading'
import MobileHomePage from '../pages/mobile/MobileHomePage'
import {detect} from 'detect-browser'
const browser = detect()

type State = {
  currencies: Currency[] | null,
  currenciesObject: Object | null,
  markets: Market[] | null,
  marketsObject: Object | null,
  marketTickers: Object | null,
  market24h: Object | null,
  marketCaps: {[string]: MarketCap},
  pricingSymbol: string,
  pricingDecimalPlaces: number,
  sort: string,
  sortDirection: number,
  filter: string
}

type Props = {
  history: Object,
  language: string
}

class HomeContainer extends React.Component<Props, State> {
  state = {
    currencies: null,
    currenciesObject: null,
    markets: null,
    marketsObject: null,
    marketTickers: null,
    market24h: null,
    marketCaps: {},
    pricingSymbol: 'KRW',
    pricingDecimalPlaces: 0,
    sort: 'amount24h',
    sortDirection: -1,
    filter: ''
  }

  timeoutId: TimeoutID | null = null

  componentDidMount() {
    this.updateData()
  }

  updateData = () => {
    Promise.all([
      fetch(`${API_URL}/currencies`),
      fetch(`${API_URL}/markets`),
      fetch(`${API_URL}/markets/ticker`),
      fetch(`${API_URL}/markets/24h`),
      fetch(`${API_URL}/markets/caps?limit=5`)
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([currencies, markets, marketTickers, market24h, marketCaps]) => {
      this.setState({
        currencies: currencies,
        currenciesObject: currencies.reduce((object, currency) => (
          (object[currency.symbol] = currency), object
        ), {}),
        markets: markets,
        marketsObject: markets.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        marketTickers: marketTickers.reduce((object, marketTicker) => (
          (object[marketTicker.marketId] = marketTicker), object
        ), {}),
        market24h: market24h.reduce((object, currency) => (
          (object[currency.marketId] = currency), object
        ), {}),
        marketCaps: marketCaps.reduce((object, caps) => (
          (object[caps.marketId] = caps), object
        ), {})
      })
    })
  }

  componentDidUpdate() {
    if (this.timeoutId === null) {
      this.timeoutId = setTimeout(() => {
        this.updateData()
        this.timeoutId = null
      }, 60000)
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  setSort = (sortValue: string) => {
    const {sort, sortDirection} = this.state
    if (sort === sortValue) {
      this.setState({
        sortDirection: sortDirection * -1
      })
    } else {
      this.setState({
        sort: sortValue,
        sortDirection: -1
      })
    }
  }

  handlePricingCurrencyClick = (currencySymbol: string) => {
    const {currenciesObject, pricingSymbol} = this.state
    if (currenciesObject === null) {
      return
    }

    const pricingCurrency = currenciesObject[currencySymbol]
    if (pricingCurrency === undefined) {
      return
    }

    if (pricingCurrency.symbol !== pricingSymbol) {
      this.setState({
        pricingSymbol: pricingCurrency.symbol,
        pricingDecimalPlaces: pricingCurrency.decimalPlaces,
        sort: 'amount24h',
        sortDirection: -1
      })
    }
  }

  handleButtonClick = (type: string) => {
    switch (type) {
    case 'exchange':
    case 'signup':
      this.props.history.push(`/${type}`)
      break
    case 'announce':
    case 'fees':
    case 'help':
    case 'terms':
    case 'privacy':
      this.props.history.push(`/support/${type}`)
      break

    default:
      break
    }
  }

  handleMarketSearchChange = (value: string) => {
    this.setState({
      filter: value.toUpperCase()
    })
  }

  render() {
    const {currencies, marketsObject, marketTickers, market24h, marketCaps, pricingSymbol, pricingDecimalPlaces, sort, sortDirection, filter} = this.state
    const {history} = this.props

    if (currencies && marketsObject && marketTickers && market24h) {
      const marketList = currencies.map((currency) => {
        const marketId = currency.symbol + '_' + pricingSymbol
        if (marketsObject[marketId] && marketTickers[marketId] && market24h[marketId]) {
          return {
            marketId: marketId,
            currencyNames: currency.names,
            baseSymbol: currency.symbol,
            pricingSymbol: pricingSymbol,
            price: marketTickers[marketId].price,
            changeRate: marketTickers[marketId].changeRate,
            marketSummary: market24h[marketId],
            high24h: market24h[marketId].high,
            low24h: market24h[marketId].low,
            volume24h: market24h[marketId].volume,
            amount24h: market24h[marketId].amount,
            decimalPlaces: currency.decimalPlaces,
            pricingDecimalPlaces: pricingDecimalPlaces,
            tickSizeRanges: marketsObject[marketId].pricingCurrency.tickSizeRanges
          }
        }

        return null
      }).filter(market => market !== null)

      if (sort === 'marketId') {
        marketList.sort((a, b) => a && b && a[sort] > b[sort] ? sortDirection : sortDirection * -1)
      } else {
        marketList.sort((a, b) => a && b && new Decimal(a[sort]).greaterThan(new Decimal(b[sort])) ? sortDirection : sortDirection * -1)
      }

      const filteredMarkets = marketList && marketList.filter(market => {
        if (market === null) {
          return false
        }

        if (market.marketId.includes(filter)) {
          return true
        }

        for (let key in market.currencyNames) {
          if (market.currencyNames[key].includes(filter)) {
            return true
          }
        }

        return false
      })

      let isMobile = false

      switch (browser && browser.os) {
      case 'iOS':
      case 'Android OS':
      case 'BlackBerry OS':
      case 'Windows Mobile':
      case 'Amazon OS':
        isMobile = true
        break
      }

      if (filteredMarkets && filteredMarkets !== null) {
        if (isMobile) {
          return (
            <MobileHomePage
              history={history}
              marketList={filteredMarkets}
              pricingSymbol={pricingSymbol}
              setSort={this.setSort}
              onPricingCurrencyClick={this.handlePricingCurrencyClick}
              language={this.props.language}
              filter={filter}
              sort={sort}
              sortDirection={sortDirection}
              onMarketSearchChange={this.handleMarketSearchChange}
            />
          )
        } else {
          return (
            <HomePage
              history={history}
              marketList={filteredMarkets}
              pricingSymbol={pricingSymbol}
              setSort={this.setSort}
              onPricingCurrencyClick={this.handlePricingCurrencyClick}
              language={this.props.language}
              filter={filter}
              sort={sort}
              sortDirection={sortDirection}
              onMarketSearchChange={this.handleMarketSearchChange}
              marketCaps={marketCaps}
            />
          )
        }
      }
    }

    return null
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}


export default connect(mapStateToProps)(HomeContainer)
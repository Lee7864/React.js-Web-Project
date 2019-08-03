// @flow

import * as React from 'react'
import moment from 'moment'

import TradingPage from '../pages/TradingPage'

import type {
  Market,
  Order,
  Trade,
  TradePrice,
  OrderBook,
} from '../../types/Trading'
import { API_URL } from '../../config'
import { connect } from 'react-redux'
import type {Profile} from '../../types/Profile'
import connectEventStream, { EventStream } from '../../data/EventStream'
import type { NewOrderParams, NewOrderResult, CancelOrderParams, CancelOrderResult}  from '../../types/OrderRequest'
import type {Balance} from '../../types/Balance'
import {applyOrderBookChanges} from '../../data/OrderBookUtils'

import {detect} from 'detect-browser'
import MobileTradingPage from '../pages/mobile/MobileTradingPage'
const browser = detect()

function createEmptyOrderBook(): OrderBook {
  return {
    maxSequence: 0,
    loaded: false,
    sellItems: [],
    buyItems: [],
    estimatedVIInfo: null,
    marketStatus: 'LOADING'
  }
}

function applyTrades(inState: Trade[] | null, arrived: Trade[]) {
  if (inState) {
    const sequences = {}  // remove duplication
    const list = [...arrived, ...inState].reduce((agg, trade) => {
      if (!sequences[trade.sequence]) {
        sequences[trade.sequence] = true
        agg.push(trade)
      }
      return agg
    }, [])

    list.sort((a, b) => b.sequence - a.sequence)  // descending order

    const max = 128
    if (list.length > max) {
      return list.slice(0, max)
    }
    return list
  } else {
    return arrived
  }
}

function applyOrders(existedOrders: Order[], arrived: Order[], filter?: (Order) => boolean): Order[] {
  if (existedOrders) {
    if (arrived.length <= 0) {
      return existedOrders
    }

    const existedMap: {[string]: Order} = existedOrders.reduce((map: Object, order: Order) => {
      map[order.id] = order
      return map
    }, {})

    if (filter) {
      arrived = arrived.filter(filter)
    }

    const newList = existedOrders.slice(0)

    arrived.forEach((order: Order) => {
      if (existedMap[order.id]) {
        if (order.stateRevision > existedMap[order.id].stateRevision) {
          existedMap[order.id].orderedPrice = order.orderedPrice
          existedMap[order.id].orderedQuantity = order.orderedQuantity
          existedMap[order.id].orderedAmount = order.orderedAmount
          existedMap[order.id].effectivePrice = order.effectivePrice
          existedMap[order.id].effectiveQuantity = order.effectiveQuantity
          existedMap[order.id].effectiveAmount = order.effectiveAmount
          existedMap[order.id].bookedQuantity = order.bookedQuantity
          existedMap[order.id].filledQuantity = order.filledQuantity
          existedMap[order.id].filledAmount = order.filledAmount
          existedMap[order.id].invalidatedQuantity = order.invalidatedQuantity
          existedMap[order.id].invalidatedAmount = order.invalidatedAmount
          existedMap[order.id].stateRevision = order.stateRevision
          existedMap[order.id].status = order.status
          existedMap[order.id].closedAt = order.closedAt
        }
      } else {
        newList.push(order)
      }
    })

    return newList.sort((a, b) => a && b && a.createdAt > b.createdAt ? 1 : -1)
  }

  return []
}

function applyFetchedBalances(inState: {[string]: Balance} | null, fetched: Balance[]): {[string]: Balance} {
  if (inState) {
    return inState
  } else {
    return fetched.reduce((object, balance) => (
      (object[balance.currencySymbol] = balance), object
    ), {})
  }
}

function applyRealtimeBalances(inState: {[string]: Balance} | null, arrived: Balance[]): {[string]: Balance} | null {
  if (arrived.length <= 0) {
    return inState
  }

  const updatedObject: {[string]: Balance} = inState ? {...inState} : {}
  arrived.forEach((balance) => {
    updatedObject[balance.currencySymbol] = balance
  })
  return updatedObject
}

type Props = {
  history: Object,
  profile: Profile,
  language: string,
  match: Object
}

type State = {
  markets: Market[] | null,
  marketsObject: Object | null,
  marketsDetails: Object | null,
  marketsSummary: Object | null,
  ordersTabIndex: number,
  activeOrders: Order[],
  completedOrders: Order[],
  balancesObject: {[string]: Balance} | null,
  tradeFeedList: Trade[] | null,
  selectedMarketId: string,
  orderBook: OrderBook,
  popup: Object | null,
  popupVisible: boolean,
  tabIndex: number,
  prevDayClosePrice: string,
  marketStreamConnected: boolean
}

class TradingContainer extends React.Component<Props, State> {
  state = {
    markets: null,
    marketsObject: null,
    marketsDetails: null,
    marketsSummary: null,
    activeOrders: [],
    completedOrders: [],
    ordersTabIndex: 0,
    balancesObject: null,
    tradeFeedList: null,
    selectedMarketId: this.props.match.params.sub,
    orderBook: createEmptyOrderBook(),
    popup: null,
    popupVisible: true,
    tabIndex: 1,
    prevDayClosePrice: '0',
    marketStreamConnected: false
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextProps.match.params.sub === nextState.selectedMarketId
  }

  marketEventStream: EventStream | null
  privateEventStream: EventStream | null
  inOrderRequesting: boolean
  timeoutId: TimeoutID | null = null

  componentDidMount() {
    // for only when logged-in
    if (this.props.profile) {
      this.privateEventStream = connectEventStream({
        identifier: this.props.profile.email,
        withCredentials: true,
        uri: '/myaccount/watch',
        openHandler: (email: string) => {
        },
        errorHandler: (email: string, err: Error) => {
        },
        dataHandlers: {
          'MYORDER': (email: string, newOrChangedOrders: Array<Object>) => {
            if (this.props.profile && this.props.profile.email === email) {
              this.setState({
                activeOrders: applyOrders(this.state.activeOrders, newOrChangedOrders),
                completedOrders: applyOrders(this.state.completedOrders, newOrChangedOrders, (order) => order.status !== 'OPEN')
              })
            }
          },
          'MYBALANCE': (email: string, changedBalances: Array<Object>) => {
            if (this.props.profile && this.props.profile.email === email) {
              this.setState({
                balancesObject: applyRealtimeBalances(this.state.balancesObject, changedBalances)
              })
            }
          }
        },
        dataErrorHandler: (email: string, err: Error) => {
        }
      })

      this.updateWhenLoggedIn()
    } else {
      this.updateOnlyStaticData()
    }
  }

  updateWhenLoggedIn = () => {
    const marketsBaseUrl = `${API_URL}/markets`
    const accountBaseUrl = `${API_URL}/myaccount`
    const { selectedMarketId } = this.state

    Promise.all([
      fetch(`${marketsBaseUrl}`),
      fetch(`${marketsBaseUrl}/ticker`),
      fetch(`${marketsBaseUrl}/24h`),
      fetch(`${API_URL}/markets/${selectedMarketId}/candles/day?optionalCount=1&exclusiveMaxTimestamp=${moment().hour(9).minute(0).second(0).millisecond(0).format('x')}`),
      fetch(`${API_URL}/markets/${selectedMarketId}/trades/recent`),
      fetch(`${API_URL}/markets/${selectedMarketId}/orderbook`),
      fetch(`${accountBaseUrl}/orders/active`, {credentials: 'include'}),
      fetch(`${accountBaseUrl}/orders/recents/completed`, {credentials: 'include'}),
      fetch(`${accountBaseUrl}/balances`, {credentials: 'include'})
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([markets, marketsDetails, marketsSummary, prevDayCandle, trades, orderBookChangesFromRest, activeOrders, completedOrders, balances]) => {
      if (activeOrders.error || completedOrders.error || balances.error) {
        // if any fails, supposing 401(unauthorized)
        this.props.history.push('/login#callback=/exchange')
        return
      }

      const resultState = {}

      if (!activeOrders.error) {
        resultState.activeOrders = applyOrders(this.state.activeOrders, activeOrders)
      }

      if (!completedOrders.error) {
        resultState.completedOrders = applyOrders(this.state.completedOrders, completedOrders, (order) => order.status !== 'OPEN')
      }

      if (!balances.error) {
        resultState.balancesObject = applyFetchedBalances(this.state.balancesObject, balances)
      }

      this.setState({
        ...resultState,
        markets: markets,
        marketsObject: markets.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        marketsDetails: marketsDetails.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        marketsSummary: marketsSummary.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        prevDayClosePrice: prevDayCandle.length > 0 ? prevDayCandle[0].close : '0',
        tradeFeedList: applyTrades(null, trades),
        orderBook: applyOrderBookChanges(createEmptyOrderBook(), orderBookChangesFromRest)
      })

      if (this.marketEventStream == null) {
        this.updateMarketEventStream(selectedMarketId)
      }
    })
  }

  updateOnlyStaticData = () => {
    const marketsBaseUrl = `${API_URL}/markets`
    const { selectedMarketId } = this.state

    Promise.all([
      fetch(`${marketsBaseUrl}`),
      fetch(`${marketsBaseUrl}/ticker`),
      fetch(`${marketsBaseUrl}/24h`),
      fetch(`${API_URL}/markets/${selectedMarketId}/candles/day?optionalCount=1&exclusiveMaxTimestamp=${moment().hour(9).minute(0).second(0).millisecond(0).format('x')}`),
      fetch(`${API_URL}/markets/${selectedMarketId}/trades/recent`),
      fetch(`${API_URL}/markets/${selectedMarketId}/orderbook`)
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([markets, marketsDetails, marketsSummary, prevDayCandle, trades, orderBookChangesFromRest]) => {
      this.setState({
        markets: markets,
        marketsObject: markets.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        marketsDetails: marketsDetails.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        marketsSummary: marketsSummary.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        prevDayClosePrice: prevDayCandle.length > 0 ? prevDayCandle[0].close : '0',
        tradeFeedList: applyTrades(null, trades),
        orderBook: applyOrderBookChanges(createEmptyOrderBook(), orderBookChangesFromRest)
      })

      if (this.marketEventStream == null) {
        this.updateMarketEventStream(selectedMarketId)
      }
    })
  }

  updateForPolling = () => {
    const marketsBaseUrl = `${API_URL}/markets`

    Promise.all([
      fetch(`${marketsBaseUrl}/ticker`),
      fetch(`${marketsBaseUrl}/24h`)
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([marketsDetails, marketsSummary]) => {
      this.setState({
        marketsDetails: marketsDetails.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {}),
        marketsSummary: marketsSummary.reduce((object, market) => (
          (object[market.marketId] = market), object
        ), {})
      })
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.profile && !this.props.profile) {
      // [logged-in] -> [logged-out], e.g. session in cookie removed
      Promise.resolve().then(() => {
        this.setState({
          activeOrders: [],
          completedOrders: [],
          balancesObject: null,
        })
      })
    }

    if (this.timeoutId == null) {
      this.timeoutId = setTimeout(() => {
        this.updateForPolling()
        this.timeoutId = null
      }, 60000)
    }
  }

  componentWillUnmount() {
    if (this.marketEventStream) {
      this.marketEventStream.close()
      this.marketEventStream = null
    }
    if (this.privateEventStream) {
      this.privateEventStream.close()
      this.privateEventStream = null
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  updateMarketEventStream = (marketId: string) => {
    this.marketEventStream = connectEventStream({
      identifier: marketId,
      uri: `/markets/${marketId}/watch`,
      openHandler: (marketId: string) => {
        this.setState({
          marketStreamConnected: true
        })
      },
      errorHandler: (marketId: string, err: Error) => {
        this.setState({
          marketStreamConnected: false
        })
      },
      dataHandlers: {
        'ORDERBOOK': (marketId: string, bookChanges: Array<Object>) => {
          if (marketId == this.state.selectedMarketId) {
            this.setState({
              orderBook: applyOrderBookChanges(this.state.orderBook, bookChanges)
            })
          }
        },
        'TRADE': (marketId: string, moreTrades: Array<Object>) => {
          if (marketId == this.state.selectedMarketId) {
            this.setState({
              tradeFeedList: applyTrades(this.state.tradeFeedList, moreTrades)
            })
          }

          if (moreTrades && moreTrades.length > 0
            && this.state.marketsDetails && this.state.marketsDetails[marketId]) {
            const lastPrice: TradePrice = moreTrades[0].priceList[0]
            this.setState({
              marketsDetails: {
                ...this.state.marketsDetails,
                [marketId] : {
                  ...this.state.marketsDetails[marketId],
                  price: lastPrice.price,
                  changeRate: lastPrice.changeRate
                }
              }
            })
          }
        },
      },
      dataErrorHandler: (marketId: string, err: Error) => {
      }
    })
  }

  handleSelectMarket = (marketId: string) => {
    const {selectedMarketId} = this.state

    if (marketId === selectedMarketId) {
      return
    }

    this.props.history.push(`/exchange/${marketId}`)

    if (this.marketEventStream != null) {
      this.marketEventStream.close()
      this.marketEventStream = null
    }

    this.updateMarketEventStream(marketId)

    Promise.all([
      fetch(`${API_URL}/markets/${marketId}/candles/day?optionalCount=1&exclusiveMaxTimestamp=${moment().hour(9).minute(0).second(0).millisecond(0).format('x')}`),
      fetch(`${API_URL}/markets/${marketId}/trades/recent`),
      fetch(`${API_URL}/markets/${marketId}/orderbook`)
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([prevDayCandle, trades, orderBookChangesFromRest]) => {
      this.setState({
        tabIndex: 1,
        selectedMarketId: marketId,
        prevDayClosePrice: prevDayCandle.length > 0 ? prevDayCandle[0].close : '0',
        tradeFeedList: applyTrades(null, trades),
        orderBook: applyOrderBookChanges(createEmptyOrderBook(), orderBookChangesFromRest)
      })
    })
  }

  handleNewOrder = (params: NewOrderParams): Promise<NewOrderResult> => {
    if (this.inOrderRequesting) {
      return new Promise((resolve, reject) => {
        reject({
          params: params,
          error: {
            key: 'general',
            message: '앞선 주문의 전송이 완료되지 않았습니다'
          }
        })
      })
    }

    this.inOrderRequesting = true
    return fetch(`${API_URL}/orders`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(params),
      credentials: 'include'
    })
      .catch(err => {
        this.inOrderRequesting = false
        return Promise.reject({
          params: params,
          error: {
            key: 'unknown',
            message: '서버 접속에 실패했습니다.'
          }
        })
      })
      .then(response => (
        Promise.all([response.status, response.json()])
      ))
      .then(([status, json]) => {
        this.inOrderRequesting = false
        switch (status) {
        case 200:
          return Promise.resolve({
            params: params
          })
        case 401:
          return Promise.resolve({
            params: params,
            error: {
              key: 'unauthorized',
              message: '로그인 상태가 변경되었습니다'
            }
          })
        }

        if (json.error && json.error.reasons && json.error.reasons.length > 0) {
          return Promise.reject({
            params: params,
            error: json.error.reasons[0]
          })
        }
        return Promise.reject({
          params: params,
          error: {
            key: 'unknown',
            message: '알 수 없는 오류가 발생했습니다'
          }
        })
      })
  }

  handleCancelAllActiveOrders = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)
    })
  }

  handleOrdersTabClick = (value: string) => {
    if (value === 'active') {
      this.setState({
        ordersTabIndex: 0
      })
    } else if (value === 'completed') {
      this.setState({
        ordersTabIndex: 1
      })
    }
  }

  handleActiveOrderCancelClick = (params: CancelOrderParams): Promise<CancelOrderResult> => {
    if (this.inOrderRequesting) { // TODO remove duplication of this code
      return new Promise((resolve, reject) => {
        reject({
          params: params,
          error: {
            key: 'general',
            message: '앞선 주문의 전송이 완료되지 않았습니다'
          }
        })
      })
    }

    this.inOrderRequesting = true
    return fetch(`${API_URL}/orders/${params.orderId}`, {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({marketId: params.marketId}),
      credentials: 'include'
    }).catch(err => {
      this.inOrderRequesting = false
      return Promise.reject({
        params: params,
        error: {
          key: 'unknown',
          message: '서버 접속에 실패했습니다.'
        }
      })
    }).then(response => (
      Promise.all([response.status, response.json()])
    )).then(([status, json]) => {
      this.inOrderRequesting = false  // TODO remove duplication of this code
      switch (status) {
      case 200:
        return Promise.resolve({
          params: params
        })
      case 401:
        return Promise.resolve({
          params: params,
          error: {
            key: 'unauthorized',
            message: '로그인 상태가 변경되었습니다'
          }
        })
      }

      if (json.error && json.error.reasons && json.error.reasons.length > 0) {
        return Promise.reject({
          params: params,
          error: json.error.reasons[0]
        })
      }
      return Promise.reject({
        params: params,
        error: {
          key: 'unknown',
          message: '알 수 없는 오류가 발생했습니다'
        }
      })
    })
  }

  handleShowPopup = (popup: Object) => {
    this.setState({
      popup: popup
    })
  }

  handleClosePopup = () => {
    this.setState({
      popup: null
    })
  }

  handleTabClick = (tabIndex: number) => {
    this.setState({
      tabIndex: tabIndex
    })
  }

  render() {
    const { markets, marketsObject, marketsDetails, marketsSummary, activeOrders, completedOrders, ordersTabIndex,
      balancesObject, orderBook, tradeFeedList, selectedMarketId, popup, popupVisible, tabIndex, prevDayClosePrice, marketStreamConnected } = this.state
    if (markets === null || marketsObject === null || marketsDetails === null || marketsSummary === null) {
      return null
    }

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

    if (isMobile) {
      return (
        <MobileTradingPage
          history={this.props.history}
          markets={markets}
          marketsObject={marketsObject}
          marketsDetails={marketsDetails}
          marketsSummary={marketsSummary}
          activeOrders={activeOrders}
          completedOrders={completedOrders}
          ordersTabIndex={ordersTabIndex}
          ordersTabClick={this.handleOrdersTabClick}
          balancesObject={balancesObject}
          orderBook={orderBook}
          tradeFeedList={tradeFeedList}
          selectedMarketId={selectedMarketId}
          onSelectMarket={this.handleSelectMarket}
          onNewOrder={this.handleNewOrder}
          onCancelAllActiveOrders={this.handleCancelAllActiveOrders}
          onOrderCancelClick={this.handleActiveOrderCancelClick}
          profile={this.props.profile}
          language={this.props.language}
          popup={popup}
          onShowPopup={this.handleShowPopup}
          onClosePopup={this.handleClosePopup}
          popupVisible={popupVisible}
          tabIndex={tabIndex}
          onTabClick={this.handleTabClick}
          prevDayClosePrice={prevDayClosePrice}
          marketStreamConnected={marketStreamConnected}
        />
      )
    } else {
      return (
        <TradingPage
          history={this.props.history}
          markets={markets}
          marketsObject={marketsObject}
          marketsDetails={marketsDetails}
          marketsSummary={marketsSummary}
          activeOrders={activeOrders}
          completedOrders={completedOrders}
          ordersTabIndex={ordersTabIndex}
          ordersTabClick={this.handleOrdersTabClick}
          balancesObject={balancesObject}
          orderBook={orderBook}
          tradeFeedList={tradeFeedList}
          selectedMarketId={selectedMarketId}
          onSelectMarket={this.handleSelectMarket}
          onNewOrder={this.handleNewOrder}
          onCancelAllActiveOrders={this.handleCancelAllActiveOrders}
          onOrderCancelClick={this.handleActiveOrderCancelClick}
          profile={this.props.profile}
          language={this.props.language}
          popup={popup}
          onShowPopup={this.handleShowPopup}
          onClosePopup={this.handleClosePopup}
          popupVisible={popupVisible}
          tabIndex={tabIndex}
          onTabClick={this.handleTabClick}
          prevDayClosePrice={prevDayClosePrice}
          marketStreamConnected={marketStreamConnected}
        />
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    profile: state.login.profile,
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(TradingContainer)

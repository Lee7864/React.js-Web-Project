// @flow

import * as React from 'react'
import {Divider, Text, View} from '../controls'
import OrderBookCard from './OrderBookCard'
import Tab from '../controls/Tab'
import BuySellCard from './BuySellCard'
import LocalizedStrings from 'localized-strings'
import type {BookedPriceAndQuantity, Market, OrderBook, Trade} from '../../types/Trading'
import type {Profile} from '../../types/Profile'
import type {Balance} from '../../types/Balance'
import type {NewOrderHandler, NewOrderParams, NewOrderResult} from '../../types/OrderRequest'
import {normalizeNewOrderParams} from '../../data/OrderUtils'
import type {TabData} from '../controls/Tab'
import Decimal from 'decimal.js'
import {findPriceForSnapToMarket, roundPriceToTickSize} from '../../data/NumberUtils'
import {calculateOrderBook} from '../../data/OrderBookUtils'
import Spacer from '../controls/Spacer'
import Button from '../controls/Button'
import styles from '../../styles/StyleGuide.css'
import TradeFeedCard from './TradeFeedCard'

const strings = new LocalizedStrings({
  en: {
    header: {
      orderBook: 'ORDER BOOK',
      tradeFeed: 'TRADE FEED',
      buy: 'BUY',
      sell: 'SELL',
      plzLogin: 'Start Trading, ',
      plzLogin2: 'Get Paid',
      amount: 'Amount',
      price: 'Price',
      total: 'Total',
      orderType: 'Order Type',
      ok: 'Confirm',
      cancel: 'Cancel'
    },
    body: {
      type: 'Type',
      price: 'Price',
      quantity: 'Amount',
      amount: 'Total',
      condition: 'Condition',
      buy: 'Buy {0}',
      sell: 'Sell {0}',
      popupBuyTitle: 'Buy Order Confirmation',
      popupSellTitle: 'Sell Order Confirmation',
      limit: 'LIMIT',
      market: 'MARKET',
      boxTop: 'BOX-TOP',
      snapToPrimary: 'SNAP-TO-PRIMARY',
      snapToMarket: 'SNAP-TO-MARKET',
      min: 'min. ',
      full: 'Full',
      yourAmount: 'Amount'
    },
    login: {
      link_login: 'Login',
      link_signup: 'Sign Up'
    },
    popup: {
      fault: 'There is an fault',
      confirmTitle: 'Confirm!',
      successToOrder: 'Order Success',
      successMessage: 'Success to order.',
      failToOrder: 'Order Fail',
      cancelToOrder: 'Cancel Order',
      cancelMessage: 'Cancel to order.',
      failToCancel: 'Fail to cancel an order',
      insufficientAmount: 'Insufficient amount',
      insufficientAmountMessage: 'There is insufficient amount for the price',
      minTitle: 'Min Total Amount',
      minMessage: 'Total amount is more than {0} {1}',
      priceEmptyTitle: 'No Price',
      priceEmptyMessage: 'Please input a price.'
    }
  },
  ko: {
    header: {
      orderBook: '호가',
      tradeFeed: '체결',
      order: '매수/매도',
      buy: '매수',
      sell: '매도',
      plzLogin: 'Start Trading, ',
      plzLogin2: 'Get Paid',
      amount: '수량',
      price: '가격',
      total: '총액',
      orderType: '주문유형',
      ok: '확인',
      cancel: '취소'
    },
    body: {
      type: '주문유형',
      price: '주문가격',
      quantity: '주문수량',
      amount: '주문총액',
      condition: '주문조건',
      buy: '{0} 매수',
      sell: '{0} 매도',
      popupBuyTitle: '매수 주문 확인',
      popupSellTitle: '매도 주문 확인',
      limit: '지정가',
      market: '시장가',
      boxTop: '최유리',
      snapToPrimary: '최우선',
      snapToMarket: '최우선유리',
      min: '최소 ',
      full: '가',
      yourAmount: '잔고 대비'
    },
    login: {
      link_login: '로그인',
      link_signup: '회원가입'
    },
    popup: {
      fault: '화면에 오류가 있습니다',
      confirmTitle: '확인해주세요!',
      successToOrder: '주문 성공',
      successMessage: '주문이 입력되었습니다.',
      failToOrder: '주문 실패',
      cancelToOrder: '주문 취소',
      cancelMessage: '주문이 취소되었습니다.',
      failToCancel: '주문 취소 실패',
      insufficientAmount: '주문 수량 부족',
      insufficientAmountMessage: '주문 가능한 수량이 부족합니다.',
      minTitle: '최소 주문 금액 부족',
      minMessage: '최소 주문 금액이 {0} {1} 이상 되어야 합니다.',
      priceEmptyTitle: '주문 가격 없음',
      priceEmptyMessage: '주문 가격을 먼저 입력해주세요.'
    }
  }
})

type TabElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: TabElementProps) => {
  return (
    <View flex='fill' flexHorizontal>
      <View flex='fill' height={50} onClick={onPress}>
        <View height={50} justifyContent='center' alignItems='center'>
          <Text textColor='black' fontWeight='semibold'>{item.key}</Text>
        </View>

        {selected &&
        <View position='absolute' width='100%' height='100%' justifyContent='flex-end'>
          <View width='100%' height={3} style={styles.dontshrink} backgroundColor='iris'/>
        </View>
        }
      </View>
    </View>
  )
}

type Props = {
  market: Market,
  balancesObject: {[string]: Balance} | null,
  orderBook: OrderBook,
  onNewOrder: NewOrderHandler,
  onShowPopup: (popup: Object) => void,
  onClosePopup: () => void,
  popupVisible: boolean,
  profile: Profile,
  language: string,
  prevDayClosePrice: string,
  tradeFeedList: Trade[] | null,
  onLoginClick: () => void,
  onSignupClick: () => void
}

type State = {
  tradeType: 'LIMIT' | 'MARKET' | 'BOX_TOP' | 'SNAP_TO_PRIMARY' | 'SNAP_TO_MARKET',
  condition: 'GTC' | 'IOC' | 'FOK',
  isBuy: boolean,
  selectedPrice: Decimal | null,
  baseAvailable: Decimal,
  pricingAvailable: Decimal,
  sliderValue: number,
  quantity: Decimal,
  consumingQuantity: Decimal,
  standbyQuantity: Decimal,
  expectedAvgPrice: Decimal,
  amount: Decimal,
  currentMarketId: string,
  isOrderBook: boolean
}

class OrderCard extends React.PureComponent<Props, State> {
  state = {
    tradeType: 'LIMIT',
    condition: 'GTC',
    isBuy: true,
    selectedPrice: null,
    baseAvailable: new Decimal(0),
    pricingAvailable: new Decimal(0),
    sliderValue: 0,
    quantity: new Decimal(0),
    consumingQuantity: new Decimal(0),
    standbyQuantity: new Decimal(0),
    expectedAvgPrice: new Decimal(0),
    amount: new Decimal(0),
    currentMarketId: this.props.market.baseSymbol + '/' + this.props.market.pricingCurrency.symbol,
    isOrderBook: true
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const baseSymbol = props.market.baseSymbol
    const pricingSymbol = props.market.pricingCurrency.symbol
    const tickSizeRanges = props.market.pricingCurrency.tickSizeRanges
    const newMarketId = baseSymbol + '/' + pricingSymbol

    if (!props.profile || newMarketId !== state.currentMarketId) {
      return {
        tradeType: 'LIMIT',
        condition: 'GTC',
        selectedPrice: null,
        sliderValue: 0,
        quantity: new Decimal(0),
        consumingQuantity: new Decimal(0),
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: new Decimal(0),
        amount: new Decimal(0),
        currentMarketId: newMarketId
      }
    }

    let result = {}

    result.baseAvailable = (props.balancesObject && props.balancesObject !== null && props.balancesObject[baseSymbol])
      ? new Decimal(props.balancesObject[baseSymbol].amount).minus(new Decimal(props.balancesObject[baseSymbol].frozen))
      : new Decimal(0)

    result.pricingAvailable = (props.balancesObject && props.balancesObject !== null && props.balancesObject[pricingSymbol])
      ? new Decimal(props.balancesObject[pricingSymbol].amount).minus(new Decimal(props.balancesObject[pricingSymbol].frozen))
      : new Decimal(0)

    result.selectedPrice = state.selectedPrice

    const sellList: Array<BookedPriceAndQuantity> = props.orderBook.sellItems.filter(item => item.quantity.greaterThan(0)).sort((a, b) => a.price.lessThan(b.price) ? -1 : 1)
    const buyList: Array<BookedPriceAndQuantity> = props.orderBook.buyItems.filter(item => item.quantity.greaterThan(0)).sort((a, b) => a.price.lessThan(b.price) ? 1 : -1)

    if (state.tradeType === 'MARKET' || state.tradeType === 'BOX_TOP') {
      if (state.isBuy) {
        if (sellList.length > 0) {
          result.selectedPrice = sellList[0].price
        } else {
          result.selectedPrice = null
          result.tradeType = 'LIMIT'
          result.condition = 'GTC'
        }
      } else {
        if (buyList.length > 0) {
          result.selectedPrice = buyList[0].price
        } else {
          result.selectedPrice = null
          result.tradeType = 'LIMIT'
          result.condition = 'GTC'
        }
      }
    } else if (state.tradeType === 'SNAP_TO_PRIMARY') {
      if (state.isBuy) {
        if (buyList.length > 0) {
          result.selectedPrice = buyList[0].price
        } else {
          result.selectedPrice = null
          result.tradeType = 'LIMIT'
          result.condition = 'GTC'
        }
      } else {
        if (sellList.length > 0) {
          result.selectedPrice = sellList[0].price
        } else {
          result.selectedPrice = null
          result.tradeType = 'LIMIT'
          result.condition = 'GTC'
        }
      }
    } else if (state.tradeType === 'SNAP_TO_MARKET') {
      if (state.isBuy) {
        if (sellList.length > 0) {
          result.selectedPrice = findPriceForSnapToMarket(sellList[0].price, tickSizeRanges, -1)

          if (result.selectedPrice === null) {
            result.tradeType = 'LIMIT'
            result.condition = 'GTC'
          } else if (buyList.length > 0 && result.selectedPrice.equals(buyList[0].price)) {
            result.selectedPrice = buyList[0].price
          }
        } else {
          result.selectedPrice = null
          result.tradeType = 'LIMIT'
          result.condition = 'GTC'
        }
      } else {
        if (buyList.length > 0) {
          result.selectedPrice = findPriceForSnapToMarket(buyList[0].price, tickSizeRanges, 1)

          if (result.selectedPrice === null) {
            result.tradeType = 'LIMIT'
            result.condition = 'GTC'
          } else if (sellList.length > 0 && result.selectedPrice.equals(sellList[0].price)) {
            result.selectedPrice = sellList[0].price
          }
        } else {
          result.selectedPrice = null
          result.tradeType = 'LIMIT'
          result.condition = 'GTC'
        }
      }
    }

    const partialState = calculateOrderBook(props.orderBook, state.tradeType, state.condition, result.selectedPrice, state.quantity, state.isBuy, result.baseAvailable, result.pricingAvailable)

    result = {
      ...result,
      partialState
    }

    return result
  }

  processNewOrder = (params: NewOrderParams): Promise<NewOrderResult> => {
    return new Promise((resolve, reject) => {
      const normalized: NewOrderParams | null = normalizeNewOrderParams(params)
      if (!normalized) {
        const result: NewOrderResult = {
          params: params,
          error: {
            key: 'unknown',
            message: strings.popup.fault
          }
        }
        this.props.onShowPopup({type: 'fail', title: strings.popup.confirmTitle, message: result.error ? result.error.message : '', onClose: this.props.onClosePopup})
        reject(result)
        return
      }

      this.props.onNewOrder(normalized)
        .then((result: NewOrderResult) => {
          if (!result.error) {
            this.props.onShowPopup({type: 'success', title: strings.popup.successToOrder, message: strings.popup.successMessage, onClose: this.props.onClosePopup})
            resolve(result)
          } else {
            this.props.onShowPopup({type: 'fail', title: strings.popup.failToOrder, message: result.error.message, onClose: this.props.onClosePopup})
            reject(result)
          }
        })
        .catch((result: NewOrderResult) => {
          this.props.onShowPopup({type: 'fail', title: strings.popup.failToOrder, message: result.error ? result.error.message : '', onClose: this.props.onClosePopup})
          reject(result)
        })
    })
  }

  handleTradeTypeClick = (value: string) => {
    const {profile} = this.props

    if (!profile) {
      return
    }

    if (this.state.tradeType === value) {
      return
    }

    if (value === 'LIMIT' || value === 'BOX_TOP' || value === 'SNAP_TO_PRIMARY' || value === 'SNAP_TO_MARKET') {
      this.setState({
        tradeType: value,
        condition: 'GTC',
        sliderValue: 0,
        quantity: new Decimal(0),
        consumingQuantity: new Decimal(0),
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: new Decimal(0),
        amount: new Decimal(0)
      })
    } else if (value === 'MARKET') {
      this.setState({
        tradeType: value,
        condition: 'IOC',
        sliderValue: 0,
        quantity: new Decimal(0),
        consumingQuantity: new Decimal(0),
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: new Decimal(0),
        amount: new Decimal(0)
      })
    }
  }

  handleConditionClick = (value: string) => {
    const {profile} = this.props
    const {tradeType} = this.state

    if (!profile) {
      return
    }

    switch(tradeType) {
    case 'LIMIT':
    case 'BOX_TOP':
      if (value === 'GTC' || value === 'IOC' || value === 'FOK') {
        this.setState({
          condition: value,
          sliderValue: 0,
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          amount: new Decimal(0)
        })
      }
      break
    case 'MARKET':
      if (value === 'IOC' || value === 'FOK') {
        this.setState({
          condition: value,
          sliderValue: 0,
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          amount: new Decimal(0)
        })
      }
      break
    case 'SNAP_TO_PRIMARY':
    case 'SNAP_TO_MARKET':
      if (value === 'GTC') {
        this.setState({
          condition: value,
          sliderValue: 0,
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          amount: new Decimal(0)
        })
      }
      break
    }
  }

  handleBuyTabClick = (value: string) => {
    this.setState({
      isBuy: value === 'buy',
      sliderValue: 0,
      quantity: new Decimal(0),
      consumingQuantity: new Decimal(0),
      standbyQuantity: new Decimal(0),
      expectedAvgPrice: new Decimal(0),
      amount: new Decimal(0)
    })
  }

  handlePriceClick = (priceNumber: Decimal | null, isBuy: boolean) => {
    const {profile} = this.props

    if (!profile) {
      return
    }

    this.setState({
      selectedPrice: priceNumber,
      sliderValue: 0,
      quantity: new Decimal(0),
      consumingQuantity: new Decimal(0),
      standbyQuantity: new Decimal(0),
      expectedAvgPrice: new Decimal(0),
      amount: new Decimal(0)
    })
  }

  handleSliderChange = (value: number) => {
    const {profile, orderBook} = this.props
    const {tradeType, condition, selectedPrice, isBuy, baseAvailable, pricingAvailable} = this.state

    if (!profile) {
      return
    }

    if (selectedPrice === null) {
      return
    }

    const quantity = isBuy ? pricingAvailable.mul(value).dividedBy(selectedPrice.mul(100)) : baseAvailable.mul(value).dividedBy(100)

    const partialState = calculateOrderBook(orderBook, tradeType, condition, selectedPrice, quantity, isBuy, baseAvailable, pricingAvailable)
    this.setState(partialState)
  }

  handleQuantityChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const {orderBook ,onShowPopup, onClosePopup} = this.props
    const {selectedPrice, isBuy, baseAvailable, pricingAvailable, tradeType, condition} = this.state

    if (selectedPrice === null || selectedPrice.equals(0)) {
      return
    }

    const quantity = event.currentTarget.value

    if (quantity !== '') {
      const quantityNumber = new Decimal(quantity.replace(/,/gi, ''))
      const amount = quantityNumber.mul(selectedPrice)

      if (isBuy) {
        if (amount.lessThanOrEqualTo(pricingAvailable)) {
          const partialState = calculateOrderBook(orderBook, tradeType, condition, selectedPrice, quantityNumber, isBuy, baseAvailable, pricingAvailable)

          this.setState(partialState)
        } else {
          onShowPopup({type: 'fail', title: strings.popup.insufficientAmount, message: strings.popup.insufficientAmountMessage, onClose: onClosePopup})
        }
      } else {
        if (quantityNumber.lessThanOrEqualTo(baseAvailable)) {
          const partialState = calculateOrderBook(orderBook, tradeType, condition, selectedPrice, quantityNumber, isBuy, baseAvailable, pricingAvailable)
          this.setState(partialState)
        } else {
          onShowPopup({type: 'fail', title: strings.popup.insufficientAmount, message: strings.popup.insufficientAmountMessage, onClose: onClosePopup})
        }
      }
    } else {
      this.setState({
        sliderValue: 0,
        quantity: new Decimal(0),
        consumingQuantity: new Decimal(0),
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: new Decimal(0),
        amount: new Decimal(0)
      })
    }
  }

  handlePriceChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const {market} = this.props
    const {isBuy} = this.state

    const price = event.currentTarget.value
    const tickSizeRanges = market.pricingCurrency.tickSizeRanges

    if (price !== '') {
      const priceNumber = roundPriceToTickSize(new Decimal(price.replace(/,/gi, '')), tickSizeRanges, isBuy ? Decimal.ROUND_DOWN : Decimal.ROUND_UP)

      this.setState({
        selectedPrice: priceNumber,
        quantity: new Decimal(0),
        consumingQuantity: new Decimal(0),
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: new Decimal(0),
        sliderValue: 0,
        amount: new Decimal(0)
      })
    } else {
      this.setState({
        selectedPrice: null,
        quantity: new Decimal(0),
        consumingQuantity: new Decimal(0),
        standbyQuantity: new Decimal(0),
        expectedAvgPrice: new Decimal(0),
        sliderValue: 0,
        amount: new Decimal(0)
      })
    }
  }

  handleOrderClick = () => {
    const { market, onShowPopup, onClosePopup, popupVisible } = this.props
    const { tradeType, isBuy, selectedPrice, quantity, amount, condition } = this.state

    if (selectedPrice === null) {
      return
    }

    if (market.pricingCurrency && amount.lessThan(new Decimal(market.pricingCurrency.pricingLimitMinAmount))) {
      onShowPopup({type: 'fail', title: strings.popup.minTitle, message: strings.formatString(strings.popup.minMessage, market.pricingCurrency.pricingLimitMinAmount, market.pricingCurrency.symbol), onClose: onClosePopup})
      return
    }

    const baseDecimalPlaces = market.baseDecimalPlaces
    const pricingDecimalPlaces = market.pricingCurrency.decimalPlaces

    if (popupVisible) {
      onShowPopup({
        type: 'confirm',
        title: isBuy ? strings.body.popupBuyTitle : strings.body.popupSellTitle,
        symbol: market.baseSymbol,
        pricingSymbol: market.pricingCurrency.symbol,
        amount: isBuy ? (tradeType === 'LIMIT' ? quantity.toFixed(baseDecimalPlaces, Decimal.ROUND_DOWN) : '-') : quantity.toFixed(baseDecimalPlaces, Decimal.ROUND_DOWN),
        price: tradeType === 'LIMIT' ? selectedPrice.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN) : '-',
        total: isBuy ? amount.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN) : (tradeType === 'LIMIT' ? amount.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN) : '-'),
        orderType: this.handleTradeTypeToLocaleString() + ' ' + condition,
        onConfirmClick: () => this.processNewOrder({
          marketId: market.marketId,
          type: tradeType,
          timeInForce: condition,
          priceStr: selectedPrice.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN),
          quantityStr: quantity.toFixed(baseDecimalPlaces, Decimal.ROUND_DOWN),
          amountStr: amount.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN),
          action: isBuy ? 'BUY' : 'SELL'
        }).then((result) => {
          this.setState({
            tradeType: 'LIMIT',
            condition: 'GTC',
            selectedPrice: null,
            quantity: new Decimal(0),
            consumingQuantity: new Decimal(0),
            standbyQuantity: new Decimal(0),
            expectedAvgPrice: new Decimal(0),
            sliderValue: 0,
            amount: new Decimal(0)
          })
        }).catch((result) => {
        })
      })
    } else {
      this.processNewOrder({
        marketId: market.marketId,
        type: tradeType,
        timeInForce: condition,
        priceStr: selectedPrice.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN),
        quantityStr: quantity.toFixed(baseDecimalPlaces, Decimal.ROUND_DOWN),
        amountStr: amount.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN),
        action: isBuy ? 'BUY' : 'SELL'
      }).then((result) => {
        this.setState({
          tradeType: 'LIMIT',
          condition: 'GTC',
          selectedPrice: null,
          quantity: new Decimal(0),
          consumingQuantity: new Decimal(0),
          standbyQuantity: new Decimal(0),
          expectedAvgPrice: new Decimal(0),
          sliderValue: 0,
          amount: new Decimal(0)
        })
      }).catch((result) => {
      })
    }
  }

  handleTradeTypeToLocaleString = () => {
    const { tradeType } = this.state

    switch(tradeType) {
    case 'LIMIT':
      return strings.body.limit
    case 'MARKET':
      return strings.body.market
    case 'BOX_TOP':
      return strings.body.boxTop
    case 'SNAP_TO_PRIMARY':
      return strings.body.snapToPrimary
    case 'SNAP_TO_MARKET':
      return strings.body.snapToMarket
    }

    return ''
  }

  handleOrderBookTradeFeedTabClick = () => {
    this.setState({
      isOrderBook: !this.state.isOrderBook
    })
  }

  render() {
    const {market, balancesObject, orderBook, onShowPopup, onClosePopup, popupVisible, profile, language, prevDayClosePrice, tradeFeedList, onLoginClick, onSignupClick} = this.props
    const {tradeType, condition, isBuy, quantity, selectedPrice, consumingQuantity, standbyQuantity, expectedAvgPrice, amount, sliderValue, isOrderBook} = this.state

    strings.setLanguage(language)

    return (
      <View width='100%' maxWidth={390} style={styles.dontshrink} backgroundColor='white'>
        <View flex='fill' id="order-book">
          <View height={50} style={styles.dontshrink} paddingHorizontalNum={10}>
            <Tab
              data={[{key: strings.header.orderBook, value: 'orderBook'}, {key: strings.header.tradeFeed, value: 'tradeFeed'}]}
              selectedIndex={isOrderBook ? 0 : 1}
              onPress={this.handleOrderBookTradeFeedTabClick}
              tabElement={TabElement}
              flex='fill'
            />
          </View>

          <Divider/>

          <View flex='fill' hidden={!isOrderBook}>
            <OrderBookCard
              orderBook={orderBook}
              prevDayClosePrice={!prevDayClosePrice && prevDayClosePrice !== '' ? new Decimal(prevDayClosePrice) : new Decimal(0)}
              tickSizeRanges={market.pricingCurrency.tickSizeRanges}
              language={language}
              marketId={market.marketId}
              balancesObject={balancesObject}
              isBuy={isBuy}
              selectedPrice={selectedPrice}
              quantity={quantity}
              onPriceClick={this.handlePriceClick}
              consumingQuantity={consumingQuantity}
              standbyQuantity={standbyQuantity}
              tradeFeedList={tradeFeedList}
              height={40}
            />
          </View>

          <View flex='fill' hidden={isOrderBook}>
            <TradeFeedCard
              tradeFeedList={tradeFeedList}
              language={language}
              baseDecimalPlaces={market.baseDecimalPlaces}
              pricingCurrencyDecimalPlaces={market.pricingCurrency.decimalPlaces}
              tickSizeRanges={market.pricingCurrency.tickSizeRanges}
            />
          </View>
        </View>

        <Divider/>

        <View backgroundColor='white' height='100%' maxHeight={370} style={styles.dontshrink}>

          <View height='100%'>
            <View height={50} paddingHorizontalNum={10}>
              <Tab data={[{key: strings.header.buy, value: 'buy'}, {key: strings.header.sell, value: 'sell'}]} selectedIndex={isBuy ? 0 : 1} onPress={this.handleBuyTabClick} tabElement={TabElement} flex='fill'/>
            </View>

            <Divider/>

            <BuySellCard
              pricingCurrencyDecimalPlaces={market.pricingCurrency.decimalPlaces}
              baseDecimalPlaces={market.baseDecimalPlaces}
              pricingSymbol={market.pricingCurrency.symbol}
              baseSymbol={market.baseSymbol}
              tickSizeRanges={market.pricingCurrency.tickSizeRanges}
              onOrderClick={this.handleOrderClick}
              isBuy={isBuy}
              onShowPopup={onShowPopup}
              onClosePopup={onClosePopup}
              popupVisible={popupVisible}
              language={language}
              tradeType={tradeType}
              onTradeTypeClick={this.handleTradeTypeClick}
              condition={condition}
              onConditionClick={this.handleConditionClick}
              quantity={quantity}
              onQuantityChange={this.handleQuantityChange}
              price={selectedPrice}
              onPriceChange={this.handlePriceChange}
              onPriceClick={this.handlePriceClick}
              amount={amount}
              sliderValue={sliderValue}
              onSliderChange={this.handleSliderChange}
              expectedAvgPrice={expectedAvgPrice}
            />

            {!profile &&
            <View alignItems='center' justifyContent='center' position='absolute' width='100%' height='100%' style={{backgroundColor: 'rgba(255,255,255,0.9)'}}>
              <View flexHorizontal flexWrap justifyContent='center'>
                <Text fontSize='large'>{strings.header.plzLogin}</Text>
                <Spacer size="small" />
                <Text fontSize='large'>{strings.header.plzLogin2}</Text>
              </View>
              <View padding='small' flexHorizontal phoneFlexVertical justifyContent='center'>
                <Button
                  title={strings.login.link_login}
                  width={130}
                  size='medium'
                  backgroundColor="white"
                  titleColor="default"
                  borderRadius="xsmall"
                  onPress={onLoginClick}
                />
                <Spacer size="small" />
                <Button
                  title={strings.login.link_signup}
                  width={130}
                  size='medium'
                  backgroundImage="gradient-iris2"
                  titleColor="white"
                  borderRadius="xsmall"
                  onPress={onSignupClick}
                />
                <Spacer size="small" />
              </View>
            </View>
            }
          </View>
        </View>
      </View>
    )
  }
}

export default OrderCard
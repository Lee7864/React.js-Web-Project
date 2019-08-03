// @flow

import * as React from 'react'

import LocalizedStrings from 'localized-strings'

import {View, Text, Image, Spacer, Divider, Popup, Button} from '../controls'

import CurrenciesCard from '../cards/CurrenciesCard'
import ActiveOrdersCard from '../cards/ActiveOrdersCard'
import CompletedOrdersCard  from '../cards/CompletedOrdersCard'

import type {Market, MarketDetails, MarketSummary, Trade, OrderBook, Order} from '../../types/Trading'
import type { NewOrderHandler, CancelOrderHandler, CancelOrderParams, CancelOrderResult } from '../../types/OrderRequest'

import styles from '../../styles/StyleGuide.css'
import Tab from '../controls/Tab'
import type {TabData} from '../controls/Tab'
import type {Profile} from '../../types/Profile'
import type {Balance} from '../../types/Balance'

import TradingViewChart from '../chart/TradingViewChart'
import MarketInfoCard from '../cards/MarketInfoCard'
import OrderCard from '../cards/OrderCard'
import TradeBottomBannerCard from '../cards/TradeBottomBannerCard'

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
          <Text fontSize='small' textColor='black' fontWeight='semibold'>{item.key}</Text>
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

const strings = new LocalizedStrings({
  en: {
    hello: '{first}, {second}',
    header: {
      activeOrders: 'ACTIVE ORDERS',
      completedOrders: 'COMPLETE ORDERS',
      amount: 'Amount',
      price: 'Price',
      total: 'Total',
      orderType: 'Order Type',
      ok: 'Confirm',
      cancel: 'Cancel'
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
      failToCancel: 'Fail to cancel an order'
    }
  },
  ko: {
    hello: '{second}, {first}',
    header: {
      activeOrders: '미체결주문',
      completedOrders: '완료주문',
      amount: '수량',
      price: '가격',
      total: '총액',
      orderType: '주문유형',
      ok: '확인',
      cancel: '취소'
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
      failToCancel: '주문 취소 실패'
    }
  }
})

type Props = {
  history: Object,
  markets: Market[],
  marketsObject: {[string]: Market},
  marketsDetails: {[string]: MarketDetails},
  marketsSummary: {[string]: MarketSummary},
  activeOrders: Order[],
  completedOrders: Order[],
  ordersTabIndex: number,
  ordersTabClick: (value: string) => void,
  balancesObject: {[string]: Balance} | null,
  tradeFeedList: Trade[] | null,
  selectedMarketId: string,
  orderBook: OrderBook,
  onSelectMarket: (marketId: string) => void,
  onNewOrder: NewOrderHandler,
  onCancelAllActiveOrders: () => Promise<boolean>,
  onOrderCancelClick: CancelOrderHandler,
  profile: Profile,
  language: string,
  popup: Object | null,
  onShowPopup: (popup: Object) => void,
  onClosePopup: () => void,
  popupVisible: boolean,
  onTabClick: (tabIndex: number) => void,
  prevDayClosePrice: string,
  marketStreamConnected: boolean
}

class TradingPage extends React.PureComponent<Props> {

  handleOrderCancel = (params: CancelOrderParams): Promise<CancelOrderResult> => {
    return new Promise((resolve, reject) => {
      this.props.onOrderCancelClick(params)
        .then((result: CancelOrderResult) => {
          if (!result.error) {
            this.props.onShowPopup({type: 'success', title: strings.popup.cancelToOrder, message: strings.popup.cancelMessage, onClose: this.props.onClosePopup})
            resolve(result)
          } else {
            this.props.onShowPopup({type: 'fail', title: strings.popup.failToCancel, message: result.error.message, onClose: this.props.onClosePopup})
            reject(result)
          }
        })
        .catch((result: CancelOrderResult) => {
          this.props.onShowPopup({type: 'fail', title: strings.popup.failToCancel, message: result.error ? result.error.message : '', onClose: this.props.onClosePopup})
          reject(result)
        })
    })
  }

  handleLoginClick = () => {
    this.props.history.push('/login')
  }

  handleSignupClick = () => {
    this.props.history.push('/signup')
  }

  handleNoticeClick = (id: number) => {
    this.props.history.push(`/support/announce?id=${id}`)
  }

  render() {
    const {
      markets,
      marketsObject,
      marketsDetails,
      marketsSummary,
      activeOrders,
      completedOrders,
      ordersTabIndex,
      ordersTabClick,
      balancesObject,
      orderBook,
      tradeFeedList,
      selectedMarketId,
      onSelectMarket,
      onNewOrder,
      onCancelAllActiveOrders,
      profile,
      language,
      popup,
      onShowPopup,
      onClosePopup,
      popupVisible,
      onTabClick,
      prevDayClosePrice,
      marketStreamConnected
    } = this.props

    strings.setLanguage(language)
    const lastTradeSequence = (tradeFeedList && tradeFeedList.length > 0) ? tradeFeedList[0].sequence : 0
    const ordersTabData = [{key: strings.header.activeOrders, value: 'active'}, {key: strings.header.completedOrders, value: 'completed'}]

    let tradeFee = Number(marketsObject[selectedMarketId].feeRatio) * 100 + ''

    if (profile && profile.maxTradeFee && profile.maxTradeFeeValidUntil && profile.maxTradeFeeValidUntil >= Date.now()) {
      tradeFee = Number(profile.maxTradeFee) * 100 + ''
    } else if (profile && profile.defaultMaxTradeFee) {
      tradeFee = Number(profile.defaultMaxTradeFee) * 100 + ''
    }

    return (
      <View flex='fill'>
        <View flex='fill' flexHorizontal minHeight={800}>

          <View flex='fill'>
            <View flex='fill'>
              <MarketInfoCard
                high={marketsSummary[selectedMarketId].high}
                low={marketsSummary[selectedMarketId].low}
                amount={marketsSummary[selectedMarketId].amount}
                volume={marketsSummary[selectedMarketId].volume}
                marketSymbol={marketsObject[selectedMarketId].marketSymbol}
                baseSymbol={marketsObject[selectedMarketId].baseSymbol}
                baseName={marketsObject[selectedMarketId].baseNames[strings.getLanguage()]}
                marketPrice={marketsDetails[selectedMarketId].price}
                marketChangeRate={marketsDetails[selectedMarketId].changeRate}
                prevDayClosePrice={prevDayClosePrice}
                baseDecimalPlaces={marketsObject[selectedMarketId].baseDecimalPlaces}
                pricingCurrencyDecimalPlaces={marketsObject[selectedMarketId].pricingCurrency.decimalPlaces}
                language={language}
              />

              <Divider/>

              <View flex='fill'>
                <View id="trading_view_container" position='absolute' width='100%' height='100%'>
                  <TradingViewChart
                    marketsObject={marketsObject}
                    marketId={selectedMarketId}
                    marketSymbol={marketsObject[selectedMarketId].marketSymbol}
                    baseSymbol={marketsObject[selectedMarketId].baseSymbol}
                    pricingSymbol={marketsObject[selectedMarketId].pricingCurrency.symbol}
                    sequence={lastTradeSequence}
                    containerId="trading_view_container"
                    language={language}
                  />
                </View>
              </View>
            </View>

            <Divider/>

            <View backgroundColor='white' maxHeight={370} height='100%'>
              <View maxWidth={400} paddingHorizontalNum={10}>
                <Tab data={ordersTabData} selectedIndex={ordersTabIndex} onPress={ordersTabClick} tabElement={TabElement} flex='fill'/>
              </View>

              <Divider/>

              <View flex='fill'>
                <View flex='fill' hidden={ordersTabIndex !== 0}>
                  <ActiveOrdersCard
                    activeOrders={activeOrders}
                    marketsObject={marketsObject}
                    onOrderCancelClick={this.handleOrderCancel}
                    onShowPopup={onShowPopup}
                    isNeedScrollbarSpace={true}
                    language={language}
                  />
                </View>
                <View flex='fill' hidden={ordersTabIndex !== 1}>
                  <CompletedOrdersCard
                    completedOrders={completedOrders}
                    marketsObject={marketsObject}
                    isNeedScrollbarSpace={true}
                    language={language}
                  />
                </View>
              </View>
            </View>
          </View>

          <Divider/>

          <OrderCard
            market={marketsObject[selectedMarketId]}
            balancesObject={balancesObject}
            orderBook={orderBook}
            onNewOrder={onNewOrder}
            onShowPopup={onShowPopup}
            onClosePopup={onClosePopup}
            popupVisible={popupVisible}
            profile={profile}
            language={language}
            prevDayClosePrice={prevDayClosePrice}
            tradeFeedList={tradeFeedList}
            onLoginClick={this.handleLoginClick}
            onSignupClick={this.handleSignupClick}
          />

          <Divider/>

          <View width='100%' maxWidth={340} style={styles.dontshrink}>
            <CurrenciesCard
              markets={markets}
              marketsObject={marketsObject}
              marketsDetails={marketsDetails}
              marketsSummary={marketsSummary}
              selectedMarketId={selectedMarketId}
              onSelectMarket={onSelectMarket}
              language={language}
            />
          </View>
        </View>

        <Divider/>

        <TradeBottomBannerCard onNoticeClick={this.handleNoticeClick} connected={marketStreamConnected} tradeFee={tradeFee} language={language}/>

        {popup !== null && (popup.type === 'success' || popup.type === 'fail') &&
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          buttonTitle={strings.header.ok}
          onButtonClick={popup.onClose}
        />
        }

        {popup !== null && popup.type === 'check' &&
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          buttonTitle={popup.successButtonTitle}
          onButtonClick={popup.onSuccess}
          cancelTitle={popup.cancelButtonTitle}
          onCancelClick={onClosePopup}
        />
        }

        {popup !== null && popup.type === 'confirm' &&
        <Popup>
          <View flex='fill' padding="xlarge" backgroundColor="white" boxShadow width='100%' maxWidth={400}>
            <Text textAlign='center' fontSize='medium' fontWeight='semibold'>{popup.title}</Text>
            <Spacer size='medium'/>
            <View flex='fill' alignItems='center'>
              <Image source={`/images/coins/${popup.symbol}.svg`} width={72} height={72}/>
            </View>
            <Spacer size='medium'/>
            <View flexHorizontal justifyContent='space-between'>
              <Text>{strings.header.amount}</Text>
              <Text>{popup.amount + ' ' + popup.symbol}</Text>
            </View>
            <Spacer size='medium'/>
            <View flexHorizontal justifyContent='space-between'>
              <Text>{strings.header.price}</Text>
              <Text>{popup.price + ' ' + popup.pricingSymbol}</Text>
            </View>
            <Spacer/>
            <Divider color='light-gray'/>
            <Spacer/>
            <View flexHorizontal justifyContent='space-between'>
              <Text>{strings.header.total}</Text>
              <Text>{popup.total + ' ' + popup.pricingSymbol}</Text>
            </View>
            <Spacer size='medium'/>
            <View flexHorizontal justifyContent='space-between'>
              <Text>{strings.header.orderType}</Text>
              <Text>{popup.orderType}</Text>
            </View>

            <Spacer size='xlarge'/>

            <View flexHorizontal>
              <Button title={strings.header.cancel} flex="fill" onPress={onClosePopup}/>
              <Spacer/>
              <Button title={strings.header.ok} flex="fill" color="iris" titleColor="white" onPress={popup.onConfirmClick}/>
            </View>
          </View>
        </Popup>
        }

      </View>
    )
  }
}

export default TradingPage

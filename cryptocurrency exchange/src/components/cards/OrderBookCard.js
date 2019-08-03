// @flow

import * as React from 'react'

import LocalizedStrings from 'localized-strings'

import {View, Text, Divider, Spacer} from '../controls'

import type {BookedPriceAndQuantity, OrderBook, TickSize, Trade} from '../../types/Trading'
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'
import tradingStyles from '../../styles/TradingPage.css'
import {formatPriceToTickSize} from '../../data/NumberUtils'
import type {Balance} from '../../types/Balance'
import type {Color} from '../controls'
import MiniTradeFeedCard from './MiniTradeFeedCard'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    header: {
      orderBook: 'ORDER BOOK',
      sellAmount: 'Amount',
      price: 'Price',
      buyAmount: 'Amount',
      limit: 'LIMIT',
      market: 'MARKET',
      boxTop: 'BOX-TOP',
      snapToPrimary: 'SNAP-TO-PRIMARY',
      snapToMarket: 'SNAP-TO-MARKET'
    },
    vi: {
      mode: 'Volatility Interruption (VI) MODE',
      modeDesc: 'The values represented below are anticipated price and amount.',
      modeExplain: 'What is volatility interruption?',
      explanation: 'Volatility interruption (VI) is a sophisticated microstructure mechanism designed to provide cooling-off periods and effective price discovery during brief periods of abnomal volatility for indivisual assets.'
    }
  },
  ko: {
    header: {
      orderBook: '호가',
      sellAmount: '매도잔량',
      price: '가격',
      buyAmount: '매수잔량',
      limit: '지정가',
      market: '시장가',
      boxTop: '최유리',
      snapToPrimary: '최우선',
      snapToMarket: '최우선유리'
    },
    vi: {
      mode: 'VI (변동성완화장치) 발동',
      modeDesc: '지금부터 2분간 거래가 유예되고 2분 후 단일가로 체결 처리됩니다',
      modeExplain: 'VI (변동성완화장치)란?',
      explanation: '특정 거래쌍의 가격이 전일 종가 대비 30% 이상, 현재가 대비 6% 이상 변동이 발생하는 경우 시세 급변동을 완화하는 가격 안정화 장치입니다.'
    }
  }
})

type RowProps = {
  sellQuantity: Decimal,
  sellExpectedConsumingQuantity: Decimal,
  sellExpectedStandbyQuantity: Decimal,
  price: string,
  buyQuantity: Decimal,
  buyExpectedConsumingQuantity: Decimal,
  buyExpectedStandbyQuantity: Decimal,
  maxQuantity: Decimal,
  prevDayClosePrice: Decimal,
  selectedPrice: Decimal | null,
  onPriceClick: (priceNumber: Decimal | null, isBuy: boolean) => void,
  backgroundColor?: Color,
  height: number,
  fontSize?: number
}

class Row extends React.PureComponent<RowProps> {
  priceNumber = new Decimal(this.props.price)

  handleClick = (event: Event) => {
    event.preventDefault()
    const {buyQuantity, onPriceClick} = this.props

    onPriceClick(this.priceNumber, buyQuantity.equals(0))
  }

  handleClosePriceClick = (event: Event) => {
    event.preventDefault()
    const {onPriceClick} = this.props

    onPriceClick(null, true)
  }

  handleBuyClick = (event: Event) => {
    event.preventDefault()
    const {onPriceClick} = this.props
    onPriceClick(this.priceNumber, true)
  }

  handleSellClick = (event: Event) => {
    event.preventDefault()
    const {onPriceClick} = this.props
    onPriceClick(this.priceNumber, false)
  }

  render() {
    const {sellQuantity, sellExpectedConsumingQuantity, sellExpectedStandbyQuantity,
      price, buyQuantity, buyExpectedConsumingQuantity, buyExpectedStandbyQuantity,
      maxQuantity, prevDayClosePrice, selectedPrice, backgroundColor, height, fontSize
    } = this.props
    const sellQuantityWidth = Math.max(sellQuantity.dividedBy(maxQuantity).mul(100).toNumber(), 1)
    const buyQuantityWidth = Math.max(buyQuantity.dividedBy(maxQuantity).mul(100).toNumber(), 1)

    const sellExpectedConsumingQuantityWidth = sellExpectedConsumingQuantity.dividedBy(maxQuantity).mul(100).toNumber()
    const buyExpectedConsumingQuantityWidth = buyExpectedConsumingQuantity.dividedBy(maxQuantity).mul(100).toNumber()

    const sellStandbyQuantityWidth = sellExpectedStandbyQuantity.dividedBy(maxQuantity).mul(100).toNumber()
    const buyStandbyQuantityWidth = buyExpectedStandbyQuantity.dividedBy(maxQuantity).mul(100).toNumber()

    const priceColor = this.priceNumber.greaterThanOrEqualTo(prevDayClosePrice) ? this.priceNumber.equals(0) ? 'dark-gray' : 'up-red' : 'down-blue'

    const isSelected = selectedPrice !== null && this.priceNumber.equals(selectedPrice)

    return (
      <View flexHorizontal height={height} style={styles.dontshrink} paddingHorizontalNum={15}>

        <View padding='xsmall' flex='fill' height='100%' justifyContent='center'>
          <View backgroundColor="sell-quantity-blue" style={{position: 'absolute', top: 5, bottom: 5, right: 0, width: sellQuantityWidth + '%'}} hidden={sellQuantity.equals(0)}/>
          <View backgroundColor="sell-selected-price-blue" style={{position: 'absolute', top: 5, bottom: 5, right: 0, width: sellExpectedConsumingQuantityWidth + '%'}} hidden={sellExpectedConsumingQuantity.equals(0)}/>
          <View backgroundColor="white" borderColor='sell-selected-price-blue' border='normal' style={{position: 'absolute', top: 5, bottom: 5, right: (sellQuantity.equals(0) ? '0' : sellQuantityWidth) + '%', width: sellStandbyQuantityWidth + '%'}} hidden={sellExpectedStandbyQuantity.equals(0)}/>
          <Text textAlign="right" fontSizeNum={fontSize ? fontSize : 14} textColor='dark-gray'>{sellQuantity.equals(0) ? '' : sellQuantity.toFixed(4, Decimal.ROUND_DOWN).toString()}</Text>
        </View>
        <View padding='xsmall' flex='fill' height='100%' justifyContent='center' onClick={this.handleClick} borderType='bottom' borderColor='white' border='normal' backgroundColor={backgroundColor}>
          <Text textAlign="right" fontSizeNum={fontSize ? fontSize : 14} textColor={priceColor} fontWeight={isSelected ? 'bold' : 'normal'}>{commaNumber(price)}</Text>
        </View>
        <View padding='xsmall' flex='fill' height='100%' justifyContent='center'>
          <View backgroundColor="buy-quantity-red" style={{position: 'absolute', top: 5, bottom: 5, left: 0, width: buyQuantityWidth + '%'}} hidden={buyQuantity.equals(0)}/>
          <View backgroundColor="buy-selected-price-red" style={{position: 'absolute', top: 5, bottom: 5, left: 0, width: buyExpectedConsumingQuantityWidth + '%'}} hidden={buyExpectedConsumingQuantity.equals(0)}/>
          <View backgroundColor="white" borderColor='buy-selected-price-red' border='normal' opacity={0.8} style={{position: 'absolute', top: 5, bottom: 5, left: (buyQuantity.equals(0) ? '0' : buyQuantityWidth) + '%', width: buyStandbyQuantityWidth + '%'}} hidden={buyExpectedStandbyQuantity.equals(0)}/>
          <Text textAlign="right" fontSizeNum={fontSize ? fontSize : 14} textColor='dark-gray'>{buyQuantity.equals(0) ? '' : buyQuantity.toFixed(4, Decimal.ROUND_DOWN).toString()}</Text>
        </View>

      </View>
    )
  }
}

type Props = {
  orderBook: OrderBook,
  prevDayClosePrice: Decimal,
  tickSizeRanges: TickSize[],
  language: string,
  marketId: string,
  balancesObject: {[string]: Balance} | null,
  isBuy: boolean,
  selectedPrice: Decimal,
  quantity: Decimal,
  onPriceClick: (priceNumber: Decimal | null, isBuy: boolean) => void,
  consumingQuantity: Decimal,
  standbyQuantity: Decimal,
  tradeFeedList: Trade[] | null,
  height: number,
  hiddenHeader?: boolean,
  headerFontSize?: number,
  fontSize?: number,
  tradeFeedFontSize?: number
}

class OrderBookCard extends React.PureComponent<Props> {

  contentsElement: HTMLElement | null = null
  maxOrderBookCount: number = 10

  scrollToCenter = () => {
    if (this.contentsElement === null) {
      this.contentsElement = document.getElementById('orderBookContents')
    }

    if (this.contentsElement !== null) {
      const scrollTop = (this.maxOrderBookCount * 40) - (this.contentsElement.offsetHeight / 2)

      if (scrollTop > 0) {
        this.contentsElement.scrollTop = scrollTop
      } else {
        this.contentsElement.scrollTop = 0
      }
    }
  }

  componentDidMount() {
    this.scrollToCenter()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.marketId !== prevProps.marketId) {
      this.scrollToCenter()
    }
  }

  render() {
    const {orderBook, language, tickSizeRanges, prevDayClosePrice,
      isBuy, selectedPrice, consumingQuantity, standbyQuantity,
      onPriceClick, tradeFeedList, height, hiddenHeader, headerFontSize, fontSize, tradeFeedFontSize} = this.props

    strings.setLanguage(language)

    const sellList: Array<BookedPriceAndQuantity> = orderBook.sellItems.filter(item => item.quantity.greaterThan(0)).slice(0).reverse()
    const buyList: Array<BookedPriceAndQuantity> = orderBook.buyItems.filter(item => item.quantity.greaterThan(0)).slice(0)

    const sellLowPrice = sellList.length > 0 ? sellList[0].price : new Decimal(Infinity)
    const buyHighPrice = buyList.length > 0 ? buyList[0].price : new Decimal(0)

    let existedPrice = false
    let existedIndex = 0

    if (selectedPrice !== null) {
      if (selectedPrice.lessThanOrEqualTo(buyHighPrice)) {
        for (let idx = 0; idx < buyList.length; idx++) {
          if (buyList[idx].price.equals(selectedPrice)) {
            existedPrice = true
          } else if(buyList[idx].price.lessThan(selectedPrice)) {
            break
          }
          existedIndex = idx
        }

        if (!existedPrice) {
          existedIndex += 1
          buyList.splice(existedIndex, 0, {sequence: 0, price: selectedPrice, quantity: new Decimal(0)})
        }
      } else if (selectedPrice.lessThan(sellLowPrice)) {
        if (isBuy) {
          buyList.splice(0, 0, {sequence: 0, price: selectedPrice, quantity: new Decimal(0)})
        } else {
          sellList.splice(0, 0, {sequence: 0, price: selectedPrice, quantity: new Decimal(0)})
        }
      } else {
        for (let idx = 0; idx < sellList.length; idx++) {
          if (sellList[idx].price.equals(selectedPrice)) {
            existedPrice = true
          } else if (sellList[idx].price.greaterThan(selectedPrice)) {
            break
          }
          existedIndex = idx
        }

        if (!existedPrice) {
          existedIndex = existedIndex + 1
          sellList.splice(existedIndex, 0, {sequence: 0, price: selectedPrice, quantity: new Decimal(0)})
        }
      }
    }

    const maxBookedPriceAndQuantity = sellList.concat(buyList).reduce((prev, next) => (selectedPrice !== null && selectedPrice.equals(prev.price) ? prev.quantity.add(standbyQuantity) : prev.quantity).greaterThan((selectedPrice !== null && selectedPrice.equals(next.price) ? next.quantity.add(standbyQuantity) : next.quantity)) ? prev : next, {sequence: 0, price: new Decimal(0), quantity: new Decimal(0)})
    const maxQuantity = Decimal.max(selectedPrice !== null && selectedPrice.equals(maxBookedPriceAndQuantity.price) ? maxBookedPriceAndQuantity.quantity.add(standbyQuantity) : maxBookedPriceAndQuantity.quantity, standbyQuantity)

    let sellCurrentTotalConsumingQuantity: Decimal = isBuy ? consumingQuantity : new Decimal(0)
    let buyCurrentTotalConsumingQuantity: Decimal = isBuy ? new Decimal(0) : consumingQuantity

    return (
      <View flex='fill' backgroundColor='white'>
        <View flexHorizontal paddingHorizontalNum={15} hidden={hiddenHeader}>
          <View flex='fill' height={height} justifyContent='center' alignItems='center'>
            <Text fontSizeNum={headerFontSize ? headerFontSize : 13} textColor='dark-gray'>{strings.header.sellAmount}</Text>
          </View>
          <View flex='fill' height={height} justifyContent='center' alignItems='center'>
            <Text fontSizeNum={headerFontSize ? headerFontSize : 13} textColor='dark-gray'>{strings.header.price}</Text>
          </View>
          <View flex='fill' height={height} justifyContent='center' alignItems='center'>
            <Text fontSizeNum={headerFontSize ? headerFontSize : 13} textColor='dark-gray'>{strings.header.buyAmount}</Text>
          </View>
        </View>

        <Divider/>

        <View flex='fill' justifyContent='center' overflow='auto' id='orderBookContents'>
          <View position='absolute' width='100%' height='100%'>
            {this.props.orderBook !== null && this.props.orderBook.marketStatus === 'VI_OPEN' &&
            <View justifyContent='center' position='absolute' zIndex={10} height={this.maxOrderBookCount * 80}>
              <View justifyContent='flex-end' flex='fill' backgroundColor='dark-gray' opacity={0.8} overflow='hidden' padding='xsmall'>
                <Text textColor='white' fontSize='small' fontWeight='semibold'>{strings.vi.mode}</Text>
                <Spacer/>
                <Text textColor='white' fontSize='xsmall'>{strings.vi.modeDesc}</Text>
              </View>
              <View height={240}/>
              <View flex='fill' backgroundColor='dark-gray' opacity={0.8} overflow='hidden' padding='xsmall'>
                <Text textColor='white' fontSize='small' fontWeight='semibold'>{strings.vi.modeExplain}</Text>
                <Spacer/>
                <Text textColor='white' fontSize='xsmall'>{strings.vi.explanation}</Text>
              </View>
            </View>
            }
            <View flex='fill'/>

            <View flexDirection='column-reverse' style={styles.dontshrink} height={this.maxOrderBookCount * 40}>
              {sellList.map((item, index) => {
                if (index < this.maxOrderBookCount) {
                  const sellCurrentConsumingQuantity = isBuy ? Decimal.min(sellCurrentTotalConsumingQuantity, item.quantity) : new Decimal(0)
                  sellCurrentTotalConsumingQuantity = Decimal.max(sellCurrentTotalConsumingQuantity.sub(item.quantity), new Decimal(0))

                  const sellCurrentStandbyQuantity = selectedPrice !== null && selectedPrice.equals(item.price) ? standbyQuantity : new Decimal(0)

                  return (
                    <React.Fragment key={item.price.toString()}>
                      <Row
                        sellQuantity={item.quantity}
                        sellExpectedConsumingQuantity={sellCurrentConsumingQuantity}
                        sellExpectedStandbyQuantity={sellCurrentStandbyQuantity}
                        price={formatPriceToTickSize(item.price, tickSizeRanges)}
                        buyQuantity={new Decimal(0)}
                        buyExpectedConsumingQuantity={new Decimal(0)}
                        buyExpectedStandbyQuantity={new Decimal(0)}
                        maxQuantity={maxQuantity}
                        quantityWidth={item.quantity.dividedBy(maxQuantity).mul(100).toNumber()}
                        prevDayClosePrice={prevDayClosePrice}
                        selectedPrice={selectedPrice}
                        onPriceClick={onPriceClick}
                        backgroundColor={sellCurrentConsumingQuantity.greaterThan(0) ? 'sell-selected-price-blue' : 'sell-price-blue'}
                        height={height}
                        fontSize={fontSize}
                      />
                    </React.Fragment>
                  )
                }
              })}
            </View>

            <Divider/>

            <View style={styles.dontshrink} height={this.maxOrderBookCount * 40}>
              <View position='absolute' width='33%' height='100%'>
                <MiniTradeFeedCard tradeFeedList={tradeFeedList} language={language} tickSizeRanges={tickSizeRanges} hiddenHeader={hiddenHeader} fontSize={tradeFeedFontSize}/>
              </View>
              {buyList.map((item, index) => {

                if (index < this.maxOrderBookCount) {
                  const buyCurrentConsumingQuantity = isBuy ? new Decimal(0) : Decimal.min(buyCurrentTotalConsumingQuantity, item.quantity)
                  buyCurrentTotalConsumingQuantity = Decimal.max(buyCurrentTotalConsumingQuantity.sub(item.quantity), new Decimal(0))

                  const buyCurrentStandbyQuantity = selectedPrice !== null && selectedPrice.equals(item.price) ? standbyQuantity : new Decimal(0)

                  return (
                    <React.Fragment key={item.price.toString()}>
                      <Row
                        sellQuantity={new Decimal(0)}
                        sellExpectedConsumingQuantity={new Decimal(0)}
                        sellExpectedStandbyQuantity={new Decimal(0)}
                        price={formatPriceToTickSize(item.price, tickSizeRanges)}
                        buyQuantity={item.quantity}
                        buyExpectedConsumingQuantity={buyCurrentConsumingQuantity}
                        buyExpectedStandbyQuantity={buyCurrentStandbyQuantity}
                        maxQuantity={maxQuantity}
                        quantityWidth={item.quantity.dividedBy(maxQuantity).mul(100).toNumber()}
                        prevDayClosePrice={prevDayClosePrice}
                        selectedPrice={selectedPrice}
                        onPriceClick={onPriceClick}
                        backgroundColor={buyCurrentConsumingQuantity.greaterThan(0) ? 'buy-selected-price-red' : 'buy-price-red'}
                        height={height}
                        fontSize={fontSize}
                      />
                    </React.Fragment>
                  )
                }
              })}
            </View>

            <View flex='fill'/>
          </View>
        </View>
      </View>
    )
  }
}

export default OrderBookCard

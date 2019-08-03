// @flow

import * as React from 'react'
import moment from 'moment'

import {View, Text, Divider} from '../controls'

import type {Market, Order} from '../../types/Trading'
import {firstGreaterThanZero, tryGreaterThanZero} from '../../data/OrderUtils'
import {formatPrice, formatQuantity, formatAmount} from '../../data/NumberUtils'

import LocalizedStrings from 'localized-strings'

import styles from '../../styles/StyleGuide.css'
import tradingStyles from '../../styles/TradingPage.css'
import commaNumber from 'comma-number'
import {AutoSizer, List} from 'react-virtualized'
import Decimal from 'decimal.js'

const strings = new LocalizedStrings({
  en: {
    header: {
      dateFinished: 'Date Finished',
      pair: 'Pair',
      type: 'Type',
      side: 'Side',
      price: 'Price',
      amount: 'Amount',
      total: 'Total',
      filled: 'Filled',
      status: 'Status',
      noItems: 'No Transactions'
    },
    item: {
      types: {
        LIMIT: 'Limit',
        MARKET: 'Market',
        BOX_TOP: 'Box-Top',
        SNAP_TO_PRIMARY: 'Snap-To-Primary',
        SNAP_TO_MARKET: 'Sanp-To-Market'
      },
      sides: {
        BUY: 'Buy',
        SELL: 'Sell',
        KILL: 'Cancel'
      },
      statuses: {
        REJECTED: 'Rejected',
        REFUTED: 'Rejected',
        DROPPED: 'Rejected',
        FILLED: 'Filled',
        KILLED: 'Cancelled',
        CANCELLED: 'Partially Filled'
      }
    }
  },
  ko: {
    header: {
      dateFinished: '완료일시',
      pair: '거래쌍',
      type: '주문유형',
      side: '매수/매도',
      price: '주문가',
      amount: '주문량',
      total: '주문총액',
      filled: '체결량',
      status: '상태',
      noItems: '주문 내역이 존재하지 않습니다.'
    },
    item: {
      types: {
        LIMIT: '지정가',
        MARKET: '시장가',
        BOX_TOP: '최유리',
        SNAP_TO_PRIMARY: '최우선',
        SNAP_TO_MARKET: '최우선유리'
      },
      sides: {
        BUY: '매수',
        SELL: '매도',
        KILL: '취소'
      },
      statuses: {
        REJECTED: '무효화됨',
        REFUTED: '무효화됨',
        DROPPED: '무효화됨',
        FILLED: '전부체결',
        KILLED: '전부취소',
        CANCELLED: '일부체결'
      }
    }
  }
})

type OrderProps = {
  closedAt?: string,
  marketSymbol: string,
  action: 'BUY' | 'SELL' | 'KILL',
  type?: 'LIMIT' | 'MARKET' | 'BOX_TOP' | 'SNAP_TO_PRIMARY' | 'SNAP_TO_MARKET',
  orderedPrice?: string,
  orderedQuantity?: string,
  orderedAmount?: string,
  effectivePrice?: string,
  effectiveQuantity?: string,
  effectiveAmount?: string,
  filledQuantity?: string,
  baseDecimalPlaces: number,
  pricingDecimalPlaces: number,
  hiddenColumns?: string[],
  fontSize?: number
}

class OrderRow extends React.PureComponent<OrderProps> {

  render() {
    const {closedAt, marketSymbol, action, type, orderedPrice, orderedQuantity, orderedAmount, effectivePrice, effectiveQuantity, effectiveAmount, filledQuantity, baseDecimalPlaces, pricingDecimalPlaces, hiddenColumns, fontSize} = this.props

    const isHidden = (value: string) => {
      return hiddenColumns && hiddenColumns.indexOf(value) >= 0
    }

    const backgroundColor = isHidden('side') ? (action === 'BUY' ? 'buy-quantity-red' : 'sell-quantity-blue') : 'white'

    const price: Decimal | null = firstGreaterThanZero(effectivePrice, orderedPrice)
    const quantity: Decimal | null = firstGreaterThanZero(effectiveQuantity, orderedQuantity)
    let amount: Decimal | null = firstGreaterThanZero(effectiveAmount, orderedAmount)
    if (!amount && price && quantity) {
      amount = Decimal.mul(price, quantity)
    }
    const filledQuantityDecimal = tryGreaterThanZero(filledQuantity)

    const fieldPaddingNum = 5

    return (
      <View flexHorizontal height={40} style={tradingStyles.orders_item} backgroundColor={backgroundColor} justifyContent='space-around'>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('date')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='center'>{moment(closedAt).format('MM-DD kk:mm')}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('pair')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='center'>{marketSymbol}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('side')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor={action === 'BUY' ? 'up-red' : action === 'SELL' ? 'down-blue' : 'dark-gray'} fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='center'>{strings.item.sides[action]}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('type')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='center'>{strings.item.types[type]}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('price')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontWeight='semibold' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='right'>{pricingDecimalPlaces > 0 ? formatPrice(price, pricingDecimalPlaces) : (price !== null ? commaNumber(price.toString()) : '-')}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('amount')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='right'>{formatQuantity(quantity, baseDecimalPlaces)}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('total')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='right'>{formatAmount(amount, pricingDecimalPlaces)}</Text>
          </View>
        </View>

        <View flex='fill' maxWidth={100} justifyContent='center' hidden={isHidden('filled')}>
          <View justifyContent='center' width='100%' position='absolute' paddingHorizontalNum={fieldPaddingNum}>
            <Text textColor='dark-gray' fontSizeNum={fontSize ? fontSize : 14} overflow='hidden' whiteSpace='nowrap' textAlign='right'>{formatQuantity(filledQuantityDecimal, baseDecimalPlaces)}</Text>
          </View>
        </View>
      </View>
    )
  }
}

type HeaderProps = {
  hiddenColumns?: string[],
  isNeedScrollbarSpace?: boolean,
  headerFontSize?: number
}

class Header extends React.PureComponent<HeaderProps> {

  isHidden = (value: string) => {
    return this.props.hiddenColumns && this.props.hiddenColumns.indexOf(value) >= 0
  }

  render() {
    const fontSize = this.props.headerFontSize ? this.props.headerFontSize : 13

    return (
      <View flexHorizontal height={40}>
        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('date')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.dateFinished}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('pair')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.pair}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('side')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.side}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('type')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.type}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('price')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.price}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('amount')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.amount}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('total')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.total}</Text>
        </View>

        <View flex='fill' justifyContent='center' alignItems='center' hidden={this.isHidden('filled')}>
          <Text textColor='dark-gray' fontSizeNum={fontSize}>{strings.header.filled}</Text>
        </View>

        {this.props.isNeedScrollbarSpace && <View width={17} style={styles.dontshrink}/>}
      </View>
    )
  }
}

type Props = {
  completedOrders: Order[],
  marketsObject: {[string]: Market},
  language: string,
  hiddenColumns?: string[],
  isNeedScrollbarSpace?: boolean,
  headerFontSize?: number,
  fontSize?: number
}

class CompletedOrdersCard extends React.PureComponent<Props> {

  render() {
    const {completedOrders, marketsObject, language, hiddenColumns, isNeedScrollbarSpace, headerFontSize, fontSize} = this.props

    strings.setLanguage(language)

    return (
      <View flex='fill' backgroundColor='white' style={styles.dontshrink}>
        <Header hiddenColumns={hiddenColumns} isNeedScrollbarSpace={isNeedScrollbarSpace} headerFontSize={headerFontSize}/>

        <Divider/>

        <View flex='fill'>
          <AutoSizer>
            {({height, width}) => (
              <List
                style={{outline: 'none', overflowY: 'scroll'}}
                width={width}
                height={height}
                rowCount={completedOrders.length}
                rowHeight={40}
                rowRenderer={(params) => {
                  const order = completedOrders[completedOrders.length - params.index - 1]

                  return (
                    <View key={'completed_' + (completedOrders.length - params.index - 1)} style={params.style}>
                      <OrderRow
                        closedAt={order.closedAt}
                        marketSymbol={order.marketSymbol}
                        action={order.action}
                        type={order.type}
                        orderedPrice={order.orderedPrice}
                        orderedQuantity={order.orderedQuantity}
                        orderedAmount={order.orderedAmount}
                        effectivePrice={order.effectivePrice}
                        effectiveQuantity={order.effectiveQuantity}
                        effectiveAmount={order.effectiveAmount}
                        filledQuantity={order.filledQuantity}
                        baseDecimalPlaces={marketsObject[order.marketId].baseDecimalPlaces}
                        pricingDecimalPlaces={marketsObject[order.marketId].pricingCurrency.decimalPlaces}
                        hiddenColumns={hiddenColumns}
                        fontSize={fontSize}
                      />
                    </View>
                  )
                }}
                noRowsRenderer={() => {
                  return (
                    <View height='100%' alignItems='center' justifyContent='center'>
                      <Text fontSizeNum={25} textColor='disabled'>{strings.header.noItems}</Text>
                    </View>
                  )
                }}
              />
            )}
          </AutoSizer>
        </View>
      </View>
    )
  }
}

export default CompletedOrdersCard
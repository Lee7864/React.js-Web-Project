// @flow

import * as React from 'react'
import {Divider, Spacer, Text, View} from '../controls'
import Dropdown from '../controls/Dropdown'
import type {Currency} from '../../types/Balance'
import moment from 'moment'

import 'react-dates/initialize'
import LocalizedStrings from 'localized-strings'
import {DateRangePicker} from 'react-dates'
import Decimal from 'decimal.js'
import Pagination from '../controls/Pagination'
import commaNumber from 'comma-number'

import styles from '../../styles/BalancePage.css'
import viewStyles from '../controls/View.css'

const strings = new LocalizedStrings({
  en: {
    trade: {
      asset: 'Asset',
      asset2: 'Asset',
      type: 'Type',
      amount: 'Amount',
      quantity: 'Quantity',
      price: 'Price',
      fee: 'Fee (Unit)',
      balance: 'Balances',
      date: 'Date',
      noItems: 'There is no trade history'
    },
    type: {
      buy: 'Buy',
      sell: 'Sell',
      deposit: 'Deposit',
      withdraw: 'Withdrawal',
      all: 'All',
      BUY: 'BUY',
      SELL: 'SELL',
      DEPOSIT: 'DEPOSIT',
      WITHDRAW: 'WITHDRAW',
      ALL: 'All',
    }
  },
  ko: {
    trade: {
      asset: '거래쌍',
      asset2: '자산명',
      type: '거래유형',
      amount: '거래금액',
      quantity: '거래수량',
      price: '평균체결가',
      fee: '수수료',
      balance: '보유수량',
      date: '일시',
      noItems: '거래 목록이 존재하지 않습니다.'
    },
    type: {
      buy: '매수',
      sell: '매도',
      deposit: '입금',
      withdraw: '출금',
      all: '전체',
      BUY: '매수',
      SELL: '매도',
      DEPOSIT: '입금',
      WITHDRAW: '출금',
      ALL: '전체',
    }
  }
})

type TradeHistoryRowProps = {
  history: Object
}

class TradeHistoryRow extends React.PureComponent<TradeHistoryRowProps> {
  render() {
    const {history} = this.props
    const feeSymbol = history.type == 'SELL' ? history.pricingSymbol : history.baseSymbol

    const symbolDecimalPlaces = history.pricingSymbol === 'KRW' ? 0 : 8

    return (
      <View>
        <Divider color='light-blue' opacity='0.5'/>

        <View phoneHidden>
          <Spacer size='medium-large'/>
          <View flexHorizontal>
            <Spacer size='medium'/>
            <View width='100%' maxWidth={110} justifyContent='center'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(history.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
            </View>
            <Spacer />
            <View width='100%' maxWidth={110} justifyContent='center'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.baseSymbol + '/' + history.pricingSymbol}</Text>
            </View>
            <Spacer/>
            <View width='100%' maxWidth={100} justifyContent='center'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('type.'+history.type)? strings.getString('type.'+history.type) : history.type}</Text>
            </View>
            <Spacer />
            <View width='100%' maxWidth={135} flexHorizontal tabletFlexVertical justifyContent='flex-end'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(history.quantity)}</Text>
              <Spacer size='tiny' />
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.baseSymbol}</Text>
            </View>
            <Spacer/>
            <View width='100%' maxWidth={135} flexHorizontal tabletFlexVertical justifyContent='flex-end'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(new Decimal(history.price).toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())}</Text>
              <Spacer size='tiny' />
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.pricingSymbol}</Text>
            </View>
            <Spacer />
            <View width='100%' maxWidth={135} flexHorizontal tabletFlexVertical justifyContent='flex-end'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(new Decimal(history.amount).toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())}</Text>
              <Spacer size='tiny' />
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.pricingSymbol}</Text>
            </View>
            <Spacer />
            <View width='100%' maxWidth={135} flexHorizontal tabletFlexVertical justifyContent='flex-end'>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.fee ? commaNumber(new Decimal(history.fee).toFixed(8, Decimal.ROUND_DOWN).toString()) : '-'}</Text>
              <Spacer size='tiny' />
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.fee ? feeSymbol : ''}</Text>
            </View>
            <View minWidth={13}></View>
          </View>
        </View>

        <View width='100%' paddingHorizontal="large" phoneOnlyShown>
          <Spacer size="medium" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.date}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(history.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.asset}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.baseSymbol + '/' + history.pricingSymbol}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.type}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('type.'+history.type)? strings.getString('type.'+history.type) : history.type}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.quantity}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(history.quantity) + ' ' + history.baseSymbol}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.price}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(new Decimal(history.price).toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())+ ' ' + history.pricingSymbol}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.amount}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(new Decimal(history.amount).toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())+ ' ' + history.pricingSymbol}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.trade.fee}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{history.fee ? commaNumber(new Decimal(history.fee).toFixed(8, Decimal.ROUND_DOWN).toString()) + ' ' + feeSymbol : '-'}</Text>
          </View>

        </View>

        <Spacer size='medium'/>
      </View>
    )
  }
}

type Props = {
  currencies: Currency[] | null,
  tradeHistories: Object | null,
  callHistories: (startDate: moment, endDate: moment, type: string, currencySymbol: string, pageNo: number, size: number) => void,
  language: string
}

type State = {
  startDate: moment,
  endDate: moment,
  focusedInput: Object | null
}

class TradeHistoryCard extends React.Component<Props, State> {
  state = {
    startDate: moment().add(-1, 'month'),
    endDate: moment(),
    focusedInput: null
  }

  constructor(props: Props) {
    super(props)

    if (props.tradeHistories !== null) {
      this.state.startDate = props.tradeHistories.startDate
      this.state.endDate = props.tradeHistories.endDate
    }
  }

  handleAssetChange = (currency: string) => {
    const {tradeHistories, callHistories} = this.props

    if (tradeHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'TRADE', '', 1, 20)
    } else {
      callHistories(tradeHistories.startDate, tradeHistories.endDate, tradeHistories.type, currency, 1, 20)
    }
  }

  handleTypeChange = (type: string) => {
    const {tradeHistories, callHistories} = this.props

    if (tradeHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'TRADE', '', 1, 20)
    } else {
      callHistories(tradeHistories.startDate, tradeHistories.endDate, type, tradeHistories.currencySymbol, 1, 20)
    }
  }

  handleDateChange = (startDate: moment, endDate: moment) => {
    this.setState({
      startDate: startDate,
      endDate: endDate
    })
  }

  handleCalendarClose = (startDate: moment, endDate: moment) => {
    const {tradeHistories, callHistories} = this.props

    if (tradeHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'TRADE', '', 1, 20)
    } else {
      callHistories(startDate, endDate, tradeHistories.type, tradeHistories.currencySymbol, 1, 20)
    }
  }

  handlePageClick = (pageNo: number) => {
    const {tradeHistories, callHistories} = this.props

    if (tradeHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'TRADE', '', 1, 20)
    } else {
      callHistories(tradeHistories.startDate, tradeHistories.endDate, tradeHistories.type, tradeHistories.currencySymbol, pageNo, tradeHistories.size)
    }
  }

  render() {
    const { currencies, tradeHistories, language } = this.props

    strings.setLanguage(language)

    let dropdownAsset = []
    dropdownAsset.push(<Dropdown.Item title={strings.type.all} value='' key='asset_all'/>)
    if (currencies !== null) {
      currencies
        .filter((currency) => {return currency.symbol != 'KRW'})
        .map((currency) => {
        dropdownAsset.push(<Dropdown.Item title={currency.symbol} value={currency.symbol} key={'asset_' + currency.symbol}/>)
      })
    }

    return (
      <View>
        <View width='100%'>
          <Spacer phoneHidden/>
          <View flexHorizontal flex='fill' flexWrap>
            <View width={200} style={styles.dontshrink}>
              {currencies && currencies !== null &&
              <Dropdown title={strings.trade.asset2} onItemClick={this.handleAssetChange} selectedValue={tradeHistories !== null ? tradeHistories.currencySymbol : ''}>
                {dropdownAsset}
              </Dropdown>
              }
            </View>
            <View width={214} style={styles.dontshrink}>
              <Dropdown title={strings.trade.type} onItemClick={this.handleTypeChange} selectedValue={tradeHistories !== null ? tradeHistories.type : 'TRADE'}>
                <Dropdown.Item title={strings.type.all} value='TRADE'/>
                <Dropdown.Item title={strings.type.buy} value='BUY'/>
                <Dropdown.Item title={strings.type.sell} value='SELL'/>
              </Dropdown>
            </View>

            {tradeHistories !== null &&
            <View flexHorizontal>
              <Spacer size='large'/>
              <View width={255} style={styles.dontshrink}>
                <Spacer size='xsmall'/>
                <View border='normal' borderRadius='small' borderColor='light-blue'>
                  <DateRangePicker
                    numberOfMonths={1}
                    minimumNights={0}
                    readOnly
                    noBorder
                    isOutsideRange={day => moment().isBefore(day.hour(0).minute(0).second(0))}
                    small
                    showDefaultInputIcon
                    startDate={this.state.startDate}
                    startDateId="startDate"
                    endDate={this.state.endDate}
                    endDateId="endDate"
                    onDatesChange={({ startDate, endDate }) => this.handleDateChange(startDate, endDate)}
                    onClose={({ startDate, endDate }) => this.handleCalendarClose(startDate, endDate)}
                    focusedInput={this.state.focusedInput}
                    onFocusChange={focusedInput => this.setState({ focusedInput: focusedInput })}
                  />

                </View>
              </View>
            </View>
            }
          </View>
          <View phoneHidden>
            <Spacer size='xsmall'/>
            <Divider color='light-blue'/>
            <Spacer size='medium'/>
            <View flexHorizontal width='100%'>
              <Spacer size='medium'/>
              <View width='100%' maxWidth={110}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.date}</Text>
              </View>
              <Spacer />
              <View width='100%' maxWidth={110}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.asset}</Text>
              </View>
              <Spacer/>
              <View width='100%' maxWidth={100}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.type}</Text>
              </View>
              <Spacer />
              <View width='100%' maxWidth={135}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.quantity}</Text>
              </View>
              <Spacer/>
              <View width='100%' maxWidth={135}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.price}</Text>
              </View>
              <Spacer />
              <View width='100%' maxWidth={135}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.amount}</Text>
              </View>
              <Spacer />
              <View width='100%' maxWidth={135}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.trade.fee}</Text>
              </View>
              <View minWidth={13}></View>
            </View>
          </View>
          <Spacer size='small'/>
          {tradeHistories !== null && tradeHistories.historyList !== null && tradeHistories.historyList.map((history) => (
            <TradeHistoryRow history={history} key={history.timestamp}/>
          ))}

          { tradeHistories === null &&
            <View alignItems='center'>
            </View>
          }
          { tradeHistories !== null && tradeHistories.historyList === null &&
            <View alignItems='center' height={100}>
              <Spacer size="huge"/>
              <Text textColor='gray'>{strings.trade.noItems}</Text>
            </View>
          }

        </View>

        <View alignItems='center'>
          {tradeHistories !== null &&
          <Pagination
            pageNo={tradeHistories.pageNo}
            totalPageNo={tradeHistories.totalPageNo}
            onPageClick={this.handlePageClick}
          />
          }
        </View>
      </View>
    )
  }
}

export default TradeHistoryCard
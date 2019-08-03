// @flow

import * as React from 'react'
import type {Currency, Deposit} from '../../types/Balance'
import { Button, Divider, Spacer, Text, View } from '../controls'
import moment from 'moment'
import LocalizedStrings from 'localized-strings'
import Dropdown from '../controls/Dropdown'
import {DateRangePicker} from 'react-dates'
import Pagination from '../controls/Pagination'
import Image from '../controls/Image'
import commaNumber from 'comma-number'
import viewStyle from '../controls/View.css'
import styles from '../../styles/BalancePage.css'

const strings = new LocalizedStrings({
  en: {
    deposit: {
      asset: 'Asset',
      status: 'Status',
      amount: 'Amount',
      date: 'Date',
      detail: 'Details',
      transactionId: 'Transaction Id',
      address: 'Address',
      noItems: 'There is no deposit history'
    },
    status: {
      KILL: 'Canceled',
      FREEZE: 'Processing',
      DONE: 'Complete',
      COMPLETED: 'Complete',
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
    deposit: {
      asset: '자산명',
      status: '상태',
      amount: '입금수량',
      date: '날짜',
      detail: '입금 정보',
      transactionId: '거래 ID',
      address: '주소',
      noItems: '입금 내역이 없습니다.'
    },
    status: {
      KILL: '취소',
      FREEZE: '대기',
      DONE: '완료',
      COMPLETED: '완료',
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

type RowProps = {
  deposit: Object,
  onDepositClick: (symbol: string, timestamp: number) => void,
  visibleDeposit: boolean,
}

class DepositRow extends React.PureComponent<RowProps> {

  handleDepositClick = () => {
    const { deposit, onDepositClick } = this.props

    onDepositClick(deposit.address, deposit.timestamp)
  }

  render() {
    const { deposit, visibleDeposit } = this.props

    const depositButtonColor = visibleDeposit ? 'iris' : 'white'
    const depositButtonTitleColor = visibleDeposit ? 'white' : 'default'

    return (
      <View>
        <Spacer size='xsmall'/>
        <View flexHorizontal padding="xsmall" alignItems='center' phoneHidden>
          <View width='20%' minWidth={70} maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Image source={`/images/coins/${deposit.baseSymbol}.svg`} width={24} height={24}/>
              <Spacer size='xsmall'/>
              <View>
                <Spacer size="xsmall" />
                <Text fontSize="tiny" width={30} textAlign='left'>{deposit.baseSymbol}</Text>
              </View>
            </View>
          </View>
          <View minWidth='10%' maxWidth={100}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('status.'+deposit.status)? strings.getString('status.'+deposit.status) : deposit.status}</Text>
          </View>
          <View minWidth='20%' maxWidth={180}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(deposit.amount)}</Text>
          </View>
          <View minWidth='20%' maxWidth={180}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(deposit.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
          </View>
          {
            deposit.baseSymbol !== 'KRW' &&
            <View minWidth='40%' maxWidth={300} flexHorizontal justifyContent='center' alignItems='center'>
              <Button title={strings.deposit.detail} size='xsmall' fontSize='xsmall' color={depositButtonColor} titleColor={depositButtonTitleColor} onPress={this.handleDepositClick} width={112}/>
            </View>
          }
          {
            deposit.baseSymbol === 'KRW' &&
            <View minWidth='40%' maxWidth={300} />
          }
        </View>


        <View flexHorizontal width='100%' paddingHorizontal="medium" phoneOnlyShown justifyContent='space-between'>
          <View minWidth='10%' maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Spacer size="xsmall"/>
              <Image source={`/images/coins/${deposit.baseSymbol}.svg`} width={24} height={24}/>
              <Spacer size='xsmall'/>
              <View>
                <Spacer size="tiny" />
                <Text style={styles.symbol}>{deposit.baseSymbol}</Text>
              </View>
            </View>
          </View>
        </View>

        <View width='100%' paddingHorizontal="large" phoneOnlyShown>
          <Spacer size="small" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.deposit.status}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('status.'+deposit.status)? strings.getString('status.'+deposit.status) : deposit.status}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.deposit.amount}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(deposit.amount)}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.deposit.date}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(deposit.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
          </View>

          {
            deposit.baseSymbol !== 'KRW' &&
            <View flexHorizontal paddingHorizontal="small" style={{paddingTop: '10px'}}>
              <View onClick={this.handleDepositClick}
                    width='100%'
                    paddingVertical='medium'
                    paddingHorizontal='xsmall'
                    alignItems='center'
                    style={{cursor: 'pointer'}}>
                <Text fontSize="small" cursor='pointer'>{strings.deposit.detail}</Text>
              </View>
            </View>
          }
        </View>

        <Spacer size='xsmall'/>

        <DepositDetailRow
          visibleDeposit={visibleDeposit}
          deposit={deposit}
        />

      </View>
    )
  }
}


type DepositProps = {
  deposit: Deposit,
  visibleDeposit: boolean
}

class DepositDetailRow extends React.PureComponent<DepositProps> {

  render() {
    const { deposit, visibleDeposit } = this.props
    const hidden = !visibleDeposit

    return (
      <View flexHorizontal backgroundColor='light-gray' hidden={hidden}>
        <View style={styles.fang}>
          <Image source='/images/fang.svg'></Image>
        </View>

        <Divider color='light-blue' phoneHidden/>
        <View width='100%'>
          <Divider color='light-blue'/>
          <Spacer size='large' phoneHidden/>
          <Spacer size='small' phoneOnlyShown/>

          <View width='100%' flexHorizontal phoneHidden>
            <View style={styles.withdrawDetailTitle}>
              <Text style={styles.withdrawDetailTitleText}>{strings.deposit.address}:</Text>
            </View>
            <Spacer size="small" />
            <View style={styles.withdrawDetailValue}>
              <Text style={styles.withdrawDetailValueText}>{deposit.address}</Text>
            </View>
          </View>

          <View phoneOnlyShown flexHorizontal>
            <View style={{width:strings.getLanguage() === 'ko' ? '15%' : '27%'}}>
              <Text style={styles.withdrawDetailTitleText}>{strings.deposit.address} :</Text>
            </View>
            <Spacer size='tiny' />
            <View style={{width:strings.getLanguage() === 'ko' ? '80%' : '68%'}}>
              <Text style={styles.withdrawDetailValueText}>{deposit.address || '-'}</Text>
            </View>
          </View>

          <Spacer size='medium' phoneHidden/>
          <Spacer size='small' phoneOnlyShown/>

          <View width='100%' flexHorizontal phoneHidden>
            <View style={styles.withdrawDetailTitle}>
              <Text fontSize="small" align="right" fontWeight='bold' style={styles.withdrawDetailTitleText}>{strings.deposit.transactionId}:</Text>
            </View>
            <Spacer size="small" />
            <View style={styles.withdrawDetailValue}>
              <Text style={styles.withdrawDetailValueText}>{deposit.transactionId || '-'}</Text>
            </View>
          </View>

          <View phoneOnlyShown flexHorizontal>
            <View style={{width:strings.getLanguage() === 'ko' ? '15%' : '27%'}}>
              <Text style={styles.withdrawDetailTitleText}>{strings.deposit.transactionId} :</Text>
            </View>
            <Spacer size='tiny' />
            <View style={{width:strings.getLanguage() === 'ko' ? '80%' : '68%'}}>
              <Text style={styles.withdrawDetailValueText}>{deposit.transactionId || '-'}</Text>
            </View>
          </View>

          <Spacer size='large' phoneHidden/>
          <Spacer size='small' phoneOnlyShown/>

        </View>
        <Divider color='light-blue' phoneHidden/>

      </View>
    )
  }
}

type Props = {
  currencies: Currency[] | null,
  depositHistories: Object | null,
  callHistories: (startDate: moment, endDate: moment, type: string, currencySymbol: string, pageNo: number, size: number) => void,
  language: string
}

type State = {
  lastTimestamp: number,
  selectedTimestamp: number,
  selectedAddress: string,
  visibleDeposit: boolean,
  startDate: moment,
  endDate: moment,
  focusedInput: Object | null
}

class DepositsCard extends React.PureComponent<Props, State> {
  state = {
    lastTimestamp: 0,
    selectedTimestamp: 0,
    selectedAddress: '',
    visibleDeposit: false,
    startDate: moment().add(-1, 'month'),
    endDate: moment(),
    focusedInput: null
  }

  constructor(props: Props) {
    super(props)

    if (props.depositHistories !== null) {
      this.state.startDate = props.depositHistories.startDate
      this.state.endDate = props.depositHistories.endDate
    }
  }

  handleDepositClick = (address: string, timestamp: number) => {
    const { selectedAddress, selectedTimestamp, visibleDeposit } = this.state

    if (selectedAddress !== null && selectedAddress === address
        && selectedTimestamp !== null && selectedTimestamp === timestamp
      && (visibleDeposit === true)) {
      this.setState({
        selectedAddress: '',
        selectedTimestamp: 0,
        visibleDeposit: false,
      })
      return
    }

    this.setState({
      selectedAddress: address,
      selectedTimestamp: timestamp,
      visibleDeposit: true,
    })
  }

  handleAssetChange = (currency: string) => {
    const {depositHistories, callHistories} = this.props

    if (depositHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'DEPOSIT', '', 1, 20)
    } else {
      callHistories(depositHistories.startDate, depositHistories.endDate, depositHistories.type, currency, 1, 20)
    }
  }

  handleDateChange = (startDate: moment, endDate: moment) => {
    this.setState({
      startDate: startDate,
      endDate: endDate
    })
  }

  handleCalendarClose = (startDate: moment, endDate: moment) => {
    const {depositHistories, callHistories} = this.props

    if (depositHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'DEPOSIT', '', 1, 20)
    } else {
      callHistories(startDate, endDate, depositHistories.type, depositHistories.currencySymbol, 1, 20)
    }
  }

  handlePageClick = (pageNo: number) => {
    const {depositHistories, callHistories} = this.props

    if (depositHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'DEPOSIT', '', 1, 20)
    } else {
      callHistories(depositHistories.startDate, depositHistories.endDate, depositHistories.type, depositHistories.currencySymbol, pageNo, depositHistories.size)
    }
  }

  render() {

    const {
      selectedAddress,
      selectedTimestamp,
      visibleDeposit,
      startDate,
      endDate,
      focusedInput
    } = this.state

    strings.setLanguage(this.props.language)

    const { currencies, depositHistories } = this.props

    let dropdownAsset = []
    dropdownAsset.push(<Dropdown.Item title={strings.type.all} value='' key='asset_all'/>)
    if (currencies !== null) {
      currencies.map((currency) => {
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
              <Dropdown title={strings.deposit.asset} onItemClick={this.handleAssetChange} selectedValue={depositHistories !== null ? depositHistories.currencySymbol : ''}>
                {dropdownAsset}
              </Dropdown>
              }
            </View>

            {depositHistories !== null &&
            <View flexHorizontal>
              <Spacer size='medium'/>
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
                    startDate={startDate}
                    startDateId="startDate"
                    endDate={endDate}
                    endDateId="endDate"
                    onDatesChange={({ startDate, endDate }) => this.handleDateChange(startDate, endDate)}
                    onClose={({ startDate, endDate }) => this.handleCalendarClose(startDate, endDate)}
                    focusedInput={focusedInput}
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
            <Spacer size='xsmall'/>
            <View flexHorizontal padding="xsmall">
              <View width='20%' minWidth={70} maxWidth={90} flexHorizontal justifyContent='flex-end'>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.deposit.asset}</Text>
                <Spacer size='tiny' />
              </View>
              <View minWidth='10%' maxWidth={100}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.deposit.status}</Text>
              </View>
              <View minWidth='20%' maxWidth={180}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.deposit.amount}</Text>
              </View>
              <View minWidth='20%' maxWidth={180}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.deposit.date}</Text>
              </View>
              <View minWidth='40%' maxWidth={300} />
            </View>
          </View>
          <Spacer size='xsmall'/>

          {depositHistories !== null && depositHistories.historyList !== null && depositHistories.historyList.map((deposit) => {
            return (
              <React.Fragment key={`${deposit.address}_${deposit.timestamp}`}>
                <Divider color='light-blue'/>
                <DepositRow
                  deposit={deposit}
                  onDepositClick={this.handleDepositClick}
                  visibleDeposit={selectedAddress === deposit.address && selectedTimestamp === deposit.timestamp && visibleDeposit}
                />
              </React.Fragment>
            )
          })}
          { depositHistories === null &&
          <View alignItems='center'>
          </View>
          }
          { depositHistories !== null && depositHistories.historyList === null &&
          <View alignItems='center' height={100}>
            <Spacer size="huge"/>
            <Text textColor='gray'>{strings.deposit.noItems}</Text>
          </View>
          }
        </View>

        <View alignItems='center'>
          {depositHistories !== null &&
          <Pagination
            pageNo={depositHistories.pageNo}
            totalPageNo={depositHistories.totalPageNo}
            onPageClick={this.handlePageClick}
          />
          }
        </View>
      </View>
    )
  }
}

export default DepositsCard


// @flow

import * as React from 'react'
import type {Currency, Withdrawal} from '../../types/Balance'
import { Button, Divider, Spacer, Text, View, Popup } from '../controls'
import moment from 'moment'
import LocalizedStrings from 'localized-strings'
import Dropdown from '../controls/Dropdown'
import {DateRangePicker} from 'react-dates'
import Pagination from '../controls/Pagination'
import Image from '../controls/Image'
import commaNumber from 'comma-number'
import styles from '../../styles/BalancePage.css'

const strings = new LocalizedStrings({
  en: {
    withdrawals: {
      asset: 'Asset',
      status: 'Status',
      amount: 'Amount',
      date: 'Date',
      detail: 'Withdrawal Details',
      cancel: 'Cancel',
      buttonCancel: 'Cancel',
      transactionId: 'Transaction Id',
      address: 'Address',
      noItems: 'There is no withdrawal history',
      continue: 'Continue',
      cancelled: 'Cancelled.',
      confirmcancel: 'Do you want to cancel the request for withdrawal?',
      fee: 'Fee'
    },
    status: {
      KILL: 'Canceled',
      FREEZE: 'Processing',
      ONGOING: 'Ongoing',
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
    withdrawals: {
      asset: '자산명',
      status: '상태',
      amount: '출금수량',
      date: '날짜',
      detail: '출금 정보',
      cancel: '출금 취소',
      buttonCancel: '취소',
      transactionId: '거래 ID',
      address: '주소',
      noItems: '출금 내역이 없습니다.',
      continue: '확인',
      cancelled: '취소 되었습니다.',
      confirmcancel: '출금신청을 취소하시겠습니까?',
      fee: '수수료'
    },
    status: {
      KILL: '취소',
      FREEZE: '대기',
      ONGOING: '처리중',
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
  withdrawal: Object,
  index: number,
  onWithdrawalClick: (symbol: string, timestamp: number) => void,
  onWithdrawCancelClick: (withdrawId: string, index: number) => void,
  visibleWithdrawal: boolean,
}

class WithdrawalRow extends React.PureComponent<RowProps> {

  handleWithdrawalClick = () => {
    const { withdrawal, onWithdrawalClick } = this.props
    onWithdrawalClick(withdrawal.address, withdrawal.timestamp)
  }

  handleCancelClick = () => {
    const { withdrawal, index, onWithdrawCancelClick } = this.props
    onWithdrawCancelClick(withdrawal.withdrawId, index)
  }

  render() {
    const { withdrawal, visibleWithdrawal } = this.props

    const withdrawalButtonColor = visibleWithdrawal ? 'iris' : 'white'
    const withdrawalButtonTitleColor = visibleWithdrawal ? 'white' : 'default'

    return (
      <View>
        <Spacer size='xsmall'/>
        <View flexHorizontal padding="xsmall" alignItems='center' phoneHidden>
          <View width='10%' minWidth={70} maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Image source={`/images/coins/${withdrawal.baseSymbol}.svg`} width={24} height={24}/>
              <Spacer size='xsmall'/>
              <View>
                <Spacer size="xsmall" />
                <Text fontSize="tiny" width={30} textAlign='left'>{withdrawal.baseSymbol}</Text>
              </View>
            </View>
          </View>
          <View minWidth='10%' maxWidth={100}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('status.'+withdrawal.status)? strings.getString('status.'+withdrawal.status) : withdrawal.status}</Text>
          </View>
          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(withdrawal.amount)}</Text>
          </View>
          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{ withdrawal.fee !== undefined ? commaNumber(withdrawal.fee) : '-' }</Text>
          </View>
          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(withdrawal.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
          </View>
          <View width='100%' flexHorizontal phoneFlexVertical justifyContent='flex-end'>
              <Button title={strings.withdrawals.detail} minWidth={110} size='xsmall' fontSize='xsmall' color={withdrawalButtonColor} titleColor={withdrawalButtonTitleColor} onPress={this.handleWithdrawalClick}/>
              <View minWidth={5}></View>
              {withdrawal.status === 'FREEZE' && <Button title={strings.withdrawals.cancel} minWidth={110} size='xsmall' fontSize='xsmall' onPress={this.handleCancelClick}/>}
              {withdrawal.status !== 'FREEZE' && <View minWidth={110}></View>}
              <View minWidth={10}></View>
          </View>
        </View>

        <View flexHorizontal width='100%' paddingHorizontal="medium" phoneOnlyShown justifyContent='space-between'>
          <View minWidth='10%' maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Spacer size="xsmall"/>
              <Image source={`/images/coins/${withdrawal.baseSymbol}.svg`} width={24} height={24}/>
              <Spacer size='xsmall'/>
              <View>
                <Spacer size="tiny" />
                <Text style={styles.symbol}>{withdrawal.baseSymbol}</Text>
              </View>
            </View>
          </View>
        </View>

        <View width='100%' paddingHorizontal="large" phoneOnlyShown>
          <Spacer size="small" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.status}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('status.'+withdrawal.status)? strings.getString('status.'+withdrawal.status) : withdrawal.status}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.amount}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(withdrawal.amount)}</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.fee}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{ withdrawal.fee !== undefined ? commaNumber(withdrawal.fee) : '-' }</Text>
          </View>

          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.date}</Text>
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(withdrawal.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
          </View>

          <View flexHorizontal paddingHorizontal="small" style={{paddingTop:'10px'}}>
            <View onClick={this.handleWithdrawalClick}
                  width={withdrawal.status === 'FREEZE' ? '50%' : '100%'}
                  paddingVertical='medium'
                  paddingHorizontal='xsmall'
                  alignItems='center'
                  style={{cursor:'pointer'}}>
              <Text fontSize="small" cursor='pointer'>{strings.withdrawals.detail}</Text>
            </View>
            {
              withdrawal.status === 'FREEZE' &&
              <React.Fragment>
                <View width={1} height={20} style={{backgroundColor:'#c4cdd5'}} alignSelf='center'/>
                <View onClick={this.handleCancelClick}
                      width='50%'
                      paddingVertical='medium'
                      paddingHorizontal='xsmall'
                      alignItems='center'
                      style={{cursor:'pointer'}}>
                  <Text fontSize="small" cursor='pointer'>{strings.withdrawals.cancel}</Text>
                </View>
              </React.Fragment>

            }
          </View>
        </View>

        <Spacer size='xsmall' phoneHidden/>

        <WithdrawalDetailRow
          visibleWithdrawal={visibleWithdrawal}
          withdrawal={withdrawal}
        />

      </View>
    )
  }
}

type WithdrawalProps = {
  visibleWithdrawal: boolean,
  withdrawal: Object,
}

class WithdrawalDetailRow extends React.PureComponent<WithdrawalProps> {

  render() {
    const { visibleWithdrawal, withdrawal } = this.props
    const hidden = !visibleWithdrawal

    return (
      <View flexHorizontal backgroundColor='light-gray' hidden={hidden}>
        <View style={styles.fang} hidden>
          <Image source='/images/fang.svg'></Image>
        </View>

        <Divider color='light-blue' phoneHidden/>
        <View width='100%'>
          <Divider color='light-blue'/>
          <Spacer size='large' phoneHidden/>
          <Spacer size='small' phoneOnlyShown/>

          <View width='100%' flexHorizontal phoneHidden>
            <View style={styles.withdrawDetailTitle}>
              <Text style={styles.withdrawDetailTitleText}>{strings.withdrawals.address}:</Text>
            </View>
            <Spacer size="small" />
            <View style={styles.withdrawDetailValue}>
              <Text style={styles.withdrawDetailValueText}>{withdrawal.address}</Text>
            </View>
          </View>

          <View phoneOnlyShown flexHorizontal>
            <View style={{width:strings.getLanguage() === 'ko' ? '15%' : '27%'}}>
              <Text style={styles.withdrawDetailTitleText}>{strings.withdrawals.address} :</Text>
            </View>
            <Spacer size='tiny' />
            <View style={{width:strings.getLanguage() === 'ko' ? '80%' : '68%'}}>
              <Text style={styles.withdrawDetailValueText}>{withdrawal.address || '-'}</Text>
            </View>
          </View>

          <Spacer size='medium' phoneHidden/>
          <Spacer size='small' phoneOnlyShown/>

          <View width='100%' flexHorizontal phoneHidden>
            <View style={styles.withdrawDetailTitle}>
              <Text fontSize="small" align="right" fontWeight='bold' style={styles.withdrawDetailTitleText}>{strings.withdrawals.transactionId}:</Text>
            </View>
            <Spacer size="small" />
            <View style={styles.withdrawDetailValue}>
              <Text style={styles.withdrawDetailValueText}>{withdrawal.transactionId || '-'}</Text>
            </View>
          </View>
          <View phoneOnlyShown flexHorizontal>
            <View style={{width:strings.getLanguage() === 'ko' ? '15%' : '27%'}}>
              <Text style={styles.withdrawDetailTitleText}>{strings.withdrawals.transactionId} :</Text>
            </View>
            <Spacer size='tiny' />
            <View style={{width:strings.getLanguage() === 'ko' ? '80%' : '68%'}}>
              <Text style={styles.withdrawDetailValueText}>{withdrawal.transactionId || '-'}</Text>
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
  withdrawalHistories: Object | null,
  callHistories: (startDate: moment, endDate: moment, type: string, currencySymbol: string, pageNo: number, size: number) => void,
  onWithdrawCancelClick: (withdrawId: string, index: number) => void,
  language: string
}

type State = {
  selectedTimestamp: number,
  selectedAddress: string,
  visibleWithdrawal: boolean,
  startDate: moment,
  endDate: moment,
  focusedInput: Object | null,
  showPopup: boolean,
  showAlertPopup: boolean,
  popupType: string,
  popupMessage: string,
  cancelId: string,
  cancelIndex: number,
}

class WithdrawalsCard extends React.PureComponent<Props, State> {
  state = {
    selectedTimestamp: 0,
    selectedAddress: '',
    visibleWithdrawal: false,
    startDate: moment().add(-1, 'month'),
    endDate: moment(),
    focusedInput: null,
    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupMessage: '',
    cancelId: '',
    cancelIndex: -1,
  }

  constructor(props: Props) {
    super(props)

    if (props.withdrawalHistories !== null) {
      this.state.startDate = props.withdrawalHistories.startDate
      this.state.endDate = props.withdrawalHistories.endDate
    }
  }

  handleWithdrawalClick = (address: string, timestamp: number) => {
    const { selectedAddress, selectedTimestamp, visibleWithdrawal } = this.state

    if (selectedAddress !== null && selectedAddress === address
      && selectedTimestamp !== null && selectedTimestamp === timestamp
      && (visibleWithdrawal === true)) {
      this.setState({
        selectedAddress: '',
        selectedTimestamp: 0,
        visibleWithdrawal: false
      })
      return
    }

    this.setState({
      selectedAddress: address,
      selectedTimestamp: timestamp,
      visibleWithdrawal: true,
    })
  }

  handleAssetChange = (currency: string) => {
    const {withdrawalHistories, callHistories} = this.props

    if (withdrawalHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'WITHDRAW', '', 1, 20)
    } else {
      callHistories(withdrawalHistories.startDate, withdrawalHistories.endDate, withdrawalHistories.type, currency, 1, 20)
    }
  }

  handleDateChange = (startDate: moment, endDate: moment) => {
    this.setState({
      startDate: startDate,
      endDate: endDate
    })
  }

  handleCalendarClose = (startDate: moment, endDate: moment) => {
    const {withdrawalHistories, callHistories} = this.props

    if (withdrawalHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'WITHDRAW', '', 1, 20)
    } else {
      callHistories(startDate, endDate, withdrawalHistories.type, withdrawalHistories.currencySymbol, 1, 20)
    }
  }

  handlePageClick = (pageNo: number) => {
    const {withdrawalHistories, callHistories} = this.props

    if (withdrawalHistories === null) {
      callHistories(this.state.startDate, this.state.endDate, 'WITHDRAW', '', 1, 20)
    } else {
      callHistories(withdrawalHistories.startDate, withdrawalHistories.endDate, withdrawalHistories.type, withdrawalHistories.currencySymbol, pageNo, withdrawalHistories.size)
    }
  }

  onWithdrawCancelClick = (withdrawId: string, index: number) => {
    this.setState({
      cancelId: withdrawId,
      cancelIndex: index,
      showPopup: true,
      popupType: 'confirmcancel'
    })
  }

  handlePopupClick = () => {
    this.setState({
      showPopup: false,
      showAlertPopup: false,
      popupType: '',
      popupMessage: '',
    })
  }

  handlePopupConfirmClick = () => {
    this.props.onWithdrawCancelClick(this.state.cancelId, this.state.cancelIndex)

    this.setState({
      cancelId: '',
      cancelIndex: -1,
      showPopup: false,
      popupType: ''
    })
  }

  handleShowPopup = (type: string, message: string) => {
    this.setState({
      showPopup: true,
      popupType: type,
      popupMessage: message
    })
  }

  handleShowAlertPopup = (type: string, message: string) => {
    this.setState({
      showAlertPopup: true,
      popupType: type,
      popupMessage: message
    })
  }

  render() {
    const {
      selectedAddress,
      selectedTimestamp,
      visibleWithdrawal,
      startDate,
      endDate,
      focusedInput,
      showPopup, showAlertPopup, popupType, popupMessage
    } = this.state

    const { currencies, withdrawalHistories, language } = this.props

    strings.setLanguage(language)

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
              <Dropdown title={strings.withdrawals.asset} onItemClick={this.handleAssetChange} selectedValue={withdrawalHistories !== null ? withdrawalHistories.currencySymbol : ''}>
                {dropdownAsset}
              </Dropdown>
              }
            </View>

            {withdrawalHistories !== null &&
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
            <View flexHorizontal padding="xsmall" >

              <View width='10%' minWidth={65} maxWidth={70}>
                <View flexHorizontal justifyContent='flex-end'>
                  <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.withdrawals.asset}</Text>
                  <Spacer size='xsmall' />
                </View>
              </View>
              <View minWidth='10%' maxWidth={100}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.withdrawals.status}</Text>
              </View>
              <View minWidth='15%' maxWidth={130}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.withdrawals.amount}</Text>
              </View>
              <View minWidth='15%' maxWidth={130} phoneHidden>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.withdrawals.fee}</Text>
              </View>
              <View minWidth='15%' maxWidth={130}>
                <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.withdrawals.date}</Text>
              </View>

              <View width='100%' flex='fill' phoneHidden/>
            </View>
          </View>
          <Spacer size='xsmall'/>
          {withdrawalHistories !== null && withdrawalHistories.historyList !== null && withdrawalHistories.historyList.map((withdrawal, index) => {
            return (
              <React.Fragment key={`${withdrawal.address}_${withdrawal.timestamp}`}>
                <Divider color='light-blue'/>
                <WithdrawalRow
                  withdrawal={withdrawal}
                  index={index}
                  onWithdrawalClick={this.handleWithdrawalClick}
                  onWithdrawCancelClick={this.onWithdrawCancelClick}
                  visibleWithdrawal={selectedAddress === withdrawal.address && selectedTimestamp === withdrawal.timestamp && visibleWithdrawal}
                  onShowPopup={this.handleShowPopup}
                />
              </React.Fragment>
            )
          })}

          { withdrawalHistories === null &&
            <View alignItems='center'>
            </View>
          }
          { withdrawalHistories !== null && withdrawalHistories.historyList === null &&
            <View alignItems='center' height={100}>
              <Spacer size="huge"/>
              <Text textColor='gray'>{strings.withdrawals.noItems}</Text>
            </View>
          }
        </View>

        <View alignItems='center'>
          {withdrawalHistories !== null &&
          <Pagination
            pageNo={withdrawalHistories.pageNo}
            totalPageNo={withdrawalHistories.totalPageNo}
            onPageClick={this.handlePageClick}
          />
          }
        </View>

        {
          showPopup && popupType === 'confirmcancel' &&
          <Popup type='success'
                 message={strings.withdrawals.confirmcancel}
                 buttonTitle={strings.withdrawals.continue}
                 onButtonClick={this.handlePopupConfirmClick}
                 cancelTitle={strings.withdrawals.buttonCancel}
                 onCancelClick={this.handlePopupClick}/>
        }
        {
          showPopup && popupType !== 'confirmcancel' &&
          <Popup type='success'
                 message={popupMessage}
                 image='images/success.png'
                 buttonTitle={strings.withdrawals.continue}
                 onButtonClick={this.handlePopupClick}/>
        }
        {
          showAlertPopup &&
          <Popup type='fail'
                 message={strings.assets.erroroccurred}
                 image='images/monotone.png'
                 buttonTitle={strings.withdrawals.continue}
                 onButtonClick={this.handlePopupClick}/>
        }

      </View>


    )
  }
}

export default WithdrawalsCard
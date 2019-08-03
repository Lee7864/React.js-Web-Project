// @flow

import * as React from 'react'
import moment from 'moment'
import Decimal from 'decimal.js'
import type {Balance, Currency} from '../../types/Balance'
import type {Profile} from '../../types/Profile'
import {Button, Input, Spacer, Text, View, Popup} from '../controls'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import { API_URL } from '../../config'
import LocalizedStrings from 'localized-strings'
import commaNumber from 'comma-number'
import viewStyle from '../controls/View.css'
import Image from '../controls/Image'
import balanceStyle from '../../styles/BalancePage.css'
import styles from '../../styles/StyleGuide.css'
import {popupService} from '../../redux/services'
import {store} from '../../redux'
import {parseUserLastInterest} from '../../data/InterestUtils'
import type {UserLastInterest} from '../../types/Interest'
import {treatNewline} from "../../data/StringUtil";
var QRCode = require('qrcode.react')

const strings = new LocalizedStrings({
  en: {
    assets: {
      asset: 'Asset',
      balances: 'Balances',
      available: 'Available',
      inorder: 'In orders',
      price: 'Price',
      _24hChange: '24h Change',
      hide: 'Hide 0 balance',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      continue: 'Continue',
      erroroccurred: 'An error occurred.',
      cancel: 'Cancel',
      belowlevel: 'Mobile Authentication is required.',
      linktomobileauth: 'Mobile Authentication',
      totalinterest: 'Total Interest Earned',
      thisinterest: 'Interest ({0})',
      interest: 'Interest',
    },
    deposit: {
      address: 'Deposit Address',
      important: 'Important!',
      copyAddrDesc1: 'Send only {0} to this deposit address. Sending any other coin or token to this address may result in the loss of your deposit.',
      copyAddr: 'Copy Address',
      copied: 'Your ({0}) address has been copied to your clipboard.',
      allocAddrComplete: 'Your ({0}) address has been generated.',
      allocAddr: 'Generate New {0} Address',
      allocAddrDesc: 'To deposit {0}, you must generate a new {0} address by pressing this button.',
      bchSuspended: 'Suspended due to hard fork',
      title: 'Deposit {0}'
    },
    withdraw: {
      address: '{0} Withdrawal Address',
      desc1: 'Enter the {0} withdrawal address',
      amount: 'Amount',
      available: 'Available',
      desc2: 'The minimum withdrawal amount {0} {1}',
      fee: 'Withdrawal Fee',
      check: 'Check this box to agree to the above fee charge for withdrawal',
      submit: 'Submit',
      important: 'Notice to Customers',
      //desc3: ' The minimum {0} withdrawal is {1} {0}.  Please see the Withdrawals page for current withdrawal status and also all withdrawal history.',
      notice1: '• Due to the nature of the blockchain network, withdrawals can not be canceled. Please make sure that the address and quantity are correct',
      notice2: '• It may take up to 90 minutes (9:00-21:00) for the withdrawal to be completed and may be delayed due to blockchain network conditions',
      notice3: '• Withdrawal limits reset at 9:00 am daily',
      notice4: '• If a fraudulent transaction has been suspected, withdrawals may be rejected',
      complete: 'Your withdrawal request has been submitted.',
      otpcode: 'OTP Code',
      password: 'Password',
      insertpassword: 'Enter your password',
      insert2facode: 'Enter 6 digits in your OTP app',
      title: 'Withdraw {0}',
      withdrawavailable: '{0} {1} Available',
      totalwithdrawal: 'Total Amount: {0} {1}',
      insufficientfunds: 'The requested withdrawal amount exceeds your balance.\nPlease check your balance and try again',
      noAddress: `The residential address registration is required\n for the Withdrawal in order to prevent money laundering and illicit fund transfers.`,
      addAddress: 'Add Address',
      cancelAddress: 'Cancel',
    }
  },
  ko: {
    assets: {
      asset: '자산명',
      balances: '보유수량',
      available: '거래가능수량',
      inorder: '거래중수량',
      price: '현재가', // check
      _24hChange: '전일대비',
      hide: '보유자산만 보기',
      deposit: '입금',
      withdraw: '출금',
      continue: '확인',
      erroroccurred: '오류가 발생했습니다.',
      cancel: '취소',
      belowlevel: '입출금 거래를 위해 보안등급 2단계 휴대전화 인증이 필요합니다.',
      linktomobileauth: '보안등급 2단계 가기',
      totalinterest: '총 누적이자',
      thisinterest: '이자액 ({0})',
      interest: '이자액',
    },
    deposit: {
      address: '입금주소',
      important: '입금 전 반드시 주의하세요.',
      copyAddrDesc1: '- 이 주소는 {0} 입금만 가능합니다.',
      copyAddrDesc2: '- 다른 암호화폐를 이 주소로 잘못 입금하면 손실될 수 있으니 주의해 주세요.',
      copyAddrDesc3: '- 암호화폐별 추가 주의사항',
      copyAddrDesc3KRW: ' ',
      copyAddrDesc3BTC: '- 비트코인 캐시(BCH)나 비트코인 골드(BTG)를 이 주소로 입금하지 않도록 특히 주의 바랍니다. 블록체인 네트워크에서 6번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3BCH: '- 블록체인 네트워크에서 6번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3BTG: '- 블록체인 네트워크에서 50번 승인 후 잔고에  반영됩니다.',
      copyAddrDesc3ETH: '- 이더리움 클래식(ETC)을 이 주소로 입금하지 않도록 특히 주의 바랍니다. 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3ETC: '- 이더리움(ETH)을 이 주소로 입금하지 않도록 특히 주의 바랍니다. 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3GNT: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3LTC: '- 블록체인 네트워크에서 6번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3OMG: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3POWR: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3REP: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3SNT: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3ZIL: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3ZRX: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddr: '입금주소 복사',
      copied: '{0} 입금주소가 복사되었습니다.',
      allocAddrComplete: '{0} 입금주소가 생성되었습니다.',
      allocAddr: '{0} 입금주소 생성',
      allocAddrDesc: '입금하려면 {0} 입금주소 생성 버튼을 클릭해 주세요.',
      bchSuspended: '하드포크로 입출금 중지',
      title: '{0} 입금'
    },
    withdraw: {
      address: '출금주소',
      desc1: '{0} 출금주소를 정확히 입력해 주세요.',
      amount: '출금수량',
      available: '출금가능',
      desc2: '최소 {0} {1}',
      fee: '출금수수료',
      check: '출금 전 주의사항을 읽고, 동의합니다.',
      submit: '출금신청',
      important: '출금 전 반드시 주의하세요.',
      notice1: '- 블록체인 네트워크 특성상 출금이 완료되면 취소할 수 없습니다. 주소와 수량이 정확한지 꼭 확인하시기 바랍니다.',
      notice2: '- 출금이 완료되기까지 최대 90분(9:00~21:00)이 소요되며 블록체인 네트워크 상황에 따라 지연될 수 있습니다.',
      notice3: '- 출금한도는 매일 오전 9:00에 초기화됩니다.',
      notice4: '- 부정거래가 의심되는 경우 출금이 제한될 수 있습니다.',
      important2: '출금한도 안내',
      notice5: '- 1일 출금한도는 보안등급에 따라 차등 적용됩니다.',
      notice6: '   2,3단계 승인 완료 회원:    10,000,000원',
      notice7: '     4단계 승인 완료 회원: 1,000,000,000원',
      notice8: '- 암호화폐의 1일 출금한도는 출금 시점의 원화 환산 금액으로 산정됩니다.',
      complete: '출금신청을 완료했습니다.',
      otpcode: '6자리 인증번호',
      password: '비밀번호',
      insertpassword: '비밀번호를 입력해 주세요.',
      insert2facode: 'OTP 앱의 인증번호를 입력해 주세요.',
      title: '{0} 출금',
      withdrawavailable: '출금가능: {0} {1}',
      totalwithdrawal: '총 출금액: {0} {1}',
      insufficientfunds: '잔액 부족으로 출금할 수 없습니다.\n다시 확인해 주세요.',
      noAddress: `불법자금 유입 및 자금세탁 방지를 위해,\n주소(거주지)를 등록하셔야 출금이 가능합니다.`,
      addAddress: '주소등록',
      cancelAddress: '취소',
    },
  }
})

type RowProps = {
  balance: Balance,
  price: string,
  pricingSymbol: string,
  pricingDecimalPlaces: number,
  changeRate: string,
  onBalanceClick: (balance: BalanceRow) => void,
  onBankingClick: (string) => void,
  onShowPopup: (type: string, message: string) => void,
  onShowAlertPopup: (type: string, message: string) => void,
  profile: Profile,
  onDepositClick: (balance: Balance, addressInfo: Object) => void,
  onWithdrawClick: (balance: Balance, withInfo: Object) => void,
  onShowAddAddressPopup: (type: string, message: string, handler: () => {}) => void,
}

type RowState = {
  visibleDeposit: boolean,
  visibleDepositAllocate: boolean,
  visibleWithdraw: boolean,
  depositAddress: string,
  withdrawFee: string,
  withdrawDailyLimit: string,
  withdrawUsed: string,
  withdrawAvailable: string
}

class BalanceRow extends React.Component<RowProps, RowState> {
  state = {
    depositAddress: '',
    withdrawFee: '',
    withdrawDailyLimit: '',
    withdrawUsed: '',
    withdrawAvailable: '',
    withdrawAddress: '',
    withdrawNote: '',
    withdrawAmount: '',
    visibleDeposit: false,
    visibleDepositAllocate: false,
    visibleWithdraw: false
  }

  setDisabled = () => {
    this.setState({
      visibleDeposit: false,
      visibleDepositAllocate: false,
      visibleWithdraw: false
    })
  }

  handleAllocateSuccess = (address: string) => {
    this.setState({
      depositAddress: address,
      visibleDeposit: true,
      visibleDepositAllocate: false
    })
  }

  handleDepositClick = () => {
    const { visibleDeposit, visibleDepositAllocate, depositAddress } = this.state
    if (visibleDeposit || visibleDepositAllocate) {
      this.setDisabled()
      return
    }

    const level: number = Number(this.props.profile.level.substr(5, 1))
    if (level < 2) {
      this.props.onShowAlertPopup('belowlevel', '')
      return
    }

    const { balance, onDepositClick } = this.props

    if (balance.currencySymbol === 'KRW') {
      this.props.onBankingClick('deposit')
      return
    }

    Promise.all([
      fetch(`${API_URL}/myaccount/deposit/${balance.currencySymbol}/address`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([addressInfo]) => {

      onDepositClick(balance, addressInfo)

    })
  }

  handleAddAddressPopup = () => {
    const { balance, profile} = this.props

    if (!profile.userAddress && balance.currencySymbol !== 'KRW') {
      this.props.onShowAddAddressPopup('addaddress', strings.withdraw.noAddress, this.handleWithdrawClick)
    } else
      this.handleWithdrawClick()
  }

  handleWithdrawClick = () => {
    const { visibleWithdraw } = this.state
    if (visibleWithdraw) {
      this.setDisabled()
      return
    }

    const level: number = Number(this.props.profile.level.substr(5, 1))
    if (level < 2) {
      this.props.onShowAlertPopup('belowlevel', '')
      return
    }

    const { balance, onWithdrawClick, profile} = this.props

    if (!new Decimal(balance.amount).greaterThan(0)) {
      this.props.onShowAlertPopup('insufficientfunds', strings.withdraw.insufficientfunds)
      return
    }

    if (balance.currencySymbol === 'KRW') {
      this.props.onBankingClick('withdraw')
    } else {
      Promise.all([
        fetch(`${API_URL}/currencies/${balance.currencySymbol}`),
        fetch(`${API_URL}/markets/${balance.currencySymbol}_KRW/ticker`),
        fetch(`${API_URL}/myaccount/withdraw/quota/KRW`, {
          method: 'get',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include'
        })
      ]).then(responses => (
        Promise.all(responses.map(response => response.json()))
      )).then(([currencyInfo, ticker, quota]) => {
        const tickerPrice = ticker!=null && ticker.price!=null ? new Decimal(ticker.price) : new Decimal(0)

        const balanceAvailable = Decimal.sub(balance.amount, balance.frozen)
        const todayAvailableInKrw = new Decimal(quota.available)
        var withdrawAvailable = Decimal.sub(balanceAvailable, currencyInfo.transferFee)

        if (tickerPrice.equals(0) == false) {
          // 출금 한도가 10원보다 작으면 0으로 처리
          if (todayAvailableInKrw.lessThan('10')) {
            withdrawAvailable = new Decimal(0)
          } else {
            const withdrawAvailableInKrw = withdrawAvailable.mul(tickerPrice)
            if (withdrawAvailableInKrw.greaterThan(todayAvailableInKrw)) {
              withdrawAvailable = new Decimal(todayAvailableInKrw).dividedBy(tickerPrice)
            }
          }
        }

        if (withdrawAvailable.lessThanOrEqualTo(0)) {
          withdrawAvailable = new Decimal(0)
        } else {
          withdrawAvailable = withdrawAvailable.toFixed(8, Decimal.ROUND_FLOOR)
        }

        let withdrawInfo = {}
        withdrawInfo.symbol = balance.currencySymbol
        withdrawInfo.withdrawFee = currencyInfo.transferFee
        withdrawInfo.withdrawDailyLimit = quota.dayLimit
        withdrawInfo.withdrawUsed = quota.used
        withdrawInfo.withdrawAvailable = withdrawAvailable
        withdrawInfo.twoFAEnabled = profile ? profile.twoFAEnabled : false

        onWithdrawClick( balance, withdrawInfo )
      })
    }
  }

  render() {
    const level: number = Number(this.props.profile.level.substr(5, 1))

    const {
      balance,
      price,
      pricingSymbol,
      pricingDecimalPlaces,
      changeRate,
      onShowPopup,
      onShowAlertPopup,
      profile
    } = this.props

    const {
      depositAddress,
      withdrawFee,
      withdrawDailyLimit,
      withdrawUsed,
      withdrawAvailable,
      visibleDeposit,
      visibleDepositAllocate,
      visibleWithdraw
    } = this.state

    const depositButtonColor = visibleDeposit || visibleDepositAllocate ? 'iris' : 'white'
    const withdrawButtonColor = visibleWithdraw ? 'iris' : 'white'

    const depositButtonTitleColor = visibleDeposit || visibleDepositAllocate ? 'white' : undefined
    const withdrawButtonTitleColor = visibleWithdraw ? 'white' : undefined

    const priceAmount = isNaN(price)? '-' : new Decimal(price).mul(new Decimal(balance.amount)).toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString()
    const priceAvailable = isNaN(price)? '-' : new Decimal(price).mul(new Decimal(new Decimal(balance.amount).sub(new Decimal(balance.frozen)))).toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString()
    const priceFrozen = isNaN(price)? '-' : new Decimal(price).mul(new Decimal(balance.frozen)).toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString()

    const changeRateBackground = new Decimal(changeRate).greaterThanOrEqualTo(0) ? new Decimal(changeRate).equals(0) ? 'gray' : 'up-red' : 'down-blue'
    const changeRateString = new Decimal(changeRate).greaterThan(0) ? '+' + changeRate : changeRate

    const amount = new Decimal(balance.amount)
    const frozen = new Decimal(balance.frozen)
    const available = amount.sub(frozen)

    const symbolDecimalPlaces = balance.currencySymbol === 'KRW' ? 0 : 8

    const parsedInterest: UserLastInterest = parseUserLastInterest(balance.interestLast, balance.interestLastAt, 'YYYYMMDD')

    return (
      <View>
        <Spacer size='small'/>

        <View flexHorizontal width='100%' phoneHidden>

          <View minWidth='10%' maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Spacer size="xsmall"/>
              <Image source={`/images/coins/${balance.currencySymbol}.svg`} width={24} height={24}/>
              <Spacer size='xsmall'/>
              <View>
                <Spacer size="xsmall" />
                <Text style={balanceStyle.symbol}>{balance.currencySymbol}</Text>
              </View>
            </View>
          </View>

          <View minWidth='15%' maxWidth={130} justifyContent="center" >
            <Text fontSize="xsmall" textAlign='right'>{commaNumber(amount.toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())}</Text>
            {balance.currencySymbol !== pricingSymbol && <Text fontSize="tiny" textColor='dark-gray' textAlign='right'>≈ {commaNumber(priceAmount)} {pricingSymbol}</Text>}
          </View>
          <View minWidth='15%' maxWidth={130} justifyContent="center">
            <Text fontSize="xsmall" textAlign='right'>{commaNumber(available.toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())}</Text>
            {balance.currencySymbol !== pricingSymbol && <Text fontSize="tiny" textColor='dark-gray' textAlign='right'>≈ {commaNumber(priceAvailable)} {pricingSymbol}</Text>}
          </View>
          <View minWidth='15%' maxWidth={130} justifyContent="center">
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(frozen.toFixed(symbolDecimalPlaces, Decimal.ROUND_UP).toString())}</Text>
            {balance.currencySymbol !== pricingSymbol && <Text fontSize="tiny" textColor='dark-gray' textAlign='right'>≈ {commaNumber(priceFrozen)} {pricingSymbol}</Text>}
          </View>

          <View minWidth='15%' maxWidth={130} justifyContent="center">
            <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(price)}</Text>
          </View>

          <View minWidth='10%' maxWidth={80} flexHorizontal justifyContent='flex-end' alignItems='center'>
            <View width={60} height={26} backgroundColor={changeRateBackground} padding='xsmall' borderRadius='xsmall' alignItems='center'>
              <Text fontSize="xsmall" fontWeight='normal' textColor='white'>{commaNumber(changeRateString)}%</Text>
            </View>
          </View>
          <View minWidth='20%' flexHorizontal>
            <Spacer size="small"/>
            <Button title={strings.assets.deposit}
                    style={{width: '45%', maxWidth: '80px'}}
                    size='xsmall'
                    fontSize='xsmall'
                    color={depositButtonColor}
                    titleColor={depositButtonTitleColor}
                    onPress={this.handleDepositClick}/>
            <Spacer size="tiny" />
            <Button title={strings.assets.withdraw}
                    style={{width: '45%', maxWidth: '80px'}}
                    size='xsmall'
                    fontSize='xsmall'
                    color={withdrawButtonColor}
                    titleColor={withdrawButtonTitleColor}
                    onPress={level>1 && !this.props.profile.userAddress ? this.handleAddAddressPopup : this.handleWithdrawClick}/>
            <Spacer size="tiny" />
          </View>
        </View>
        {
          balance.currencySymbol !== 'KRW' &&
          <React.Fragment>
            <Spacer size='xsmall' phoneHidden/>
            <View flexHorizontal width='100%' phoneHidden>
              <View width='17%' />
              <View  backgroundColor='pale-grey' padding='xsmall' borderRadius='xsmall'>
                <View flexHorizontal alignItems='center'>
                  <Text fontSize='xsmall' textColor='iris'>{strings.assets.totalinterest}:</Text>
                  <Spacer size="tiny" />
                  <Text fontSize='xsmall' textColor='iris' fontWeight='bold'>{balance.interest ? balance.interest : '0'} {balance.currencySymbol}</Text>
                  <Spacer size="xsmall" />
                  <View backgroundColor='dark-blue-grey' width={1} height={16}/>
                  <Spacer size="xsmall" />
                  <Text fontSize='xsmall' textColor='dark-blue-grey'>
                    {parsedInterest.yearMonth ?
                      strings.formatString(strings.assets.thisinterest, parsedInterest.yearMonth)
                      : strings.assets.interest
                    }:
                  </Text>
                  <Spacer size="tiny" />
                  <Text fontSize='xsmall' textColor='dark-blue-grey'>{parsedInterest.rateOrAmount} {balance.currencySymbol}</Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        }

        <View flexHorizontal width='100%' paddingHorizontal="medium" phoneOnlyShown justifyContent='space-between'>

          <View minWidth='10%' maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Spacer size="xsmall"/>
              <Image source={`/images/coins/${balance.currencySymbol}.svg`} width={24} height={24}/>
              <Spacer size='xsmall'/>
              <View>
                <Spacer size="tiny" />
                <Text style={balanceStyle.symbol}>{balance.currencySymbol}</Text>
              </View>
            </View>
          </View>

          <View flex='fill' flexHorizontal justifyContent="flex-end">
            <View paddingHorizontal="medium">
              <Spacer size="xsmall" />
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{ price !== '-' ? commaNumber(price) + ' ' + pricingSymbol : ''}</Text>
            </View>

            <View width={60}
                  height={26}
                  backgroundColor={changeRateBackground}
                  padding='xsmall'
                  borderRadius='xsmall'
                  alignItems='center'>
              <Text fontSize="xsmall" fontWeight='normal' textColor='white'>{commaNumber(changeRateString)}%</Text>
            </View>
          </View>

        </View>

        <View width='100%' paddingHorizontal="medium" phoneOnlyShown>
          <Spacer size="medium-large" />
          <View flexHorizontal justifyContent="space-between" paddingHorizontal='small'>
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.assets.balances}</Text>
            <View justifyContent="flex-end">
              <Text fontSize="xsmall" textAlign='right'>{commaNumber(amount.toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())}</Text>
              <Spacer size='tiny' />
              {balance.currencySymbol !== pricingSymbol && <Text fontSize="tiny" textColor='dark-gray' textAlign='right'>≈ {commaNumber(priceAmount)} {pricingSymbol}</Text>}
            </View>
          </View>

          <Spacer size="small" />

          <View flexHorizontal justifyContent="space-between" paddingHorizontal='small'>
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.assets.available}</Text>
            <View>
              <Text fontSize="xsmall" textAlign='right'>{commaNumber(available.toFixed(symbolDecimalPlaces, Decimal.ROUND_DOWN).toString())}</Text>
              <Spacer size='tiny' />
              {balance.currencySymbol !== pricingSymbol && <Text fontSize="tiny" textColor='dark-gray' textAlign='right'>≈ {commaNumber(priceAvailable)} {pricingSymbol}</Text>}
            </View>
          </View>

          <Spacer size="small" />

          <View flexHorizontal justifyContent="space-between" paddingHorizontal='small'>
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.assets.inorder}</Text>
            <View>
              <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(frozen.toFixed(symbolDecimalPlaces, Decimal.ROUND_UP).toString())}</Text>
              <Spacer size='tiny' />
              {balance.currencySymbol !== pricingSymbol && <Text fontSize="tiny" textColor='dark-gray' textAlign='right'>≈ {commaNumber(priceFrozen)} {pricingSymbol}</Text>}
            </View>
          </View>

          {
            balance.currencySymbol !== 'KRW' &&
            <React.Fragment>
              <Spacer size="small" />
              <View width='100%' backgroundColor='pale-grey' padding='small' borderRadius='xsmall'>
                <View flexHorizontal justifyContent="space-between">
                  <Text fontSize="xsmall" textColor='iris' textAlign='right'>{strings.assets.totalinterest}</Text>
                  <Text fontSize='xsmall' textColor='iris' fontWeight='bold'>{balance.interest ? balance.interest : '0'} {balance.currencySymbol}</Text>
                </View>
                <Spacer size='small' />
                <View flexHorizontal justifyContent="space-between">
                  <Text fontSize="xsmall" textColor='dark-gray' textAlign='right'>
                    {parsedInterest.yearMonth ?
                      strings.formatString(strings.assets.thisinterest, parsedInterest.yearMonth)
                      : strings.assets.interest
                    }
                  </Text>
                  <Text fontSize='xsmall' textColor='dark-gray'>{parsedInterest.rateOrAmount} {balance.currencySymbol}</Text>
                </View>
              </View>
            </React.Fragment>
          }

          <View flexHorizontal padding="small">
            <View onClick={this.handleDepositClick}
                  width={'50%'}
                  padding='xsmall'
                  alignItems='center'
                  style={{cursor:'pointer'}}>
              <Text fontSize="small" textColor='iris' fontWeight="bold" cursor='pointer'>{strings.assets.deposit}</Text>
            </View>

            <View width={1} height={20} style={{backgroundColor:'#c4cdd5'}} alignSelf='center'/>

            <View onClick={this.handleWithdrawClick}
                  width='50%'
                  padding='xsmall'
                  alignItems='center'
                  style={{cursor:'pointer'}}>
              <Text fontSize="small" textColor='iris' fontWeight="bold" cursor='pointer'>{strings.assets.withdraw}</Text>
            </View>
          </View>
        </View>

        <Spacer size='small' phoneHidden/>

      </View>
    )
  }
}


type Props = {
  marketTickers: Object | null,
  balances: Balance[] | null,
  balancesObject: Object | null,
  currencies: Currency[] | null,
  pricingSymbol: string,
  pricingDecimalPlaces: number,
  hideZeroBalances: boolean,
  onHideZeroBalanceClick: () => void,
  onBankingClick: (string) => void,
  profile: Profile,
  onLinktoAuthClick: () => void,
  onLinktoMyaccount: () => void,
  language: string,
  handleBalanceUpdated: () => void
}

type State = {
  selectedBalance: BalanceRow | null,
  hideZeroBalances: boolean,
  showPopup: boolean,
  showAlertPopup: boolean,
  showAddressPopup: boolean,
  popupType: string,
  popupMessage: string,
  popupAddressHandler: () => {},

  addressInfo: Object | null,
  withdrawInfo: Object | null
}

class AssetsCard extends React.Component<Props, State> {
  state = {
    selectedBalance: null,
    hideZeroBalances: this.props.hideZeroBalances,
    showPopup: false,
    showAlertPopup: false,
    showAddressPopup: false,
    popupType: '',
    popupMessage: '',
    popupAddressHandler: null,
    addressInfo: null,
    withdrawInfo: null
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.hideZeroBalances !== prevState.hideZeroBalances) {
      return {
        hideZeroBalances: nextProps.hideZeroBalances
      }
    }

    return null
  }

  handleBalanceClick = (balance: BalanceRow) => {
    const { selectedBalance } = this.state

    if (selectedBalance !== null) {
      selectedBalance.setDisabled()

      if (selectedBalance !== balance) {
        this.setState({
          selectedBalance: balance
        })
      }
    } else {
      this.setState({
        selectedBalance: balance
      })
    }
  }

  handleDepositClick = (balance: Balance, addressInfo: Object) => {
    store.dispatch(popupService.create(
      {
        popupType: 'requestdeposit',
        selectedBalance: balance,
        addressInfo: addressInfo,
      }
    ))
  }

  handleWithdrawClick = (balance: Balance, withdrawInfo: Object) => {
    store.dispatch(popupService.create(
      {
        popupType: 'requestwithdraw',
        selectedBalance: balance,
        withdrawInfo: withdrawInfo,
        twoFAEnabled: withdrawInfo.twoFAEnabled,
        callback: this.handleCallbackWithdrawComplete
      }
    ))
  }

  handleCallbackWithdrawComplete = () => {
    this.props.handleBalanceUpdated()
  }

  getPrice = (currencySymbol: string) => {
    const { marketTickers, pricingSymbol, pricingDecimalPlaces } = this.props

    if (marketTickers === null) {
      return '-'
    }

    if (currencySymbol === pricingSymbol) {
      return '-'
    } else if (currencySymbol === 'KRW') {
      const krw_price = new Decimal(marketTickers[pricingSymbol + '_KRW'].price)
      if (krw_price.equals(0)) {
        return '0'
      } else {
        return new Decimal(1).dividedBy(krw_price).toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString()
      }
    } else if (currencySymbol === 'BTC' && pricingSymbol === 'ETH') {
      const eth_btc_price = new Decimal(marketTickers['ETH_BTC'].price)

      if (eth_btc_price.equals(0)) {
        return '0'
      } else {
        return new Decimal(1).dividedBy(eth_btc_price).toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString()
      }
    } else {
      const ticker = marketTickers[currencySymbol + '_' + pricingSymbol]

      if (ticker) {
        return new Decimal(ticker.price).toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString()
      } else {
        return '-'
      }
    }
  }

  getChangeRate = (currencySymbol: string) => {
    const { marketTickers, pricingSymbol } = this.props

    if (marketTickers === null) {
      return '0'
    }

    if (currencySymbol === pricingSymbol) {
      return '0'
    } else if (currencySymbol === 'KRW') {
      const krw_change_rate = new Decimal(marketTickers[pricingSymbol + '_KRW'].changeRate)

      return new Decimal(krw_change_rate).mul(-1).toString()
    } else if (currencySymbol === 'BTC' && pricingSymbol === 'ETH') {
      const eth_btc_change_rate = new Decimal(marketTickers['ETH_BTC'].changeRate)

      return new Decimal(eth_btc_change_rate).mul(-1).toString()
    } else {
      const ticker = marketTickers[currencySymbol + '_' + pricingSymbol]

      if (ticker) {
        return ticker.changeRate
      } else {
        return '0'
      }
    }
  }

  handlePopupClick = () => {
    this.setState({
      showPopup: false,
      showAlertPopup: false,
      showAddressPopup: false,
      popupType: '',
      popupMessage: '',
    })
  }

  handlePopupClickAndUpdateBalance = () => {
    this.setState({
      showPopup: false,
      showAlertPopup: false,
      showAddressPopup: false,
      popupType: '',
      popupMessage: '',
    })
    this.props.handleBalanceUpdated()
  }

  handleLinktoAuthClick = () => {
    this.handlePopupClick()
    this.props.onLinktoAuthClick()
  }

  handleLinktoMyaccount = () => {
    this.handlePopupClick()
    this.props.onLinktoMyaccount()
  }

  handlePopupClickAndWithdraw = () => {
    this.handlePopupClick()

    if (moment().isBefore('2019-01-18')) this.state.popupAddressHandler()
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

  handleShowAddAddressPopup = (type: string, message: string, handler: () => {}) => {
    this.setState({
      showAddressPopup: true,
      popupType: type,
      popupMessage: message,
      popupAddressHandler: handler,
    })
  }

  render() {
    const {
      marketTickers,
      currencies,
      balancesObject,
      pricingSymbol,
      pricingDecimalPlaces,
      onHideZeroBalanceClick,
      onBankingClick,
      profile,
      language
    } = this.props

    const {
      hideZeroBalances,
      showPopup, popupType, showAlertPopup, popupMessage, showAddressPopup,
    } = this.state

    strings.setLanguage(language)

    return (
      <View width='100%'>
        <Spacer size='medium' phoneHidden/>
        <View flexHorizontal phoneHidden style={viewStyle.rowBorder}>
          <View width='10%' minWidth={70} maxWidth={90}>
            <View flexHorizontal justifyContent='flex-end'>
              <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.assets.asset}</Text>
              <Spacer size="xsmall"/>
            </View>
          </View>

          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.assets.balances}</Text>
          </View>
          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.assets.available}</Text>
          </View>
          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.assets.inorder}</Text>
          </View>

          <View minWidth='15%' maxWidth={130}>
            <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.assets.price}, {pricingSymbol}</Text>
          </View>
          <View minWidth='10%' maxWidth={80} flexHorizontal justifyContent='flex-end'>
            <Text fontSize="xsmall" fontWeight='normal' textColor='light-blue' textAlign='right'>{strings.assets._24hChange}</Text>
            <Spacer size='tiny' />
          </View>

          <View minWidth='20%' flexHorizontal justifyContent='flex-end'>
            <View id='hideZeroBalance'
                  flexHorizontal
                  width={14}
                  height={14}
                  component='input'
                  type='checkbox'
                  onClick={onHideZeroBalanceClick}
                  checked={hideZeroBalances}/>
            <Spacer size="tiny" />
            <View>
              <Text fontSize='xsmall' textColor='dark-gray'>{strings.assets.hide}</Text>
            </View>
            <Spacer size="large"/>
          </View>

        </View>

        {currencies && currencies.map((currency, index) => {
          let balance = null

          if (balancesObject !== null) {
            balance = balancesObject[currency.symbol]
          }

          if (balance === undefined || balance === null) {
            if (hideZeroBalances) {
              return null
            }

            balance = {
              currencySymbol: currency.symbol,
              amount: '0',
              frozen: '0',
              fee: '0',
              revision: '0'
            }
          }

          const price = marketTickers !== null ? this.getPrice(currency.symbol) : '-'
          const changeRate = marketTickers !== null ? this.getChangeRate(currency.symbol) : '0'

          return (
            <React.Fragment key={balance.currencySymbol}>
              {index > 0 && <View style={balanceStyle.rowBorder}/>}
              <BalanceRow
                balance={balance}
                price={price}
                pricingSymbol={pricingSymbol}
                pricingDecimalPlaces={pricingDecimalPlaces}
                changeRate={changeRate}
                onBalanceClick={this.handleBalanceClick}
                onDepositClick={this.handleDepositClick}
                onWithdrawClick={this.handleWithdrawClick}
                onBankingClick={onBankingClick}
                onShowPopup={this.handleShowPopup}
                onShowAlertPopup={this.handleShowAlertPopup}
                onShowAddAddressPopup={this.handleShowAddAddressPopup}
                profile={profile}
              />

            </React.Fragment>
          )
        })}
        {
          showPopup && (popupType === 'addressallocate' || popupType === 'addresscopied') &&
          <Popup type='success'
                 message={popupMessage}
                 image='images/success.png'
                 buttonTitle={strings.assets.continue}
                 onButtonClick={this.handlePopupClick}/>
        }
        {
          showPopup && popupType !== 'addressallocate' && popupType !== 'addresscopied' &&
          <Popup type='success'
                 message={popupMessage}
                 image='images/success.png'
                 buttonTitle={strings.assets.continue}
                 onButtonClick={this.handlePopupClickAndUpdateBalance}/>
        }
        {
          showAlertPopup && popupType === 'belowlevel' &&
          <Popup type="error"
                 message={strings.assets.belowlevel}
                 image='images/monotone.png'
                 buttonTitle={strings.assets.linktomobileauth}
                 onButtonClick={this.handleLinktoAuthClick}
                 cancelTitle={strings.assets.cancel}
                 onCancelClick={this.handlePopupClick}/>

        }
        {
          showAlertPopup && popupType !== 'belowlevel' &&
          <Popup type='fail'
                 message={popupMessage ? popupMessage : strings.assets.erroroccurred}
                 image='images/monotone.png'
                 buttonTitle={strings.assets.continue}
                 onButtonClick={this.handlePopupClick}/>
        }
        {
          showAddressPopup && popupType === 'addaddress' &&
          <Popup type='check'
            message={popupMessage ? popupMessage : strings.withdraw.noAddress}
            image='images/monotone.png'
            buttonTitle={strings.withdraw.addAddress}
            onButtonClick={this.handleLinktoMyaccount}
            cancelTitle={strings.withdraw.cancelAddress}
            onCancelClick={this.handlePopupClickAndWithdraw}/>

        }
      </View>
    )
  }
}

export default AssetsCard

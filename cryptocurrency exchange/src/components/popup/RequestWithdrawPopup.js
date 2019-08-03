// @flow

import * as React from 'react'
import Decimal from 'decimal.js'
import { View, Text, Spacer, Image, Button, Input } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import balanceStyle from '../../styles/BalancePage.css'
import {connect} from 'react-redux'
import {API_URL} from '../../config'
import commaNumber from 'comma-number'
import {popupService} from '../../redux/services'
import {store} from '../../redux'

const strings = new LocalizedStrings({
  en: {
    assets: {
      erroroccurred: 'An error occurred.',
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
      balancenotenough: 'Your balance is not enough.',
    }
  },
  ko: {
    assets: {
      erroroccurred: '오류가 발생했습니다.',
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
      balancenotenough: '잔액이 부족합니다.',
    },
  }
})


type Props = {
  language: string,
  data: Object,
  onClose: () => void,
  onShowPopup: (type: string, message: string) => void,
}

type State = {
  agree: boolean,
  withdrawAddress: string,
  withdrawNote: string,
  withdrawAmount: string,
  otpNumStr: string,
  password: string
}

class RequestWithdrawPopup extends React.Component<Props, State> {
  state = {
    agree: false,
    withdrawAddress: '',
    withdrawNote: '',
    withdrawAmount: '0',
    otpNumStr: '',
    password: ''
  }

  handleWithdrawAddressChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      withdrawAddress: event.currentTarget.value
    })
  }

  handleWithdrawNoteChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      withdrawNote: event.currentTarget.value
    })
  }

  handleWithdrawAmountChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      withdrawAmount: event.currentTarget.value
    })
  }

  handleWithdrawOtpNumChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.data.twoFAEnabled) {
      this.setState({
        otpNumStr: event.currentTarget.value
      })
    } else {
      this.setState({
        password: event.currentTarget.value
      })
    }
  }

  handleWithdrawSubmitClick = (symbol: string) => {
    if (!this.checkAvailable()) {
      return
    }

    const { withdrawAddress, withdrawAmount, otpNumStr, password } = this.state
    const {withdrawInfo} = this.props.data

    if (new Decimal(withdrawAmount).greaterThan(new Decimal(withdrawInfo.withdrawAvailable))) {
      this.props.onShowPopup('error', strings.withdraw.balancenotenough)
      return
    }

    let body: Object = {
      address: withdrawAddress,
      amount: withdrawAmount,
    }

    if (this.props.data.twoFAEnabled) {
      body.otpNumStr = otpNumStr
    } else {
      body.password = password
    }

    fetch(`${API_URL}/myaccount/withdraw/${symbol}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        this.props.data.callback()
        this.props.onShowPopup('success', strings.withdraw.complete)
        store.dispatch(popupService.remove())

      } else {

        Promise.all([response.json()]).then(([json]) => {
          if (json.error && json.error.reasons && json.error.reasons.length > 0) {
            this.props.onShowPopup('error', json.error.reasons[0].message)
          } else {
            this.props.onShowPopup('error', strings.assets.erroroccurred)
          }
        })
      }
    })
  }

  handleAgreeCheck = () => {
    const { agree } = this.state

    this.setState({
      agree: !agree
    })
  }

  checkAvailable = () => {
    const {agree, withdrawAddress, withdrawAmount, otpNumStr, password} = this.state
    if (isNaN(withdrawAmount) || withdrawAmount === '' || withdrawAddress === '') return false

    const auth = otpNumStr !== '' || password !== ''
    const amount = new Decimal(withdrawAmount).greaterThan(0)
    const available = agree &&  amount && auth

    return available
  }

  render() {
    strings.setLanguage(this.props.language)

    const minWidth = window.innerWidth < 350 ? window.innerWidth * 0.9 : 350
    const maxHeight = window.innerHeight < 800 ? window.innerHeight * 0.9 : 800

    const {data, onClose} = this.props
    const {withdrawAmount} = this.state
    const {selectedBalance, withdrawInfo} = data
    const symbol = selectedBalance.currencySymbol

    const available = this.checkAvailable()
    const withdrawSubmitButtonText = available ? 'white' : 'gray'
    const withdrawSubmitButtonBG = available ? 'iris' : 'light-gray'
    const withdrawSubmitButtonBorder = available ? 'iris' : 'light-gray'

    return(
      <View style={styles.dontshrink}
            backgroundColor="white"
            width='100%'
            maxWidth={830}
            maxHeight={maxHeight}
            overflow="auto">
        <View padding="large" style={styles.dontshrink}>
          <View flexHorizontal
                phoneFlexVertical
                tabletFlexVertical
                justifyContent="space-between">
            <View>
              <View paddingHorizontal="small"
                    phonePaddingHorizontal='none'
                    flexHorizontal
                    justifyContent="space-between" minWidth={minWidth}>
                <Text fontSize="large" fontWeight='light'>
                  {strings.formatString(strings.withdraw.title, symbol)}
                </Text>
                <Image source="/images/cancel_black.svg" width={20} height={20} cursor='pointer' onClick={onClose}/>
              </View>
              <Spacer size="small" />
              <View style={balanceStyle.importantMessageWithdraw}>
                <View width='100%' minWidth={minWidth}>
                  <View>
                    <Text fontSize="small" fontWeight='normal'>{strings.formatString(strings.withdraw.address, symbol)}</Text>
                    <Spacer size="small" />
                    <Input placeholder={strings.formatString(strings.withdraw.desc1, symbol)} onChange={this.handleWithdrawAddressChange} border='thin' borderColor='light-gray'/>
                  </View>
                  <Spacer size="medium" />

                  <View hidden>
                    <View flexHorizontal>
                      <Text fontSize="small" fontWeight='normal'>Note</Text>
                      <Spacer size="tiny" />
                      <Text fontSize="small" fontWeight='normal' textColor='light-blue'>(Not Required)</Text>
                    </View>
                    <Spacer size="small" />
                    <Input placeholder='Enter a note' onChange={this.handleWithdrawNoteChange} />
                  </View>
                  <Spacer size="medium" hidden/>

                  <View>
                    <View flexHorizontal>
                      <Text fontSize="small" fontWeight='normal'>{strings.withdraw.amount}</Text>
                      <Spacer size="tiny" />
                      <Text fontSize="small" fontWeight='normal' textColor='light-blue'>{'(' + withdrawInfo.withdrawAvailable + ' ' + symbol + ' '+ strings.withdraw.available +')'}</Text>
                    </View>
                    <Spacer size="small" />
                    <Input onChange={this.handleWithdrawAmountChange} border='thin' borderColor='light-gray'/>
                  </View>
                  <Spacer size="tiny"/>
                  <Text fontSize="xsmall" textAlign="right" >
                    {strings.formatString(strings.withdraw.withdrawavailable, withdrawInfo.withdrawAvailable, symbol)}
                  </Text>
                  <Spacer size="tiny"/>
                  <Text fontSize="xsmall" textAlign="right">
                    {strings.withdraw.fee} : {commaNumber(withdrawInfo.withdrawFee) + ' ' + symbol}
                  </Text>
                  <Spacer size="tiny"/>
                  <Text fontSize="xsmall" textAlign="right">
                    {strings.formatString(strings.withdraw.totalwithdrawal,
                      isNaN(withdrawAmount) || withdrawAmount === '' ? commaNumber(withdrawInfo.withdrawFee) : commaNumber(new Decimal(withdrawAmount).add(new Decimal(withdrawInfo.withdrawFee))), symbol)}
                  </Text>
                  <Spacer size="small"/>

                  <View>
                    <Text fontSize="small" fontWeight='normal'>{withdrawInfo.twoFAEnabled? strings.withdraw.insert2facode : strings.withdraw.insertpassword}</Text>
                    <Spacer size="small" />
                    <Input placeholder={withdrawInfo.twoFAEnabled? strings.withdraw.otpcode : strings.withdraw.password} type={withdrawInfo.twoFAEnabled ? 'text' : 'password'}
                           onChange={this.handleWithdrawOtpNumChange} border='thin' borderColor='light-gray'/>
                  </View>
                  <Spacer size="medium"/>

                  <View>
                    <View component='label' flexHorizontal>
                      <View component='input' type='checkbox' onClick={this.handleAgreeCheck}/>
                      <Spacer size="tiny" />
                      <View>
                        <Spacer size="tiny" />
                        <Text fontSize='xsmall'>{strings.withdraw.check}</Text>
                      </View>
                    </View>
                  </View>
                  <Spacer size="medium" />

                  <Button title={strings.withdraw.submit}
                          titleColor={withdrawSubmitButtonText}
                          backgroundColor={withdrawSubmitButtonBG}
                          borderColor={withdrawSubmitButtonBorder}
                          onPress={() => this.handleWithdrawSubmitClick(symbol)}/>
                  <View flex='fill'/>
                </View>

                <Spacer size="large" />

                <View>
                  <View style={balanceStyle.importantMessageBox}>
                    <View>
                      <Text fontSize="small" fontWeight='bold' textColor='dark-blue-grey'>{strings.withdraw.important}</Text>
                      <Spacer size="medium" />
                      <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.withdraw.notice1}</Text>
                      <Spacer size="small" />
                      <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.withdraw.notice2}</Text>
                      {!strings.withdraw.important2 && <Spacer size="small" />}
                      {!strings.withdraw.important2 && <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.withdraw.notice3}</Text>}
                      <Spacer size="small" />
                      <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.withdraw.notice4}</Text>
                    </View>
                    {
                      strings.withdraw.important2 &&
                      (
                        <View>
                          <Spacer size="medium" />
                          <Text fontSize="small" fontWeight='bold' textColor='dark-blue-grey'>{strings.withdraw.important2}</Text>
                          <Spacer size="medium" />
                          <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey' style={balanceStyle.importantMessageText}>{strings.withdraw.notice5}</Text>
                          <Spacer size="small" />
                          <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey' style={[{marginLeft: '10px'}]}>{strings.withdraw.notice6}</Text>
                          <Spacer size="small" />
                          <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey' style={[{marginLeft: '10px'}]} >{strings.withdraw.notice7}</Text>
                          <Spacer size="small" />
                          <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.withdraw.notice8}</Text>
                        </View>
                      )
                    }
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(RequestWithdrawPopup)
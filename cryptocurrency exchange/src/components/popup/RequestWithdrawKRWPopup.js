// @flow

import * as React from 'react'
import Decimal from 'decimal.js'
import { View, Text, Spacer, Image, Divider, Input, Button } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import {connect} from 'react-redux'
import balanceStyle from '../../styles/BalancePage.css'
import {API_URL} from '../../config'
import {popupService} from '../../redux/services'
import {store} from '../../redux'
import commaNumber from 'comma-number'

const strings = new LocalizedStrings({
  en: {
    banking: {
      symbol: "USD",
      confirm: "Confirm",
      cancel: "Cancel",
      remove: "Remove",
      close: "Close",
      willyouremove: "Do you want to remove?",
      password: "Password",
      checkpassworddesc: 'After verifying the password, adding bank account starts.',
      continue: 'Continue',
      registered: 'Registered.',
      done: 'Done',
      error: 'Error!',
      deposit: 'Deposit',
      deposittab: 'Deposit',
      withdrawl: 'Withdrawl',
      withdrawltab: 'Withdrawl',
      banking: 'Banking',
      ondeposit: 'On Deposit',
      depositinpregress: 'Deposit in Process',
      bankname: 'Bank Name',
      signername: 'Signer Name',
      accountnumber: 'Account Number',
      withdraw: 'Withdraw',
      addbankaccount: 'Add Bank Account',
      removebankaccount: 'Remove Bank Account',
      expirationdate: 'Expiration Date',
      depositbank: 'Deposit Bank',
      accountholder: 'Account Holder',
      depositcode: 'Deposit Code',
      expiresin: 'Expires In',
      depositamount: 'Deposit Amount',
      status: 'Status',
      pendingapproval: 'Pending Approval',
      processed: 'Processed',
      failed: 'Failed',
      deposittitle: 'Deposit KRW',
      withdrawtitle: 'Withdraw KRW',
      depositdesc: 'Please confirm the details of the bank to transfer funds from',
      depositdescwithdraw: 'Please confirm the details of the bank to transfer funds to',
      entertheamount: 'Enter the amount to transfer to Quanty',
      entertheamountwithdraw: 'Enter the amount to transfer from Quanty',
      requesttransfer: 'Request Transfer',
      requesttransferwithdraw: 'Request Transfer',
      noticetocustomers: '- Notice to Customers',
      noticetocustomerswithdraw: '- Notice to Customers',
      pleasetransfer: 'Please transfer the funds to following account.\nYou must enter the 6 letter code (ALL CAPS) in your banking app to initiate the transfer.',
      depositinfo1: '‧ Every deposit must go through authentication process.',
      depositinfo2: '‧ The authentication process usually takes upto 3 minutes, but when there are influx of bank transactions it may take longer than usual.',
      depositinfo3: '‧ Deposit function is suspended between 11:30 pm - 12:30 am during banking system maintenance.',
      depositinfo4: '‧ For first time KRW deposit, crypto currency withdrawl will be suspended for 72 hours.',
      depositinfo5: '‧ You can schedule up to 25 deposits simultaneously, but must wait for the deposit to clear before adding another scheduled deposit.',
      insertpassword: 'Enter your password',
      insert2facode: 'Enter 6 digits in your OTP app',
      otpcode: 'OTP Code',
      password: 'Password',
      withdrawComplete: 'Your withdrawal request has been submitted',
      withdrawconfirm: 'Do you want to cancel the request for withdrawal?',
      withdrawavailable: '{0} KRW Available',
      withdrawalfee: 'Withdrawal Fee: 1,000 KRW',
      totalwithdrawal: 'Total Amount: {0} KRW',
      withdrawCancelComplete: 'Withdrawal cancel complete.',
      balancenotenough: 'Your balance is not enough.',
      withdrawperlimit: 'You have exceeded your limit for withdrawals once.',
      withdrawinfo1: '‧ The withdrawal request will be processed during business hours. (9:00~21:00)',
      withdrawinfo2: '‧ Limit per withdrawal is 10,000,000 won.',
      withdrawinfo3: '‧ Daily withdrawal limit is determined by your authentication level.',
      withdrawinfo4: 'Level 2 and 3 members can withdraw up to 10,000,000 won',
      withdrawinfo5: 'Level 4 members can withdraw up to 50,000,000 won',
      withdrawinfo6: '‧ The withdrawal fee is 1,000 won per transaction regardless of the withdrawal amount.',
      withdrawinfo7: '  ‧ When we suspect fraudulent activity, withdrawals may be restricted.',
    }
  },
  ko: {
    banking: {
      symbol: "KRW",
      confirm: '확인',
      cancel: "취소",
      remove: "삭제",
      close: "닫기",
      willyouremove: "삭제 하시겠습니까?",
      password: "비밀번호",
      checkpassworddesc: '비밀번호 확인 후 계좌번호 등록을 시작합니다.',
      continue: '확인',
      registered: '등록되었습니다.',
      done: '확인',
      error: '오류',
      deposit: '입금',
      deposittab: '입금신청내역',
      withdrawl: '출금',
      withdrawltab: '출금신청내역',
      transactionhistory: '입출금 내역',
      banking: 'KRW 입출금',
      ondeposit: '거래가능금액',
      depositinpregress: '거래중금액',
      bankname: '은행',
      signername: '예금주',
      accountnumber: '계좌번호',
      withdraw: '출금',
      addbankaccount: '계좌 등록',
      removebankaccount: '계좌 삭제',
      expirationdate: '요청일시',
      depositbank: '입금은행',
      accountholder: '예금주',
      depositcode: '입금코드',
      expiresin: '유효시간',
      depositamount: '입금액',
      status: '상태',
      pendingapproval: '승인대기',
      processed: '완료',
      failed: '기한만료',
      deposittitle: 'KRW 입금',
      withdrawtitle: 'KRW 출금',
      depositdesc: '등록계좌 정보를 확인해 주세요.',
      depositdescwithdraw: '등록계좌 정보를 확인해 주세요.',
      entertheamount: '입금 예정 금액을 입력해 주세요.',
      entertheamountwithdraw: '출금 예정 금액을 입력해 주세요.',
      requesttransfer: '입금 예약',
      requesttransferwithdraw: '출금 예약',
      noticetocustomers: '- 입금 안내사항',
      noticetocustomerswithdraw: '- 출금 전 반드시 주의하세요',
      pleasetransfer: '아래 계좌로 입금을 완료해 주세요.\n입금은행표시내용란에 입금코드를 대문자로 기재하셔야 합니다.',
      depositinfo1: '‧ 입금예약 내용과 동일한 금액, 입출금계좌 및 입금코드로 입금해야 정상적으로 처리됩니다.',
      depositinfo2: '‧ 입금 신청은 운영시간(9:00~21:00) 동안 처리됩니다.',
      depositinfo3: '‧ 원화(KRW)를 처음 입금하는 경우, 암호화폐 출금이 72시간 동안 제한됩니다.',
      depositinfo4: '',
      depositinfo5: '',
      insertpassword: '비밀번호를 입력해 주세요.',
      insert2facode: 'OTP 앱의 인증번호를 입력해 주세요.',
      otpcode: '6자리 인증번호',
      password: '비밀번호',
      withdrawComplete: '출금신청을 완료했습니다.',
      withdrawconfirm: '출금신청을 취소하시겠습니까?',
      withdrawavailable: '출금가능 {0} 원',
      withdrawalfee: '출금수수료: 1,000 원',
      totalwithdrawal: '총 출금액: {0} 원',
      withdrawCancelComplete: '출금신청이 취소되었습니다.',
      balancenotenough: '잔액이 부족합니다.',
      withdrawperlimit: '1회 출금한도를 초과하여 출금하실 수 없습니다.',
      withdrawinfo1: '‧ 출금 신청은 운영시간(9:00~21:00) 동안 처리됩니다.',
      withdrawinfo2: '‧ 1회 출금금액 최대한도는 10,000,000원입니다.',
      withdrawinfo3: '‧ 1일 출금한도는 보안등급에 따라 차등 적용됩니다.',
      withdrawinfo4: '2,3단계 승인 완료 회원: 10,000,000원',
      withdrawinfo5: '4단계 승인 완료 회원: 50,000,000원',
      withdrawinfo6: '‧ 출금수수료는 출금액과 관계없이 1건당 1,000원입니다.',
      withdrawinfo7: '‧ 부정거래로 의심될 경우, 출금이 제한될 수 있습니다.',
    }
  }
})

type Props = {
  language: string,
  data: Object,
  onClose: () => void,
  onShowPopup: (type: string, message: string) => void
}

type State = {
  inputFocused: string,
  withdrawAmount: string,
  auth: string,
}

class RequestWithdrawKRWPopup extends React.Component<Props, State> {

  state = {
    inputFocused: '',
    withdrawAmount: '0',
    auth: '',
  }

  withdrawInput: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this.withdrawInput = React.createRef()
  }

  onInputFocused = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      inputFocused: event.currentTarget.name
    })
  }

  onInputBlur = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === 'withdraw') {
      let value = event.currentTarget.value !== '' ? parseInt(event.currentTarget.value, 10) : 0
      if (value < 0) value = 0
      event.currentTarget.value = value.toString()

      this.setState({
        withdrawAmount: value.toString(),
        inputFocused: ''
      })

    } else {
      this.setState({
        inputFocused: ''
      })
    }
  }

  onInputChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === 'auth') {
      this.setState({
        auth: event.currentTarget.value
      })
    } else if (event.currentTarget.name === 'withdraw') {
      this.setState({
        withdrawAmount: event.currentTarget.value
      })
    }
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => {
        this.onSubmitRequestWithdraw()
      }, 10)
    } else if (inputEvent.keyCode === 27) {
      this.onCancelRequestWithdraw()
    }
  }

  onCancelRequestWithdraw = () => {
    this.setState({
      withdrawAmount: '0',
      auth: '',
    })

    this.props.onClose()
  }

  onSubmitRequestWithdraw = () => {
    if ( !this.checkAvailable() ) return
    this.submitRequestWithdraw(this.state.withdrawAmount, this.state.auth)
  }

  submitRequestWithdraw = (amount: string, auth: string) => {
    const { quota, twoFAEnabled } = this.props.data

    if (new Decimal(amount).greaterThan(new Decimal(quota.availableKRW))) {
      this.props.onShowPopup('error', strings.banking.balancenotenough)
      return
    } else if (new Decimal(amount).greaterThan(new Decimal(quota.perLimitKRW))) {
      this.props.onShowPopup('error', strings.banking.withdrawperlimit)
      return
    }

    let body: Object = {
      'symbol': 'KRW',
      'amount': amount
    }
    if ( twoFAEnabled ) {
      body.otpNumStr = auth
    } else {
      body.password = auth
    }

    fetch(API_URL + '/myaccount/withdraw/KRW', {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if(response.ok) {
          this.props.onShowPopup('success', strings.banking.withdrawComplete)
          this.props.data.callback()

          store.dispatch(popupService.remove())

        } else {

          Promise.all([response.status, response.json()]).then(([status, json]) => {
            switch (status) {
              default:
                const errorReason = json.error.reasons
                this.props.onShowPopup('error', errorReason[0].message)
                break;
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  checkAvailable = () => {
    const {withdrawAmount, auth} = this.state
    if (isNaN(withdrawAmount) || withdrawAmount === '') return false

    const amount = new Decimal(withdrawAmount).greaterThan(0)
    const available = amount && auth

    return available
  }

  render() {
    strings.setLanguage(this.props.language)

    const minWidth = window.innerWidth < 350 ? window.innerWidth * 0.9 : 350
    const maxHeight = window.innerHeight < 800 ? window.innerHeight * 0.9 : 800

    const {inputFocused} = this.state
    const {bankAccount, quota, twoFAEnabled} = this.props.data

    let validateInfo = {}
    let authValidateInfo = {}
    let buttonColor

    if (inputFocused === 'withdraw') {
      validateInfo.border = 'thick'
      validateInfo.borderColor = 'down-blue'
    } else {
      validateInfo.border = 'normal'
      validateInfo.borderColor = 'gray'
    }

    if (inputFocused === 'auth') {
      authValidateInfo.border = 'thick'
      authValidateInfo.borderColor = 'down-blue'
    } else {
      authValidateInfo.border = 'normal'
      authValidateInfo.borderColor = 'gray'
    }

    buttonColor = this.checkAvailable() ? 'iris' : 'light-blue'

    return (
      <View style={styles.dontshrink}
            backgroundColor="white"
            maxWidth={830}
            maxHeight={maxHeight}
            width='100%'
            overflow="auto">
        <View padding="large"
              phonePaddingHorizontal="medium"
              style={styles.dontshrink}>
          <View flexHorizontal
                phoneFlexVertical
                tabletFlexVertical
                justifyContent="space-between">
            <View>
              <View flexHorizontal justifyContent="space-between" minWidth={minWidth}>
                <Text fontSize="large" fontWeight='light'>
                  {strings.banking.withdrawtitle}
                </Text>
                <Image source="/images/cancel_black.svg" width={20} height={20} cursor='pointer' onClick={this.onCancelRequestWithdraw}/>
              </View>
              <Spacer size="large" />
              <View style={balanceStyle.importantMessageWithdraw}>
                <View width='100%' alignSelf='start' minWidth={320} maxWidth={350}>
                  <Text fontSize="small-medium">
                    {strings.banking.depositdescwithdraw}
                  </Text>

                  <Spacer />
                  <View flexHorizontal
                        paddingVertical="medium"
                        justifyContent="space-between">
                    <Text textColor="gray">
                      {strings.banking.bankname}:
                    </Text>
                    <Text>{bankAccount.bankName}</Text>

                  </View>
                  <Divider color="divider" />
                  <View flexHorizontal
                        paddingVertical="medium"
                        justifyContent="space-between">
                    <Text textColor="gray">
                      {strings.banking.signername}:
                    </Text>
                    <Text>{bankAccount.accountHolder}</Text>
                  </View>
                  <Divider color="divider" />
                  <View flexHorizontal
                        paddingVertical="medium"
                        justifyContent="space-between">
                    <Text textColor="gray">
                      {strings.banking.accountnumber}:
                    </Text>
                    <Text>{bankAccount.accountNumber}</Text>
                  </View>
                  <Divider color="divider" />
                  <Spacer size="large"/>
                  <Text fontSize="small-medium">
                    {strings.banking.entertheamountwithdraw}
                  </Text>
                  <Spacer/>
                  <View flexHorizontal justifyContent="space-between">
                    <View flex="fill"
                          paddingVertical="tiny">
                      <Input type="number"
                             name="amount"
                             placeholder='0'
                             borderColor={validateInfo.borderColor}
                             border={validateInfo.border}
                             onFocus={this.onInputFocused}
                             onBlur={this.onInputBlur}
                             onKeyUp={this.onInputKeyUp}
                             onChange={this.onInputChanged}
                             name="withdraw"
                             innerRef={this.withdrawInput}
                      />
                    </View>
                    <Spacer size="medium"/>
                    <View>
                      <Spacer size="medium"/>
                      <Text textColor="gray">{strings.banking.symbol === "USD" ? "KRW" : "원"}</Text>
                    </View>
                  </View>
                  <Spacer size="tiny"/>
                  <Text fontSize="xsmall" textAlign="right" >
                    {strings.formatString(strings.banking.withdrawavailable, commaNumber(quota.availableKRW))}
                  </Text>
                  <Spacer size="tiny"/>
                  <Text fontSize="xsmall" textAlign="right">
                    {strings.banking.withdrawalfee}
                  </Text>
                  <Spacer size="tiny"/>
                  <Text fontSize="xsmall" textAlign="right">
                    {strings.formatString(strings.banking.totalwithdrawal, isNaN(parseInt(this.state.withdrawAmount, 10)) ? commaNumber(1000) : commaNumber(1000 + parseInt(this.state.withdrawAmount, 10)))}
                  </Text>
                  <Spacer/>
                  <View flex="fill"
                        paddingVertical="tiny">
                    <Text fontSize="small-medium">
                      {twoFAEnabled ? strings.banking.insert2facode : strings.banking.insertpassword}
                    </Text>
                    <Spacer/>
                    <Input type={twoFAEnabled ? 'text' : 'password'}
                           name="auth"
                           placeholder={twoFAEnabled ? strings.banking.otpcode : strings.banking.password}
                           borderColor={authValidateInfo.borderColor}
                           border={authValidateInfo.border}
                           onFocus={this.onInputFocused}
                           onBlur={this.onInputBlur}
                           onKeyUp={this.onInputKeyUp}
                           onChange={this.onInputChanged}
                           name="auth"
                    />
                  </View>

                  <Spacer />
                  <Button title={strings.banking.requesttransferwithdraw}
                          height={44}
                          width='100%'
                          color={buttonColor}
                          borderColor={buttonColor}
                          titleColor="white"
                          onPress={this.onSubmitRequestWithdraw}/>
                  <Spacer />

                </View>
                <Spacer size="large" phoneHidden/>
                <View style={balanceStyle.importantMessageBox}>
                  <Text fontSize="small" fontWeight="bold" textColor='dark-blue-grey'>{strings.banking.noticetocustomerswithdraw}</Text>
                  <Spacer size="small" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.withdrawinfo1}</Text>
                  <Spacer size="small" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.withdrawinfo2}</Text>
                  <Spacer size="small" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.withdrawinfo3}</Text>
                  <Spacer size="xsmall" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="small">{strings.banking.withdrawinfo4}</Text>
                  <Spacer size="xsmall" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="small">{strings.banking.withdrawinfo5}</Text>
                  <Spacer size="small" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.withdrawinfo6}</Text>
                  <Spacer size="small" />
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.withdrawinfo7}</Text>
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

export default connect(mapStateToProps)(RequestWithdrawKRWPopup)

// @flow

import * as React from 'react'
import { View, Text, Spacer, Image, Divider, Input, Button } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import {connect} from 'react-redux'
import balanceStyle from '../../styles/BalancePage.css'
import {treatNewline} from '../../data/StringUtil'
import {API_URL} from '../../config'
import type {DepositRequest} from '../../types/Balance'

const strings = new LocalizedStrings({
  en: {
    banking: {
      symbol: "USD",
      confirm: "Confirm",
      cancel: "Cancel",
      remove: "Remove",
      close: "Close",
      continue: 'Continue',
      done: 'Done',
      error: 'Error!',
      deposit: 'Deposit',
      deposittab: 'Deposit',
      banking: 'Banking',
      ondeposit: 'On Deposit',
      depositinpregress: 'Deposit in Process',
      bankname: 'Bank Name',
      signername: 'Signer Name',
      accountnumber: 'Account Number',
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
      depositdesc: 'Please confirm the details of the bank to transfer funds from',
      entertheamount: 'Enter the amount to transfer to Quanty',
      requesttransfer: 'Request Transfer',
      noticetocustomers: '- Notice to Customers',
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
    }
  },
  ko: {
    banking: {
      symbol: "KRW",
      confirm: '확인',
      cancel: "취소",
      remove: "삭제",
      close: "닫기",
      continue: '확인',
      done: '확인',
      error: '오류',
      deposit: '입금',
      deposittab: '입금신청내역',
      transactionhistory: '입출금 내역',
      banking: 'KRW 입출금',
      ondeposit: '거래가능금액',
      depositinpregress: '거래중금액',
      bankname: '은행',
      signername: '예금주',
      accountnumber: '계좌번호',
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
      depositdesc: '등록계좌 정보를 확인해 주세요.',
      entertheamount: '입금 예정 금액을 입력해 주세요.',
      requesttransfer: '입금 예약',
      noticetocustomers: '- 입금 안내사항',
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
  password: string,
  inputFocused: string,
  depositAmount: number,

  otpRemainTime: number,
  otpRemainTimeString: string,
  depositRequestData: DepositRequest | null,
}

class RequestDepositKRWPopup extends React.Component<Props, State> {

  state = {
    password: '',
    inputFocused: '',
    depositAmount: 0,

    otpRemainTime: 0,
    otpRemainTimeString: '',
    depositRequestData: null
  }

  otpTimer: IntervalID
  depositInput: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this.depositInput = React.createRef()
  }

  componentWillUnmount() {
    this.stopOTPTimer()
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (prevState.otpRemainTime !== this.state.otpRemainTime) {
      const {otpRemainTime} = this.state
      const hour = Math.floor(otpRemainTime / 3600)
      const minute = Math.floor((otpRemainTime - hour * 3600) / 60)
      const sec = otpRemainTime % 60
      this.setState({
        otpRemainTimeString: this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(sec)
      })
    }
  }

  addZero = (i: number | string) => {
    if (parseInt(i, 10) < 10) {
      i = '0' + i
    }
    return i
  }

  startOTPTimer = () => {
    this.stopOTPTimer()
    this.setState({
      otpRemainTime: 259200
    })

    this.otpTimer = setInterval(this.setOTPTimer, 1000)
  }

  stopOTPTimer = () => {
    if (this.otpTimer !== null) clearInterval(this.otpTimer)
  }

  setOTPTimer = () => {
    const {otpRemainTime} = this.state

    if (otpRemainTime > 0) {
      this.setState({
        otpRemainTime: otpRemainTime - 1
      })
    } else {
      this.stopOTPTimer()
    }
  }

  onSubmitRequestDeposit = () => {
    if (this.state.depositAmount <= 0) return
    this.submitRequestDeposit(this.state.depositAmount)
  }

  submitRequestDeposit = (amount: number) => {
    fetch(API_URL + '/bank/deposit/register', {
      method: 'post',
      body: JSON.stringify({ 'symbol': 'KRW', 'amount': amount }),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                depositRequestData: json,
              })

              this.props.data.callback()

              this.startOTPTimer()
              break;

            default:
              const errorReason = json.error.reasons
              this.props.onShowPopup('error', errorReason[0].message)
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })

  }

  onCancelRequestDeposit = () => {
    this.setState({
      depositAmount: 0
    })

    this.props.onClose()
  }

  onInputFocused = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      inputFocused: event.currentTarget.name
    })
  }

  onInputBlur = (event: SyntheticInputEvent<HTMLInputElement>) => {
    let value = event.currentTarget.value !== '' ? parseInt(event.currentTarget.value, 10) : 0
    if (value < 0) value = 0
    event.currentTarget.value = value

    this.setState({
      depositAmount: value,
      inputFocused: ''
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => {
        this.onSubmitRequestDeposit()
      }, 10)

    } else if (inputEvent.keyCode === 27) {
      this.onCancelRequestDeposit()
    }
  }

  onInputChanged = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      depositAmount: event.currentTarget.value
    })
  }

  render() {
    const { inputFocused, depositAmount, otpRemainTimeString, depositRequestData } = this.state

    const minWidth = window.innerWidth < 350 ? window.innerWidth * 0.9 : 350
    const maxHeight = window.innerHeight < 800 ? window.innerHeight * 0.9 : 800

    strings.setLanguage(this.props.language)

    const {bankAccount} = this.props.data

    let validateInfo = {}
    let buttonColor

    if (inputFocused === 'deposit') {
      validateInfo.border = 'thick'
      validateInfo.borderColor = 'down-blue'
    } else {
      validateInfo.border = 'normal'
      validateInfo.borderColor = 'gray'
    }

    buttonColor = depositAmount > 0 ? 'iris' : 'light-blue'

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
                  {strings.banking.deposittitle}
                </Text>
                <Image source="/images/cancel_black.svg" width={20} height={20} cursor='pointer'
                       onClick={this.onCancelRequestDeposit}/>
              </View>

              <View style={balanceStyle.importantMessageDeposit} alignItems='center'>
                <View width='100%' alignSelf='start' minWidth={320} maxWidth={350}>
                  <Spacer size="large"/>
                  {
                    depositRequestData === null &&
                    <Text fontSize="small-medium">
                      {strings.banking.depositdesc}
                    </Text>
                  }
                  {
                    depositRequestData !== null &&
                    <Text fontSize="small-medium">
                      {treatNewline(strings.banking.pleasetransfer)}
                    </Text>
                  }

                  <Spacer/>
                  <View flexHorizontal
                        paddingVertical="medium"
                        justifyContent="space-between">
                    <Text textColor="gray">
                      {strings.banking.bankname}:
                    </Text>
                    {
                      depositRequestData === null &&
                      <Text>{bankAccount.bankName}</Text>
                    }
                    {
                      depositRequestData !== null &&
                      <Text>{depositRequestData.bankName}</Text>
                    }

                  </View>
                  <Divider color="divider"/>
                  <View flexHorizontal
                        paddingVertical="medium"
                        justifyContent="space-between">
                    <Text textColor="gray">
                      {strings.banking.signername}:
                    </Text>
                    {
                      depositRequestData === null &&
                      <Text>{bankAccount.accountHolder}</Text>
                    }
                    {
                      depositRequestData !== null &&
                      <Text>{depositRequestData.accountHolder}</Text>
                    }
                  </View>
                  <Divider color="divider"/>
                  <View flexHorizontal
                        paddingVertical="medium"
                        justifyContent="space-between">
                    <Text textColor="gray">
                      {strings.banking.accountnumber}:
                    </Text>
                    {
                      depositRequestData === null &&
                      <Text>{bankAccount.accountNumber}</Text>
                    }
                    {
                      depositRequestData !== null &&
                      <Text>{depositRequestData.accountNumber}</Text>
                    }
                  </View>
                  <Divider color="divider"/>
                  {
                    depositRequestData === null &&
                    <React.Fragment>
                      <Spacer size="large"/>
                      <Text fontSize="small-medium">
                        {strings.banking.entertheamount}
                      </Text>
                      <Spacer/>
                      <View flexHorizontal justifyContent="space-between">
                        <View flex="fill"
                              paddingVertical="tiny">
                          <Input type="number"
                                 placeholder='0'
                                 borderColor={validateInfo.borderColor}
                                 border={validateInfo.border}
                                 onFocus={this.onInputFocused}
                                 onBlur={this.onInputBlur}
                                 onKeyUp={this.onInputKeyUp}
                                 onChange={this.onInputChanged}
                                 name="deposit"
                                 innerRef={this.depositInput}
                          />
                        </View>
                        <Spacer size="medium"/>
                        <View>
                          <Spacer size="medium"/>
                          <Text textColor="gray">
                            {strings.banking.symbol === "USD" ? "KRW" : "원"}
                          </Text>
                        </View>
                      </View>
                      <Spacer/>
                      <Button title={strings.banking.requesttransfer}
                              color={buttonColor}
                              borderColor={buttonColor}
                              titleColor="white"
                              width='100%'
                              height={44}
                              onPress={this.onSubmitRequestDeposit}/>
                      <Spacer/>
                    </React.Fragment>
                  }
                  {
                    depositRequestData !== null &&
                    <React.Fragment>
                      <View flexHorizontal
                            paddingVertical="medium"
                            justifyContent="space-between">
                        <View flexHorizontal>
                          <Text textColor="gray">
                            {strings.banking.depositcode}:
                          </Text>
                          <Spacer size="tiny"/>
                          <Text textColor="up-red">{strings.banking.expiresin}:</Text>
                          <Spacer size="tiny"/>
                          <Text textColor="up-red">{otpRemainTimeString}</Text>
                        </View>
                        <View>
                          <Text textColor="grass"
                                fontSize="small-medium"
                                fontWeight="bold">
                            {depositRequestData.otpCode}
                          </Text>
                        </View>
                      </View>
                      <Spacer/>
                    </React.Fragment>
                  }

                </View>
                <Spacer size="large" phoneHidden/>
                <View style={balanceStyle.importantMessageBox}>
                  <Text fontWeight="bold" fontSize="small"
                        textColor='dark-blue-grey'>{strings.banking.noticetocustomers}</Text>
                  <Spacer size="small"/>
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.depositinfo1}</Text>
                  <Spacer size="small"/>
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.depositinfo2}</Text>
                  <Spacer size="small"/>
                  <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.depositinfo3}</Text>
                  {
                    strings.banking.depositinfo4 !== '' &&
                    <React.Fragment>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.depositinfo4}</Text>
                    </React.Fragment>
                  }
                  {
                    strings.banking.depositinfo5 !== '' &&
                    <React.Fragment>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>{strings.banking.depositinfo5}</Text>
                    </React.Fragment>
                  }
                  {
                    strings.banking.depositinfo4 === '' &&
                    <React.Fragment>
                      <Spacer size="xsmall"/>
                      <Text paddingVertical="small" fontWeight="bold" fontSize="small" textColor='dark-blue-grey'>- 입금 전
                        반드시 주의하세요.</Text>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>‧ 반드시 입금예약과 동일한 계좌로부터 동일한 금액을 한번에 입금하여야
                        합니다.</Text>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>‧ 6자리 입금코드는 '입금통장표시, 받는분통장표시, 받는통장메모' 등으로 표기되는
                        입금은행표시내용란에 대문자로 정확하게 입력해 주셔야 합니다.</Text>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>‧ 입금예약은 72시간 동안 유효하며, 유효기간이 만료된 이후에는 새로 입금예약을
                        하셔야 합니다.</Text>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>‧ 다음의 경우엔 입금처리가 되지 않으므로 고객상담 채팅이나
                        support@quanty.com으로 문의해 주세요.</Text>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>ex) 1,000,000원 입금 예약을 하고 500,000원으로 두 번 나누어
                        입금</Text>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="medium"
                            phonePaddingHorizontal="xsmall">6자리 입금코드를 잘못 입력하거나 입력하지 않음</Text>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="medium"
                            phonePaddingHorizontal="xsmall">6자리 입금코드를 소문자로 입력</Text>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="medium"
                            phonePaddingHorizontal="xsmall">입금예약 후 입출금계좌를 바꾸거나 삭제하고 입금</Text>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="medium"
                            phonePaddingHorizontal="xsmall">입금예약과 입금액을 다르게 입금</Text>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey' paddingHorizontal="medium"
                            phonePaddingHorizontal="xsmall">입금예약과 다른 은행계좌에서 입금</Text>
                      <Spacer size="small"/>
                      <Text fontSize="xsmall" textColor='dark-blue-grey'>‧ 은행별로 입금코드를 입력하는 입금은행표시내용란의 명칭이 조금씩 다르니 주의깊게
                        확인 바랍니다. 각 은행별 입금은행표시내용란의 명칭은 도움말을 참조해 주세요.</Text>
                    </React.Fragment>
                  }
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

export default connect(mapStateToProps)(RequestDepositKRWPopup)

// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import { View, Text, Image, Spacer, Popup, Button, Input, SubMenu, Divider } from '../controls'
import Footer from '../controls/Footer'

import bankingStyles from '../../styles/BankingPage.css'
import styles from '../../styles/StyleGuide.css'
import viewStyles from '../controls/View.css'
import type {BankAccount, DepositRequest, Quota, Withdrawal, Balance} from '../../types/Balance'
import {API_URL} from '../../config'
import commaNumber from 'comma-number'
import Decimal from 'decimal.js'
import BankingDepositPage from './BankingDepositPage'
import BankingWithdrawlPage from './BankingWithdrawlPage'
import balanceStyle from '../../styles/BalancePage.css'
import {treatNewline} from '../../data/StringUtil'
import {connect} from 'react-redux'

const strings = new LocalizedStrings({
  en: {
    banking: {
      symbol: "USD",
      confirm: "Confirm",
      cancel: "Cancel",
      remove: "Remove",
      close: "Close",
      willyouremove: "Do you want to remove?",
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
      noAddress: `The residential address registration is required\n for the Withdrawal in order to prevent money laundering and illicit fund transfers.`,
      addAddress: 'Add Address',
      cancelAddress: 'Cancel',
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
      noAddress: `불법자금 유입 및 자금세탁 방지를 위해,\n주소(거주지)를 등록하셔야 출금이 가능합니다.`,
      addAddress: '주소등록',
      cancelAddress: '취소',
    }
  }
})

type Props = {
  twoFAEnabled: boolean,
  quota: Quota,
  bankAccount: BankAccount,
  balance: Balance,
  onAddBankAccountClick: () => void,
  onRemoveBankAccountClick: () => void,
  onCancelClick: () => void,
  onContinueClick: (string) => void,

  showPopup: boolean,
  showAlertPopup: boolean,
  showAddressPopup: boolean,
  popupType: string,
  popupMessage: string,
  errorPopupMessage: string,
  onPopupSubmitClick: () => void,
  onPopupCancelClick: () => void,
  onSubMenuClick: (string) => void,
  onCheckPassword: boolean,
  checkPassword: boolean,
  subMenu: string,

  onErrorPopupCancelClick: () => void,
  depositRequests: DepositRequest[],
  pageDepositRequest: number,
  pagesDepositRequest: number,
  onDepositRequestPageClick: (number) => void,
  onDepositClick: () => void,
  onWithdrawClick: () => void,
  onWithdraw: () => {},
  onLinktoMyaccount: () => {},
  onCancelRequestDeposit: () => void,
  onSubmitRequestDeposit: (number) => void,
  depositRequestData: DepositRequest | null,
  otpRemainTimeString: string,
  onCancelRequestWithdraw: () => void,
  onSubmitRequestWithdraw: (amount: number, auth: string) => void,

  withdrawRequests: Withdrawal[],
  pageWithdrawRequest: number,
  pagesWithdrawRequest: number,
  onWithdrawRequestPageClick: (number) => void,
  onWithdrawCancelClick: (withdrawid: string, index: number) => void,
  onWithdrawConfirmClick: () => void,

  language: string,

}

type State = {
  password: string,
  inputFocused: string,
  auth: string,
  cancelId: string,
  cancelIndex: number
}

class BankingPage extends React.Component<Props, State> {

  state = {
    password: '',
    inputFocused: '',
    auth: '',
    cancelId: '',
    cancelIndex: -1
  }

  passwordInput: { current: null | HTMLDivElement }
  depositInput: { current: null | HTMLDivElement }
  withdrawInput: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this.passwordInput = React.createRef()
    this.depositInput = React.createRef()
    this.withdrawInput = React.createRef()
  }

  componentDidUpdate(prevProps:Props, prevState:State) {
    if (prevProps.checkPassword === false && this.props.checkPassword === true) {

      var popupForm = document.createElement("form")
      popupForm.target = "addbankaccount"
      popupForm.method = "POST"
      popupForm.action = API_URL + "/bankverification/encode"

      var popupInput = document.createElement("input")
      popupInput.type = "text"
      popupInput.name = "password"
      popupInput.value = this.state.password
      popupForm.appendChild(popupInput)
      if (document.body !== null) document.body.appendChild(popupForm)

      popupForm.submit()
      if (document.body !== null) document.body.removeChild(popupForm)

    } else if (prevProps.popupType !== this.props.popupType && this.props.popupType === 'getpassword') {
      this.passwordInput.current.focus()
    }
  }

  onInputFocused = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      inputFocused: event.currentTarget.name
    })
  }

  onInputBlur = () => {
    this.setState({
      inputFocused: ''
    })
  }

  onInputChanged = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      password: event.currentTarget.value
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement>) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent

    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      if (this.props.showPopup && this.props.popupType === 'getpassword') {
        setTimeout(() => {
          this.onContinueClick()
        }, 10)
      }

    } else if (inputEvent.keyCode === 27) {
      if (this.props.showPopup && this.props.popupType === 'getpassword') {
        this.onCancelClick()
      }
    }
  }

  onContinueClick = () => {
    if (this.state.password === '') return
    this.props.onContinueClick(this.state.password)
  }

  onCancelClick = () => {
    this.setState({
      password: ''
    })

    this.props.onCancelClick()
  }

  render() {
    const {password, inputFocused} = this.state
    const {bankAccount, showPopup, popupType, popupMessage, onCheckPassword, checkPassword,
      subMenu, errorPopupMessage, showAlertPopup, depositRequests, pageDepositRequest, pagesDepositRequest, balance,
      onAddBankAccountClick, onRemoveBankAccountClick, onPopupSubmitClick, onPopupCancelClick,
      onSubMenuClick, onErrorPopupCancelClick, onDepositRequestPageClick, onDepositClick, onWithdrawClick,
      withdrawRequests, pageWithdrawRequest, pagesWithdrawRequest, onWithdrawRequestPageClick,
      onWithdrawConfirmClick, onWithdrawCancelClick, language, showAddressPopup, onWithdraw, onLinktoMyaccount,
    } = this.props

    let validateInfo = {}
    let buttonColor
    if (showPopup && popupType === 'getpassword') {
      if (inputFocused === 'password') {
        validateInfo.border = 'thick'
        validateInfo.borderColor = 'down-blue'
        validateInfo.icon = 'secured-focused'
      } else {
        validateInfo.border = 'normal'
        validateInfo.borderColor = 'gray'
        validateInfo.icon = 'secured'
      }
      buttonColor = password !== '' ? 'iris' : 'light-blue'
    }

    const maxWidth = window.innerWidth < 450 ? window.innerWidth * 0.9 : 450
    const maxHeight = window.innerHeight < 800 ? window.innerHeight * 0.9 : 800

    const amount = new Decimal( balance.amount )
    const frozen = new Decimal( balance.frozen )
    const available = amount.minus(frozen)

    strings.setLanguage(this.props.language)

    return (
      <View flex='fill' overflow='auto' padding="small" alignItems='center'>
        <Spacer size="small"/>
        <View style={styles.dontshrink}
              flexHorizontal
              width='100%'
              maxWidth={976}>

          <View style={bankingStyles.toparea}>
            <Text style={bankingStyles.title} fontWeight='light'>{strings.banking.banking}</Text>
            <Spacer size="medium" phoneHidden/>

            <View style={bankingStyles.topinfo}>
              <View flex="fill" phonePaddingVertical="medium">
                <Spacer size="medium" phoneHidden/>
                <View flexHorizontal>
                  <View>
                    <Text style={bankingStyles.topinfoAvaiableTitle}>{strings.banking.ondeposit}</Text>
                    <Spacer size="xsmall"/>
                    {
                      strings.banking.symbol === "KRW" &&
                      <Text style={bankingStyles.topinfoAvaiableValue}>
                        {commaNumber(parseInt(available, 10).toString())}원
                      </Text>
                    }
                    {
                      strings.banking.symbol === "USD" &&
                      <Text style={bankingStyles.topinfoAvaiableValue}>
                        {commaNumber(parseInt(available, 10).toString())} KRW
                      </Text>
                    }

                  </View>
                  <Spacer size="medium-large" phoneHidden/>
                  <Spacer size="small" phoneOnlyShown/>
                  <View>
                    <Text style={bankingStyles.topinfoFrozenTitle}>{strings.banking.depositinpregress}</Text>
                    <Spacer size="xsmall"/>
                    {
                      strings.banking.symbol === "KRW" &&
                      <Text style={bankingStyles.topinfoFrozenValue}>
                        {commaNumber(parseInt(frozen, 10).toString())}원
                      </Text>
                    }
                    {
                      strings.banking.symbol === "USD" &&
                      <Text style={bankingStyles.topinfoFrozenValue}>
                        {commaNumber(parseInt(frozen, 10).toString())} KRW
                      </Text>
                    }
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={bankingStyles.topbuttons}>
            <View flex="fill" paddingVertical="large" phonePaddingVertical="none">
              <Spacer size="tiny" />
              <View flexHorizontal justifyContent="flex-end">
                <View flexHorizontal style={viewStyles.button} onClick={onDepositClick}>
                  <Image source="/images/arrow-down.svg" style={{marginTop:'2px'}} width={16} height={16} />
                  <Spacer size="tiny"/>
                  <View>
                    <Spacer size="tiny" />
                    <Text textColor="iris" cursor="pointer">{strings.banking.deposit}</Text>
                  </View>
                </View>
                <Spacer size="medium" phoneHidden/>
                <Spacer size="xsmall" phoneOnlyShown/>
                <View width={1} height={20} backgroundColor="gray" />
                <Spacer size="small" phoneHidden/>
                <Spacer size="tiny" phoneOnlyShown/>
                <View flexHorizontal style={viewStyles.button} onClick={onWithdrawClick}>
                  <Image source="/images/arrow-up.svg" style={{marginTop:'2px'}} width={16} height={16} />
                  <Spacer size="tiny"/>
                  <View>
                    <Spacer size="tiny" />
                    <Text textColor="iris" cursor="pointer">{strings.banking.withdraw}</Text>
                  </View>
                </View>
                <Spacer size="small" phoneHidden/>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.dontshrink}
              backgroundColor="white"
              width='100%'
              maxWidth={976}>

          <View padding="medium" overflow='auto' flex="fill">
            <View flexHorizontal justifyContent="space-between" width='100%' style={styles.dontshrink}>
              <View flexHorizontal phoneFlexVertical tabletFlexVertical style={styles.dontshrink}>
                <View minWidth={70} phoneFlexHorizontal tabletFlexHorizontal paddingVertical='tiny'>
                  <Text fontSize="xsmall" textColor="gray">{strings.banking.bankname}:</Text>
                  <Spacer />
                  <Text>{bankAccount.bankName}</Text>
                </View>
                <Spacer size="huge" phoneHidden tabletHidden/>
                <View minWidth={70} phoneFlexHorizontal tabletFlexHorizontal paddingVertical='tiny'>
                  <Text fontSize="xsmall" textColor="gray">{strings.banking.signername}:</Text>
                  <Spacer />
                  <Text>{bankAccount.accountHolder}</Text>
                </View>
                <Spacer size="huge" phoneHidden tabletHidden/>
                <View minWidth={100} phoneFlexHorizontal tabletFlexHorizontal paddingVertical='tiny'>
                  <Text fontSize="xsmall" textColor="gray">{strings.banking.accountnumber}:</Text>
                  <Spacer />
                  <Text>{bankAccount.accountNumber}</Text>
                </View>
              </View>

              <View>
                <Spacer size="xsmall" phoneHidden/>
                {
                  bankAccount.accountNumber === '-' &&
                  <View flexHorizontal style={viewStyles.button} onClick={onAddBankAccountClick}>
                    <Image source="/images/circle-plus.svg" width={20} height={20} cursor="pointer" />
                    <Spacer size="tiny" />
                    <View>
                      <Spacer size="tiny" />
                      <Text textColor="iris" cursor="pointer">{strings.banking.addbankaccount}</Text>
                    </View>
                  </View>
                }
                {
                  bankAccount.accountNumber !== '-' &&
                  <View flexHorizontal style={viewStyles.button} onClick={onRemoveBankAccountClick}>
                    <Image source="/images/deletebankaccount.svg" width={20} height={20} cursor="pointer"/>
                    <Spacer size="tiny" phoneHidden/>
                    <View>
                      <Spacer size="tiny"/>
                      <Text textColor="up-red" cursor="pointer">{strings.banking.removebankaccount}</Text>
                    </View>
                  </View>
                }
              </View>
            </View>
          </View>
        </View>
        <Spacer size="medium-large" />
        <View style={styles.dontshrink}
              backgroundColor="white"
              width='100%'
              maxWidth={976}>
          <Spacer size="tiny" />
          <View paddingHorizontal="xlarge">
            <View flexHorizontal overflow="auto" >
              <SubMenu thisMenu="deposit" currentMenu={subMenu} title={strings.banking.deposittab} onClick={onSubMenuClick} />
              <Spacer size="xsmall" />
              <SubMenu thisMenu="withdraw" currentMenu={subMenu} title={strings.banking.withdrawltab} onClick={onSubMenuClick} />
            </View>
          </View>
          <View paddingHorizontal="medium">
            <Divider color="divider" />

            {
              subMenu === 'deposit' &&
              <BankingDepositPage depositRequests={depositRequests}
                                  pageDepositRequest={pageDepositRequest}
                                  pagesDepositRequest={pagesDepositRequest}
                                  onDepositRequestPageClick={onDepositRequestPageClick}
                                  language={language}/>
            }
            {
              subMenu === 'withdraw' &&
              <BankingWithdrawlPage withdrawRequests={withdrawRequests}
                                    pageWithdrawRequest={pageWithdrawRequest}
                                    pagesWithdrawRequest={pagesWithdrawRequest}
                                    onWithdrawRequestPageClick={onWithdrawRequestPageClick}
                                    onWithdrawCancelClick={onWithdrawCancelClick}
                                    language={language}/>
            }

          </View>
        </View>
        <Footer />

        {
          showPopup && popupType === 'checkremove' &&
          <Popup type="check"
                 title={strings.banking.confirm}
                 message={popupMessage}
                 buttonTitle={strings.banking.remove}
                 cancelTitle={strings.banking.cancel}
                 onButtonClick={onPopupSubmitClick}
                 onCancelClick={onPopupCancelClick}
          />
        }
        {
          showPopup && popupType === 'infobanksuccess' &&
          <Popup type='success'
                 message={strings.banking.registered}
                 image='images/success.png'
                 buttonTitle={strings.banking.done}
                 onButtonClick={onPopupCancelClick}/>

        }
        {
          showPopup && popupType === 'infobankerror' &&
          <Popup type='error'
                 title={strings.banking.error}
                 image='images/monotone.png'
                 message={popupMessage}
                 buttonTitle={strings.banking.continue}
                 onButtonClick={onPopupCancelClick}/>

        }

        {
          showPopup && popupType === 'getpassword' &&
          onCheckPassword && !checkPassword &&
          <Popup>
            <View padding="large" style={styles.dontshrink}>
              <Text>{strings.banking.checkpassworddesc}</Text>
              <Spacer size="large" />
              <Input placeholder={strings.banking.password}
                     type='password'
                     borderColor={validateInfo.borderColor}
                     border={validateInfo.border}
                     onFocus={this.onInputFocused}
                     onBlur={this.onInputBlur}
                     onChange={this.onInputChanged}
                     onKeyUp={this.onInputKeyUp}
                     name="password"
                     autoComplete="off"
                     icon={validateInfo.icon}
                     innerRef={this.passwordInput}/>
              <Spacer size="large" />

              <View flexHorizontal>
                <Button title={strings.banking.cancel}
                        flex="fill"
                        titleWeight="normal"
                        backgroundColor="white"
                        onPress={this.onCancelClick}/>
                <Spacer />
                <Button title={strings.banking.continue}
                        flex="fill"
                        color={buttonColor}
                        borderColor={buttonColor}
                        titleColor="white"
                        onPress={this.onContinueClick}/>
              </View>
            </View>
          </Popup>
        }
        { onCheckPassword && checkPassword &&
          <Popup>
            <View padding="none"
                  overflow='auto'
                  maxWidth={maxWidth}
                  maxHeight={maxHeight}>
              <View style={styles.dontshrink}>
                <View width='100%' height='100%'>
                  <iframe frameBorder="0"
                          name="addbankaccount"
                          width='450px'
                          height='550px'/>
                </View>

              </View>
            </View>
            <View padding="medium">
              <Button title={strings.banking.cancel}
                      flex="fill"
                      titleWeight="normal"
                      backgroundColor="white"
                      onPress={this.onCancelClick}/>
            </View>
          </Popup>
        }
        {
          showPopup && popupType === 'withdrawconfirm' &&
          <Popup type="check"
                 message={strings.banking.withdrawconfirm}
                 buttonTitle={strings.banking.confirm}
                 onButtonClick={onWithdrawConfirmClick}
                 cancelTitle={strings.banking.cancel}
                 onCancelClick={onPopupSubmitClick}
          />
        }
        {
          showPopup && popupType === 'withdrawcomplete' &&
          <Popup type="check"
                 title={strings.banking.confirm}
                 message={strings.banking.withdrawComplete}
                 buttonTitle={strings.banking.done}
                 onButtonClick={onPopupSubmitClick}
          />
        }
        {
          showPopup && popupType === 'withdrawcancelcomplete' &&
          <Popup type="check"
                 message={strings.banking.withdrawCancelComplete}
                 buttonTitle={strings.banking.done}
                 onButtonClick={onPopupSubmitClick}
          />
        }
        {
          showAlertPopup &&
          <Popup type='error'
                 title={strings.banking.error}
                 image='images/monotone.png'
                 message={errorPopupMessage}
                 buttonTitle={strings.banking.continue}
                 onButtonClick={onErrorPopupCancelClick}/>
        }
        {
          showAddressPopup &&
          <Popup type='check'
            message={strings.banking.noAddress}
            image='images/monotone.png'
            buttonTitle={strings.banking.addAddress}
            onButtonClick={onLinktoMyaccount}
            cancelTitle={strings.banking.cancelAddress}
            onCancelClick={onWithdraw}/>
        }

      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(BankingPage)

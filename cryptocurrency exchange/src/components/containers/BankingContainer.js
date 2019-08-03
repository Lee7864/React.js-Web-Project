// @flow
import * as React from 'react'
import BankingPage from '../pages/BankingPage'
import {API_URL} from '../../config'
import type {BankAccount, DepositRequest, Quota, Withdrawal, Balance} from '../../types/Balance'
import update from 'react-addons-update'
import LocalizedStrings from 'localized-strings'
import {connect} from 'react-redux'
import type {Profile} from '../../types/Profile'
import { store } from '../../redux'
import {popupService} from '../../redux/services'
import {withRouter} from 'react-router-dom'
import moment from "moment/moment";

const strings = new LocalizedStrings({
  en: {
    bankingcontainer: {
      registeraccountplease: 'Please register your bank account.',
      erroroccurred: 'An error occurred.',
      deleteconfirmmessage: 'Do you really want to delete the registered account?\nYou can only register your account {0} times a month. ({1} more times)',
      monthlimitmessage: 'You cannot register any more than {0} accounts this month.',
      popuplimitmessage: 'You cannot register any more than {0} account registration attempts this month.',
      balancenotenough: 'Your balance is not enough.',
      withdrawdaylimit: 'You have exceeded your daily limit.',
      withdrawperlimit: 'You have exceeded your limit for withdrawals once.',
    }
  },
  ko: {
    bankingcontainer: {
      registeraccountplease: 'KRW 입출금을 하려면 먼저 계좌 등록이 필요합니다.',
      erroroccurred: '오류가 발생했습니다.',
      deleteconfirmmessage: '등록한 계좌를 정말 삭제하시겠습니까?\n계좌 등록은 한 달에 {0}회까지만 가능합니다. ({1}회 남음)',
      monthlimitmessage: '이 달 계좌 등록 가능 횟수 {0}회를 초과해서 더이상 등록할 수 없습니다.',
      popuplimitmessage: '이 달 계좌 등록 시도 횟수 {0}회를 초과해서 더이상 등록할 수 없습니다.',
      balancenotenough: '잔액이 부족합니다.',
      withdrawdaylimit: '1일 출금한도를 초과하여 출금하실 수 없습니다.\n출금한도는 매일 오전 9:00에 초기화됩니다.',
      withdrawperlimit: '1회 출금한도를 초과하여 출금하실 수 없습니다.',
    }
  }
})

type Props = {
  match: Object,
  location: Object,
  history: Object,
  profile: Profile,
  language: string,
  method: string
}

type State = {
  bankAccount: BankAccount,
  quota: Quota,
  balance: Balance,

  showPopup: boolean,
  showAlertPopup: boolean,
  popupType: string,
  popupTitle: string,
  popupMessage: string,
  errorPopupMessage: string,

  onCheckPassword: boolean,
  checkPassword: boolean,
  subMenu: string,

  pageDepositRequest: number,
  pagesDepositRequest: number,
  depositRequests: DepositRequest[],

  depositRequestData: DepositRequest | null,

  otpRemainTime: number,
  otpRemainTimeString: string,

  search: string,
  id: string,
  openWithPopup: boolean,

  pageWithdrawRequest: number,
  pagesWithdrawRequest: number,
  withdrawRequests: Withdrawal[],

  withdrawId: string,
  withdrawIndex: number
}

type MessageEvent = {
  data: string
}

class BankingContainer extends React.Component<Props, State> {

  state = {
    bankAccount: {
      bankName: '-',
      accountHolder: '-',
      accountNumber: '-',
      monthLimit: 3,
      popupLimit: 10,
      used: 0,
      available: 0,
      popup: 0
    },

    quota: {
      available: '0',
      availableKRW: '0',
      dayLimit: '0',
      dayLimitKRW: '0',
      perLimitKRW: '0',
      used: '0',
      usedKRW: '0',
    },

    balance: {
      currencySymbol: '',
      amount: '0',
      frozen: '0',
      fee: '0',
    },

    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupTitle: '',
    popupMessage: '',
    errorPopupMessage: '',

    onCheckPassword: false,
    checkPassword: false,
    subMenu: '',

    pageDepositRequest: 0,
    pagesDepositRequest: 0,
    depositRequests: [],

    depositRequestData: null,

    otpRemainTime: 0,
    otpRemainTimeString: '',

    search: '',
    id: '',
    openWithPopup: false,

    pageWithdrawRequest: 0,
    pagesWithdrawRequest: 0,
    withdrawRequests: [],

    withdrawId: '',
    withdrawIndex: -1
  }

  otpTimer: IntervalID

  constructor(props) {
    super(props)

    if (this.props.location.search !== '') {
      const params = this.decodeURLParams(this.props.location.search)
      if (params.popup && params.popup.toString() === 'true') {
        this.state.openWithPopup = true
      }

      this.props.history.replace(/banking/+this.props.match.params.sub)
    }
    this.bankingPage = React.createRef()
  }

  componentDidMount() {
    if (this.props.profile === undefined) {
      this.props.history.push('/login#callback=/banking')
      return
    }

    this.getBankAccount(true)
    this.getQuota()
    this.getBalance()

    const sub = this.props.match.params.sub
    if (sub === 'deposit') {
      this.getDepositRequest()
    } else if (sub === 'withdraw') {
      this.getWithdrawRequest()
    }
  }

  static getDerivedStateFromProps(nextProps:Props, prevState:State) {
    if (nextProps.match.params.sub !== prevState.subMenu) {
      return {
        subMenu: nextProps.match.params.sub
      }
    }

    return null
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage)
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

  decodeURLParams = (search: string = '') => {
    const hashes = search.slice(search.indexOf("?") + 1).split("&");
    return hashes.reduce((params, hash) => {
      const split = hash.indexOf("=")

      if (split < 0) {
        return Object.assign(params, {
          [hash]: null
        })
      }

      const key = hash.slice(0, split)
      const val = hash.slice(split + 1)

      return Object.assign(params, { [key]: decodeURIComponent(val) })
    }, {})
  }

  checkOpenPopup = () => {
    if (this.state.openWithPopup) {
      if (this.state.subMenu === 'deposit') {
        this.handleDepositClick()
      } else if (this.state.subMenu === 'withdraw') {
        this.handleWithdrawClick()
      }
    }
  }

  getBankAccount = (fromComponentMount: boolean = false) => {
    fetch(API_URL + '/bank/account', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setBankAccount(json)
              if (fromComponentMount) this.checkOpenPopup()
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getQuota = () => {
    fetch(API_URL + '/myaccount/withdraw/quota/KRW', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                quota: json
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getBalance = () => {
    fetch(API_URL + '/myaccount/balances/KRW', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                balance: json
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  removeBankAccount = () => {
    fetch(API_URL + '/bank/account/delete', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.getBankAccount()
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getDepositRequest = (page: number = 1) => {
    fetch(API_URL + '/bank/deposit/list?pageNo=' + page + '&pageSize=10', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                pageDepositRequest: json.pageNo,
                pagesDepositRequest: json.pages,
                depositRequests: json.result
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getWithdrawRequest = (page: number = 1) => {
    const date: Date = new Date()
    fetch(`${API_URL}/myaccount/histories?fromTimestamp=0&toTimestamp=${date.getTime() + 100000000}&historyType=WITHDRAW&currencySymbol=KRW&pageNo=${page}&pageSize=10`, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                withdrawRequests: json.historyList !== null ? json.historyList : [],
                pageWithdrawRequest: json.pageNo,
                pagesWithdrawRequest: json.totalPageNo
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleAddBankAccountClick = () => {
    const {bankAccount} = this.state
    if (bankAccount.used === bankAccount.monthLimit) {
      this.setState({
        showAlertPopup: true,
        errorPopupMessage: strings.formatString(strings.bankingcontainer.monthlimitmessage, bankAccount.monthLimit)
      })
      return
    } else if (bankAccount.popup === bankAccount.popupLimit) {
      this.setState({
        showAlertPopup: true,
        errorPopupMessage: strings.formatString(strings.bankingcontainer.popuplimitmessage, bankAccount.popupLimit)
      })
      return
    }

    this.setState({
      onCheckPassword: true,
      showPopup: true,
      popupType: 'getpassword',

    })
  }

  handleRemoveBankAccountClick = () => {
    const {bankAccount} = this.state

    this.setState({
      showPopup: true,
      popupType: 'checkremove',
      popupMessage: strings.formatString(strings.bankingcontainer.deleteconfirmmessage, bankAccount.monthLimit, bankAccount.available),
    })
  }

  handlePopupSubmitClick = () => {
    const popupType = this.state.popupType
    if (popupType === 'withdrawconfirm') {
      this.resetWithdrawData()
    } else {
      this.handlePopupCancelClick()

      if (popupType === 'checkremove') {
        this.removeBankAccount()
      } else if (popupType === 'withdrawcomplete') {
        this.handleCancelRequestWithdraw()
        this.getWithdrawRequest()
      }
    }
  }

  handlePopupCancelClick = () => {

    if (this.state.popupType === 'infobankerror') {
      this.setState({
        showPopup: true,
        popupType: 'getpassword',
        onCheckPassword: true,
        checkPassword: false,
        popupTitle: '',
        popupMessage: '',
      })
    } else {
      this.setState({
        showPopup: false,
        popupType: '',
        popupTitle: '',
        popupMessage: '',
        withdrawId: '',
        withdrawIndex: -1
      })
    }
  }

  handleErrorPopupCancelClick = () => {
    this.setState({
      showAlertPopup: false,
      errorPopupMessage: '',
    })
  }

  handleCancelClick = () => {
    this.setState({
      onCheckPassword: false,
      checkPassword: false,
      showPopup: false,
      popupType: '',
    })
  }

  handleContinueClick = (password: string) => {
    if (password === '') return

    this.setState({
      onCheckPassword: true,
      checkPassword: true,
      showPopup: false,
      popupType: '',
    })

    window.addEventListener('message', this.handlePostMessage)
  }

  handlePostMessage = (event: MessageEvent) => {
    window.removeEventListener('message', this.handlePostMessage)

    if (typeof event.data === 'string' || event.data instanceof String) {
      if (event.data === 'success') {
        this.setState({
          onCheckPassword: false,
          checkPassword: false,
          showPopup: true,
          popupType: 'infobanksuccess',
        })
        this.getBankAccount()
      } else {
        this.setState({
          onCheckPassword: false,
          checkPassword: false,
          showPopup: true,
          popupType: 'infobankerror',
          popupMessage: event.data.toString()
        })
      }
    } else {
      this.setState({
        onCheckPassword: false,
        checkPassword: false,
        showPopup: true,
        popupType: 'infobankerror',
        popupMessage: 'unknownerror'
      })
    }
  }

  handleSubMenuClick = (menu: string) => {
    if ( menu === this.state.subMenu ) return
    if ( this.state.subMenu === 'deposit' ) {
      this.setState({
        depositRequests: [],
        pageDepositRequest: 0,
        pagesDepositRequest: 0,
      })
    } else if ( this.state.subMenu === 'withdraw' ) {
      this.setState({
        withdrawRequests: [],
        pageWithdrawRequest: 0,
        pagesWithdrawRequest: 0,
      })
    }

    this.props.history.push('/banking/'+menu)

    if (menu === 'deposit') {
      this.getDepositRequest()
    } else if (menu === 'withdraw') {
      this.getWithdrawRequest()
    }
  }

  handleDepositRequestPageClick = (page: number) => {
    if (page === this.state.pageDepositRequest) return
    this.getDepositRequest(page)
  }

  handleWithdrawRequestPageClick = (page: number) => {
    if (page === this.state.pageWithdrawRequest) return
    this.getWithdrawRequest(page)
  }

  handleDepositClick = () => {
    if (this.state.bankAccount.accountNumber === '-') {
      this.setState({
        showAlertPopup: true,
        errorPopupMessage: strings.bankingcontainer.registeraccountplease,
      })
    } else {
      store.dispatch(popupService.create(
        {
          popupType: 'requestdepositkrw',
          depositRequestData: null,
          bankAccount: this.state.bankAccount,
          callback: this.getDepositRequest
        }
      ))
    }
  }

  handleCancelRequestDeposit = () => {
    store.dispatch(popupService.remove())
    this.setState({
      depositRequestData: null,
      otpRemainTimeString: '',
    })

    this.stopOTPTimer()
  }

  handleSubmitRequestDeposit = (amount: number) => {
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
              //let dataChangeObject = {}
              //dataChangeObject.$unshift = [json]

              this.setState({
                depositRequestData: json,
                //depositRequests: update(this.state.depositRequests, dataChangeObject)
              })


              this.getDepositRequest()
              this.startOTPTimer()
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                showAlertPopup: true,
                errorPopupMessage: errorReason[0].message
              })
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })

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

  handleLinktoMyaccount = () => {
    this.setState({
      showAddressPopup: false,
    })

    this.props.history.push('/myaccount/info')

  }

  handleWithdraw = () => {
    this.setState({
      showAddressPopup: false,
    })

    if (moment().isBefore('2019-01-18')) {
      store.dispatch(popupService.create(
        {
          popupType: 'requestwithdrawkrw',
          bankAccount: this.state.bankAccount,
          quota: this.state.quota,
          twoFAEnabled: this.props.profile.twoFAEnabled,
          callback: this.handleCallbackWithdraw
        }
      ))
    }
  }

  handleWithdrawClick = () => {
    const level: number = Number(this.props.profile.level.substr(5, 1))

    if (this.state.bankAccount.accountNumber === '-') {
      this.setState({
        showAlertPopup: true,
        errorPopupMessage: strings.bankingcontainer.registeraccountplease,
      })
    } else if (level>1 && !this.props.profile.userAddress) {
      this.setState({
        showAddressPopup: true,
      })

    } else {
      store.dispatch(popupService.create(
        {
          popupType: 'requestwithdrawkrw',
          bankAccount: this.state.bankAccount,
          quota: this.state.quota,
          twoFAEnabled: this.props.profile.twoFAEnabled,
          callback: this.handleCallbackWithdraw
        }
      ))
    }
  }

  handleCallbackWithdraw = () => {
    // this.getWithdrawRequest()
    this.getQuota()
    this.getBalance()
  }

  handleCancelRequestWithdraw = () => {
    store.dispatch(popupService.remove())
  }

  handleSubmitRequestWithdraw = (amount: number, auth: string) => {
    if (amount > parseInt(this.state.quota.availableKRW, 10)) {
      this.setState({
        showAlertPopup: true,
        errorPopupMessage: strings.bankingcontainer.balancenotenough
      })
      return
    } else if (amount > parseInt(this.state.quota.perLimitKRW)) {
      this.setState({
        showAlertPopup: true,
        errorPopupMessage: strings.bankingcontainer.withdrawperlimit
      })
      return
    }

    let body = {
      'symbol': 'KRW',
      'amount': amount
    }
    if (this.props.profile.twoFAEnabled) {
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
          this.setState({
            showPopup: true,
            popupType: 'withdrawcomplete',
          })
          this.bankingPage.current.resetDepositWithdrawAmount()
          this.getBalance()
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            switch (status) {
              default:
                const errorReason = json.error.reasons
                this.setState({
                  showAlertPopup: true,
                  errorPopupMessage: errorReason[0].message
                })
                break;
            }
          })
        }

      })
      .catch(error => {
        console.log(error)
      })
  }

  handleWithdrawConfirmClick = () => {
    const {withdrawId, withdrawIndex} = this.state

    Promise.all([
      fetch(`${API_URL}/myaccount/withdraw/${withdrawId}`, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => {
      if (responses[0].ok) {
        const { withdrawRequests } = this.state

        let dataChangeObject = {}
        dataChangeObject[withdrawIndex] = {}
        dataChangeObject[withdrawIndex].status = {$set: 'KILL'}

        if (withdrawRequests !== null && withdrawRequests[withdrawIndex] !== null) {
          this.setState({
            withdrawRequests: update(this.state.withdrawRequests, dataChangeObject),
            withdrawId: '',
            withdrawIndex: -1,
            showPopup: true,
            popupType: 'withdrawcancelcomplete'
          })
          this.getBalance()
          this.getQuota()
        }

      } else {
        this.setState({
          showAlertPopup: true,
          errorPopupMessage: strings.bankingcontainer.erroroccurred,
          withdrawId: '',
          withdrawIndex: -1,
          showPopup: false,
          popupType: ''
        })
      }
    }).catch(error => {
      if (error === 'login required') {
        this.props.history.push('/login#callback=/banking/withdraw')
      } else {
        this.setState({
          withdrawRequests: [],
          withdrawId: '',
          withdrawIndex: -1,
          showPopup: false,
          popupType: ''
        })
      }
    })
  }

  handleWithdrawCancelClick = (withdrawId: string, index: number) => {
    this.setState({
      withdrawId: withdrawId,
      withdrawIndex: index,
      showPopup: true,
      popupType: 'withdrawconfirm'
    })
  }

  resetWithdrawData = () => {
    this.setState({
      withdrawId: '',
      withdrawIndex: -1,
      showPopup: false,
      popupType: ''
    })
  }

  setBankAccount = (data: Object | null) => {
    let dataChangeObject: Object = {}

    if (data !== null) {

      if (data.bankAccount !== null) {
        dataChangeObject.bankName = {$set: data.bankAccount.bankName}
        dataChangeObject.accountHolder = {$set: data.bankAccount.accountHolder}
        dataChangeObject.accountNumber = {$set: data.bankAccount.accountNumber}
      } else {
        dataChangeObject.bankName = {$set: '-'}
        dataChangeObject.accountHolder = {$set: '-'}
        dataChangeObject.accountNumber = {$set: '-'}
      }

      dataChangeObject.monthLimit = {$set: data.monthLimit}
      dataChangeObject.popupLimit = {$set: data.popupLimit}
      dataChangeObject.used = {$set: data.used}
      dataChangeObject.available = {$set: data.available}
      dataChangeObject.popup = {$set: data.popup}
    }

    this.setState({
      bankAccount: update(this.state.bankAccount, dataChangeObject)
    })
  }

  render() {
    const {profile} = this.props
    if (profile === undefined) return null

    const {bankAccount, quota, showPopup, balance, showAlertPopup, showAddressPopup, popupType, errorPopupMessage,
      popupMessage, onCheckPassword, checkPassword, subMenu, depositRequests,
      pageDepositRequest, pagesDepositRequest, depositRequestData,
      otpRemainTimeString, withdrawRequests,
      pageWithdrawRequest, pagesWithdrawRequest } = this.state

    strings.setLanguage(this.props.language)

    return (
      <BankingPage twoFAEnabled={profile.twoFAEnabled}
                   quota={quota}
                   bankAccount={bankAccount}
                   balance={balance}
                   showPopup={showPopup}
                   showAlertPopup={showAlertPopup}
                   showAddressPopup={showAddressPopup}
                   popupType={popupType}
                   popupMessage={popupMessage}
                   errorPopupMessage={errorPopupMessage}
                   onCheckPassword={onCheckPassword}
                   checkPassword={checkPassword}
                   subMenu={subMenu}

                   pageDepositRequest={pageDepositRequest}
                   pagesDepositRequest={pagesDepositRequest}
                   depositRequests={depositRequests}
                   depositRequestData={depositRequestData}
                   otpRemainTimeString={otpRemainTimeString}

                   onAddBankAccountClick={this.handleAddBankAccountClick}
                   onRemoveBankAccountClick={this.handleRemoveBankAccountClick}
                   onPopupSubmitClick={this.handlePopupSubmitClick}
                   onPopupCancelClick={this.handlePopupCancelClick}
                   onCancelClick={this.handleCancelClick}
                   onContinueClick={this.handleContinueClick}
                   onSubMenuClick={this.handleSubMenuClick}
                   onErrorPopupCancelClick={this.handleErrorPopupCancelClick}

                   onDepositRequestPageClick={this.handleDepositRequestPageClick}
                   onDepositClick={this.handleDepositClick}
                   onWithdrawClick={this.handleWithdrawClick}
                   onWithdraw={this.handleWithdraw}
                   onLinktoMyaccount={this.handleLinktoMyaccount}
                   onCancelRequestDeposit={this.handleCancelRequestDeposit}
                   onSubmitRequestDeposit={this.handleSubmitRequestDeposit}
                   onCancelRequestWithdraw={this.handleCancelRequestWithdraw}
                   onSubmitRequestWithdraw={this.handleSubmitRequestWithdraw}

                   withdrawRequests={withdrawRequests}
                   pageWithdrawRequest={pageWithdrawRequest}
                   pagesWithdrawRequest={pagesWithdrawRequest}
                   onWithdrawRequestPageClick={this.handleWithdrawRequestPageClick}
                   onWithdrawCancelClick={this.handleWithdrawCancelClick}
                   onWithdrawConfirmClick={this.handleWithdrawConfirmClick}

                   ref={this.bankingPage}
                   language={this.props.language}

      />
    )
  }
}


function mapStateToProps(state) {
  return {
    profile: state.login.profile,
    language: state.setLanguage.language,
  }
}

export default connect(mapStateToProps)(withRouter(BankingContainer))

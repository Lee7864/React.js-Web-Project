// @flow

import * as React from 'react'

import DeleteAccountPage from '../pages/DeleteAccountPage'
import { API_URL } from '../../config'
import type { Profile } from '../../types/Profile'
import {userService} from '../../redux/services'
import {store} from '../../redux'
import type {Balance} from '../../types/Balance'

type Props = {
  profile: Profile,
  closePopupAndShowResult: (result: boolean, type: string) => void,
  onRequestWithdrawPress: () => void,
  onFailDeleteAccount: () => void,
  language: string
}

type State = {
  myBalanceData: Balance[],
  validateReady: boolean,
  otpRequested: boolean,
  otpRemainTime: number,
  otpRemainTimeString: string,

  showPopup: boolean,
  showAlertPopup: boolean,
  popupType: string,
  popupMessage: string,
  otp: string,
}

class DeleteAccountContainer extends React.Component<Props, State> {

  state = {
    myBalanceData: [],
    validateReady:false,
    otpRequested:false,

    otpRemainTime:0,
    otpRemainTimeString:'',

    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupMessage: '',

    otp: ''
  }

  deletePage: { current: null | HTMLDivElement }
  otpTimer = null

  constructor(props: Props) {
    super(props)
    this.deletePage = React.createRef()
  }

  setFocus = () => {
    if (this.deletePage.current !== null) this.deletePage.current.setFocus()
  }

  componentDidMount() {
    this.callMyBalance()
  }

  componentWillUnmount() {
    this.stopOTPTimer()
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.otpRemainTime !== this.state.otpRemainTime) {
      const {otpRemainTime} = this.state
      const minute = Math.floor(otpRemainTime / 60)
      const sec = otpRemainTime % 60
      this.setState({
        otpRemainTimeString: this.addZero(minute) + ':' + this.addZero(sec)
      })
    }
  }

  addZero = (i: number | string) => {
    if (parseInt(i, 10) < 10) {
      i = '0' + i
    }
    return i
  }

  callMyBalance() {
    fetch(API_URL + '/myaccount/balances', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                myBalanceData: json,
                validateReady: json.length === 0
              })

              break;

            default:
              const errorReason = json.error.reasons
              //alert(errorReason[0].message)
              break;
          }

        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  startOTPTimer() {
    this.setState({
      otpRemainTime: 1800
    })

    this.otpTimer = setInterval(this.setOTPTimer, 1000)
  }

  stopOTPTimer() {
    if (this.otpTimer !== null) clearInterval(this.otpTimer)
  }

  setOTPTimer() {
    const {otpRemainTime} = this.state;

    if(otpRemainTime > 0) {
      this.setState({
        otpRemainTime: otpRemainTime - 1
      })
    } else {
      this.stopOTPTimer()
    }
  }

  handleRequestOTPPress = () => {
    if (!this.state.validateReady) return

    fetch(API_URL + '/deregister/validate', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            otpRequested: true
          })
          this.startOTPTimer()
          this.props.closePopupAndShowResult(true, 'deleteotpsent')

        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            const errorReason = json.error.reasons
            this.props.closePopupAndShowResult(false, errorReason[0].message)
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleSubmitDeletePress = (otpNumStr: string) => {
    this.setState({
      otp: otpNumStr
    })

    this.props.closePopupAndShowResult(true, 'checkdeleteaccount')
  }

  deleteAccount() {
    fetch(API_URL + '/deregister/accept?otpNum=' + this.state.otp, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.stopOTPTimer()
          store.dispatch(userService.get_profile())
          this.props.closePopupAndShowResult(true, 'donedeleteaccount')

        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            const errorReason = json.error.reasons
            this.props.closePopupAndShowResult(false, errorReason[0].message)

            if ( errorReason[0].key === 'otpChances' ) {
              this.props.onFailDeleteAccount()
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const {profile, onRequestWithdrawPress} = this.props
    const {myBalanceData, validateReady, otpRequested, otpRemainTimeString,
          showPopup, showAlertPopup, popupType, popupMessage} = this.state

    return (
      <DeleteAccountPage profile={profile}
                         myBalanceData={myBalanceData}
                         validateReady={validateReady}
                         otpRequested={otpRequested}
                         otpRemainTimeString={otpRemainTimeString}
                         showPopup={showPopup}
                         showAlertPopup={showAlertPopup}
                         popupType={popupType}
                         popupMessage={popupMessage}
                         onRequestWithdrawPress={onRequestWithdrawPress}
                         onRequestOTPPress={this.handleRequestOTPPress}
                         onSubmitDeletePress={this.handleSubmitDeletePress}
                         ref={this.deletePage}
                         language={this.props.language}
      />
    )
  }
}

export default DeleteAccountContainer
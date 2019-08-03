// @flow

import * as React from 'react'
import LoginHistoryPage from '../pages/LoginHistoryPage'
import type {CurrentDevice, Device, LoginHistory} from '../../types/Profile'
import { API_URL } from '../../config'

type Props = {
  language: string
}

type State = {
  devicePageNo: number | null,
  loginHistoryPageNo: number,
  nextPageNo: number | null,
  currentDevice: CurrentDevice | null,
  devices: Device[],
  loginHistories: LoginHistory[],
  onFetchCurrent: boolean,
  onFetchDevices: boolean,
  onFetchHistory: boolean,
  onFetchRegister: boolean,
  onFetchUnregister: boolean,
  showAlertPopup: boolean,
  popupMessage: string,
  loading: boolean
}

class LoginHistoryContainer extends React.Component<Props, State> {

  state = {
    devicePageNo: 0,
    loginHistoryPageNo: 1,
    nextPageNo: null,
    currentDevice: null,
    devices: [],
    loginHistories: [],
    onFetchCurrent: false,
    onFetchDevices: false,
    onFetchHistory: false,
    onFetchRegister: false,
    onFetchUnregister: false,
    showAlertPopup: false,
    popupMessage: '',
    loading: false
  }

  componentDidMount() {
    this.getCurrentDevice()
    this.getDevices()
    this.getLoginHistory(this.state.loginHistoryPageNo)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevState.devicePageNo !== this.state.devicePageNo && this.state.devicePageNo === 0) {
      this.getCurrentDevice()
      this.getDevices()
    }
  }

  getCurrentDevice = () => {
    if (this.state.onFetchCurrent) return
    this.setState({
      onFetchCurrent: true,
      loading: true,
    })

    fetch(API_URL + '/device/current', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                onFetchCurrent: false,
                loading: false,
                currentDevice: json
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                onFetchCurrent: false,
                loading: false,
                showAlertPopup: true,
                popupMessage: errorReason[0].message
              })
              break;
          }

        })
      })
      .catch(error => {
        this.setState({
          onFetchCurrent: false,
          loading: false,
        })
        console.log(error)
      })
  }

  getDevices = () => {
    if (this.state.devicePageNo === null) return
    if (this.state.onFetchDevices) return
    this.setState({
      onFetchDevices: true,
      loading: true,
    })
    fetch(API_URL + '/devices?activeOnly=true&pageNo=' + (this.state.devicePageNo !== null ? this.state.devicePageNo : 0), {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                onFetchDevices: false,
                loading: false,
                devicePageNo: json.nextPageNo,
                devices: this.state.devices.concat(json.result.concat())
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                onFetchDevices:false,
                loading: false,
                showAlertPopup: true,
                popupMessage: errorReason[0].message
              })
              break;
          }

        })
      })
      .catch(error => {
        this.setState({
          onFetchDevices: false,
          loading: false,
        })
        console.log(error)
      })
  }

  getLoginHistory = (pageNo: number) => {
    if (this.state.loginHistoryPageNo === null) return
    if (this.state.onFetchHistory) return
    this.setState({
      onFetchHistory: true,
      loading: true
    })

    fetch(API_URL + '/user/login/history?pageNo=' + pageNo, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.setState({
                onFetchHistory: false,
                loading: false,
                nextPageNo: json.nextPageNo,
                loginHistories: json.result
              })
              break;

            default:
              const errorReason = json.error.reasons
              this.setState({
                onFetchHistory: false,
                loading: false,
                showAlertPopup: true,
                popupMessage: errorReason[0].message
              })
              break;
          }

        })
      })
      .catch(error => {
        this.setState({
          onFetchHistory: false,
          loading: false
        })
        console.log(error)
      })
  }

  handleRegisterPress = () => {
    this.registerDevice()
  }

  registerDevice = () => {
    if (this.state.onFetchRegister) return
    this.setState({
      onFetchRegister: true,
      loading: true
    })
    fetch(API_URL + '/device/register', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            onFetchRegister: false,
            loading: false,
            devicePageNo: 0,
            devices:[],
          })
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {

            const errorReason = json.error.reasons
            this.setState({
              onFetchRegister: false,
              loading: false,
              showAlertPopup: true,
              popupMessage: errorReason[0].message
            })
          })
        }
      })
      .catch(error => {
        this.setState({
          onFetchRegister: false,
          loading: false,
        })
        console.log(error)
      })
  }

  handleDeleteClick = (id: string) => {
    this.unregisterDevice(id)
  }

  handlePopupClick = () => {
    this.setState({
      showAlertPopup: false,
      popupMessage: ''
    })
  }

  unregisterDevice = (deviceId: string) => {
    if (this.state.onFetchUnregister) return
    this.setState({
      onFetchUnregister: true
    })

    fetch(API_URL + '/device/deactivate?deviceId=' + deviceId, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            onFetchUnregister: false,
            devicePageNo: 0,
            devices:[]
          })

        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            const errorReason = json.error.reasons
            this.setState({
              onFetchUnregister:false,
              showAlertPopup: true,
              popupMessage: errorReason[0].message
            })
          })
        }
      })
      .catch(error => {
        this.setState({
          onFetchUnregister: false
        })
        console.log(error)
      })
  }

  handlePrevClick = () => {
    const { loginHistoryPageNo} = this.state
    if (loginHistoryPageNo === 1) return

    this.getLoginHistory(loginHistoryPageNo - 1)
    this.setState({
      loginHistoryPageNo: loginHistoryPageNo - 1
    })
  }

  handleNextClick = () => {
    const {nextPageNo, loginHistoryPageNo} = this.state
    if (nextPageNo === null) return

    this.getLoginHistory(loginHistoryPageNo + 1)
    this.setState({
      loginHistoryPageNo: loginHistoryPageNo + 1
    })
  }

  render() {
    const {currentDevice, devices, loginHistories, showAlertPopup, popupMessage, loginHistoryPageNo, nextPageNo, loading} = this.state

    return(
      <LoginHistoryPage currentDevice={currentDevice}
                        devices={devices}
                        loginHistories={loginHistories}
                        showAlertPopup={showAlertPopup}
                        popupMessage={popupMessage}
                        onRegisterPress={this.handleRegisterPress}
                        onDeleteClick={this.handleDeleteClick}
                        onPopupClick={this.handlePopupClick}
                        language={this.props.language}
                        onPrevClick={this.handlePrevClick}
                        onNextClick={this.handleNextClick}
                        loginHistoryPageNo={loginHistoryPageNo}
                        nextPageNo={nextPageNo}
                        loading={loading}

      />
    )
  }
}

export default LoginHistoryContainer
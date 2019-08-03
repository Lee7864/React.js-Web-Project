// @flow

import * as React from 'react'
import {stringify as qsStringify} from 'querystring'
import LoginPage from '../pages/LoginPage'
import ReCAPTCHA from 'react-google-recaptcha'
import LocalizedStrings from 'localized-strings'
import { store } from '../../redux'
import { userService } from '../../redux/services'
import { API_URL } from '../../config'
import {connect} from 'react-redux'
import {getCachedFingerprint, generateFingerprint} from '../../data/BrowserUtils'

const strings = new LocalizedStrings({
  en: {
    login: {
      entervalidemail: 'Please enter a valid email address.',
      authFailed: 'Please confirm email, password',
    }
  },
  ko: {
    login: {
      entervalidemail: '이메일 주소를 올바르게 입력해 주세요.',
      authFailed: '이메일 또는 비밀번호가 일치하지 않습니다.\n다시 확인하여 입력해 주세요.\n5회 이상 잘못 입력할 경우,\n고객센터를 통해 재인증해야 로그인할 수 있습니다.',
    }
  }
})

type Props = {
  language: string
}

type State = {
  email: string,
  password: string,
  fingerprint: string,
  recaptchaResponse: string,
  recaptcha: ReCAPTCHA,
  enableOTP: boolean,
  enableTOTP: boolean,
  otpCode: string,
  focusedInputName: string,
  otpRemainTime: number,
  otpRemainTimeString: string,
}

class LoginContainer extends React.Component<Props, State> {

  otpTimer = null

  constructor(props) {
    super(props)

    const fingerprint = getCachedFingerprint()
    this.state = {
      email: '',
      password: '',
      fingerprint: fingerprint,
      recaptchaResponse: '',
      recaptcha: null,
      enableOTP: false,
      enableTOTP: false,
      otpCode: '',
      focusedInputName: '',
      otpRemainTime: 18000,
      otpRemainTimeString: '30:00',
    }

    if (fingerprint === null) {
      generateFingerprint((result) => {
        this.setState({
          fingerprint: result
        })
      })
    }
  }

  componentWillUnmount() {
    this.stopOTPTimer()
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
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

  startOTPTimer = () => {
    this.stopOTPTimer()
    this.setState({
      otpRemainTime: 1800
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

  handleInputBlur = (event: Event) => {
    const eventValue = event.currentTarget.value
    const eventName = event.currentTarget.name

    if (eventName === 'email') {
      this.setState({
        focusedInputName: '',
        email: eventValue
      })
    } else if (eventName === 'password') {
      this.setState({
        focusedInputName: '',
        password: eventValue
      })
    } else if (eventName === 'otp') {
      this.setState({
        focusedInputName: '',
        otpCode: eventValue
      })
    }
  }

  handleInputFocused = (event: Event) => {
    this.setState({
      focusedInputName: event.currentTarget.name
    })
  }

  handleSignInClick = () => {
    this.login()
  }

  handleRecaptchaChange = (recaptchaToken: string) => {
    this.setState({
      recaptchaResponse: recaptchaToken
    })
  }

  login = () => {
    if (!this.readyLogin()) return

    const baseUrl = API_URL + '/authenticate?g-recaptcha-response='

    const { email, password, fingerprint, recaptchaResponse, otpCode } = this.state

    const body = this.state.enableOTP || this.state.enableTOTP ? {
      'email': email,
      'password': password,
      'fingerprint': fingerprint,
      'otpCode': otpCode
    } : {
      'email': email,
      'password': password,
      'fingerprint': fingerprint
    }

    fetch(baseUrl + recaptchaResponse, {
      method: 'post',
      body: qsStringify(body),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        this.loginSuccess( this.state.enableOTP )
      } else {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
          case 401:
            this.handleErrorLogin401(json.error.reasons[0])
            break
          case 403:
            this.handleErrorLogin403(json.error.reasons[0])
            break
          default:
            this.resetRecaptcha()
            this.refs.loginpage.closePopupAndShowResult(false, json.error.reasons[0].message)
            break
          }
        })
      }
    })
  }

  loginSuccess = (checkRegister: boolean) => {
    this.stopOTPTimer()

    if (checkRegister) {
      this.refs.loginpage.closePopupAndShowResult(true, 'registerdevice')
    } else {
      store.dispatch(userService.get_profile());
    }
  }

  handleErrorLogin401 = (errorReason: Object) => {
    this.refs.loginpage.closePopupAndShowResult(false, errorReason.message)
    this.resetRecaptcha()
  }

  handleErrorLogin403 = (errorReason: Object) => {
    // this.resetRecaptcha()

    switch(errorReason.exception) {
    case 'MissingTOTPKeyAuthenticatorException':
      this.refs.loginpage.closePopupAndShowResult(true, errorReason.message)
      this.setState({
        enableTOTP: true
      })
      break
    case 'UnknownOrInactiveDeviceException':
      this.startOTPTimer()
      this.refs.loginpage.closePopupAndShowResult(true, errorReason.message)
      this.setState({
        enableOTP: true
      })
      break

    case 'LoginFromScratchNeedException':
    default:
      this.refs.loginpage.closePopupAndShowResult(false, errorReason.message, errorReason.exception)
      break
    }
  }

  verifyEmail = (email: string) => {
    if (email === '') {
      return true
    }

    const regExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    if (email.match(regExp) != null) {
      return true
    }

    return false
  }

  readyLogin = () => {
    if (!this.state.enableOTP && !this.state.enableTOTP) {
      return this.state.email !== '' && this.state.password !== '' && this.verifyEmail(this.state.email) && this.state.recaptchaResponse !== ''
    }
    return this.state.email !== '' && this.state.password !== '' && this.verifyEmail(this.state.email) && this.state.recaptchaResponse !== '' && this.state.otpCode !== ''
  }

  refRecaptcha = (ref: ReCAPTCHA) => {
    this.setState({
      recaptcha: ref
    })
  }

  resetRecaptcha = () => {
    if (this.state.recaptcha !== null) {
      this.state.recaptcha.reset()

      this.setState({
        recaptchaResponse: ''
      })
    }
  }

  handleRegisterDevice = (willRegister: boolean) => {

    if (willRegister) {
      fetch(API_URL + '/device/register', {
        method: 'post',
        credentials: 'include'
      }).then(response => {
        if (response.ok) {
          this.loginSuccess( false )
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            switch(status) {
              default:
                this.refs.loginpage.closePopupAndShowResult(false, json.error.reasons[0].message)
                break
            }
          })
        }
      })
    } else {
      this.loginSuccess( false )
    }
  }

  handleBrowserSavedPassword = (password: string) => {
    this.setState({
      password: password
    })
  }

  handleResetLogin = () => {
    this.stopOTPTimer()

    this.setState({
      email: '',
      password: '',
      recaptchaResponse: '',
      enableOTP: false,
      enableTOTP: false,
      otpCode: '',
      focusedInputName: '',
      otpRemainTime: 18000,
      otpRemainTimeString: '30:00',
    })
  }

  render() {

    const {email, focusedInputName, enableOTP, enableTOTP, password, otpCode, otpRemainTimeString} = this.state

    const emailValidateInfo = {
      message: this.verifyEmail(email) ? ' ' : strings.login.entervalidemail,
      borderColor: focusedInputName === 'email' ? 'down-blue' : this.verifyEmail(email) ? 'gray' : 'up-red',
      border: focusedInputName === 'email' ? 'thick' : this.verifyEmail(email) ? 'normal' : 'thick',
      backgroundColor: focusedInputName === 'email' ? 'white' : this.verifyEmail(email) ? 'white' : 'error',
      messageColor: focusedInputName === 'email' ? 'normal' : this.verifyEmail(email) ? 'normal' : 'error',
      icon: focusedInputName === 'email' ? '' : this.verifyEmail(email) && email !== '' ? 'checked' : ''
    }

    const passwordValidateInfo = {
      borderColor: focusedInputName === 'password' ? 'down-blue' : 'gray',
      border: focusedInputName === 'password' ? 'thick' : 'normal',
      icon: focusedInputName === 'password' ? 'secured-focused' : password !== '' ? 'checked' : 'secured'
    }

    const otpValidateInfo = {
      borderColor: focusedInputName === 'otp' ? 'down-blue' : 'gray',
      border: focusedInputName === 'otp' ? 'thick' : 'normal',
      icon: focusedInputName === 'otp' ? 'secured-focused' : otpCode !== '' ? 'checked' : 'secured'
    }

    const buttonEnable = this.readyLogin()
    strings.setLanguage(this.props.language)
    return (
      <LoginPage
        onSignInPress={this.handleSignInClick}
        buttonEnable={buttonEnable}
        onRecaptchaChange={this.handleRecaptchaChange}
        onBrowserSavedPassword={this.handleBrowserSavedPassword}
        refRecaptcha={this.refRecaptcha}
        enableOTP={enableOTP}
        enableTOTP={enableTOTP}
        otpRemainTimeString={otpRemainTimeString}
        onInputBlur={this.handleInputBlur}
        onInputFocused={this.handleInputFocused}
        onRegisterDevice={this.handleRegisterDevice}
        emailValidateInfo={emailValidateInfo}
        passwordValidateInfo={passwordValidateInfo}
        otpValidateInfo={otpValidateInfo}
        onResetLogin={this.handleResetLogin}
        language={this.props.language}
        ref='loginpage'
      />
    )
  }
}



function mapStateToProps(state) {
  return {
    profile: state.login.profile,
    language: state.setLanguage.language
  }
}


export default connect(mapStateToProps)(LoginContainer)
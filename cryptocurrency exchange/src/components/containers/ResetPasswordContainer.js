// @flow

import * as React from 'react'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import LocalizedStrings from 'localized-strings'
import { API_URL } from '../../config'
import {connect} from 'react-redux'
import type {ValidateInfo} from '../../types/UI'
import type {Color} from '../controls'

const strings = new LocalizedStrings({
  en: {
    resetpassword: {
      entervalidemail: 'Please enter a valid email address.',
      checkotpcode: 'Please check OTP Code.',
    }
  },
  ko: {
    resetpassword: {
      entervalidemail: '이메일 주소를 올바르게 입력해 주세요.',
      checkotpcode: '인증번호를 확인해 주세요.',
    }
  }
})

type Props = {
  language: string,
  onCancelClick: () => void,
}

type State = {
  email: string,
  password: string,
  passwordConfirm: string,
  otpCode: string,
  phase: number,
  recaptchaResponse: string,
  hasPasswordLetters: boolean,
  hasPasswordNumbers: boolean,
  hasPasswordSpecialChars: boolean,
  isPasswordBetween8_100Chars: boolean,
  focusedInputName: string,
  otpRemainTime: number,
  otpRemainTimeString: string,
}

class ResetPasswordContainer extends React.Component<Props, State> {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    otpCode: '',
    phase: 1,
    recaptchaResponse: '',
    hasPasswordLetters: false,
    hasPasswordNumbers: false,
    hasPasswordSpecialChars: false,
    isPasswordBetween8_100Chars: false,
    focusedInputName: '',
    otpRemainTime: 18000,
    otpRemainTimeString: '30:00',
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

  handleInputFocused = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      focusedInputName: event.currentTarget.name
    })
  }

  handleInputBlur = (event: SyntheticEvent<HTMLInputElement>) => {
    const eventValue = event.currentTarget.value
    const eventName = event.currentTarget.name

    if (eventName === 'email') {
      this.setState({
        focusedInputName: '',
        email: eventValue
      })
    } else {
      this.setState({
        focusedInputName: ''
      })
    }
  }

  handleInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      if (this.state.phase === 1) {
        setTimeout(() => { this.handleEmailConfirmClick() }, 10);
      } else if (this.state.phase === 3) {
        setTimeout(() => { this.handleConfirmClick() }, 10);
      }
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelClick()
    }
  }

  handleEmailConfirmClick = () => {

    const baseUrl = API_URL + '/user/reset_validate?g-recaptcha-response='
    const { email, recaptchaResponse } = this.state

    if (this.verifyEmail()) {
      const body = {
        'loginName': email
      }

      fetch(baseUrl + recaptchaResponse, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      }).then(response => {
        if (response.ok) {
          this.startOTPTimer()
          this.setState({
            phase: 2,
            recaptchaResponse: ''
          })
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            this.refs.resetpasswordpage.closePopupAndShowResult(false, json.error.reasons[0].message)
          })
        }
      })
    }
  }

  checkEmail = (email: string) => {
    if (email === '') {
      return true
    }

    const regExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    if (email.match(regExp) != null) {
      return true
    }

    return false
  }

  checkOTP = (otp: string) => {
    if (otp === '') {
      return true
    }
    return /^[0-9]{6}$/.test(otp)
  }

  checkNickname = (nickName: string) => {
    if (nickName === '') {
      return true
    }
    const special_pattern = /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"₩]/gi
    if (nickName.search(/\s/) !== -1 || special_pattern.test(nickName) === true) return false
    if (nickName.length > 3 && nickName.length < 11) return true
    return false
  }

  checkPassword = (password: string) => {
    if (password === '') {
      return true
    }
    return true
  }

  checkPasswordConfirm = (passwordConfirm: string) => {
    if (passwordConfirm === '') {
      return true
    }
    return passwordConfirm === this.state.password
  }

  verifyEmail = () => {
    const { email, recaptchaResponse } = this.state

    if (recaptchaResponse === '') {
      return false
    }

    const regExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

    return email.match(regExp) != null
  }

  handleRecaptchaChange = (recaptchaToken: string) => {
    this.setState({
      recaptchaResponse: recaptchaToken
    })
  }

  handleEnterOTPCodeClick = () => {
    this.setState({
      phase: 3,
      recaptchaResponse: ''
    })
  }

  handleOTPCodeInputChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const otpCode = event.currentTarget.value

    this.setState({
      otpCode: otpCode
    })
  }

  handlePasswordInputChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const password = event.currentTarget.value

    let hasPasswordLetters = false
    let hasPasswordNumbers = false
    let hasPasswordSpecialChars = false
    let isPasswordBetween8_100Chars = false

    if (password.match(/([a-zA-Z])/)) {
      hasPasswordLetters = true
    }

    if (password.match(/([0-9])/)) {
      hasPasswordNumbers = true
    }

    if (password.match(/[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"₩]/)) {
      hasPasswordSpecialChars = true
    }

    if (password.length > 7 && password.length < 101) {
      isPasswordBetween8_100Chars = true
    }

    this.setState({
      password: password,
      hasPasswordLetters: hasPasswordLetters,
      hasPasswordNumbers: hasPasswordNumbers,
      hasPasswordSpecialChars: hasPasswordSpecialChars,
      isPasswordBetween8_100Chars: isPasswordBetween8_100Chars
    })
  }

  handlePasswordConfirmInputChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const passwordConfirm = event.currentTarget.value

    this.setState({
      passwordConfirm: passwordConfirm
    })
  }

  handleConfirmClick = () => {

    const baseUrl = API_URL + '/user/reset_password?g-recaptcha-response='
    const { email, otpCode, recaptchaResponse, password, passwordConfirm } = this.state

    if (this.verifyEmail() && this.verifyPassword()) {
      const body = {
        'loginName': email,
        'otpNumStr': otpCode,
        'password': password,
        'passwordConfirmation': passwordConfirm
      }

      fetch(baseUrl + recaptchaResponse, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      }).then(response => {
        if (response.ok) {
          this.setState({
            phase: 4,
            recaptchaResponse: ''
          })
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            this.refs.resetpasswordpage.closePopupAndShowResult(false, json.error.reasons[0].message)
          })
        }
      })
    }
  }

  verifyPassword = () => {
    const { otpCode, recaptchaResponse, password, passwordConfirm } = this.state
    return recaptchaResponse !== '' && otpCode !== '' && password !== '' && (password === passwordConfirm)
  }

  handleFinishPress = () => {
    this.props.history.push('/login')
  }

  render() {

    const {email, phase, focusedInputName, otpCode, password, passwordConfirm, otpRemainTimeString} = this.state

    const continueButtonColor: Color = this.verifyEmail() ? 'iris' : 'light-blue'
    const confirmButtonColor: Color = this.verifyPassword() ? 'iris' : 'light-blue'

    const passwordInputEmpty: boolean = this.state.password === ''
    const passwordLettersColor: Color = this.state.hasPasswordLetters ? 'down-blue' : 'red'
    const passwordNumbersColor: Color = this.state.hasPasswordNumbers ? 'down-blue' : 'red'
    const passwordSpecialCharsColor: Color = this.state.hasPasswordSpecialChars ? 'down-blue' : 'red'
    const passwordCharLengthColor: Color = this.state.isPasswordBetween8_100Chars ? 'down-blue' : 'red'

    const emailValidateInfo: ValidateInfo = {
      message: this.checkEmail(email) ? ' ' : strings.resetpassword.entervalidemail,
      borderColor: focusedInputName === 'email' ? 'down-blue' : this.checkEmail(email) ? 'gray' : 'up-red',
      border: focusedInputName === 'email' ? 'thick' : this.checkEmail(email) ? 'normal' : 'thick',
      backgroundColor: focusedInputName === 'email' ? 'white' : this.checkEmail(email) ? 'white' : 'error',
      messageColor: focusedInputName === 'email' ? 'normal' : this.checkEmail(email) ? 'normal' : 'error',
      icon: focusedInputName === 'email' ? '' : this.checkEmail(email) && email !== '' ? 'checked' : ''
    }

    const otpValidateInfo: ValidateInfo = {
      message: this.checkOTP(otpCode) ? ' ' : strings.resetpassword.checkotpcode,
      borderColor: focusedInputName === 'otp' ? 'down-blue' : this.checkOTP(otpCode) ? 'gray' : 'up-red',
      border: focusedInputName === 'otp' ? 'thick' : this.checkOTP(otpCode) ? 'normal' : 'thick',
      backgroundColor: focusedInputName === 'otp' ? 'white' : this.checkOTP(otpCode) ? 'white' : 'error',
      messageColor: focusedInputName === 'otp' ? 'normal' : this.checkOTP(otpCode) ? 'normal' : 'error',
      icon: focusedInputName === 'otp' ? 'secured-focused' : this.checkOTP(otpCode) && otpCode !== '' ? 'checked' : 'secured'
    }

    const passwordValidateInfo: ValidateInfo = {
      message: ' ',
      borderColor: focusedInputName === 'password' ? 'down-blue' : this.checkPassword(password) ? 'gray' : 'up-red',
      border: focusedInputName === 'password' ? 'thick' : this.checkPassword(password) ? 'normal' : 'thick',
      backgroundColor: focusedInputName === 'password' ? 'white' : this.checkPassword(password) ? 'white' : 'error',
      icon: focusedInputName === 'password' ? 'secured-focused' : this.checkPassword(password) && password !== '' ? 'checked' : 'secured'
    }

    const passwordConfirmValidateInfo: ValidateInfo = {
      message: ' ',
      borderColor: focusedInputName === 'confirmpassword' ? 'down-blue' : this.checkPasswordConfirm(passwordConfirm) ? 'gray' : 'up-red',
      border: focusedInputName === 'confirmpassword' ? 'thick' : this.checkPasswordConfirm(passwordConfirm) ? 'normal' : 'thick',
      backgroundColor: focusedInputName === 'confirmpassword' ? 'white' : this.checkPasswordConfirm(passwordConfirm) ? 'white' : 'error',
      icon: focusedInputName === 'confirmpassword' ? 'secured-focused' : this.checkPasswordConfirm(passwordConfirm) && passwordConfirm !== '' ? 'checked' : 'secured'
    }
    strings.setLanguage(this.props.language)

    return (
      <ResetPasswordPage
        phase={phase}
        otpRemainTimeString={otpRemainTimeString}

        continueButtonColor = {continueButtonColor}
        onEmailConfirmClick={this.handleEmailConfirmClick}
        onRecaptchaChange={this.handleRecaptchaChange}
        onEnterOTPCodeClick={this.handleEnterOTPCodeClick}
        onOTPCodeChange={this.handleOTPCodeInputChange}
        onPasswordChange={this.handlePasswordInputChange}
        onPasswordConfirmChange={this.handlePasswordConfirmInputChange}
        confirmButtonColor={confirmButtonColor}
        onConfirmClick={this.handleConfirmClick}
        passwordInputEmpty={passwordInputEmpty}
        passwordLettersColor={passwordLettersColor}
        passwordNumbersColor={passwordNumbersColor}
        passwordSpecialCharsColor={passwordSpecialCharsColor}
        passwordCharLengthColor={passwordCharLengthColor}

        onInputBlur={this.handleInputBlur}
        onInputFocused={this.handleInputFocused}
        onInputKeyUp={this.handleInputKeyUp}
        emailValidateInfo={emailValidateInfo}
        otpValidateInfo={otpValidateInfo}
        passwordValidateInfo={passwordValidateInfo}
        passwordConfirmValidateInfo={passwordConfirmValidateInfo}
        onFinishPress={this.handleFinishPress}

        ref="resetpasswordpage"
        language={this.props.language}
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


export default connect(mapStateToProps)(ResetPasswordContainer)
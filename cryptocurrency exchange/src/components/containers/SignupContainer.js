// @flow

import * as React from 'react'

import SignupPage from '../pages/SignupPage'
import LocalizedStrings from 'localized-strings'
import { API_URL } from '../../config'
import {connect} from 'react-redux'
import {getCachedFingerprint, generateFingerprint} from '../../data/BrowserUtils'

const strings = new LocalizedStrings({
  en: {
    signup: {
      entervalidemail: 'Please enter a valid email address.',
      enterotpcode: 'Please enter OTP code from your email.',
      enter4to10characters: 'Please enter 4 to 10 characters. No space or special characters allowed.',
    }
  },
  ko: {
    signup: {
      entervalidemail: '이메일 주소를 올바르게 입력해 주세요.',
      enterotpcode: '이메일로 받은 인증번호 6자리를 입력해 주세요.',
      enter4to10characters: '4~10자(한글, 영문, 숫자 혼용 가능), 특수문자 및 띄어쓰기 불가',
    }
  }
})

type Props = {
  history: Object,
  language: string
}

type State = {
  fingerprint: string,
  recaptchaResponse: string,
  loginName: string,
  signupProcess: string,
  focusedInputName: string,
  agreement: boolean,

  onRegister: boolean,
  otpRemainTime: number,
  otpRemainTimeString: string,
  otpFailCount: number,

  otpNumStr: string,
  nickName: string,
  password: string,
  passwordConfirmation: string,

  pwdchk_char: boolean,
  pwdchk_num: boolean,
  pwdchk_special: boolean,
  pwdchk_length: boolean,
  showPasswordValidate: boolean
}

class SignupContainer extends React.Component<Props, State> {

  otpTimer = null
  signup = null

  constructor(props) {
    super(props)

    const fingerprint = getCachedFingerprint()
    this.state = {
      fingerprint: fingerprint,
      recaptchaResponse: '',
      loginName: '',
      signupProcess: 'start',
      focusedInputName: '',
      agreement: false,

      onRegister: false,
      otpRemainTime: 18000,
      otpRemainTimeString: '30:00',
      otpFailCount: 3,

      otpNumStr: '',
      nickName: '',
      password: '',
      passwordConfirmation: '',

      pwdchk_char: false,
      pwdchk_num: false,
      pwdchk_special: false,
      pwdchk_length: false,
      showPasswordValidate: false
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
    } else if (prevState.otpFailCount === 1 && this.state.otpFailCount === 0) {
      this.handleCancelSignup()
    }
  }

  addZero = (i: number | string) => {
    if (parseInt(i, 10) < 10) {
      i = '0' + i
    }
    return i
  }

  handleRecaptchaChanged = (value: string) => {
    this.setState({
      recaptchaResponse: value
    })
  }

  handleContinueSignup = () => {
    if (!this.readyContinue()) return;
    const {loginName, recaptchaResponse, onRegister, signupProcess} = this.state

    if (signupProcess === 'start') {
      if (onRegister === true) return

      this.setState({ onRegister:true })

      fetch(API_URL + '/register/validate?g-recaptcha-response=' + recaptchaResponse, {
        method: 'post',
        body: JSON.stringify({ 'loginName': loginName }),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
        .then(response => {
          if (response.ok) {
            this.validateSuccess()
          } else {
            Promise.all([response.status, response.json()]).then(([status, json]) => {
              this.setState({
                onRegister:false,
                recaptchaResponse: ''
              })

              this.signup.closePopupAndShowResult(false, json.error.reasons[0].message)
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else if (signupProcess === 'otpsent') {
      this.setState({
        signupProcess: 'createaccount'
      })
    } else if (signupProcess === 'createaccount') {
      if ( onRegister ) return
      this.checkRegisterInfo()
    } else if (signupProcess === 'finish') {
      this.props.history.push('/login')
    }
  }

  validateSuccess = () => {
    this.startOTPTimer()

    this.setState({
      onRegister:false,
      signupProcess: 'otpsent',
      recaptchaResponse: '',
    })
  }

  checkRegisterInfo = () => {

    const { fingerprint, recaptchaResponse, loginName, nickName, otpNumStr, password, passwordConfirmation } = this.state
    if (recaptchaResponse === '' || nickName === '' || otpNumStr === '' || password === '' || passwordConfirmation === '') return

    const registerPostbody = {
      'fingerprint': fingerprint,
      'loginName': loginName,
      'nickName': nickName,
      'otpNumStr': otpNumStr,
      'password': password,
      'passwordConfirmation': passwordConfirmation,
    }

    this.setState({ onRegister:true })

    fetch(API_URL + '/register/create?g-recaptcha-response=' + recaptchaResponse, {
      method: 'post',
      body: JSON.stringify( registerPostbody ),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.registerSuccess()
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            let otpFailCount = this.state.otpFailCount
            const errorReason = json.error.reasons
            if (errorReason[0].key === 'otpNumStr') {
              if (otpFailCount > 1) {
                otpFailCount--

                this.setState({
                  onRegister: false,
                  otpFailCount: otpFailCount,
                  recaptchaResponse: ''
                })
              } else {
                this.setState({
                  onRegister: false,
                  recaptchaResponse: ''
                })

                this.handleCancelSignup()
              }
            } else {
              this.setState({
                onRegister: false,
                recaptchaResponse: ''
              })
            }

            this.signup.closePopupAndShowResult(false, errorReason[0].message)

          })
        }
      })

      .catch(error => {
        console.log(error)
      })
  }

  registerSuccess = () => {
    this.stopOTPTimer()

    this.setState({
      onRegister: false,
      signupProcess: 'finish',
      recaptchaResponse: '',
    })
  }

  handleCancelSignup = () => {

    if (this.state.signupProcess === 'start') {
      this.signup.recaptcha.reset()
      this.props.history.push('/')
    } else {
      this.setState({
        onRegister: false,
        signupProcess: 'start',
        loginName: '',
        recaptchaResponse: '',

        otpNumStr: '',
        nickName: '',
        password: '',
        passwordConfirmation: '',

        pwdchk_char: false,
        pwdchk_num: false,
        pwdchk_special: false,
        pwdchk_length: false
      })

      if (this.signup.recaptcha !== null && this.signup.recaptcha !== undefined) {
        this.signup.recaptcha.reset()
      }

      this.stopOTPTimer()
    }
  }

  handleInputChanged = (event: Event) => {
    const inputName = event.currentTarget.name
    const inputValue = event.currentTarget.value

    if (inputName === 'otp') {
      this.setState({
        otpNumStr: inputValue
      })
    } else if (inputName === 'nickname') {
      this.setState({
        nickName: inputValue
      })
    } else if (inputName === 'password') {
      this.validatePassword(inputValue)
      this.setState({
        showPasswordValidate: inputValue !== ''
      })
    } else if (inputName === 'confirmpassword') {
      this.setState({
        passwordConfirmation: inputValue
      })
    }
  }

  handleInputBlur = (event: Event) => {
    const inputValue = event.currentTarget.value
    const inputName = event.currentTarget.name
    if (inputName === 'password') {
      this.setState({
        password: inputValue,
        focusedInputName: ''
      })
    } else if (inputName === 'email') {
      this.setState({
        loginName: inputValue,
        focusedInputName: ''
      })
    } else {
      this.setState({
        focusedInputName: ''
      })
    }
  }

  handleInputFocused = (event: Event) => {
    this.setState({
      focusedInputName: event.currentTarget.name
    })
  }

  handleCheckboxChange = (event: Event) => {
    this.setState({
      agreement: !this.state.agreement
    })
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

  verifyOTP = (otp: string) => {
    if (otp === '') {
      return true
    }
    return /^[0-9]{6}$/.test(otp)
  }

  verifyNickname = (nickName: string) => {
    if (nickName === '') {
      return true
    }
    const special_pattern = /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"₩]/gi
    if (nickName.search(/\s/) !== -1 || special_pattern.test(nickName) === true) return false
    if (nickName.length > 3 && nickName.length < 11) return true
    return false
  }

  verifyPassword = (password: string) => {
    if (password === '') {
      return true
    }

    if (this.state.pwdchk_char && this.state.pwdchk_length && this.state.pwdchk_num && this.state.pwdchk_special) {
      return true
    }
    return false
  }

  verifyPasswordConfirm = (passwordConfirm: string) => {
    if (passwordConfirm === '') {
      return true
    }
    return passwordConfirm === this.state.password
  }

  readyContinue = () => {
    const {signupProcess, loginName, nickName, password, passwordConfirmation, otpNumStr, recaptchaResponse, agreement} = this.state
    switch (signupProcess) {
      case 'start':
        return loginName !== '' && this.verifyEmail(loginName) && recaptchaResponse !== ''

      case 'createaccount':
        return loginName !== '' && this.verifyEmail(loginName) && password !== '' && this.verifyPassword(password) &&
          password === passwordConfirmation && passwordConfirmation !== '' &&
          otpNumStr !== '' && this.verifyOTP(otpNumStr) &&
          nickName !== '' && this.verifyNickname(nickName) && recaptchaResponse !== '' && agreement

      case 'otpsent':
      case 'finish':
      default:
        return true;
    }
  }

  validatePassword = (password:string) => {
    let special = false
    let char = false
    let num = false
    let length = false

    if (password.match(/[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"₩]/)) {
      special = true
    }

    if (password.match(/([a-zA-Z])/)) {
      char = true
    }

    if (password.match(/([0-9])/)) {
      num = true
    }

    if (password.length > 7 && password.length < 101) {
      length = true
    }

    this.setState({
      pwdchk_char: char,
      pwdchk_num: num,
      pwdchk_special: special,
      pwdchk_length: length
    })
  }

  startOTPTimer = () => {
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

  render() {

    const {signupProcess, loginName, nickName, password, passwordConfirmation,
      otpNumStr, otpRemainTimeString, focusedInputName, showPasswordValidate} = this.state

    let emailValidateInfo = {
      message: this.verifyEmail(loginName) ? ' ' : strings.signup.entervalidemail
    }
    if (focusedInputName === 'email') {
      emailValidateInfo.border = 'thick'
      emailValidateInfo.borderColor = 'down-blue'
      emailValidateInfo.backgroundColor = 'white'
      emailValidateInfo.messageColor = 'normal'
      emailValidateInfo.icon = ''
    } else {
      emailValidateInfo.border = this.verifyEmail(loginName) ? 'normal' : 'thick'
      emailValidateInfo.borderColor = this.verifyEmail(loginName) ? 'gray' : 'up-red'
      emailValidateInfo.backgroundColor = this.verifyEmail(loginName) ? 'white' : 'error'
      emailValidateInfo.messageColor = this.verifyEmail(loginName) ? 'normal' : 'error'
      emailValidateInfo.icon = this.verifyEmail(loginName) && loginName !== '' ? 'checked' : ''
    }

    let nicknameValidateInfo = {}
    if (focusedInputName === 'nickname') {
      nicknameValidateInfo.message = strings.signup.enter4to10characters
      nicknameValidateInfo.border = 'thick'
      nicknameValidateInfo.borderColor = 'down-blue'
      nicknameValidateInfo.backgroundColor = 'white'
      nicknameValidateInfo.messageColor = 'normal'
      nicknameValidateInfo.icon = ''
    } else {
      nicknameValidateInfo.message = this.verifyNickname(nickName) ? ' ' : strings.signup.enter4to10characters
      nicknameValidateInfo.border = this.verifyNickname(nickName) ? 'normal' : 'thick'
      nicknameValidateInfo.borderColor = this.verifyNickname(nickName) ? 'gray' : 'up-red'
      nicknameValidateInfo.backgroundColor = this.verifyNickname(nickName) ? 'white' : 'error'
      nicknameValidateInfo.messageColor = this.verifyNickname(nickName) ? 'normal' : 'error'
      nicknameValidateInfo.icon = this.verifyNickname(nickName) && nickName !== '' ? 'checked' : ''
    }

    let otpValidateInfo = {}
    if (focusedInputName === 'otp') {
      otpValidateInfo.message = strings.signup.enterotpcode
      otpValidateInfo.border = 'thick'
      otpValidateInfo.borderColor = 'down-blue'
      otpValidateInfo.backgroundColor = 'white'
      otpValidateInfo.messageColor = 'normal'
      otpValidateInfo.icon = 'secured-focused'
    } else {
      otpValidateInfo.message = this.verifyOTP(otpNumStr) ? ' ' : strings.signup.enterotpcode
      otpValidateInfo.border = this.verifyOTP(otpNumStr) ? 'normal' : 'thick'
      otpValidateInfo.borderColor = this.verifyOTP(otpNumStr) ? 'gray' : 'up-red'
      otpValidateInfo.backgroundColor = this.verifyOTP(otpNumStr) ? 'white' : 'error'
      otpValidateInfo.messageColor = this.verifyOTP(otpNumStr) ? 'normal' : 'error'
      otpValidateInfo.icon = this.verifyOTP(otpNumStr) && otpNumStr !== '' ? 'checked' : 'secured'
    }

    let passwordValidateInfo = {
      message: ' '
    }
    if (focusedInputName === 'password') {
      passwordValidateInfo.border = 'thick'
      passwordValidateInfo.borderColor = 'down-blue'
      passwordValidateInfo.backgroundColor = 'white'
      passwordValidateInfo.icon = 'secured-focused'
    } else {
      passwordValidateInfo.border = this.verifyPassword(password) ? 'normal' : 'thick'
      passwordValidateInfo.borderColor = this.verifyPassword(password) ? 'gray' : 'up-red'
      passwordValidateInfo.backgroundColor = this.verifyPassword(password) ? 'white' : 'error'
      passwordValidateInfo.icon = this.verifyPassword(password) && password !== '' ? 'checked' : 'secured'
    }

    let passwordConfirmValidateInfo = {
      message: ' '
    }
    if (focusedInputName === 'confirmpassword') {
      passwordConfirmValidateInfo.border = 'thick'
      passwordConfirmValidateInfo.borderColor = 'down-blue'
      passwordConfirmValidateInfo.backgroundColor = 'white'
      passwordConfirmValidateInfo.icon = 'secured-focused'
    } else {
      passwordConfirmValidateInfo.border = this.verifyPasswordConfirm(passwordConfirmation) ? 'normal' : 'thick'
      passwordConfirmValidateInfo.borderColor = this.verifyPasswordConfirm(passwordConfirmation) ? 'gray' : 'up-red'
      passwordConfirmValidateInfo.backgroundColor = this.verifyPasswordConfirm(passwordConfirmation) ? 'white' : 'error'
      passwordConfirmValidateInfo.icon = this.verifyPasswordConfirm(passwordConfirmation) && passwordConfirmation !== '' ? 'checked' : 'secured'
    }

    const buttonColor = this.readyContinue() ? 'iris' : 'light-blue'
    const buttonBorderColor = this.readyContinue() ? 'iris' : 'light-blue'
    strings.setLanguage(this.props.language)
    return (
      <SignupPage onCancelPress={this.handleCancelSignup}
                  onContinuePress={this.handleContinueSignup}
                  onRecaptchaChanged={this.handleRecaptchaChanged}
                  onInputChanged={this.handleInputChanged}
                  onInputBlur={this.handleInputBlur}
                  onInputFocused={this.handleInputFocused}
                  onCheckboxChange={this.handleCheckboxChange}

                  signupProcess={signupProcess}
                  otpRemainTimeString={otpRemainTimeString}
                  loginName={loginName}
                  pwdchk_char={this.state.pwdchk_char}
                  pwdchk_num={this.state.pwdchk_num}
                  pwdchk_special={this.state.pwdchk_special}
                  pwdchk_length={this.state.pwdchk_length}
                  ref={ref => { this.signup = ref }}

                  showPasswordValidate={showPasswordValidate}
                  emailValidateInfo={emailValidateInfo}
                  nicknameValidateInfo={nicknameValidateInfo}
                  otpValidateInfo = {otpValidateInfo}
                  passwordValidateInfo = {passwordValidateInfo}
                  passwordConfirmValidateInfo = {passwordConfirmValidateInfo}

                  buttonBorderColor={buttonBorderColor}
                  buttonColor = {buttonColor}
                  language={this.props.language}

      />
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(SignupContainer)

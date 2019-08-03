// @flow

import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

import {View, Text, Input, Button, Spacer, Link, Popup} from '../controls'
import type {Color, Border} from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import Footer from '../controls/Footer'
import Header from '../controls/Header'

import { RECAPTCHA_SITEKEY } from '../../config'

const strings = new LocalizedStrings({
  en: {
    login: {
      title: 'Welcome.',
      email: 'Email',
      password: 'Password.',
      signin: 'Sign In',
      forgotpassword: 'Forgot password?',
      newtoquanty: 'New to Quanty?',
      signup: 'Sign up',
      otpcodefield: 'OTP Code',
      totpcodefield: '2FA Code',
      continue: 'Continue',
      error: 'Error!',
      cancel: 'Cancel',
      wantregisterdevice: 'Register this device?',
      confirm: 'Confirm',

    }
  },
  ko: {
    login: {
      title: '로그인',
      email: '이메일',
      password: '비밀번호',
      signin: '로그인',
      forgotpassword: '비밀번호가 기억나지 않으신가요?',
      newtoquanty: '아직 계정이 없으신가요?',
      signup: '회원가입',
      otpcodefield: '인증번호 6자리를 입력해 주세요.',
      totpcodefield: 'OTP앱의 6자리 인증번호',
      continue: '확인',
      error: '오류',
      cancel: '취소',
      wantregisterdevice: '지금 사용하고 계신 기기를 등록하시겠습니까?',
      confirm: '확인',

    }
  }
})

type Props = {
  onSignInPress: Function,
  buttonEnable: boolean,
  onRecaptchaChange: (recaptchaToken: string) => void,
  refRecaptcha?: Function,
  enableOTP?: boolean,
  enableTOTP?: boolean,
  onInputBlur: (event: Event) => void,
  onInputFocused: (event: Event) => void,
  emailValidateInfo: ValidateInfo,
  passwordValidateInfo: ValidateInfo,
  otpValidateInfo: ValidateInfo,
  otpRemainTimeString: string,
  onRegisterDevice: (willRegister: boolean) => void,
  onBrowserSavedPassword: (password: string) => void,
  onResetLogin: () => void,
  language: string
}

type State = {
  showPopup: boolean,
  showAlertPopup: boolean,
  popupType: string,
  popupMessage: string,
}

type ValidateInfo = {
  message?: string,
  border: Border,
  borderColor: Color,
  backgroundColor?: Color,
  messageColor?: Color
}

class LoginPage extends React.Component<Props, State> {

  state = {
    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupMessage: '',
  }

  emailInput: { current: null | HTMLInputElement }
  passwordInput: { current: null | HTMLInputElement }
  otpInput: { current: null | HTMLInputElement }

  constructor(props:Props) {
    super(props)
    this.emailInput = React.createRef()
    this.passwordInput = React.createRef()
    this.otpInput = React.createRef()
  }

  componentDidMount() {
    setTimeout(() => { this.setFocus() }, 10);
  }

  setFocus = () => {
    this.emailInput.current.focus()
  }

  componentWillUnmount() {
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (this.state.showAlertPopup || this.state.showPopup) return
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.onSigninClick() }, 10)
    }
  }

  onSigninClick = () => {
    if (this.props.buttonEnable) {
      this.props.onSignInPress()
    }
  }

  registerDevice = (willRegister: boolean) => {
    this.setState({
      showPopup: false,
      popupType: '',
      popupMessage: ''
    })

    this.props.onRegisterDevice(willRegister)
  }

  handleAlertPopupClick = () => {

    if (this.state.popupType === 'LoginFromScratchNeedException') {
      this.emailInput.current.value = ''
      this.passwordInput.current.value = ''
      this.props.onResetLogin()
    }

    this.setState({
      showAlertPopup: false,
      popupMessage: '',
      popupType: '',
    })

    if (this.emailInput.current !== null && this.emailInput.current.value === '') {
      this.emailInput.current.focus()
    } else if (this.passwordInput.current !== null && this.passwordInput.current.value === '') {
      this.passwordInput.current.focus()
    }
  }

  handlePopupClick = () => {
    this.setState({
      showPopup: false,
      popupType: '',
      popupMessage: ''
    })

    if (this.otpInput.current !== null && this.otpInput.current.value === '') {
      this.otpInput.current.focus()
    }

  }

  handleRegisterButtonClick = () => {
    this.registerDevice(true)
  }

  handleRegisterCancelClick = () => {
    this.registerDevice(false)
  }



  handleRecaptchaChange = (recaptchaToken: string) => {
    this.props.onRecaptchaChange(recaptchaToken)

    if (this.passwordInput.current.value) (
      this.props.onBrowserSavedPassword(this.passwordInput.current.value)
    )
  }

  closePopupAndShowResult = (result: boolean, message: string, exception: string = '') => {
    if (!result) {
      this.setState({
        showAlertPopup: true,
        popupMessage: message,
        popupType: exception
      })
    } else {
      if (message === 'registerdevice') {
        this.setState({
          showPopup: true,
          popupType: 'registerdevice'
        })
      } else {
        this.setState({
          showPopup: true,
          popupType: 'otprequired',
          popupMessage: message
        })
      }
    }
  }

  render() {
    const {
      buttonEnable,
      refRecaptcha,
      enableOTP,
      enableTOTP,
      onInputBlur,
      onInputFocused,
      emailValidateInfo,
      passwordValidateInfo,
      otpValidateInfo,
      otpRemainTimeString
    } = this.props

    const {showAlertPopup, showPopup, popupType, popupMessage} = this.state
    const buttonColor = buttonEnable ? 'iris' : 'light-blue'

    strings.setLanguage(this.props.language)

    return (
      <View flex="fill" justifyContent="center" alignItems="center"
            backgroundImage="gradient-iris">
        <Header />            
        <View paddingHorizontal="xlarge"
              paddingVertical="large"
              borderRadius="tiny"
              backgroundColor="white" boxShadow width="100%" maxWidth={400} style={styles.dontshrink}>

          <View paddingHorizontal="medium" style={styles.dontshrink}>
            <Spacer size="small"/>
            <Text fontSize="medium" fontWeight="bold" textAlign="center">{strings.login.title}</Text>
            <Spacer size="large"/>

            <Input
              placeholder={strings.login.email}
              onBlur={onInputBlur}
              onFocus={onInputFocused}
              onKeyUp={this.onInputKeyUp}
              message={emailValidateInfo.message}
              borderColor={emailValidateInfo.borderColor}
              border={emailValidateInfo.border}
              backgroundColor={emailValidateInfo.backgroundColor}
              messageColor={emailValidateInfo.messageColor}
              name='email'
              icon={emailValidateInfo.icon}
              innerRef={this.emailInput}
            />
            <Spacer size="small"/>

            <Input
              placeholder={strings.login.password}
              onBlur={onInputBlur}
              onFocus={onInputFocused}
              onKeyUp={this.onInputKeyUp}
              type='password'
              borderColor={passwordValidateInfo.borderColor}
              border={passwordValidateInfo.border}
              name='password'
              icon={passwordValidateInfo.icon}
              innerRef={this.passwordInput}
            />
            <Spacer size="xlarge"/>

            {enableOTP && (
              <React.Fragment>
                <Input
                  placeholder={strings.login.otpcodefield}
                  onBlur={onInputBlur}
                  onFocus={onInputFocused}
                  onKeyUp={this.onInputKeyUp}
                  borderColor={otpValidateInfo.borderColor}
                  border={otpValidateInfo.border}
                  name='otp'
                  innerRef={this.otpInput}
                  innerText={otpRemainTimeString}
                />
                <Spacer size="large"/>
              </React.Fragment>
            )}

            {enableTOTP && (
              <React.Fragment>
                <Input
                  placeholder={strings.login.totpcodefield}
                  onBlur={onInputBlur}
                  onFocus={onInputFocused}
                  onKeyUp={this.onInputKeyUp}
                  borderColor={otpValidateInfo.borderColor}
                  border={otpValidateInfo.border}
                  name='otp'
                  icon={otpValidateInfo.icon}
                  innerRef={this.otpInput}
                />
                <Spacer size="large"/>
              </React.Fragment>
            )}

            {!enableOTP && !enableTOTP && (
              <React.Fragment>
                <View flexHorizontal justifyContent="center">
                  <ReCAPTCHA
                    ref={refRecaptcha}
                    sitekey={RECAPTCHA_SITEKEY}
                    onChange={this.handleRecaptchaChange}
                  />
                </View> 
                <Spacer size="large"/>         
              </React.Fragment>
            )}

            <View flexHorizontal justifyContent="center">
              <Button
                title={strings.login.signin}
                width="100%"
                onPress={this.onSigninClick}
                borderColor={buttonColor}
                color={buttonColor}
                titleColor='white'
                fontWeight='normal'
              />
            </View>

            <Spacer size="large"/>

            <View flexHorizontal justifyContent="center">
              <Link to="/resetpassword">{strings.login.forgotpassword}</Link>
            </View>

            <Spacer size="large"/>

            <View flexHorizontal justifyContent="center">
              <Text>
                {strings.login.newtoquanty} <Link to="/signup">{strings.login.signup}</Link>
              </Text>
            </View>
            <Spacer size="xsmall"/>
          </View>
        </View>
        {
          showAlertPopup &&
          <Popup type='error'
                 title={strings.login.error}
                 message={popupMessage}
                 image='images/monotone.png'
                 buttonTitle={strings.login.continue}
                 onButtonClick={this.handleAlertPopupClick}/>
        }
        {
          showPopup && popupType === 'otprequired' &&
          <Popup type='success'
                 message={popupMessage}
                 image='images/otp_sent.png'
                 buttonTitle={strings.login.continue}
                 onButtonClick={this.handlePopupClick}/>
        }
        {
          showPopup && popupType === 'registerdevice' &&
          <Popup type='success'
                 message={strings.login.wantregisterdevice}
                 image='images/success.png'
                 buttonTitle={strings.login.confirm}
                 cancelTitle={strings.login.cancel}
                 onButtonClick={this.handleRegisterButtonClick}
                 onCancelClick={this.handleRegisterCancelClick}/>
        }
      </View>
    )
  }
}

export default LoginPage

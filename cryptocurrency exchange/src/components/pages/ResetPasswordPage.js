// @flow

import * as React from 'react'
import {Button, Input, Spacer, Text, View, Popup} from '../controls/index'
import type {Color} from '../controls/index'
import ReCAPTCHA from 'react-google-recaptcha'
import type {Border} from '../controls'
import LocalizedStrings from 'localized-strings'
import Footer from '../controls/Footer'
import Header from '../controls/Header'
import { RECAPTCHA_SITEKEY } from '../../config'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    resetpassword: {
      title: 'Password Recovery',
      enteremailtoreset: 'Please enter your email address to reset your password.',
      email: 'Email',
      cancel: 'Cancel',
      continue: 'Continue',
      confirm: 'confirm',
      otpsent: 'OTP Sent.',
      otpsentcheckemail: 'An OTP has been sent to the email you entered. Please check your email to see your OTP code.',
      enterotpcode: 'Enter OTP Code',
      otpcodefield: 'OTP Code',
      passwordfield: 'Enter New Password',
      confirmpasswordfield: 'Confirm New Password',
      letters: 'Letters',
      numbers: 'Numbers',
      specialcharacter: 'Special Character',
      eighttotencharacters: '8 to 100 characters',
      success: 'Success',
      error: 'Error!',
      changed: 'Your password has been successfully changed.'
    }
  },
  ko: {
    resetpassword: {
      title: '비밀번호 찾기',
      enteremailtoreset: '퀀티 계정 이메일 주소를 입력해 주세요.',
      email: '이메일',
      cancel: '취소',
      continue: '확인',
      confirm: '확인',
      otpsent: '인증번호 발송',
      otpsentcheckemail: '퀀티 계정 이메일로 인증번호가 발송되었습니다. 이메일을 확인해 주세요.',
      enterotpcode: '인증번호 입력하기',
      otpcodefield: '인증번호 6자리를 입력해 주세요.',
      passwordfield: '새 비밀번호',
      confirmpasswordfield: '새 비밀번호 확인',
      letters: '문자',
      numbers: '숫자',
      specialcharacter: '특수 문자',
      eighttotencharacters: '8자 이상 100 이하',
      success: '비밀번호 변경',
      error: '오류',
      changed: '비밀번호가 새로 변경되었습니다.'
    }
  }
})

type Props = {
  phase: number,
  otpRemainTimeString: string,
  continueButtonColor: Color,
  onEmailConfirmClick: () => void,
  onRecaptchaChange: (recaptchaToken: string) => void,
  onEnterOTPCodeClick: () => void,
  onOTPCodeChange: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onPasswordChange: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onPasswordConfirmChange: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  confirmButtonColor: Color,
  onConfirmClick: () => void,
  passwordInputEmpty: boolean,
  passwordLettersColor: Color,
  passwordNumbersColor: Color,
  passwordSpecialCharsColor: Color,
  passwordCharLengthColor: Color,

  onInputBlur: (Event) => void,
  onInputFocused: (Event) => void,
  emailValidateInfo: ValidateInfo,
  otpValidateInfo: ValidateInfo,
  passwordValidateInfo: ValidateInfo,
  passwordConfirmValidateInfo: ValidateInfo,
  onFinishPress: () => void,
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

class ResetPasswordPage extends React.Component<Props, State> {
  state = {
    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupMessage: '',
  }

  constructor(props: ForgotPasswordProps) {
    super(props)
    this.phasePage = React.createRef()
  }

  componentDidUpdate(prevProps:Props, prevState:State) {
    const {phase} = this.props
    if (prevProps.phase === 1 && phase === 2) {
      this.setState({
        showPopup: true,
        popupType: 'otpsent'
      })
    } else if (prevProps.phase === 2 && phase === 3) {
      this.setState({
        showPopup: false,
        popupType: ''
      })
    } else if (prevProps.phase === 3 && phase === 4) {
      this.setState({
        showPopup: true,
        popupType: 'finish'
      })
    }
  }

  handlePopupCancelClick = () => {
    this.setState({
      showPopup: false,
      popupType: '',
      popupMessage: '',
    })
  }

  handleAlertPopupClick = () => {
    this.setState({
      showAlertPopup: false,
      popupMessage: ''
    })

    this.phasePage.current.setFocus()
  }

  closePopupAndShowResult = (result: boolean, message: string) => {
    if (!result) {
      this.phasePage.current.resetRecaptcha()

      this.setState({
        showAlertPopup: true,
        popupMessage: message
      })
    }
  }

  render() {
    const {
      phase,
      otpRemainTimeString,
      continueButtonColor,
      onEmailConfirmClick,
      onRecaptchaChange,
      onEnterOTPCodeClick,
      onOTPCodeChange,
      onPasswordChange,
      onPasswordConfirmChange,
      confirmButtonColor,
      onConfirmClick,
      passwordInputEmpty,
      passwordLettersColor,
      passwordNumbersColor,
      passwordSpecialCharsColor,
      passwordCharLengthColor,
      onInputBlur,
      onInputFocused,
      emailValidateInfo,
      otpValidateInfo,
      passwordValidateInfo,
      passwordConfirmValidateInfo,
      onFinishPress,
      onInputKeyUp,
    } = this.props

    const {showAlertPopup, popupMessage, showPopup, popupType} = this.state
    strings.setLanguage(this.props.language)
    return (
      <View flex="fill" justifyContent="center" alignItems="center" backgroundImage="gradient-iris">
        <Header />
        <View paddingHorizontal="xlarge"
              paddingVertical="large"
              borderRadius="tiny"
              backgroundColor="white" boxShadow width="100%" maxWidth={400} style={styles.dontshrink}>
          <Spacer size="small" />
          { (phase === 1 || phase === 2) &&
            <ForgotPassword
              continueButtonColor={continueButtonColor}
              onEmailConfirmClick={onEmailConfirmClick}
              onRecaptchaChange={onRecaptchaChange}
              onInputBlur={onInputBlur}
              onInputFocused={onInputFocused}
              onInputKeyUp={onInputKeyUp}
              emailValidateInfo={emailValidateInfo}
              ref={this.phasePage}
              language={this.props.language}
            />
          }
          { (phase === 3 || phase === 4) &&
          <ResetPassword
            otpRemainTimeString={otpRemainTimeString}
            onOTPCodeChange={onOTPCodeChange}
            onPasswordChange={onPasswordChange}
            onPasswordConfirmChange={onPasswordConfirmChange}
            onRecaptchaChange={onRecaptchaChange}
            confirmButtonColor={confirmButtonColor}
            onConfirmClick={onConfirmClick}
            passwordInputEmpty={passwordInputEmpty}
            passwordLettersColor={passwordLettersColor}
            passwordNumbersColor={passwordNumbersColor}
            passwordSpecialCharsColor={passwordSpecialCharsColor}
            passwordCharLengthColor={passwordCharLengthColor}

            onInputBlur={onInputBlur}
            onInputFocused={onInputFocused}
            onInputKeyUp={onInputKeyUp}
            otpValidateInfo={otpValidateInfo}
            passwordValidateInfo={passwordValidateInfo}
            passwordConfirmValidateInfo={passwordConfirmValidateInfo}
            ref={this.phasePage}
            language={this.props.language}
          />
          }
          <Spacer size="xsmall"/>
        </View>
        {
          showPopup && popupType === 'otpsent' &&
          <Popup type='success'
                  title={strings.resetpassword.otpsent}
                  message={strings.resetpassword.otpsentcheckemail}
                  image="/images/otp_sent.png"
                  buttonTitle={strings.resetpassword.enterotpcode}
                  onButtonClick={onEnterOTPCodeClick}/>
        }
        {
          showPopup && popupType === 'finish' &&
          <Popup type='success'
                title={strings.resetpassword.success}
                message={strings.resetpassword.changed}
                image="/images/reset_success.png"
                buttonTitle={strings.resetpassword.continue}
                onButtonClick={onFinishPress}/>
        }
        {
          showAlertPopup &&
          <Popup type='error'
                 title={strings.resetpassword.error}
                 message={popupMessage}
                 image='images/monotone.png'
                 buttonTitle={strings.resetpassword.continue}
                 onButtonClick={this.handleAlertPopupClick}/>
        }
      </View>
    )
  }
}

type ForgotPasswordProps = {
  continueButtonColor: Color,
  onEmailConfirmClick: () => void,
  onRecaptchaChange: (recaptchaToken: string) => void,
  onInputBlur: (Event) => void,
  onInputFocused: (Event) => void,
  onInputKeyUp: (Event) => void,
  emailValidateInfo: ValidateInfo,
  language: string
}

class ForgotPassword extends React.Component<ForgotPasswordProps, State> {

  constructor(props) {
    super(props)
    this.emailInput = React.createRef()
  }

  componentDidMount() {
    this.setFocus()
  }

  setFocus = () => {
    if (this.emailInput.current.value === '') this.emailInput.current.focus()
  }

  resetRecaptcha = () => {
    this.recaptcha.reset()
  }

  render() {

    const {
      continueButtonColor,
      onEmailConfirmClick,
      onRecaptchaChange,
      onInputBlur,
      onInputFocused,
      onInputKeyUp,
      emailValidateInfo
    } = this.props
    strings.setLanguage(this.props.language)
    return (
      <View paddingHorizontal="medium" phonePaddingHorizontal="small">
        <View flexHorizontal justifyContent="center">
          <Text fontSize="medium" fontWeight="bold" alignItems="center">{strings.resetpassword.title}</Text>
        </View>
        <Spacer size="large"/>

        <Text fontSize="small">{strings.resetpassword.enteremailtoreset}</Text>
        <Spacer size="large"/>

        <Input
          placeholder={strings.resetpassword.email}
          onBlur={onInputBlur}
          onFocus={onInputFocused}
          onKeyUp={onInputKeyUp}
          border={emailValidateInfo.border}
          borderColor={emailValidateInfo.borderColor}
          backgroundColor={emailValidateInfo.backgroundColor}
          message={emailValidateInfo.message}
          messageColor={emailValidateInfo.messageColor}
          name="email"
          icon={emailValidateInfo.icon}
          innerRef={this.emailInput}
        />
        <Spacer size="small"/>

        <View flexHorizontal justifyContent="center">
          <ReCAPTCHA
            ref={ ref => { this.recaptcha = ref } }
            sitekey={RECAPTCHA_SITEKEY}
            onChange={onRecaptchaChange}
          />
        </View>
        <Spacer size="large"/>

        <Button
          title={strings.resetpassword.continue}
          titleColor='white'
          fontWeight='normal'
          flex="fill"
          color={continueButtonColor}
          onPress={onEmailConfirmClick}
        />
        {/*<View flexHorizontal>*/}
          {/*<Button*/}
            {/*title={strings.resetpassword.cancel}*/}
            {/*titleColor='gray'*/}
            {/*fontWeight='normal'*/}
            {/*flex="fill"*/}
          {/*/>*/}
          {/*<Spacer/>*/}
          {/*<Button*/}
            {/*title={strings.resetpassword.continue}*/}
            {/*titleColor='white'*/}
            {/*fontWeight='normal'*/}
            {/*flex="fill"*/}
            {/*color={continueButtonColor}*/}
            {/*onPress={onEmailConfirmClick}*/}
          {/*/>*/}
        {/*</View>*/}
      </View>
    )
  }
}

type ResetPasswordProps = {
  otpRemainTimeString: string,
  onOTPCodeChange: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onPasswordChange: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onPasswordConfirmChange: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onRecaptchaChange: (recaptchaToken: string) => void,
  confirmButtonColor: Color,
  onConfirmClick: () => void,
  passwordInputEmpty: boolean,
  passwordLettersColor: Color,
  passwordNumbersColor: Color,
  passwordSpecialCharsColor: Color,
  passwordCharLengthColor: Color,

  onInputBlur: (Event) => void,
  onInputFocused: (Event) => void,
  onInputKeyUp: (Event) => void,
  otpValidateInfo: ValidateInfo,
  passwordValidateInfo: ValidateInfo,
  passwordConfirmValidateInfo: ValidateInfo,
  language: string
}

class ResetPassword extends React.Component<ResetPasswordProps, State> {

  constructor(props) {
    super(props)
    this.otpInput = React.createRef()
    this.passwordInput = React.createRef()
    this.confirmpasswordInput = React.createRef()
  }

  componentDidMount() {
    this.setFocus()
  }

  setFocus = () => {
    if (this.otpInput.current.value === '') {
      this.otpInput.current.focus()
    } else if (this.passwordInput.current.value === '') {
      this.passwordInput.current.focus()
    } else if (this.confirmpasswordInput.current.value === '') {
      this.confirmpasswordInput.current.focus()
    }
  }

  resetRecaptcha = () => {
    this.recaptcha.reset()
  }

  render() {
    const {
      otpRemainTimeString,
      onOTPCodeChange,
      onPasswordChange,
      onPasswordConfirmChange,
      onRecaptchaChange,
      confirmButtonColor,
      onConfirmClick,
      passwordInputEmpty,
      passwordLettersColor,
      passwordNumbersColor,
      passwordSpecialCharsColor,
      passwordCharLengthColor,
      onInputBlur,
      onInputFocused,
      onInputKeyUp,
      otpValidateInfo,
      passwordValidateInfo,
      passwordConfirmValidateInfo
    } = this.props
    strings.setLanguage(this.props.language)
    return (
      <View paddingHorizontal="medium" phonePaddingHorizontal="small">
        <View flexHorizontal justifyContent="center">
          <Text fontSize="medium" fontWeight="bold" alignItems="center">{strings.resetpassword.title}</Text>
        </View>
        <Spacer size='large'/>

        <Input
          placeholder={strings.resetpassword.otpcodefield}
          onChange={onOTPCodeChange}
          onBlur={onInputBlur}
          onFocus={onInputFocused}
          onKeyUp={onInputKeyUp}
          message={otpValidateInfo.message}
          border={otpValidateInfo.border}
          borderColor={otpValidateInfo.borderColor}
          backgroundColor={otpValidateInfo.backgroundColor}
          messageColor={otpValidateInfo.messageColor}
          name='otp'
          autoComplete='off'
          innerText={otpRemainTimeString}
          innerRef={this.otpInput}
        />
        <Spacer size="small"/>

        <Input
          placeholder={strings.resetpassword.passwordfield}
          type='password'
          onChange={onPasswordChange}
          onBlur={onInputBlur}
          onFocus={onInputFocused}
          onKeyUp={onInputKeyUp}
          message={passwordValidateInfo.message}
          border={passwordValidateInfo.border}
          borderColor={passwordValidateInfo.borderColor}
          backgroundColor={passwordValidateInfo.backgroundColor}
          name='password'
          icon={passwordValidateInfo.icon}
          innerRef={this.passwordInput}
        />
        {passwordInputEmpty && <Spacer size="small" /> }
        {!passwordInputEmpty &&
        <View>
          <View flexHorizontal paddingHorizontal="xsmall">
            <View width="4%" backgroundColor={passwordLettersColor} borderRadius="small"/>
            <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.resetpassword.letters}</Text>
            <View width="4%" backgroundColor={passwordNumbersColor} borderRadius="small"/>
            <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.resetpassword.numbers}</Text>
          </View>
          <Spacer size="small"/>
          <View flexHorizontal paddingHorizontal="xsmall">
            <View width="4%" backgroundColor={passwordSpecialCharsColor} borderRadius="small"/>
            <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.resetpassword.specialcharacter}</Text>
            <View width="4%" backgroundColor={passwordCharLengthColor} borderRadius="small"/>
            <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.resetpassword.eighttotencharacters}</Text>
          </View>
          <Spacer size="xsmall"/>
        </View>
        }

        {!passwordInputEmpty && <Spacer size="small"/>}

        <Input
          placeholder={strings.resetpassword.confirmpasswordfield}
          type='password'
          onChange={onPasswordConfirmChange}
          onBlur={onInputBlur}
          onFocus={onInputFocused}
          onKeyUp={onInputKeyUp}
          message={passwordConfirmValidateInfo.message}
          border={passwordConfirmValidateInfo.border}
          borderColor={passwordConfirmValidateInfo.borderColor}
          backgroundColor={passwordConfirmValidateInfo.backgroundColor}
          name='passwordConfirm'
          icon={passwordConfirmValidateInfo.icon}
          innerRef={this.confirmpasswordInput}
        />
        <Spacer size="medium"/>

        <View flexHorizontal justifyContent="center">
          <ReCAPTCHA
            ref={ ref => { this.recaptcha = ref } }
            sitekey={RECAPTCHA_SITEKEY}
            onChange={onRecaptchaChange}
          />
        </View>
        <Spacer size="large"/>

        <View flexHorizontal justifyContent="center">
          <Button
            title={strings.resetpassword.confirm}
            flex="fill"
            titleColor='white'
            fontWeight='normal'
            color={confirmButtonColor}
            onPress={onConfirmClick}
          />
        </View>  
      </View>
    )
  }
}

export default ResetPasswordPage

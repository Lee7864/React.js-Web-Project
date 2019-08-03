// @flow

import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import LocalizedStrings from 'localized-strings'
import { View, Text, Image, Input, Button, Spacer, Divider, Popup, Link } from '../controls'
import type {Border, Color} from '../controls'

import { RECAPTCHA_SITEKEY } from '../../config'
import Footer from '../controls/Footer'
import Header from '../controls/Header'
import styles from '../../styles/StyleGuide.css'
import {treatNewline} from '../../data/StringUtil'

const strings = new LocalizedStrings({
  en: {
    signup: {
      signup: 'Sign Up',
      pleasenote: 'Please note',
      youmustbe: 'You must be 19 years of age or older to use the service.',
      ifyouarecorporatememberA: 'If you are a corporate member, please contact us ',
      ifyouarecorporatememberB: 'support@quanty.com',
      ifyouarecorporatememberC: '.',
      alreadyamember: 'Already a member?',
      loginhere: 'Login Here',
      otpsent: 'OTP Sent.',
      anotphasbeen: 'An OTP has been sent to the email you entered.\nPlease check your email for the next step.',
      cancel: 'Cancel',
      continue: 'Continue',
      createyouraccount: 'Please create your account.',
      otpvalidminutes: 'The OTP is only valid for 30 minutes.',
      username: 'Username',
      password: 'Password',
      confirmpassword: 'Confirm Password',
      letters: 'Letters',
      numbers: 'Numbers',
      specialcharacter: 'Special Character',
      eighttotencharacters: '8 to 100 characters',
      iagreetoterms: 'I agree to Quanty Terms of Service and Privacy Policy.',
      success: 'Success!',
      error: 'Error!',
      accounthasbeencreated: 'Your account has been created and ready to be explored.',
      email: 'Email',
      otpcode: 'OTP Code',
      confirm: 'Confirm'
    }
  },
  ko: {
    signup: {
      signup: '회원가입',
      pleasenote: '',
      youmustbe: '만 19세 미만의 회원은 서비스를 이용하실 수 없습니다.',
      ifyouarecorporatememberA: '법인회원 가입은 ',
      ifyouarecorporatememberB: 'support@quanty.com',
      ifyouarecorporatememberC: '로 문의해 주세요.',
      alreadyamember: '이미 퀀티의 회원이시면',
      loginhere: '여기서 로그인해 주세요.',
      otpsent: '인증번호 발송',
      anotphasbeen: '입력하신 이메일로 인증번호가 발송되었습니다.\n가입 진행을 위해 이메일을 확인해 주세요.',
      cancel: '취소',
      continue: '확인',
      createyouraccount: '',
      otpvalidminutes: '30분 안에 인증을 완료해 주세요.',
      username: '별명',
      password: '비밀번호',
      confirmpassword: '비밀번호 확인',
      letters: '문자',
      numbers: '숫자',
      specialcharacter: '특수 문자',
      eighttotencharacters: '8자 이상 100자 이하',
      iagreetoterms: '이용약관과 개인정보처리방침에 동의합니다.',
      success: '회원가입 완료',
      error: '오류',
      accounthasbeencreated: '퀀티 회원가입을 환영합니다.',
      email: '이메일',
      otpcode: '인증번호',
      confirm: '확인'

    }
  }
})


type TimerProps = {
  timeString: string,
}

const Timer = ({ timeString }: TimerProps) => {
  return (
    timeString === ':'
      ? (
        <Text width={8} height={48} textColor="gray" textAlign="center" fontSize="xlarge">{timeString}</Text>
      )
      : (
        <View borderRadius="tiny" backgroundColor="light-gray">
          <Text width={36} height={48} textColor="gray" textAlign="center" fontSize="xlarge">{timeString}</Text>
        </View>
      )
  )
}

type ValidateInfo = {
  message: string,
  border: Border,
  borderColor: Color,
  backgroundColor?: Color,
  icon?: string
}

type Props = {
  onContinuePress: () => void,
  onCancelPress: () => void,

  onRecaptchaChanged: (string) => void,
  onInputChanged: (Event) => void,
  onInputBlur: (Event) => void,
  onInputFocused: (Event) => void,
  onCheckboxChange: (Event) => void,

  signupProcess: string,
  otpRemainTimeString: string,
  loginName: string,
  pwdchk_char: boolean,
  pwdchk_num: boolean,
  pwdchk_special: boolean,
  pwdchk_length: boolean,

  showPasswordValidate: boolean,
  emailValidateInfo: ValidateInfo,
  nicknameValidateInfo: ValidateInfo,
  otpValidateInfo: ValidateInfo,
  passwordValidateInfo: ValidateInfo,
  passwordConfirmValidateInfo: ValidateInfo,

  buttonBorderColor: Color,
  buttonColor: Color,

  language: string
}

type State = {
  showPopup: boolean,
  showAlertPopup: boolean,
  popupType: string,
  popupMessage: string,
}

class SignupPage extends React.Component<Props, State> {

  state = {
    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupMessage: '',
  }

  constructor(props:Props) {
    super(props)
    this.emailInput = React.createRef()
    this.otpInput = React.createRef()
  }
  emailInput: { current: null | HTMLDivElement }
  otpInput: { current: null | HTMLDivElement }

  componentDidMount() {
    document.addEventListener('keyup', this.keyUpHandler)
    if (this.emailInput.current !== null) this.emailInput.current.focus()
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyUpHandler)
  }

  keyUpHandler = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && this.state.showPopup && this.state.popupType === 'otpsent') {
      this.props.onContinuePress()
    }
  }

  componentDidUpdate(prevProps:Props, prevState:State) {
    const {signupProcess} = this.props
    if (prevProps.signupProcess === 'start' && signupProcess === 'otpsent') {
      this.setState({
        showPopup: true,
        popupType: 'otpsent'
      })
    } else if (prevProps.signupProcess === 'otpsent' && signupProcess === 'createaccount') {
      this.setState({
        showPopup: false,
        popupType: ''
      })
      this.otpInput.current.focus()

    } else if (prevProps.signupProcess === 'createaccount' && signupProcess === 'finish') {
      this.setState({
        showPopup: true,
        popupType: 'finish'
      })
    }
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.props.onContinuePress() }, 10);
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelPress()
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
  }

  closePopupAndShowResult = (result: boolean, message: string) => {
    if (!result) {
      this.setState({
        showAlertPopup: true,
        popupMessage: message
      })

      this.resetRecaptcha()
    }
  }

  onCancelPress = () => {
    if (this.state.showPopup) {
      this.handlePopupCancelClick()
    }

    if (this.props.signupProcess === 'start' || this.props.signupProcess === 'otpsent') {
      this.emailInput.current.value = ''
    }

    this.props.onCancelPress()
  }

  handleTermsClick = () => {
    this.linkto('terms')
  }

  handlePrivacyClick = () => {
    this.linkto('privacy')
  }

  linkto = (type: string) => {
    window.open(`/support/${type}`, 'termsandprivacypolicy')
  }

  resetRecaptcha = () => {
    this.recaptcha.reset()
  }

  render() {
    let view = null
    const {signupProcess, otpRemainTimeString, loginName, pwdchk_char, pwdchk_num, pwdchk_special, pwdchk_length,
      emailValidateInfo, nicknameValidateInfo, otpValidateInfo, passwordValidateInfo, passwordConfirmValidateInfo, showPasswordValidate,
      buttonColor, buttonBorderColor, onRecaptchaChanged, onInputChanged, onInputBlur, onContinuePress, onCheckboxChange,
      onInputFocused} = this.props
    strings.setLanguage(this.props.language)
    const {showAlertPopup, showPopup, popupType, popupMessage} = this.state

    if (signupProcess === 'start' || signupProcess === 'otpsent') {
      view = (
        <View flex="fill" justifyContent="center" alignItems="center">
          <Header />
          <View paddingHorizontal="xlarge"
                paddingVertical="large"
                backgroundColor="white"
                borderRadius="tiny"
                boxShadow width="100%" maxWidth={400} style={styles.dontshrink}>
            <Spacer size="small" />
            <Text fontSize="medium" fontWeight="bold" textAlign="center">{strings.signup.signup}</Text>
            <Spacer size="large" />
            <Input placeholder={strings.signup.email}
                   message={emailValidateInfo.message}
                   borderColor={emailValidateInfo.borderColor}
                   border={emailValidateInfo.border}
                   backgroundColor={emailValidateInfo.backgroundColor}
                   onBlur={onInputBlur}
                   onFocus={onInputFocused}
                   onKeyUp={this.onInputKeyUp}
                   name="email"
                   icon={emailValidateInfo.icon}
                   innerRef={this.emailInput}/>
            <Spacer size="tiny" />
            <View padding="small">
              {
                strings.signup.pleasenote &&
                <View>
                  <Text fontSize="small" textColor="gray" bold="true">{strings.signup.pleasenote}:</Text>
                  <Spacer/>
                </View>
              }
              <Text fontSize="xsmall" textColor="gray">• {strings.signup.youmustbe}</Text>
              <Spacer/>
              <Text fontSize="xsmall" textColor="gray">• {strings.signup.ifyouarecorporatememberA}{strings.signup.ifyouarecorporatememberB}{strings.signup.ifyouarecorporatememberC}</Text>
            </View>

            <Spacer size="small" />
            <View flexHorizontal justifyContent="center">
              <ReCAPTCHA
                ref={ ref => { this.recaptcha = ref } }
                sitekey={RECAPTCHA_SITEKEY}
                onChange={onRecaptchaChanged}
              />
            </View>
            <Spacer size="large" />
            <View flexHorizontal>
              <Button title={strings.signup.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={this.onCancelPress}/>
              <Spacer />
              <Button title={strings.signup.continue}
                      flex="fill"
                      color={buttonColor}
                      borderColor={buttonBorderColor}
                      titleColor="white"
                      onPress={onContinuePress}/>
            </View>
            <Spacer size="medium" />
            <Divider size="small"/>
            <Spacer size="small" />
            <View flexHorizontal justifyContent="center" paddingVertical="xsmall">
              <Text fontSize="small">{strings.signup.alreadyamember}</Text>
              <Spacer size="xsmall" />
              <Link to="/login" fontSize="small">{strings.signup.loginhere}</Link>
            </View>
          </View>

        </View>
      )
    } else if (signupProcess === 'createaccount' || signupProcess === 'finish') {
      view = (
        <View flex="fill" justifyContent="center" alignItems="center">
          <Header />
          <View padding="large"
                backgroundColor="white"
                borderRadius="tiny"
                boxShadow width="100%" maxWidth={400}  style={styles.dontshrink}>
            <View paddingHorizontal="large">
              <Text fontSize="medium" fontWeight="bold">{strings.signup.signup}</Text>
              <Spacer size="large" />

              { strings.signup.createyouraccount &&
                <View>
                  <Text fontSize="small" bold="true">{strings.signup.createyouraccount}</Text>
                  <Spacer size="small" />
                </View>
              }

              <Input placeholder={strings.signup.otpcode}
                     message={otpValidateInfo.message}
                     borderColor={otpValidateInfo.borderColor}
                     border={otpValidateInfo.border}
                     backgroundColor={otpValidateInfo.backgroundColor}
                     onChange={onInputChanged}
                     onFocus={onInputFocused}
                     onBlur={onInputBlur}
                     onKeyUp={this.onInputKeyUp}
                     name="otp"
                     autoComplete="off"
                     innerText={otpRemainTimeString}
                     innerRef={this.otpInput}/>
              <Spacer size="small" />

              <View width="100%" backgroundColor="disabled" border="normal" borderColor="disabled">
                <Text fontSize="small" textColor="disabled" padding="small">{loginName}</Text>
              </View>
              <Spacer size="xlarge" />

              <Input placeholder={strings.signup.username}
                     message={nicknameValidateInfo.message}
                     borderColor={nicknameValidateInfo.borderColor}
                     border={nicknameValidateInfo.border}
                     backgroundColor={nicknameValidateInfo.backgroundColor}
                     onChange={onInputChanged}
                     onFocus={onInputFocused}
                     onBlur={onInputBlur}
                     onKeyUp={this.onInputKeyUp}
                     icon={nicknameValidateInfo.icon}
                     name="nickname"/>
              <Spacer size="small" />

              <Input placeholder={strings.signup.password}
                     type="password"
                     message={passwordValidateInfo.message}
                     borderColor={passwordValidateInfo.borderColor}
                     border={passwordValidateInfo.border}
                     backgroundColor={passwordValidateInfo.backgroundColor}
                     onChange={onInputChanged}
                     onFocus={onInputFocused}
                     onBlur={onInputBlur}
                     onKeyUp={this.onInputKeyUp}
                     name="password"
                     icon={passwordValidateInfo.icon}
                     autoComplete="off"/>

            {!showPasswordValidate && <Spacer size="small" /> }
            {showPasswordValidate &&
              <View>
                <View flexHorizontal paddingHorizontal="xsmall">
                  <View width="4%" backgroundColor={pwdchk_char ? "down-blue" : "up-red"} borderRadius="small"/>
                  <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.signup.letters}</Text>
                  <View width="4%" backgroundColor={pwdchk_num ? "down-blue" : "up-red"} borderRadius="small"/>
                  <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.signup.numbers}</Text>
                </View>
                <Spacer size="small" />
                <View flexHorizontal paddingHorizontal="xsmall">
                  <View width="4%" backgroundColor={pwdchk_special ? "down-blue" : "up-red"} borderRadius="small"/>
                  <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.signup.specialcharacter}</Text>
                  <View width="4%" backgroundColor={pwdchk_length ? "down-blue" : "up-red"} borderRadius="small"/>
                  <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">{strings.signup.eighttotencharacters}</Text>
                </View>
              </View>
            }
            {showPasswordValidate && <Spacer size="large"/>}
              <Input placeholder={strings.signup.confirmpassword}
                     type="password"
                     message={passwordConfirmValidateInfo.message}
                     borderColor={passwordConfirmValidateInfo.borderColor}
                     border={passwordConfirmValidateInfo.border}
                     backgroundColor={passwordConfirmValidateInfo.backgroundColor}
                     onChange={onInputChanged}
                     onFocus={onInputFocused}
                     onBlur={onInputBlur}
                     onKeyUp={this.onInputKeyUp}
                     name="confirmpassword"
                     icon={passwordConfirmValidateInfo.icon}
                     autoComplete="off"
              />

              <View flexHorizontal>
                <Input type='checkbox' name='receiveEmail' onChange={onCheckboxChange}/>
                <View paddingVertical="medium">
                  {
                    strings.signup.iagreetoterms === 'I agree to Quanty Terms of Service and Privacy Policy.' &&
                    <React.Fragment>
                      <View flexHorizontal>
                        <Spacer size="xsmall" />
                        <Text fontSize="xsmall">I agree to Quanty</Text>
                        <Spacer size="tiny"/>
                        <Text cursor="pointer" textColor="iris"
                              fontSize="xsmall" onClick={this.handleTermsClick}>Terms of Service</Text>
                        <Spacer size="tiny" />
                        <Text fontSize="xsmall">and</Text>
                        <Spacer size="tiny"/>
                        <Text cursor="pointer" textColor="iris"
                              fontSize="xsmall" onClick={this.handlePrivacyClick}>Privacy Policy</Text>
                        <Text fontSize="xsmall">.</Text>
                      </View>
                    </React.Fragment>
                  }
                  {
                    strings.signup.iagreetoterms === '이용약관과 개인정보처리방침에 동의합니다.' &&
                    <React.Fragment>
                      <View flexHorizontal>
                        <Spacer size="xsmall" />
                        <Text cursor="pointer" textColor="iris"
                              fontSize="small" onClick={this.handleTermsClick}>이용약관</Text>
                        <Text fontSize="small">과</Text>
                        <Spacer size="xsmall"/>
                        <Text cursor="pointer" textColor="iris"
                              fontSize="small" onClick={this.handlePrivacyClick}>개인정보처리방침</Text>
                        <Text fontSize="small">에 동의합니다.</Text>
                      </View>
                    </React.Fragment>
                  }



                </View>
              </View>

              <Spacer size="medium" />

              <View flexHorizontal justifyContent="center">
                <ReCAPTCHA
                  ref={ ref => { this.recaptcha = ref } }
                  sitekey={RECAPTCHA_SITEKEY}
                  onChange={onRecaptchaChanged}
                />
              </View>
              <Spacer size="large" />

              <View flexHorizontal>
                <Button title={strings.signup.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={this.onCancelPress}/>
                <Spacer />
                <Button title={strings.signup.continue}
                        flex="fill"
                        color={buttonColor}
                        borderColor={buttonBorderColor}
                        titleColor="white"
                        onPress={onContinuePress}/>
              </View>

            </View>
          </View>

        </View>
      )
    }

    return (
      <View flex="fill" backgroundImage="gradient-iris">
        {view}
        { showPopup && popupType === 'otpsent' &&
          <Popup>
            <View flex='fill' padding="medium" backgroundColor="white" boxShadow  maxWidth={400}>
              <View paddingVertical="small" alignItems="center">
                <Image source="/images/otp_sent.png" width={40} height={40}/>
                <Spacer size="medium" />
                <Text fontSize="medium" fontWeight="bold">{strings.signup.otpsent}</Text>
                <Spacer size="large" />
                <Text paddingHorizontal="medium" fontSize="small">
                  {treatNewline(strings.signup.anotphasbeen)}
                </Text>
              </View>
              <Divider color='divider'/>
              <View paddingVertical="small" alignItems="center">
                <Text fontWeight="bold" textAlign="center">{strings.signup.otpvalidminutes}</Text>
              </View>

              <View paddingVertical="large" alignItems="center">
                <View flexHorizontal width={164}>
                  <Timer timeString={otpRemainTimeString.substr(0, 1)} />
                  <Spacer size="tiny" />
                  <Timer timeString={otpRemainTimeString.substr(1, 1)} />
                  <Spacer size="tiny" />
                  <Timer timeString={otpRemainTimeString.substr(2, 1)} />
                  <Spacer size="tiny" />
                  <Timer timeString={otpRemainTimeString.substr(3, 1)} />
                  <Spacer size="tiny" />
                  <Timer timeString={otpRemainTimeString.substr(4, 1)} />
                </View>
              </View>

              <View paddingVertical="small">
                <View flexHorizontal>
                  <Button title={strings.signup.cancel} flex="fill" titleWeight="normal" onPress={this.onCancelPress}/>
                  <Spacer />
                  <Button title={strings.signup.continue} flex="fill" color="iris" titleColor="white" onPress={onContinuePress}/>
                </View>
              </View>
            </View>
          </Popup>
        }
        {
          showPopup && popupType === 'finish' &&
          <Popup type='success'
                 title={strings.signup.success}
                 message={strings.signup.accounthasbeencreated}
                 image='images/signup_success.png'
                 buttonTitle={strings.signup.confirm}
                 onButtonClick={onContinuePress}/>
        }
        {
          showAlertPopup &&
          <Popup type='error'
                 title={strings.signup.error}
                 message={popupMessage}
                 image='images/monotone.png'
                 buttonTitle={strings.signup.continue}
                 onButtonClick={this.handleAlertPopupClick}/>
        }
      </View>
    )
  }
}

export default SignupPage

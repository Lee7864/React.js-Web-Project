// @flow

import * as React from 'react'
import { View, Text, Image, Input, Button, Spacer, Divider } from '../controls'
import type {Profile} from '../../types/Profile'
import LocalizedStrings from 'localized-strings'

const strings = new LocalizedStrings({
  en: {
    authtfa: {
      title: 'Two Factor Authentication',
      step1: 'Step 1. Install',
      step1desc: 'Please install one of the following OTP mobile application.',
      step2: 'Step 2. OTP Registration',
      step2desc: 'Open the OTP mobile application and scan the QR code or enter OTP authentication code.',
      showQRCode: 'Show QR Code',
      hideQRCode: 'Hide QR Code',
      secretkey: 'OTP Access Key Code',
      keepSecretkey: 'Please keep a record of your OTP Access Key Code in safe place. Code will be used to verify you when your phone is lost.',
      step3: 'Step 3. Enter Verification Code',
      step3desc: 'Enter your unique verification code that’s sent to your phone.',
      otpverifycode: 'OTP Verification Code',
      cancel: 'Cancel',
      continue: 'Continue',

    }
  },
  ko: {
    authtfa: {
      title: '이중 인증',
      step1: '1단계. 앱 설치',
      step1desc: '다음 OTP 모바일 애플리케이션 중 하나를 설치하세요.',
      step2: '2단계. OTP 등록',
      step2desc: 'OTP 모바일 애플리케이션을 열고 QR 코드를 스캔하거나 OTP 인증 코드를 입력합니다.',
      showQRCode: 'QR 코드 보기',
      hideQRCode: 'QR 코드 숨김',
      secretkey: 'OTP 액세스 키',
      keepSecretkey: '안전한 장소에 OTP 액세스 키를 기록해 두십시오. 기기를 분실하면 코드를 사용하여 확인해야 합니다.',
      step3: '3단계. 인증 코드 입력',
      step3desc: 'OTP 모바일 애플리케이션에서 생성된 고유 확인 코드를 입력해 주세요.',
      otpverifycode: 'OTP 확인 코드',
      cancel: '취소',
      continue: '확인',
    }
  }
})

type SecretKeyProps = {
  keyString: string,
}

const SecretKey = ({ keyString }: SecretKeyProps) => {
  return (
    <View paddingHorizontal="medium" paddingVertical="xsmall" width="25%">
      <Text textColor="gray" fontSize="medium">{keyString}</Text>
    </View>
  )
}

type Props = {
  profile: Profile | null,
  qrCodeImage: string,
  secretKey: string,
  onConfirmPress: (string) => void,
  onCancelAuthPress: () => void,
  onRequestQRCode: () => void,
  language: string,
}

type State = {
  showQR: boolean,
  focusedInputName: string,
  otp: string
}

class AuthTFAPage extends React.Component<Props, State> {

  state = {
    showQR: false,
    focusedInputName: '',
    otp: ''
  }

  constructor(props) {
    super(props)
    this.otpInput = React.createRef()
  }

  componentDidMount() {
    this.props.onRequestQRCode()
    //this.setFocus()
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.onConfirmPress() }, 10);
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelAuthPress()
    }
  }

  onConfirmPress = () => {
    if ( this.state.otp !== '' ) {
      this.props.onConfirmPress(this.state.otp)
    }
  }

  onShowQRClick = () => {
    this.setState({
      showQR: !this.state.showQR
    })
  }

  onInputChanged = (inputEvent: SyntheticEvent<HTMLInputElement> ) => {
    this.setState({
      otp: inputEvent.currentTarget.value
    })
  }

  onInputFocused = () => {
    this.setState({
      focusedInputName: 'otp'
    })
  }

  onInputBlur = () => {
    this.setState({
      focusedInputName: ''
    })
  }

  setFocus = () => {
    this.otpInput.current.focus()
  }

  linkTo = (type: string) => {
    var url
    if (type === 'authy_appstore') {
      url = 'https://itunes.apple.com/kr/app/authy/id494168017?mt=8'
    } else if (type === 'authy_playstore') {
      url = 'https://play.google.com/store/apps/details?id=com.authy.authy&hl=ko'
    } else if (type === 'googleotp_appstore') {
      url = 'https://itunes.apple.com/kr/app/google-authenticator/id388497605?mt=8'
    } else if (type === 'googleotp_playstore') {
      url = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ko'
    }
    window.open(url, '_blank')
  }

  handleAuthyAppstoreClick = () => {
    this.linkTo('authy_appstore')
  }

  handleAuthyPlaystoreClick = () => {
    this.linkTo('authy_playstore')
  }

  handleGoogleAppstoreClick = () => {
    this.linkTo('googleotp_appstore')
  }

  handleGooglePlaystoreClick = () => {
    this.linkTo('googleotp_playstore')
  }

  render() {
    const {profile, qrCodeImage, secretKey, onConfirmPress, onCancelAuthPress} = this.props
    if (profile === null) return null

    const {showQR} = this.state
    const secretKeys = secretKey.split(' ')

    const {focusedInputName, otp} = this.state

    let validateInfo = {}
    if (focusedInputName === 'otp') {
      validateInfo.border = 'thick'
      validateInfo.borderColor = 'down-blue'
      validateInfo.icon = 'secured-focused'
    } else {
      validateInfo.border = 'normal'
      validateInfo.borderColor = 'gray'
      validateInfo.icon = otp !== '' ? 'checked' : 'secured'
    }

    const buttonColor = otp !== '' ? 'iris' : 'light-blue'
    strings.setLanguage(this.props.language)

    return (
      <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="small">
        <Text fontSize="medium" fontWeight="bold" padding="large">{strings.authtfa.title}</Text>
        <Divider color='divider'/>
        <View padding="large">
          <Text fontWeight="bold">{strings.authtfa.step1}</Text>
          <Spacer/>
          <Text textColor='dark-gray'>{strings.authtfa.step1desc}</Text>
          <Spacer/>
          <View width="100%" border="normal" borderColor="light-gray" padding="small">
            <Text textColor='dark-gray' fontSize="xsmall">Authy</Text>
            <Spacer size="xsmall"/>
            <View flexHorizontal>
              <Image source="/images/authy.png" width={32} height={32}/>
              <Spacer size="small"/>
              <Image source="/images/download-on-the-app-store-badge-us-uk-rgb-blk-092917.png" width={91} height={30}
                     onClick={this.handleAuthyAppstoreClick} cursor='pointer'/>
              <Spacer size="xsmall"/>
              <Image source="/images/google-play-badge.png" width={91} height={30}
                     onClick={this.handleAuthyPlaystoreClick} cursor='pointer'/>
            </View>
          </View>
          <Spacer/>
          <View width="100%" border="normal" borderColor="light-gray" padding="small">
            <Text textColor='dark-gray' fontSize="xsmall">Google Authenticator</Text>
            <Spacer size="xsmall"/>
            <View flexHorizontal>
              <Image source="/images/google-authenticator.png" width={32} height={32}/>
              <Spacer size="small"/>
              <Image source="/images/download-on-the-app-store-badge-us-uk-rgb-blk-092917.png" width={91} height={30}
                     onClick={this.handleGoogleAppstoreClick} cursor='pointer'/>
              <Spacer size="xsmall"/>
              <Image source="/images/google-play-badge.png" width={91} height={30}
                     onClick={this.handleGooglePlaystoreClick} cursor='pointer'/>
            </View>
          </View>
        </View>
        <Divider color='divider'/>
        <View padding="large">
          <Text fontWeight="bold">{strings.authtfa.step2}</Text>
          <Spacer/>
          <Text textColor='dark-gray'>{strings.authtfa.step2desc}</Text>
          <Spacer size="medium"/>
          <View width="100%" border="normal" borderColor="light-gray" padding="small">
            <View flexHorizontal justifyContent="space-between" onClick={this.onShowQRClick}>
              <View flexHorizontal>
                <Image source="/images/showqr.png" width={24} height={24}/>
                <Spacer/>
                <View>
                  <Spacer size="tiny"/>
                  <Text textColor="down-blue" fontWeight="bold">{showQR ? strings.authtfa.hideQRCode : strings.authtfa.showQRCode}</Text>
                </View>
              </View>
              <Image source="/images/chevron-right.png" width={20} height={20} rotate={showQR ? "270" : "90"}/>
            </View>
            { showQR &&
              <View paddingHorizontal="small" paddingVertical="medium" alignItems="center" justifyContent="center">
                <Image source={'data:image/png;base64,' + qrCodeImage} width={120} height={120}/>
              </View>
            }
          </View>
          { secretKeys.length > 0 &&
            <View>
              <Spacer />
              <Text textColor='dark-gray'>{strings.authtfa.secretkey}</Text>
              <Spacer/>
              <View backgroundColor="light-gray"
                    width="100%"
                    border="normal"
                    borderColor="light-gray"
                    paddingHorizontal="small"
                    paddingVertical="xsmall">
                <View flexHorizontal>
                  <SecretKey keyString={secretKeys[0]}/>
                  <SecretKey keyString={secretKeys[1]}/>
                  <SecretKey keyString={secretKeys[2]}/>
                  <SecretKey keyString={secretKeys[3]}/>
                </View>
                <View flexHorizontal>
                  <SecretKey keyString={secretKeys[4]}/>
                  <SecretKey keyString={secretKeys[5]}/>
                  <SecretKey keyString={secretKeys[6]}/>
                  <SecretKey keyString={secretKeys[7]}/>
                </View>
              </View>
              <Spacer/>
              <View flexHorizontal>
                <View width={20}>
                  <Image source="/images/monotone.png" height={20} />
                </View>
                <View paddingHorizontal="xsmall" justifyContent='center'>
                  <Text textColor="up-red" fontSize="xsmall">{strings.authtfa.keepSecretkey}</Text>
                </View>
              </View>
            </View>
          }
        </View>
        <Divider color='divider'/>
        <View padding="large">
          <Text fontWeight="bold">{strings.authtfa.step3}</Text>
          <Spacer/>
          <Text textColor='dark-gray'>{strings.authtfa.step3desc}</Text>
          <Spacer/>
          <Input placeholder={strings.authtfa.otpverifycode}
                 borderColor={validateInfo.borderColor}
                 border={validateInfo.border}
                 onChange={this.onInputChanged}
                 onFocus={this.onInputFocused}
                 onBlur={this.onInputBlur}
                 onKeyUp={this.onInputKeyUp}
                 autoComplete="off"
                 name="otp"
                 icon={validateInfo.icon}
                 innerRef={this.otpInput}/>
          <Spacer size="medium"/>
          <View flexHorizontal>
            <Button title={strings.authtfa.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelAuthPress}/>
            <Spacer />
            <Button title={strings.authtfa.continue}
                    flex="fill"
                    color={buttonColor}
                    borderColor={buttonColor}
                    titleColor="white"
                    onPress={this.onConfirmPress}/>
          </View>
        </View>
      </View>
    )
  }
}

export default AuthTFAPage
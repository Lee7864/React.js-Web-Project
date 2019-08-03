// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import { View, Text, Spacer, Divider, Button, Input } from '../controls'
import type { Profile } from '../../types/Profile'
import styles from '../../styles/StyleGuide.css'
import commaNumber from 'comma-number'
import {treatNewline} from '../../data/StringUtil'
import supportStyles from '../../styles/SupportPage.css'
import type {Balance} from '../../types/Balance'

const strings = new LocalizedStrings({
  en: {
    delete: {
      deleteaccount: 'Delete Account',
      step1: 'Step 1. Check your total balance',
      step1desc: 'To delete your account, your total balance must be <$ or ₩>0.\nPlease transfer or withdrawal all your remaining balances.',
      yourcurrentbalances: 'Your Current Balances : ',
      requestwithdrawal: 'Request Withdrawl',
      step2otp: 'Step 2. OTP Authentication ',
      step2emaildesc: 'To delete your account, please enter the authentication code sent to your email.',
      step2smsdesc: 'To delete your account, please enter the authentication code sent via SMS.',
      step22fadesc: 'To delete your account, please enter the code from 2FA app.',
      requestotp: 'Request OTP',
      otpcode: 'OTP Code',
      submitdelete: 'delete',
      error: 'Error!',
      continue: 'Continue',

    }
  },
  ko: {
    delete: {
      deleteaccount: '회원 탈퇴',
      step1: '1. 총 보유자산 확인',
      step1desc: '보유자산이 0이어야만 회원탈퇴 할 수 있습니다.\n보유자산을 모두 출금해 주세요.\n탈퇴 후 재가입은 6개월이 경과해야 가능하니 신중하게 진행해 주십시오.',
      yourcurrentbalances: '고객님의 보유자산',
      requestwithdrawal: '출금 신청',
      step2otp: '-',
      step2emaildesc: '회원탈퇴를 위해 이메일로 전송된 인증번호를 입력해 주세요.',
      step2smsdesc: '회원탈퇴를 위해 SMS로 전송된 인증번호를 입력해 주세요.',
      step22fadesc: '회원탈퇴를 위해 이중 인증 앱에 생성된 6자리 인증번호를 입력해 주세요.',
      requestotp: '인증 번호 요청',
      otpcode: '인증 번호',
      submitdelete: '탈퇴',
      error: '오류',
      continue: '확인',

    }
  }
})

type Props = {
  profile: Profile,
  myBalanceData: Balance[],
  validateReady: boolean,
  otpRequested: boolean,
  otpRemainTimeString: string,

  onRequestWithdrawPress: () => void,
  onRequestOTPPress: () => void,
  onSubmitDeletePress: (string) => void,
  language:string
}

type State = {
  otpNumStr: string,
  inputFocused: boolean
}

class DeleteAccountPage extends React.Component<Props, State> {

  state = {
    otpNumStr: '',
    inputFocused: false
  }

  otpInput: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this.otpInput = React.createRef()
  }

  componentDidMount() {
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  onInputFocused = () => {
    if (this.props.myBalanceData.length !== 0) return
    this.setState({
      inputFocused: true
    })
  }

  onInputBlur = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.myBalanceData.length !== 0) return
    this.setState({
      inputFocused: false,
      otpNumStr: event.currentTarget.value
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {

    if (this.props.myBalanceData.length !== 0) return
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.onSubmitDeletePress() }, 10);
    }
  }

  onSubmitDeletePress = () => {
    if (this.verifyOTP(this.state.otpNumStr) && this.state.otpNumStr !== '') {
      this.props.onSubmitDeletePress(this.state.otpNumStr)
    }
  }

  setFocus = () => {
    if (this.otpInput.current !== null) this.otpInput.current.focus()
  }

  verifyOTP = (otp: string) => {
    if (otp === '') {
      return true
    }
    return /^[0-9]{6}$/.test(otp)
  }

  render() {

    const {inputFocused, otpNumStr} = this.state
    const {profile, myBalanceData, validateReady, otpRequested, otpRemainTimeString,
            onRequestWithdrawPress, onRequestOTPPress} = this.props

    const level: number = Number(profile.level.substr(5, 1))
    const buttonColor = validateReady ? 'iris' : 'light-blue'

    const inputDisabled: boolean = myBalanceData.length !== 0

    let otpValidateInfo = {}
    if (inputFocused) {
      otpValidateInfo.border = 'thick'
      otpValidateInfo.borderColor = 'down-blue'
      otpValidateInfo.backgroundColor = 'white'
      otpValidateInfo.messageColor = 'normal'
      otpValidateInfo.icon = ''
    } else {
      otpValidateInfo.border = this.verifyOTP(otpNumStr) ? 'normal' : 'thick'
      otpValidateInfo.borderColor = this.verifyOTP(otpNumStr) ? 'gray' : 'up-red'
      otpValidateInfo.backgroundColor = this.verifyOTP(otpNumStr) ? 'white' : 'error'
      otpValidateInfo.messageColor = this.verifyOTP(otpNumStr) ? 'normal' : 'error'
      otpValidateInfo.icon = this.verifyOTP(otpNumStr) && otpNumStr !== '' ? 'checked' : ''
    }

    const submitButtonColor = this.verifyOTP(otpNumStr) && otpNumStr !== '' ? 'iris' : 'light-blue'
    strings.setLanguage(this.props.language)
    return (
      <View style={styles.dontshrink} width="100%" flex="fill">
        <Text style={supportStyles.title}>{strings.delete.deleteaccount}</Text>
        <Spacer size="small" />
        <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="medium" style={styles.dontshrink}>
          <View paddingVertical="large">
            <Text fontSize="small-medium" fontWeight="bold">{strings.delete.step1}</Text>
            <Spacer />
            <Text textColor='dark-gray' lineHeight={1.8}>{treatNewline(strings.delete.step1desc)}</Text>
            <Spacer size="large" />
            <Text fontWeight="bold" textColor='dark-gray'>{strings.delete.yourcurrentbalances}</Text>
            <Spacer size="xsmall" />
            {
              myBalanceData.length > 0 && myBalanceData.map((balance) => {
              return (
                <React.Fragment key={balance.currencySymbol}>
                  <View flex='fill' maxWidth={280} border='normal' borderColor='gray' padding="small">
                    <Text textColor='dark-gray' textAlign="right">{ commaNumber(balance.amount) + ' ' + balance.currencySymbol}</Text>
                  </View>
                  <Spacer size="tiny"/>
                </React.Fragment>
              )})
            }
            {
              myBalanceData.length > 0 &&
              <React.Fragment>
                <Spacer size="large" />
                <Button title={strings.delete.requestwithdrawal}
                        flex='fill'
                        maxWidth={280}
                        color="iris"
                        titleColor="white"
                        onPress={onRequestWithdrawPress}/>
              </React.Fragment>
            }
            {
              myBalanceData.length === 0 &&
              <React.Fragment>
                <View flex='fill' maxWidth={280} border='normal' borderColor='disabled' backgroundColor='disabled' padding="small">
                  <Text textColor="disabled" textAlign="right">0</Text>
                </View>
              </React.Fragment>
            }
          </View>
          <Divider color='divider' />
          <View paddingVertical="large">
            <Text fontSize="small-medium" fontWeight="bold">
              {strings.delete.step2otp !== '-' ? strings.delete.step2otp
              : level === 1 ? '2. 이메일 인증' :
                  level === 2 ? '2. 휴대전화 인증' : '2. 이중 인증'
              }

            </Text>
            <Spacer />
            {
              level === 1 &&
              <React.Fragment>
                <Text textColor='dark-gray'>
                  { strings.delete.step2emaildesc }
                </Text>
              </React.Fragment>
            }
            {
              level === 2 &&
              <React.Fragment>
                <Text textColor='dark-gray'>
                  { strings.delete.step2smsdesc }
                </Text>
              </React.Fragment>
            }
            {
              level > 2 &&
              <React.Fragment>
                <Text textColor='dark-gray'>
                  { strings.delete.step22fadesc }
                </Text>
              </React.Fragment>
            }
            <Spacer size="large" />
            {
              level < 3 && !otpRequested &&
              <Button title={strings.delete.requestotp}
                      flex='fill'
                      maxWidth={280}
                      color={buttonColor}
                      titleColor="white"
                      onPress={onRequestOTPPress}/>
            }

            {
              level < 3 && otpRequested &&
              <React.Fragment>
                <View flexHorizontal>
                  <View width={168}>
                    <Input placeholder={strings.delete.otpcode}
                           borderColor={otpValidateInfo.borderColor}
                           border={otpValidateInfo.border}
                           backgroundColor={otpValidateInfo.backgroundColor}
                           onFocus={this.onInputFocused}
                           onBlur={this.onInputBlur}
                           onKeyUp={this.onInputKeyUp}
                           name="otp"
                           autoComplete="off"
                           innerText={otpRemainTimeString}
                           innerRef={this.otpInput}
                    />
                  </View>
                  <Spacer size="small"/>
                  <View width={100}>
                    <Button title={strings.delete.submitdelete}
                            flex='fill'
                            color={submitButtonColor}
                            titleColor="white"
                            onPress={this.onSubmitDeletePress}/>
                  </View>
                </View>
              </React.Fragment>
            }

            {
              level === 3 &&
                <React.Fragment>
                  <View flexHorizontal>
                    <View width={168}>
                      <Input placeholder={strings.delete.otpcode}
                             borderColor={otpValidateInfo.borderColor}
                             border={otpValidateInfo.border}
                             backgroundColor={otpValidateInfo.backgroundColor}
                             onFocus={this.onInputFocused}
                             onBlur={this.onInputBlur}
                             onKeyUp={this.onInputKeyUp}
                             name="otp"
                             autoComplete="off"
                             icon={otpValidateInfo.icon}
                             innerRef={this.otpInput}
                             readOnly={inputDisabled}
                      />
                    </View>
                    <Spacer size="small"/>
                    <View width={100}>
                      <Button title={strings.delete.submitdelete}
                              flex='fill'
                              color={submitButtonColor}
                              titleColor="white"
                              onPress={this.onSubmitDeletePress}/>
                    </View>
                  </View>
                </React.Fragment>
            }
          </View>

        </View>
      </View>
    )
  }
}

export default DeleteAccountPage
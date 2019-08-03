// @flow

import * as React from 'react'
import { View, Text, Input, Button, Spacer } from '../controls'
import type {Profile} from '../../types/Profile'
import LocalizedStrings from 'localized-strings'
import { API_URL } from '../../config'
import styles from '../../styles/StyleGuide.css'
import {store} from '../../redux'
import {userService} from '../../redux/services'

const strings = new LocalizedStrings({
  en: {
    authmobile: {
      title: 'Mobile Authentication',
      description: 'After verifying the password, the mobile authentication starts.',
      password: 'Password',
      cancel: 'Cancel',
      continue: 'Continue',
      error: 'Error!',
    }
  },
  ko: {
    authmobile: {
      title: '휴대전화 인증',
      description: '비밀번호 확인 후 휴대전화 인증을 시작합니다.',
      password: '비밀번호',
      cancel: '취소',
      continue: '확인',
      error: '오류!',
    }
  }
})

type Props = {
  profile: Profile | null,
  onCancelAuthPress: () => void,
  closePopupAndShowResult: (result: boolean, type: string) => void,
  onCheckProfile: () => void,
  language: string
}

type State = {
  focusedInputName: string,
  password: string,
  onStartAuth: boolean,
  showAlertPopup: boolean,
  popupMessage: string,
}

class AuthMobilePage extends React.Component<Props, State> {

  state = {
    focusedInputName: '',
    password: '',
    onStartAuth: false,
    showAlertPopup: false,
    popupMessage: '',
  }

  passwordInput: { current: null | HTMLDivElement }

  constructor(props) {
    super(props)
    this.passwordInput = React.createRef()
  }

  componentDidMount() {
    this.setFocus()
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.onStartAuth === false && this.state.onStartAuth === true) {
      var popupForm = document.createElement("form")
      popupForm.target = "mobileauth"
      popupForm.method = "POST"
      popupForm.action = API_URL + "/certification/iencode"

      var popupInput = document.createElement("input")
      popupInput.type = "text"
      popupInput.name = "password"
      popupInput.value = this.state.password
      popupForm.appendChild(popupInput)
      document.body.appendChild(popupForm)

      popupForm.submit()
      document.body.removeChild(popupForm)
    }
  }

  setFocus = () => {
    if (this.passwordInput.current.value === '') this.passwordInput.current.focus()
  }

  onInputChanged = (event: Event) => {
    this.setState({
      password: event.currentTarget.value
    })
  }

  onInputFocused = () => {
    this.setState({
      focusedInputName: 'password'
    })
  }

  onInputBlur = () => {
    this.setState({
      focusedInputName: ''
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    if (inputEvent.keyCode === 13) {
      this.passwordInput.current.blur()
      this.onContinueAuthPress()
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelAuthPress()
    }
  }

  onContinueAuthPress = () => {
    if (this.state.password === '') return

    this.setState({
      onStartAuth: true
    })

    window.addEventListener('message', this.handlePostMessage)
  }

  handlePostMessage = (event: Event) => {
    window.removeEventListener('message', this.handlePostMessage)

    this.props.onCheckProfile()

    if (typeof event.data === 'string' || event.data instanceof String) {
      if (event.data === 'success') {
        store.dispatch(userService.get_profile())
        this.props.closePopupAndShowResult(true, 'mobileauth')
      } else {
        this.props.closePopupAndShowResult(false, event.data)
      }
    } else {
      this.props.closePopupAndShowResult(false, 'unknownerror')
    }

    this.setState({
      onStartAuth: false
    })
  }

  render() {
    const {profile, onCancelAuthPress} = this.props
    const {focusedInputName, password, onStartAuth, showAlertPopup, popupMessage} = this.state
    if (profile === null) return null

    strings.setLanguage(this.props.language)

    let validateInfo = {}
    if (focusedInputName === 'password') {
      validateInfo.border = 'thick'
      validateInfo.borderColor = 'down-blue'
      validateInfo.icon = 'secured-focused'
    } else {
      validateInfo.border = 'normal'
      validateInfo.borderColor = 'gray'
      validateInfo.icon = password !== '' ? 'checked' : 'secured'
    }

    const buttonColor = password !== '' ? 'iris' : 'light-blue'

    return (
      <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="small">
        <Text fontSize="medium" fontWeight="bold" padding="large">{strings.authmobile.title}</Text>

        {
          !onStartAuth &&
          <View paddingVertical="small" paddingHorizontal="large">
            <Text>{strings.authmobile.description}</Text>
            <Spacer size="large" />
            <Input placeholder={strings.authmobile.password}
                   type='password'
                   borderColor={validateInfo.borderColor}
                   border={validateInfo.border}
                   onFocus={this.onInputFocused}
                   onBlur={this.onInputBlur}
                   onChange={this.onInputChanged}
                   onKeyUp={this.onInputKeyUp}
                   name="password"
                   autoComplete="off"
                   icon={validateInfo.icon}
                   innerRef={this.passwordInput}/>
            <Spacer size="large" />

            <View flexHorizontal>
              <Button title={strings.authmobile.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelAuthPress}/>
              <Spacer />
              <Button title={strings.authmobile.continue}
                      flex="fill"
                      color={buttonColor}
                      borderColor={buttonColor}
                      titleColor="white"
                      onPress={this.onContinueAuthPress} />
            </View>
            <Spacer size="small" />
          </View>
        }
        {
          onStartAuth &&
          <View>
            <View overflow="auto">
              <View style={styles.dontshrink}>
                <iframe frameBorder="0"
                        name="mobileauth"
                        width='435px'
                        height='590px'/>
              </View>
            </View>
            <View paddingVertical="medium" paddingHorizontal="large">
              <Button title={strings.authmobile.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelAuthPress}/>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default AuthMobilePage

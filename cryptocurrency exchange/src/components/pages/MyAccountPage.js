// @flow

import * as React from 'react'
import { View, Text, Input, Button, Spacer, Popup } from '../controls'
import type { Profile } from '../../types/Profile'

import InfoPage from './InfoPage'
import AuthPage from './AuthPage'
import LoginHistoryContainer from '../containers/LoginHistoryContainer'
import LocalizedStrings from 'localized-strings'
import { API_URL } from '../../config'
import styles from '../../styles/StyleGuide.css'
import Footer from '../controls/Footer'
import DeleteAccountContainer from '../containers/DeleteAccountContainer'
import type {ValidateInfo} from '../../types/UI'
import type {Color} from '../controls'
import {detect} from 'detect-browser'
const browser = detect()
import {store} from '../../redux';
import {popupService} from '../../redux/services';

const strings = new LocalizedStrings({
  en: {
    myaccount: {
      info: 'My Account',
      auth: 'Authentication',
      loginhistory: 'Login History',
      nicknameRule: 'Please enter 4 to 10 characters. No space or special characters allowed.',
      update: 'Update',
      username: 'Username',
      updatephonenumber: 'Update Phone Number',
      updatephonenumberdesc: 'After verifying the password, the mobile authentication starts.',
      updateusername: 'Update Username',
      updatepassword: 'Update Password',
      cancel: 'Cancel',
      success: 'Success!',
      error: 'Error!',
      continue: 'Continue',
      confirm: 'Confirm',
      done: 'Done',
      password: 'Password',
      usernamechanged: 'Your username has been changed.',
      passwordchanged: 'Your password has been changed.',
      mobileauthsucceed: 'Mobile authentication has been succeeded.',
      currentpassword: 'Current Password',
      newpassword: 'New Password',
      confirmpassword: 'Confirm Password',
      saveagreesucceed: 'Agreements has been changed.',
      iduploadnow: 'Uploading',
      iduploadfail: 'ID Upload Failed.',
      iduploadsucceed: 'ID Upload Completed.',
      deleteaccount: 'Delete Account',
      checkdeleteaccount: 'Do you want to delete your account?',
      otpsent: 'OTP Sent.',
      otpsentdescemail: 'An OTP code has been sent to your email address. Please check your email to see your OTP code.',
      otpsentdescsms: 'An OTP code has been sent to your mobile. Please check your sms to see your OTP code.',
      donedeleteaccounttitle: 'Sorry to see you go.',
      donedeleteaccountdesc1: 'All account information will be deleted and in accordance with the relevant laws, some information is safely destroyed after a certain period of storage.',
      donedeleteaccountdesc2: 'Thank you for using Quanty.',
      twofasucceed: '2FA authentication has been succeeded.',
      mobileauthsafaridisbled: 'Mobile authentication is not currently supported for this browser.\nPlease try other browser or PC environment.',
    }
  },
  ko: {
    myaccount: {
      info: '회원정보',
      auth: '보안인증',
      loginhistory: '로그인 관리',
      nicknameRule: '4~10자(한글, 영문, 숫자 혼용 가능), 특수문자 및 띄어쓰기 불가',
      update: '변경',
      username: '별명',
      updatephonenumber: '휴대전화 변경',
      updatephonenumberdesc: '비밀번호 확인 후 휴대전화 인증을 시작합니다.',
      updateusername: '별명 변경',
      updatepassword: '비밀번호 변경',
      cancel: '취소',
      success: '성공',
      error: '오류',
      continue: '확인',
      confirm: '확인',
      done: '확인',
      password: '비밀번호',
      usernamechanged: '별명이 변경되었습니다.',
      passwordchanged: '비밀번호가 변경되었습니다.',
      mobileauthsucceed: '휴대전화 인증이 성공하였습니다.',
      currentpassword: '현재 비밀번호',
      newpassword: '새 비밀번호',
      confirmpassword: '비밀번호 확인',
      saveagreesucceed: '수신 동의가 변경되었습니다.',
      iduploadnow: '전송중',
      iduploadfail: '전송이 실패하였습니다.',
      iduploadsucceed: '전송이 완료되었습니다.',
      deleteaccount: '회원 탈퇴',
      checkdeleteaccount: '정말 탈퇴 하시겠습니까?',
      otpsent: '인증번호 발송',
      otpsentdescemail: '퀀티 계정 이메일로 인증번호가 발송되었습니다. 이메일을 확인해 주세요.',
      otpsentdescsms: '휴대전화로 인증번호가 발송되었습니다. sms를 확인해 주세요.',
      donedeleteaccounttitle: '회원탈퇴 완료',
      donedeleteaccountdesc1: '회원탈퇴가 완료되었습니다.\n회원탈퇴와 동시에 계정 정보는 모두 삭제됩니다.\n단, 관계법령에 따라 일부 정보는 일정 기간 보관 후 안전하게 파기됩니다.',
      donedeleteaccountdesc2: '그 동안 퀀티를 이용해 주셔서 감사합니다.',
      twofasucceed: '이중 인증 설정이 완료되었습니다.',
      mobileauthsafaridisbled: '해당 브라우저에서는\n휴대전화 본인확인이 지원되지 않습니다.\n다른 브라우저 또는 PC환경에서 시도해 주세요.',
    }
  }
})

type Props = {
  sub: string,
  profile: Profile | null,
  qrCodeImage: string,
  secretKey: string,
  onAuth: boolean,
  idUploadReady: boolean,
  checkIdUploadReady: boolean,
  onSubMenuClick: (string) => void,
  onCancelAuthPress: () => void,
  onStartAuthPress: () => void,
  onConfirmPress: (string) => void,
  onUpdateClick: (type: string, data: Object) => void,
  onRequestQRCode: () => void,
  onCancelPress: () => void,
  onSavePress: () => void,
  onUploadPress: (photoID: Object, photoSelf: Object) => void,
  onRequestPhotoIDValidate: () => void,
  onCheckProfile: () => void,
  onDeleteAccountDone: () => void,
  onRequestWithdrawPress: () => void,
  onSwitchChange: (string) => void,
  onFailDeleteAccount: () => void,
  language: string,
}

type State = {
  showPopup: boolean,
  showAlertPopup: boolean,
  popupType: string,
  popupMessage: string,
}

class MyAccountPage extends React.Component<Props, State> {

  state = {
    showPopup: false,
    showAlertPopup: false,
    popupType: '',
    popupMessage: '',
  }

  popupUpdate: { current: null | HTMLDivElement }
  authPage: { current: null | AuthPage }
  deletePage: { current: null | DeleteAccountContainer }

  constructor(props: Props) {
    super(props)
    this.popupUpdate = React.createRef()
    this.authPage = React.createRef()
    this.deletePage = React.createRef()
  }

  componentDidMount() {
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  handleUpdatePress = (type: string) => {
    switch (type) {
    case 'nickname':
    case 'password':
      this.setState({
        showPopup: true,
        popupType: type
      })
      break

    case 'mobileauth':
      this.checkBrowser(type)
      break

    case 'level':
      this.props.onSubMenuClick('auth')
      break

    default:
      break
    }
  }

  handleAddressPress = () => {
    store.dispatch(popupService.create(
      {
        popupType: 'address',
        callback: this.props.onCheckProfile,
      }
    ))
  }

  checkBrowser = (type: string) => {
    let checkOS: string = 'checked'
    switch (browser && browser.os) {
      case 'iOS':
      case 'Android OS':
      case 'BlackBerry OS':
      case 'Windows Mobile':
      case 'Amazon OS':
        checkOS = 'mobile'
        break
    }

    let checkBrowser: string = 'checked'
    if(browser && browser.name.indexOf('safari') > -1) {
      checkBrowser = 'safari'
    }

    if(checkOS !== 'checked' && checkBrowser !== 'checked') {
      this.setState({
        showPopup: true,
        popupType: 'mobileauthsafaridisbled'
      })
    } else {
      this.setState({
        showPopup: true,
        popupType: type
      })
    }
  }

  handleDeleteAccountPress = () => {
    this.props.onSubMenuClick('deleteaccount')
  }

  onCancelAuthPress = () => {
    this.props.onCancelAuthPress()
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  handlePopupCancelClick = () => {
    const {popupType} = this.state

    if (popupType === 'iduploadSuccess' ||
      popupType === 'mobileauthsuccess' ||
      popupType === '2fasuccess') {
      this.onCancelAuthPress()
      this.props.onCheckProfile()

    } else if (popupType === 'deleteotpsent') {
      if (this.deletePage.current !== null) this.deletePage.current.setFocus()

    } else if (popupType === 'donedeleteaccount') {
      this.props.onDeleteAccountDone()
    }

    this.setState({
      showPopup: false,
      popupType: '',
      popupMessage: '',
    })
  }

  handlePopupUpdateClick = (type: string, data: Object) => {
    if (this.state.showAlertPopup) return
    this.props.onUpdateClick(type, data)
  }

  handlePopupDeleteClick = () => {
    this.setState({
      showPopup: false,
      popupType: '',
      popupMessage: '',
    })

    if (this.deletePage.current !== null) this.deletePage.current.deleteAccount()
  }

  handleAlertPopupClick = () => {
    this.setState({
      showAlertPopup: false,
      popupMessage: ''
    })

    if (this.popupUpdate.current !== null) this.popupUpdate.current.setFocus()
    if (this.authPage.current !== null) this.authPage.current.setFocus()

  }

  handleConfirmPress = (otp: string) => {
    if (this.state.showAlertPopup) return
    this.props.onConfirmPress(otp)
  }

  closePopupAndShowResult = (result: boolean, message: string) => {
    if (result) {
      if (message === 'nickname') {
        this.setState({
          showPopup: true,
          popupType: 'nicknamesuccess'
        })
      } else if (message === 'password') {
        this.setState({
          showPopup: true,
          popupType: 'passwordsuccess'
        })
      } else if (message === 'mobileauth') {
        this.setState({
          showPopup: true,
          popupType: 'mobileauthsuccess'
        })
      } else if (message === 'saveAgreeData') {
        this.setState({
          showPopup: true,
          popupType: 'saveAgreeDatasuccess'
        })
      } else if (message === '2fasuccess') {
        this.setState({
          showPopup: true,
          popupType: '2fasuccess'
        })
      } else {
        this.setState({
          showPopup: true,
          popupType: message
        })
      }
    } else {
      if (message === 'iduploadFail') {
        this.setState({
          showPopup: true,
          popupType: 'iduploadFail'
        })
      } else {
        this.setState({
          showAlertPopup: true,
          popupMessage: message
        })
      }
    }
  }

  render() {
    const {sub, profile, onAuth, qrCodeImage, secretKey, idUploadReady, checkIdUploadReady,
      onStartAuthPress, onRequestQRCode, onCancelPress,
      onSavePress, onUploadPress, onRequestPhotoIDValidate, onCheckProfile, onRequestWithdrawPress,
      onSwitchChange, onFailDeleteAccount} = this.props
    const {showPopup, popupType, showAlertPopup, popupMessage} = this.state
    if (profile === null) return null

    strings.setLanguage(this.props.language)

    const level: number = Number(profile.level.substr(5, 1))

    return (

      <View flex='fill' overflow='auto' padding="small" alignItems='center' phonePaddingHorizontal="none">
        <Spacer size="small" phoneHidden/>
        <View style={styles.dontshrink} flexHorizontal phoneFlexVertical tabletFlexVertical width='100%' maxWidth={976}>

          <View flex="fill">
            <View overflow="auto">
              {
                sub === 'info' &&
                <InfoPage profile={profile}
                          onUpdatePress={this.handleUpdatePress}
                          onDeleteAccountPress={this.handleDeleteAccountPress}
                          onCancelPress={onCancelPress}
                          onSavePress={onSavePress}
                          onSwitchChange={onSwitchChange}
                          handleAddressPress={this.handleAddressPress}
                language={this.props.language}/>
              }
              {
                sub === 'auth' &&
                <AuthPage profile={profile}
                          onStartAuthPress={onStartAuthPress}
                          onCancelAuthPress={this.onCancelAuthPress}
                          onUploadPress={onUploadPress}
                          onConfirmPress={this.handleConfirmPress}
                          onRequestQRCode={onRequestQRCode}
                          onRequestPhotoIDValidate={onRequestPhotoIDValidate}
                          closePopupAndShowResult={this.closePopupAndShowResult}
                          onCheckProfile={onCheckProfile}
                          qrCodeImage={qrCodeImage}
                          secretKey={secretKey}
                          onAuth={onAuth}
                          idUploadReady={idUploadReady}
                          checkIdUploadReady={checkIdUploadReady}
                          handleAddressPress={this.handleAddressPress}
                          ref={this.authPage}
                          language={this.props.language}
                />
              }
              {
                sub === 'loginhistory' &&
                <LoginHistoryContainer language={this.props.language}/>
              }
              {
                sub === 'deleteaccount' &&
                <DeleteAccountContainer profile={profile}
                                        ref={this.deletePage}
                                        onRequestWithdrawPress={onRequestWithdrawPress}
                                        closePopupAndShowResult={this.closePopupAndShowResult}
                                        onFailDeleteAccount={onFailDeleteAccount}
                                        language={this.props.language}/>
              }

            </View>
          </View>
        </View>

        <Footer />
        {
          showPopup && popupType === 'nickname' &&
          <Popup>
            <UpdateNickname onCancelClick={this.handlePopupCancelClick}
                            onUpdateClick={this.handlePopupUpdateClick}
                            language={this.props.language}
                            ref={this.popupUpdate}
            />
          </Popup>
        }
        {
          showPopup && popupType === 'password' &&
          <Popup>
            <UpdatePassword onCancelClick={this.handlePopupCancelClick}
                            onUpdateClick={this.handlePopupUpdateClick}
                            language={this.props.language}
                            ref={this.popupUpdate}
            />
          </Popup>
        }
        {
          showPopup && popupType === 'mobileauth' &&
          <Popup>
            <UpdateMobileAuth onCancelClick={this.handlePopupCancelClick}
                              onUpdateClick={this.handlePopupUpdateClick}
                              onCheckProfile={onCheckProfile}
                              closePopupAndShowResult={this.closePopupAndShowResult}
                              language={this.props.language}
                              ref={this.popupUpdate}
            />
          </Popup>
        }
        {
          showPopup && popupType === 'nicknamesuccess' &&
          <Popup type='success'
                 title={strings.myaccount.success}
                 message={strings.myaccount.usernamechanged}
                 image='images/success.png'
                 buttonTitle={strings.myaccount.done}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'passwordsuccess' &&
          <Popup type='success'
                 title={strings.myaccount.success}
                 message={strings.myaccount.passwordchanged}
                 image='images/success.png'
                 buttonTitle={strings.myaccount.done}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'mobileauthsuccess' &&
          <Popup type='success'
                 title={strings.myaccount.success}
                 message={strings.myaccount.mobileauthsucceed}
                 image='images/success.png'
                 buttonTitle={strings.myaccount.done}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === '2fasuccess' &&
          <Popup type='success'
                 title={strings.myaccount.success}
                 message={strings.myaccount.twofasucceed}
                 image='images/success.png'
                 buttonTitle={strings.myaccount.done}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'saveAgreeDatasuccess' &&
          <Popup type='success'
                 title={strings.myaccount.success}
                 message={strings.myaccount.saveagreesucceed}
                 image='images/success.png'
                 buttonTitle={strings.myaccount.done}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'idupload' &&
          <Popup type='success'
                 title=''
                 message={strings.myaccount.iduploadnow}
                 image=''
                 buttonTitle=''
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'iduploadFail' &&
          <Popup type='fail'
                 title={strings.myaccount.error}
                 message={strings.myaccount.iduploadfail}
                 image='images/monotone.png'
                 buttonTitle={strings.myaccount.continue}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'iduploadSuccess' &&
          <Popup type='success'
                 title={strings.myaccount.success}
                 message={strings.myaccount.iduploadsucceed}
                 image='images/success.png'
                 buttonTitle={strings.myaccount.done}
                 onButtonClick={this.handlePopupCancelClick}/>
        }
        {
          showPopup && popupType === 'deleteotpsent' &&
          <Popup type='success'
                 title={strings.myaccount.otpsent}
                 message={ level === 1 ? strings.myaccount.otpsentdescemail : strings.myaccount.otpsentdescsms}
                 image="/images/otp_sent.png"
                 buttonTitle={strings.myaccount.confirm}
                 onButtonClick={this.handlePopupCancelClick} />
        }
        {
          showPopup && popupType === 'checkdeleteaccount' &&
          <Popup type='success'
                 title={strings.myaccount.deleteaccount}
                 message={strings.myaccount.checkdeleteaccount}
                 buttonTitle={strings.myaccount.continue}
                 onButtonClick={this.handlePopupDeleteClick}
                 cancelTitle={strings.myaccount.cancel}
                 onCancelClick={this.handlePopupCancelClick} />
        }
        {
          showPopup && popupType === 'donedeleteaccount' &&
          <Popup type='success'
                 title={strings.myaccount.donedeleteaccounttitle}
                 message={strings.myaccount.donedeleteaccountdesc1}
                 submessage={strings.myaccount.donedeleteaccountdesc2}
                 buttonTitle={strings.myaccount.confirm}
                 onButtonClick={this.handlePopupCancelClick} />
        }
        {
          showPopup && popupType === 'mobileauthsafaridisbled' &&
          <Popup type='success'
                 message={strings.myaccount.mobileauthsafaridisbled}
                 buttonTitle={strings.myaccount.confirm}
                 onButtonClick={this.handlePopupCancelClick} />
        }
        {
          showAlertPopup &&
          <Popup type='error'
                 title={strings.myaccount.error}
                 message={popupMessage}
                 image='images/monotone.png'
                 buttonTitle={strings.myaccount.continue}
                 onButtonClick={this.handleAlertPopupClick}/>
        }
      </View>
    )
  }
}


type UpdateNicknameProps = {
  onCancelClick: () => void,
  onUpdateClick: (type: string, data: Object) => void,
  language: string
}

type UpdateNicknameState = {
  focusedInputName: string,
  nickname: string
}

class UpdateNickname extends React.Component<UpdateNicknameProps, UpdateNicknameState> {

  constructor(props: UpdateNicknameProps) {
    super(props)
    this.nicknameInput = React.createRef()
  }

  nicknameInput: { current: null | HTMLInputElement }

  componentDidMount() {
    this.setFocus()
  }

  state = {
    focusedInputName: '',
    nickname: ''
  }

  onInputFocused = () => {
    this.setState({
      focusedInputName: 'nickname'
    })
  }

  onInputBlur = () => {
    this.setState({
      focusedInputName: ''
    })
  }

  onInputChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      nickname: event.currentTarget.value
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.onUpdateClick() }, 10);
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelClick()
    }
  }

  onUpdateClick = () => {
    if (this.checkButtonEnable()) {
      this.props.onUpdateClick('nickname', {'nickname': this.state.nickname})
    }
  }

  validateNickname(nickname: string) {
    var special_pattern = /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"₩]/gi
    if (nickname === '') {
      return true
    } else if (nickname.search(/\s/) !== -1 || special_pattern.test(nickname) === true) {
      return false
    } else if (nickname.length < 4 || nickname.length > 10) {
      return false
    } else {
      return true
    }
  }

  setFocus = () => {
    if (this.nicknameInput.current !== null && this.nicknameInput.current.value === '') this.nicknameInput.current.focus()
  }

  checkButtonEnable = () => {
    const {nickname} = this.state
    if (nickname !== '' && this.validateNickname(nickname)) {
      return true
    }

    return false
  }

  render() {

    const {focusedInputName, nickname} = this.state
    const {onCancelClick} = this.props

    let validateInfo: ValidateInfo = {}
    if (focusedInputName === 'nickname') {
      validateInfo.message = strings.myaccount.nicknameRule
      validateInfo.border = 'thick'
      validateInfo.borderColor = 'down-blue'
      validateInfo.backgroundColor = 'white'
      validateInfo.messageColor = 'normal'
    } else {
      validateInfo.message = strings.myaccount.nicknameRule
      validateInfo.border = this.validateNickname(nickname) ? 'normal' : 'thick'
      validateInfo.borderColor = this.validateNickname(nickname) ? 'gray' : 'up-red'
      validateInfo.backgroundColor = this.validateNickname(nickname) ? 'white' : 'error'
      validateInfo.messageColor = this.validateNickname(nickname) ? 'normal' : 'error'
    }

    let buttonColor: Color = this.checkButtonEnable() ? 'iris' : 'light-blue'
    let icon: string = this.checkButtonEnable() ? 'checked' : ''
    strings.setLanguage(this.props.language)

    return (
      <View minWidth={280} maxWidth={420}
            phonePaddingHorizontal="small"
            paddingHorizontal="xlarge"
            paddingVertical="large" overflow="auto">
        <View style={styles.dontshrink}>
          <Text fontSize='medium' fontWeight='bold' textAlign='center'>
            {strings.myaccount.updateusername}
          </Text>
          <Spacer size='large'/>

          <Input placeholder={strings.myaccount.username}
                 message={validateInfo.message}
                 borderColor={validateInfo.borderColor}
                 border={validateInfo.border}
                 backgroundColor={validateInfo.backgroundColor}
                 messageColor={validateInfo.messageColor}
                 onChange={this.onInputChanged}
                 onFocus={this.onInputFocused}
                 onBlur={this.onInputBlur}
                 name="nickname"
                 icon={icon}
                 onKeyUp={this.onInputKeyUp}
                 innerRef={this.nicknameInput}/>

          <Spacer size='xlarge'/>
          <View flexHorizontal>
            <Button title={strings.myaccount.cancel} flex="fill" color="white" onPress={onCancelClick}/>
            <Spacer />
            <Button title={strings.myaccount.update}
                    flex="fill"
                    color={buttonColor}
                    borderColor={buttonColor}
                    titleColor="white"
                    onPress={this.onUpdateClick}/>
          </View>
        </View>
      </View>
    )
  }
}

type UpdateMobileAuthProps = {
  onCancelClick: () => void,
  onUpdateClick: (type: string, data: Object) => void,
  onCheckProfile: () => void,
  closePopupAndShowResult: (result: boolean, type: string) => void,
  language: string
}

type UpdateMobileAuthState = {
  focusedInputName: string,
  password: string,
  onAuth: boolean,
}

type MessageEvent = {
  data: string
}

class UpdateMobileAuth extends React.Component<UpdateMobileAuthProps, UpdateMobileAuthState> {

  state = {
    focusedInputName: '',
    password: '',
    onAuth: false,
  }
  passwordInput: { current: null | HTMLInputElement }

  constructor(props: UpdateMobileAuthProps) {
    super(props)
    this.passwordInput = React.createRef()
  }

  componentDidMount() {
    this.setFocus()
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.onAuth === false && this.state.onAuth === true) {

      var popupForm = document.createElement("form")
      popupForm.target = "mobileauth"
      popupForm.method = "POST"
      popupForm.action = API_URL + "/certification/iencode"

      var popupInput = document.createElement("input")
      popupInput.type = "text"
      popupInput.name = "password"
      popupInput.value = this.state.password
      popupForm.appendChild(popupInput)
      if (document.body !== null) document.body.appendChild(popupForm)

      popupForm.submit()
      if (document.body !== null) document.body.removeChild(popupForm)

    }
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

  onInputChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      password: event.currentTarget.value
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {

    let event: SyntheticEvent<HTMLInputElement> = inputEvent

    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.onUpdateClick() }, 10)
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelClick()
    }
  }

  onUpdateClick = () => {
    if (this.checkButtonEnable()) {
      this.setState({
        onAuth: true
      })

      window.addEventListener('message', this.handlePostMessage)
    }
  }

  handlePostMessage = (event: MessageEvent) => {
    window.removeEventListener('message', this.handlePostMessage)

    if (typeof event.data === 'string' || event.data instanceof String) {
      if (event.data === 'success') {
        this.props.onCheckProfile()
        this.props.closePopupAndShowResult(true, 'mobileauth')
      } else {

        this.props.closePopupAndShowResult(false, event.data)
      }
    } else {
      this.props.closePopupAndShowResult(false, 'unknownerror')
    }

    this.setState({
      onAuth: false
    })
  }

  setFocus = () => {
    if ( this.passwordInput.current !== null && this.passwordInput.current.value === '') this.passwordInput.current.focus()
  }

  checkButtonEnable = () => {
    return this.state.password !== ''
  }

  render() {
    const {onCancelClick} = this.props
    const {focusedInputName, onAuth} = this.state

    let validateInfo: ValidateInfo = {}
    if (focusedInputName === 'password') {
      validateInfo.border = 'thick'
      validateInfo.borderColor = 'down-blue'
      validateInfo.icon = 'secured-focused'
    } else {
      validateInfo.border = 'normal'
      validateInfo.borderColor = 'gray'
      validateInfo.icon = 'secured'
    }

    const buttonColor = this.checkButtonEnable() ? 'iris' : 'light-blue'

    const maxWidth = window.innerWidth < 435 ? window.innerWidth : 435
    const maxHeight = window.innerHeight < 800 ? window.innerHeight * 0.9 : 800

    strings.setLanguage(this.props.language)

    return (
      <View paddingVertical="small"
            paddingHorizontal="none"
            overflow="auto">
        <View style={styles.dontshrink} maxWidth={maxWidth+'px'} maxHeight={maxHeight+'px'}>
          <Text fontSize="medium" fontWeight="bold" padding="large">{strings.myaccount.updatephonenumber}</Text>
          {
            !onAuth &&
            <View paddingHorizontal="large"
                  phonePaddingHorizontal="small"
                  phonePaddingVertical="small" style={styles.dontshrink}>
              <Text>{strings.myaccount.updatephonenumberdesc}</Text>
              <Spacer size="large" />
              <Input placeholder={strings.myaccount.password}
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
                <Button title={strings.myaccount.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelClick}/>
                <Spacer />
                <Button title={strings.myaccount.continue}
                        flex="fill"
                        color={buttonColor}
                        borderColor={buttonColor}
                        titleColor="white"
                        onPress={this.onUpdateClick}/>
              </View>
              <Spacer size="large" />
            </View>
          }
          { onAuth &&
            <View style={styles.dontshrink}>
              <View overflow="auto">
                <View style={styles.dontshrink}>
                  <iframe frameBorder="0"
                          name="mobileauth"
                          width='435px'
                          height='590px'/>
                </View>
              </View>
              <View paddingVertical="medium" paddingHorizontal="large">
                <Button title={strings.myaccount.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelClick}/>
              </View>
            </View>
          }
        </View>
      </View>
    )
  }
}

type UpdatePasswordProps = {
  onCancelClick: () => void,
  onUpdateClick: (type: string, data: Object) => void,
  language: string
}

type UpdatePasswordState = {
  focusedInputName: string,
  current: string,
  password: string,
  confirmpassword: string,
  pwdchk_char: boolean,
  pwdchk_num: boolean,
  pwdchk_special: boolean,
  pwdchk_length: boolean,
  showPasswordValidate: boolean
}

class UpdatePassword extends React.Component<UpdatePasswordProps, UpdatePasswordState> {

  constructor(props) {
    super(props)
    this.currentInput = React.createRef()
    this.passwordInput = React.createRef()
    this.confirmPasswordInput = React.createRef()
  }

  currentInput: { current: null | HTMLInputElement }
  passwordInput: { current: null | HTMLInputElement }
  confirmPasswordInput: { current: null | HTMLInputElement }

  componentDidMount() {
    this.setFocus()
  }

  setFocus = () => {
    const { current, password, confirmpassword } = this.state

    if (current === '' && this.currentInput !== null && this.currentInput.current !== null) {
      this.currentInput.current.focus()
    } else if (password === '' && this.passwordInput !== null && this.passwordInput.current !== null) {
      this.passwordInput.current.focus()
    } else if (confirmpassword === '' && this.confirmPasswordInput !== null && this.confirmPasswordInput.current !== null) {
      this.confirmPasswordInput.current.focus()
    }
  }

  state = {
    focusedInputName: '',
    current: '',
    password: '',
    confirmpassword: '',
    pwdchk_char: false,
    pwdchk_num: false,
    pwdchk_special: false,
    pwdchk_length: false,
    showPasswordValidate: false
  }

  onInputChanged = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const inputName = event.currentTarget.name
    const inputValue = event.currentTarget.value

    if (inputName === 'current') {
      this.setState({
        current: inputValue
      })
    } else if (inputName === 'password') {
      this.validatePassword(inputValue)
      this.setState({
        showPasswordValidate: inputValue !== ''
      })
    } else if (inputName === 'confirmpassword') {
      this.setState({
        confirmpassword: inputValue
      })
    }
  }

  onInputBlur = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    const inputName = event.currentTarget.name
    if (inputName === 'password') {
      this.setState({
        password: inputValue,
        focusedInputName: ''
      })
    } else {
      this.setState({
        focusedInputName: ''
      })
    }
  }

  onInputFocused = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      focusedInputName: event.currentTarget.name
    })
  }

  onInputKeyUp = (inputEvent: SyntheticKeyboardEvent<HTMLInputElement> ) => {
    let event: SyntheticEvent<HTMLInputElement> = inputEvent
    if (inputEvent.keyCode === 13) {
      event.currentTarget.blur()
      setTimeout(() => { this.onUpdateClick() }, 10);
    } else if (inputEvent.keyCode === 27) {
      this.props.onCancelClick()
    }
  }

  onUpdateClick = () => {
    if (!this.readyContinue()) return
    const { current, password, confirmpassword } = this.state

    let updateData = {
      'current': current,
      'password': password,
      'confirmpassword': confirmpassword
    }

    this.props.onUpdateClick('password', updateData)
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

  readyContinue = () => {
    const { current, password, confirmpassword } = this.state
    return current !== '' && password !== '' &&
      password === confirmpassword && confirmpassword !== '' && this.verifyPassword(password)
  }

  render() {
    const {focusedInputName, current, password, confirmpassword, showPasswordValidate,
      pwdchk_char, pwdchk_length, pwdchk_num, pwdchk_special} = this.state

    const {onCancelClick} = this.props

    let currentValidateInfo: ValidateInfo = {
      message: ' '
    }
    if (focusedInputName === 'current') {
      currentValidateInfo.border = 'thick'
      currentValidateInfo.borderColor = 'down-blue'
      currentValidateInfo.backgroundColor = 'white'
      currentValidateInfo.messageColor = 'normal'
      currentValidateInfo.icon = 'secured-focused'
    } else {
      currentValidateInfo.border = 'normal'
      currentValidateInfo.borderColor = 'gray'
      currentValidateInfo.backgroundColor = 'white'
      currentValidateInfo.messageColor = 'normal'
      currentValidateInfo.icon = current !== '' ? 'checked' : 'secured'
    }

    let passwordValidateInfo: ValidateInfo = {
      message: ' '
    }
    if (focusedInputName === 'password') {
      passwordValidateInfo.border = 'thick'
      passwordValidateInfo.borderColor = 'down-blue'
      passwordValidateInfo.backgroundColor = 'white'
      passwordValidateInfo.messageColor = 'normal'
      passwordValidateInfo.icon = 'secured-focused'
    } else {
      passwordValidateInfo.border = this.verifyPassword(password) ? 'normal' : 'thick'
      passwordValidateInfo.borderColor = this.verifyPassword(password) ? 'gray' : 'up-red'
      passwordValidateInfo.backgroundColor = this.verifyPassword(password) ? 'white' : 'error'
      passwordValidateInfo.messageColor = this.verifyPassword(password) ? 'normal' : 'error'
      passwordValidateInfo.icon = this.verifyPassword(password) && password !== '' ? 'checked' : 'secured'
    }

    let passwordConfirmValidateInfo: ValidateInfo = {
      message: ' '
    }
    if (focusedInputName === 'confirmpassword') {
      passwordConfirmValidateInfo.border = 'thick'
      passwordConfirmValidateInfo.borderColor = 'down-blue'
      passwordConfirmValidateInfo.backgroundColor = 'white'
      passwordConfirmValidateInfo.messageColor = 'normal'
      passwordConfirmValidateInfo.icon = 'secured-focused'
    } else {
      passwordConfirmValidateInfo.border = this.verifyPasswordConfirm(confirmpassword) ? 'normal' : 'thick'
      passwordConfirmValidateInfo.borderColor = this.verifyPasswordConfirm(confirmpassword) ? 'gray' : 'up-red'
      passwordConfirmValidateInfo.backgroundColor = this.verifyPasswordConfirm(confirmpassword) ? 'white' : 'error'
      passwordConfirmValidateInfo.messageColor = this.verifyPasswordConfirm(confirmpassword) ? 'normal' : 'error'
      passwordConfirmValidateInfo.icon = this.verifyPasswordConfirm(confirmpassword) && confirmpassword !== '' ? 'checked' : 'secured'
    }

    const buttonColor: Color = this.readyContinue() ? 'iris' : 'light-blue'
    strings.setLanguage(this.props.language)

    return (
      <View minWidth={280} maxWidth={420}
            phonePaddingHorizontal="small"
            paddingHorizontal="xlarge"
            paddingVertical="large"
            overflow="auto"
            >
        <View style={styles.dontshrink}>
          <Text fontSize='medium' fontWeight='bold' textAlign='center'>
          {strings.myaccount.updatepassword}
        </Text>
          <Spacer size='large'/>
          <Input placeholder={strings.myaccount.currentpassword}
                 type="password"
                 message={currentValidateInfo.message}
                 borderColor={currentValidateInfo.borderColor}
                 border={currentValidateInfo.border}
                 backgroundColor={currentValidateInfo.backgroundColor}
                 messageColor={currentValidateInfo.messageColor}
                 onChange={this.onInputChanged}
                 onFocus={this.onInputFocused}
                 onBlur={this.onInputBlur}
                 onKeyUp={this.onInputKeyUp}
                 name="current"
                 icon={currentValidateInfo.icon}
                 innerRef={this.currentInput}/>
          <Spacer size="small" />

          <Input placeholder={strings.myaccount.newpassword}
                 type="password"
                 message={passwordValidateInfo.message}
                 borderColor={passwordValidateInfo.borderColor}
                 border={passwordValidateInfo.border}
                 backgroundColor={passwordValidateInfo.backgroundColor}
                 messageColor={passwordValidateInfo.messageColor}
                 onChange={this.onInputChanged}
                 onFocus={this.onInputFocused}
                 onBlur={this.onInputBlur}
                 onKeyUp={this.onInputKeyUp}
                 name="password"
                 autoComplete="off"
                 icon={passwordValidateInfo.icon}
                 innerRef={this.passwordInput}/>

          {!showPasswordValidate &&
          <View width={304}>
            <Spacer size='small' />
          </View>
          }

          {showPasswordValidate &&
          <View width={304}>
            <View flexHorizontal paddingHorizontal="xsmall">
              <View width="4%" backgroundColor={pwdchk_char ? "down-blue" : "up-red"} borderRadius="small"/>
              <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">Letters</Text>
              <View width="4%" backgroundColor={pwdchk_num ? "down-blue" : "up-red"} borderRadius="small"/>
              <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">Numbers</Text>
            </View>
            <Spacer size="small" />
            <View flexHorizontal paddingHorizontal="xsmall">
              <View width="4%" backgroundColor={pwdchk_special ? "down-blue" : "up-red"} borderRadius="small"/>
              <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">Special Character</Text>
              <View width="4%" backgroundColor={pwdchk_length ? "down-blue" : "up-red"} borderRadius="small"/>
              <Text width="46%" fontSize="xsmall" textColor="gray" paddingHorizontal="tiny">8 to 100 Characters</Text>
            </View>
          </View>
          }
          {showPasswordValidate && <Spacer size="large"/>}
          <Input placeholder={strings.myaccount.confirmpassword}
                 type="password"
                 message={passwordConfirmValidateInfo.message}
                 borderColor={passwordConfirmValidateInfo.borderColor}
                 border={passwordConfirmValidateInfo.border}
                 backgroundColor={passwordConfirmValidateInfo.backgroundColor}
                 messageColor={passwordConfirmValidateInfo.messageColor}
                 onChange={this.onInputChanged}
                 onFocus={this.onInputFocused}
                 onBlur={this.onInputBlur}
                 onKeyUp={this.onInputKeyUp}
                 name="confirmpassword"
                 autoComplete="off"
                 icon={passwordConfirmValidateInfo.icon}
                 innerRef={this.confirmPasswordInput}
          />
          <Spacer size='xlarge'/>
          <View flexHorizontal>
            <Button title={strings.myaccount.cancel} flex="fill" color="white" onPress={onCancelClick}/>
            <Spacer />
            <Button title={strings.myaccount.update}
                    flex="fill"
                    color={buttonColor}
                    borderColor={buttonColor}
                    titleColor="white"
                    onPress={this.onUpdateClick}/>
          </View>
        </View>
      </View>
    )
  }
}

export default MyAccountPage

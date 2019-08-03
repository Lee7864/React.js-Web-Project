// @flow

import * as React from 'react'
import MyAccountPage from '../pages/MyAccountPage'
import type { Profile } from '../../types/Profile'
import update from 'react-addons-update'
import { store } from '../../redux'
import { userService } from '../../redux/services'
import { API_URL } from '../../config'
import {connect} from 'react-redux'

type Props = {
  match: Object,
  history: Object,
  language: string,
}

type State = {
  subPage: string,
  onFetch: boolean,
  profile: Profile | null,
  qrCodeImage: string,
  secretKey: string,
  onAuth: boolean,
  idUploadReady: boolean,
  checkIdUploadReady: boolean
}

class MyAccountContainer extends React.Component<Props, State> {

  state = {
    subPage: '',
    onFetch: false,
    profile: null,
    qrCodeImage: '',
    secretKey: '',
    onAuth: false,
    idUploadReady: false,
    checkIdUploadReady: false
  }

  componentDidMount() {
    this.checkProfile(location.pathname)
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.match.params.sub !== prevState.subPage) {
      return {
        subPage: nextProps.match.params.sub
      }
    }
    return null
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.profile !== null && this.state.profile !== null &&
      this.state.profile.level !== prevState.profile.level) {
      //store.dispatch(userService.get_profile())
    }
  }

  handleCancelAuthPress = () => {
    this.setState({
      onAuth: false
    })
  }

  handleStartAuthPress = () => {
    this.setState({
      onAuth: true
    })
  }

  handleSubMenuClick = (menu: string) => {
    if ( menu === this.props.match.params.sub ) return
    this.setState({
      onAuth: false
    })
    this.props.history.push('/myaccount/' + menu)
  }

  handleConfirmPress = (otp: string) => {
    if ( this.state.onFetch ) return
    this.setState({onFetch: true})

    fetch(API_URL + '/otp/qrcode/verify', {
      method: 'post',
      body: JSON.stringify({"digit": otp}),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            onFetch: false
          })

          this.authSuccess()
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            this.setState({
              onFetch: false
            })

            switch(status) {
            default:
              const errorReason = json.error.reasons
              this.refs.myaccountpage.closePopupAndShowResult(false, errorReason[0].message)
              break;
            }
          })
        }
      })
      .catch(error => {
        console.log(error)

        this.setState({
          onFetch: false
        })
      })
  }


  handleUpdateClick = (type: string, data: Object) => {
    if (type === 'nickname') {
      if (!this.validateNickname(data.nickname)) {
        this.refs.myaccountpage.closePopupAndShowResult(false, '별명은 4~10자의 한/영문자, 숫자만 가능합니다.')
        return
      }

      fetch(API_URL + '/user/nickname/modify?newNickname=' + data.nickname, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
        .then(response => {
          if (response.ok) {
            this.refs.myaccountpage.closePopupAndShowResult(true, 'nickname')
            this.checkProfile(location.pathname)
            store.dispatch(userService.get_profile())
          } else {
            Promise.all([response.status, response.json()]).then(([status, json]) => {
              switch(status) {
              default:
                const errorReason = json.error.reasons
                this.refs.myaccountpage.closePopupAndShowResult(false, errorReason[0].message)
                break;
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else if (type === 'password') {
      let body = {
        "oldPassword": data.current,
        "password": data.password,
        "passwordConfirmation": data.confirmpassword,
      }

      fetch(API_URL + '/user/pwd/modify', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
        .then(response => {
          if (response.ok) {
            this.refs.myaccountpage.closePopupAndShowResult(true, 'password')
            this.checkProfile(location.pathname)
          } else {
            Promise.all([response.status, response.json()]).then(([status, json]) => {
              switch(status) {
              default:
                const errorReason = json.error.reasons
                this.refs.myaccountpage.closePopupAndShowResult(false, errorReason[0].message)
                break;
              }
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  authSuccess = () => {
    this.refs.myaccountpage.closePopupAndShowResult(true, '2fasuccess')

    //this.checkProfile(location.pathname)

    // 인증단계 변화시 redux로 LogInHandler에도 알려준다. 
    store.dispatch(userService.get_profile());
  }

  checkProfile = (path: string) => {
    if ( this.state.onFetch ) return
    this.setState({ onFetch: true })

    fetch(API_URL + '/me', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {

          this.setState({
            onFetch: false
          })

          switch(status) {
          case 200:
            this.setProfile(json)
            break;

          case 401:
          default:
            this.props.history.push('/login#callback='+path)
            break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  setProfile = (data:Profile | null) => {
    this.setState({
      profile: data
    })
  }

  setQRData = (data:Object) => {
    this.setState({
      qrCodeImage: data.qrCodeImage,
      secretKey: data.secretKey
    })
  }

  validateNickname(nickname: string) {
    var special_pattern = /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"₩]/gi
    if (nickname.search(/\s/) !== -1 || special_pattern.test(nickname) === true) {
      return false
    } else if (nickname.length < 4 || nickname.length > 10) {
      return false
    } else {
      return true
    }
  }

  handleSwitchChange = (type: string) => {
    let agreeEmail = this.state.profile.agreeEmail
    let agreeSms = this.state.profile.agreeSms
    switch (type) {
    case 'email':
      agreeEmail = !agreeEmail
      break
    case 'sms':
      agreeSms = !agreeSms
      break
    default:
      break
    }

    fetch(API_URL + '/user/agree/modify?agreeEmail=' + agreeEmail + '&agreeSms=' + agreeSms, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          let dataChangeObject = {}

          switch (type) {
          case 'email':
            dataChangeObject.agreeEmail = {$set: agreeEmail}
            break;

          case 'sms':
            dataChangeObject.agreeSms = {$set: agreeSms}
            break;

          default:
            break;
          }

          this.setState({
            profile: update(this.state.profile, dataChangeObject)
          })

          this.refs.myaccountpage.closePopupAndShowResult(true, 'saveAgreeData')
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            const errorReason = json.error.reasons
            this.refs.myaccountpage.closePopupAndShowResult(false, errorReason[0].message)
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleRequestQRCode = () => {
    const level: number = Number(this.state.profile.level.substr(5, 1))
    if (level < 2) return

    fetch(API_URL + '/otp/qrcode/create', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
          case 200:
            this.setQRData(json)
            break;

          default:
            const errorReason = json.error.reasons
            this.refs.myaccountpage.closePopupAndShowResult(false, errorReason[0].message)
            break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleCancelPress = () => {
    this.checkProfile(location.pathname)
  }

  handleSavePress = () => {
    fetch(API_URL + '/user/agree/modify?agreeEmail=' + this.state.profile.agreeEmail + '&agreeSms=' + this.state.profile.agreeSms, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.refs.myaccountpage.closePopupAndShowResult(true, 'saveAgreeData')
        } else {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            const errorReason = json.error.reasons
            this.refs.myaccountpage.closePopupAndShowResult(false, errorReason[0].message)
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleUploadPress = (photoID:Object, photoSelf:Object) => {
    let formData = new FormData()
    formData.append('photoID', photoID);
    formData.append('photoSelf', photoSelf);

    this.refs.myaccountpage.closePopupAndShowResult(true, 'idupload')

    fetch(API_URL + '/user/upload_photo_id', {
      method: 'post',
      body: formData,
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            idUploadReady: false
          })
          this.refs.myaccountpage.closePopupAndShowResult(true, 'iduploadSuccess')
        } else {
          this.refs.myaccountpage.closePopupAndShowResult(false, 'iduploadFail')
        }
      })
      .catch(error => {
        this.refs.myaccountpage.closePopupAndShowResult(false, 'iduploadFail')
      })
  }

  handleRequestPhotoIDValidate = () => {
    fetch(API_URL + '/user/upload_photo_id/validate', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          this.setState({
            checkIdUploadReady: true,
            idUploadReady: true
          })
        } else {
          this.setState({
            checkIdUploadReady: true,
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleCheckProfile = () => {
    this.checkProfile(location.pathname)
  }

  handleDeleteAccountDone = () => {
    this.props.history.push('/')
  }

  handleRequestWithdrawPress = () => {
    this.props.history.push('/balances')
  }

  handleFailDeleteAccount = () => {
    this.handleSubMenuClick('info')
  }

  render() {

    const {subPage, onAuth, profile, qrCodeImage, secretKey, idUploadReady, checkIdUploadReady} = this.state
    if (profile === null) return null

    return (
      <MyAccountPage sub={subPage}
                     profile={profile}
                     qrCodeImage={qrCodeImage}
                     secretKey={secretKey}
                     onAuth={onAuth}
                     idUploadReady={idUploadReady}
                     checkIdUploadReady={checkIdUploadReady}

                     onCancelAuthPress={this.handleCancelAuthPress}
                     onStartAuthPress={this.handleStartAuthPress}
                     onSubMenuClick={this.handleSubMenuClick}
                     onConfirmPress={this.handleConfirmPress}
                     onCancelPress={this.handleCancelPress}
                     onSavePress={this.handleSavePress}
                     onUpdateClick={this.handleUpdateClick}
                     onRequestQRCode={this.handleRequestQRCode}
                     onUploadPress={this.handleUploadPress}
                     onRequestPhotoIDValidate={this.handleRequestPhotoIDValidate}
                     onCheckProfile={this.handleCheckProfile}
                     onDeleteAccountDone={this.handleDeleteAccountDone}
                     onRequestWithdrawPress={this.handleRequestWithdrawPress}
                     onSwitchChange={this.handleSwitchChange}
                     onFailDeleteAccount={this.handleFailDeleteAccount}
                     ref='myaccountpage'
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


export default connect(mapStateToProps)(MyAccountContainer)

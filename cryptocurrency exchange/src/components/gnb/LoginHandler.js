// @flow

import * as React from 'react'
import { View, Text, Button, Spacer } from '../controls'
import type {Profile} from '../../types/Profile'
import { connect } from 'react-redux'
import { userService, popupService } from '../../redux/services'
import LocalizedStrings from 'localized-strings'
import profileStyle from './Profile.css'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import { history } from '../../redux'
import PageVisibility from 'react-page-visibility'
import styles from '../controls/Navigation.css'
import Image from '../controls/Image'


const strings = new LocalizedStrings({
  en: {
    login: {
      link_login: 'Login',
      link_signup: 'Sign Up',
      link_logout: 'Logout',
      link_myaccount: 'My Account',
      link_authentication: 'Authentication',
      link_loginhistory: 'Login History',
      link_bankaccount: 'Bank Account',
    }
  },
  ko: {
    login: {
      link_login: '로그인',
      link_signup: '회원가입',
      link_logout: '로그아웃',
      link_myaccount: '회원정보',
      link_authentication: '보안인증',
      link_loginhistory: '로그인 관리',
      link_bankaccount: '입출금 계좌',
    }
  }
})

const linkProps = {
  padding: 'small'
}

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context)

  }

  handleClick = (e:Event) => {
    e.preventDefault()
    this.props.onClick(e)
  }

  render() {
    return (
      <a href='' onClick={this.handleClick}>
        <View flexHorizontal backgroundColor="white">
            <img src='images/profile.svg' className='Profile_img'/>
            <View width='100%' flexHorizontal >
              <Text className={profileStyle.nickname}>{this.props.profile.nickname}</Text>
              <img src='images/chevron-down.svg' className='Profile_img Profile_chevron' width={16} />
            </View>
            {this.props.children}
        </View>   
      </a>
    )
  }
}

type Props = {
  onShowPopup: (type: string) => void,
  profile: Profile,
  language: string,
  onClickMenu?: () => void
}

class LoginHandler extends React.PureComponent<Props> {

  handleVisibilityChange = (isVisible: boolean) => {
    // from background to foreground 
    if (isVisible) {
      this.onTick()
      this.props.dispatch(userService.get_profile())
      this.startTimer()
    } else {
      this.stopTimer()
    }
  }  

  componentDidMount() {
    this.props.dispatch(userService.get_profile())
    this.startTimer()
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  onSelect = (key: string) => {
    if (this.props.onClickMenu !== undefined) this.props.onClickMenu()

    if (key === '1') {
      history.push('/myaccount/info')
    } else if (key === '2') {
      history.push('/myaccount/auth')
    } else if (key === '3') {
      history.push('/myaccount/loginhistory')
    } else if (key === '4') {
      history.push('/logout')
    } else if (key === '5') {
      this.checkLevel()
    }
  }

  checkLevel = () => {
    const level: number = Number(this.props.profile.level.substr(5, 1))
    if (level === 1) {
      this.props.onShowPopup('belowlevel')
    } else {
      history.push('/banking')
    }
  }

  onTick = () => {
    const quantyProfile = localStorage.getItem('quanty.profile')

    const displayEmail = this.props.profile ? this.props.profile.email : ''
    var   localStorageEmail = quantyProfile ? JSON.parse(quantyProfile).email : ''

    if (displayEmail !== localStorageEmail) {
      // page reloading
      location.reload()
    }
  }

  startTimer() {
    if (this.timer === null) {
      this.timer = setInterval(this.onTick, 60000) // 60sec
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null  
    }
  }

  linkto = (type: string) => {
    history.push(type)
  }

  handleSignupClick = () => {
    this.linkto('/signup')
  }

  handleLoginClick = () => {
    this.linkto('/login')
  }

  render() {
    strings.setLanguage(this.props.language)


    const { profile } = this.props
    if (profile === null || profile === undefined) {
      return (
        <PageVisibility onChange={this.handleVisibilityChange}>
          <React.Fragment>
            <View flexHorizontal alignItems='center'>
              <View width={62} height={24} style={styles.mobile_sign_up} alignItems='center' justifyContent='center' onClick={this.handleSignupClick}>
                <Text textColor='white' fontSize='xsmall' cursor='pointer'>{strings.login.link_signup}</Text>
              </View>
              <Spacer size="small" />
              <View flexHorizontal alignItems='center' cursor='pointer' onClick={this.handleLoginClick} phoneHidden>
                <Image source='/images/login.svg' width={24} cursor='pointer'/>
                <Spacer size="tiny"/>
                <Text textColor='dark-blue-grey' fontSize='small' cursor='pointer'>{strings.login.link_login}</Text>
              </View>
            </View>
          </React.Fragment>
        </PageVisibility>
      )
    }

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <View flexHorizontal backgroundColor="white">
          <Dropdown id='myprofile' pullRight onSelect={this.onSelect}>
            <CustomToggle bsRole="toggle" profile={profile}></CustomToggle>
            <Dropdown.Menu id='myprofile_dropdown'>
              <MenuItem eventKey="1"><View flexHorizontal width='100%'><div className={profileStyle.icon_myaccount} />{strings.login.link_myaccount}</View></MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="5"><View flexHorizontal width='100%'><div className={profileStyle.icon_banking} />{strings.login.link_bankaccount}</View></MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="2"><View flexHorizontal width='100%'><div className={profileStyle.icon_authentication} />{strings.login.link_authentication}</View></MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="3"><View flexHorizontal width='100%'><div className={profileStyle.icon_loginhistory} />{strings.login.link_loginhistory}</View></MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="4"><View flexHorizontal width='100%'><div className={profileStyle.icon_logout} />{strings.login.link_logout}</View></MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </View>
      </PageVisibility>       
    )
  }
}

function mapStateToProps(state) {
  const { login } = state
  const { profile } = login
  return {
    profile,
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(LoginHandler)


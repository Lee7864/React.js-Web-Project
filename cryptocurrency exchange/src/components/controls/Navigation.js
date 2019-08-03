// @flow

import * as React from 'react'
import {Divider, Image, Spacer, Text, View} from './index'
import styles from './Navigation.css'
import { history } from '../../redux'
import {matchPath} from 'react-router'
import connect from 'react-redux/es/connect/connect'
import LocalizedStrings from 'localized-strings'
import NotificationHandler from '../gnb/NotificationHandler'
import LanguageSelector from '../gnb/LanguageSelector'
import LoginHandler from '../gnb/LoginHandler'
import type {Profile} from '../../types/Profile'

const strings = new LocalizedStrings({
  en: {
    titles: {
      trade: 'Trade',
      balances: 'Balances',
      support: 'Support',
      plzLogin: 'Login, Please.',
      link_logout: 'Logout',
      link_myaccount: 'My Account',
      link_authentication: 'Authentication',
      link_loginhistory: 'Login History',
      link_bankaccount: 'Bank Account'
    },
    menu: {
      signup: 'Sign Up',
      login: 'Login'
    }
  },
  ko: {
    titles: {
      trade: '트레이딩',
      balances: '자산',
      support: '고객센터',
      plzLogin: '로그인해주세요.',
      link_logout: '로그아웃',
      link_myaccount: '회원정보',
      link_authentication: '보안인증',
      link_loginhistory: '로그인 관리',
      link_bankaccount: '입출금 계좌'
    },
    menu: {
      signup: '회원가입',
      login: '로그인'
    }
  }
})

type MenuProps = {
  title: string,
  onPress: () => void,
  selected: boolean,
  image?: string
}

class Menu extends React.PureComponent<MenuProps> {
  handleClick = () => {
    const { onPress } = this.props
    onPress()
  }

  render() {
    const { title, selected, image } = this.props
    const iconImage = image !== undefined ? '/images/nav/icon_' + image + '.svg' : ''
    return (
      <View width={150} height='100%' justifyContent='center' alignItems='center' style={[styles.button, styles.dontshrink]} onClick={this.handleClick}>
        <View flexHorizontal>
          <Image source={iconImage} height={12}/>
          <Spacer size='tiny'/>
          <Text fontSizeNum={16} textColor={ selected ? 'iris' : 'dark-gray' } fontWeight='semibold' letterSpacing='m1'>{title}</Text>
        </View>

        {selected &&
        <View position='absolute' width='100%' height='100%' justifyContent='flex-end'>
          <View width='100%' height={3} style={styles.dontshrink} backgroundColor='iris'/>
        </View>
        }
      </View>
    )
  }
}

type Props = {
  path: string,
  onShowPopup: (type: string) => void,
  hidden: boolean,
  language: string,
  profile: Profile
}

class Navigation extends React.PureComponent<Props> {

  clickHome = () => {
    history.push('/')
  }

  handleTradeClick = () => {
    history.push('/exchange')
  }

  handleBalancesClick = () => {
    history.push('/balances')
  }

  handleSupportClick = () => {
    history.push('/support')
  }

  handleLoginClick = () => {
    history.push('/login')
  }

  handleSignupClick = () => {
    history.push('/signup')
  }

  render() {
    const {path, onShowPopup, hidden, language, profile} = this.props

    strings.setLanguage(language)

    const exchangeMatch = matchPath(path, {
      path: '/exchange',
      exact: false
    })

    const balanceMatch = matchPath(path, {
      path: '/balances',
      exact: false
    })

    const supportMatch = matchPath(path, {
      path: '/support',
      exact: false
    })

    return (
      <View hidden={hidden} zIndex={1} backgroundColor='white' minWidth={exchangeMatch ? 1552 : 1280}>
        <View width='100%' height={60} boxLightShadow style={{top: 0}}>
          <View flex='fill' flexHorizontal alignItems='center' justifyContent='space-between' paddingHorizontalNum={20}>

            <View onClick={this.clickHome} cursor='pointer' width={200} style={styles.dontshrink}>
              <Image source="/images/logo-quanty-a.svg" width={83} height={25}/>
              <View hidden>
                <LanguageSelector/>
              </View>
            </View>

            <View flexHorizontal height='100%'>
              <Menu title={strings.titles.trade} image='trade' onPress={this.handleTradeClick} selected={exchangeMatch}/>

              <Menu title={strings.titles.balances} image='balances' onPress={this.handleBalancesClick} selected={balanceMatch}/>

              <Menu title={strings.titles.support} image='support' onPress={this.handleSupportClick} selected={supportMatch}/>
            </View>

            {!profile &&
            <View flexHorizontal width={200} style={styles.dontshrink}>
              <View width={100} style={styles.dontshrink} alignItems='center' onClick={this.handleLoginClick}>
                <Text textColor='iris' fontWeight='semibold' cursor='pointer'>{strings.menu.login}</Text>
              </View>
              <View width={100} style={styles.dontshrink} alignItems='center' onClick={this.handleSignupClick}>
                <Text textColor='iris' fontWeight='semibold' cursor='pointer'>{strings.menu.signup}</Text>
              </View>
            </View>
            }

            {profile &&
            <View flexHorizontal justifyContent='flex-end' alignItems='center' width={200} style={styles.dontshrink}>
              <NotificationHandler/>
              <LoginHandler onShowPopup={onShowPopup}/>
            </View>
            }

          </View>

          <Divider/>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language,
    profile: state.login.profile
  }
}

export default connect(mapStateToProps)(Navigation)

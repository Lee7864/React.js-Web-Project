// @flow

import * as React from 'react'
import {Divider, Image, Text, View} from './index'
import styles from './Navigation.css'
import { history } from '../../redux'
import {matchPath} from 'react-router'
import connect from 'react-redux/es/connect/connect'
import LocalizedStrings from 'localized-strings'
import LanguageSelector from '../gnb/LanguageSelector'
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

type BurgerButtonProps = {
  onPress: () => void
}

const BurgerButton = ({onPress}: BurgerButtonProps) => {
  return (
    <View>
      <View width={20} height={15} onClick={onPress}>
        <View flex='fill' height={3} backgroundColor='iris'/>
        <View flex='fill' backgroundColor='white'/>
        <View flex='fill' height={3} backgroundColor='iris'/>
        <View flex='fill' backgroundColor='white'/>
        <View flex='fill' height={3} backgroundColor='iris'/>
      </View>
    </View>
  )
}

type CloseButtonProps = {
  onPress: () => void
}

const CloseButton = ({onPress}: CloseButtonProps) => {
  return (
    <View onClick={onPress}>
      <Image source='/images/cancel.svg' width={18} height={17} />
    </View>
  )
}

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
      <View height={55} justifyContent='center' onClick={this.handleClick}>
        <View flexHorizontal>
          <View width={20} style={styles.dontshrink}/>

          <View width={25} style={styles.dontshrink}>
            <Image source={iconImage} height={12} />
          </View>

          <Text fontSizeNum={15} textColor={ selected ? 'iris' : 'dark-gray' } letterSpacing='m1'>{title}</Text>
        </View>
      </View>
    )
  }
}

type Props = {
  path: string,
  showMobileMenu: () => void,
  onShowPopup: (type: string) => void,
  hidden: boolean,
  language: string,
  mobileMenuVisible: boolean,
  hideMobileMenu: () => void,
  profile: Profile
}

class MobileNavigation extends React.PureComponent<Props> {

  clickHome = () => {
    history.push('/')
    this.props.hideMobileMenu()
  }

  handleTradeClick = () => {
    history.push('/exchange')
    this.props.hideMobileMenu()
  }

  handleBalancesClick = () => {
    history.push('/balances')
    this.props.hideMobileMenu()
  }

  handleSupportClick = () => {
    history.push('/support')
    this.props.hideMobileMenu()
  }

  handleLoginClick = () => {
    history.push('/login')
    this.props.hideMobileMenu()
  }

  handleMyAccountClick = () => {
    history.push('/myaccount/info')
    this.props.hideMobileMenu()
  }

  handleBankAccountClick = () => {
    const level: number = Number(this.props.profile.level.substr(5, 1))
    if (level === 1) {
      this.props.onShowPopup('belowlevel')
    } else {
      history.push('/banking')
    }
    this.props.hideMobileMenu()
  }

  handleAuthClick = () => {
    history.push('/myaccount/auth')
    this.props.hideMobileMenu()
  }

  handleLoginHistoryClick = () => {
    history.push('/myaccount/loginhistory')
    this.props.hideMobileMenu()
  }

  handleLogoutClick = () => {
    history.push('/logout')
    this.props.hideMobileMenu()
  }


  render() {
    const {path, showMobileMenu, hidden, language, mobileMenuVisible, hideMobileMenu, profile} = this.props

    strings.setLanguage(language)

    return (
      <View hidden={hidden} zIndex={1} backgroundColor='white'>
        <View style={{height: '55px', flexShrink:0}}/>
        <View width='100%' height={55} backgroundColor='white' boxLightShadow position='fixed' style={{top: 0}}>
          <View flex='fill' flexHorizontal alignItems='center' justifyContent='space-between' paddingHorizontalNum={20}>

            <View flexHorizontal alignItems='center'>
              <BurgerButton onPress={showMobileMenu}/>

              <View width={10} style={styles.dontshrink} />

              <View onClick={this.clickHome} cursor='pointer'>
                <Image source="/images/logo-quanty-a.svg" width={66} height={20}/>
              </View>
            </View>

            {!profile &&
            <View width={50} style={styles.dontshrink} onClick={this.handleLoginClick}>
              <Text textColor='iris' fontSizeNum={12} textAlign='center' fontWeight='semibold'>{strings.menu.login}</Text>
            </View>
            }
          </View>

          <Divider/>
        </View>

        {mobileMenuVisible &&
        <View>
          <View style={styles.collapse}>
            <View height={55} flexHorizontal alignItems='center'>
              <View width={20} style={styles.dontshrink}/>

              <CloseButton onPress={hideMobileMenu}/>

              <View width={12} style={styles.dontshrink}/>

              <View onClick={this.clickHome} cursor='pointer'>
                <Image source="/images/logo-quanty-a.svg" width={66} height={20}/>
              </View>
            </View>

            <Divider/>

            <View height={55} flexHorizontal>
              <View width={20} style={styles.dontshrink}/>

              {!profile &&
              <View onClick={this.handleLoginClick} justifyContent='center' height='100%'>
                <Text fontSizeNum={15}>{strings.titles.plzLogin}</Text>
              </View>
              }
              {profile &&
              <View justifyContent='center' height='100%'>
                <Text fontSizeNum={15}>{profile.nickname}</Text>
              </View>
              }
              <View flex='fill'/>
              <View justifyContent='center'>
                <LanguageSelector/>
              </View>

              <View width={20} style={styles.dontshrink}/>
            </View>

            <Divider/>

            <Menu title={strings.titles.trade} image='trade' onPress={this.handleTradeClick} selected={matchPath(path, {
              path: '/exchange',
              exact: false
            })}/>

            <Divider/>

            <Menu title={strings.titles.balances} image='balances' onPress={this.handleBalancesClick} selected={matchPath(path, {
              path: '/balances',
              exact: false
            })}/>

            <Divider/>

            <Menu title={strings.titles.support} image='support' onPress={this.handleSupportClick} selected={matchPath(path, {
              path: '/support',
              exact: false
            })}/>

            <Divider/>

            <View flex='fill'/>

            {profile &&
            <View>
              <Menu title={strings.titles.link_myaccount} image='my_account' onPress={this.handleMyAccountClick} selected={matchPath(path, {
                path: '/myaccount/info',
                exact: false
              })}/>
              <Divider/>

              <Menu title={strings.titles.link_bankaccount} image='bank_account' onPress={this.handleBankAccountClick} selected={matchPath(path, {
                path: '/banking',
                exact: false
              })}/>
              <Divider/>

              <Menu title={strings.titles.link_authentication} image='auth' onPress={this.handleAuthClick} selected={matchPath(path, {
                path: '/myaccount/auth',
                exact: false
              })}/>
              <Divider/>

              <Menu title={strings.titles.link_loginhistory} image='login_history' onPress={this.handleLoginHistoryClick} selected={matchPath(path, {
                path: '/myaccount/loginhistory',
                exact: false
              })}/>
              <Divider/>

              <Menu title={strings.titles.link_logout} image='logout' to='/support' onPress={this.handleLogoutClick} selected={false}/>
              <Divider/>
            </View>
            }
          </View>

          <View style={styles.collapse_background} onClick={hideMobileMenu} hidden={!mobileMenuVisible}/>
        </View>
        }
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

export default connect(mapStateToProps)(MobileNavigation)

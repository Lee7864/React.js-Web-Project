// @flow
import "@babel/polyfill"
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { View, Text, Popup, Spacer, Image } from './components/controls'

import TradingContainer from './components/containers/TradingContainer'
import LoginContainer from './components/containers/LoginContainer'
import SignupContainer from './components/containers/SignupContainer'
import MyAccountContainer from './components/containers/MyAccountContainer'
import ResetPasswordContainer from './components/containers/ResetPasswordContainer'
import BalanceContainer from './components/containers/BalanceContainer'
import SupportContainer from './components/containers/SupportContainer'
import BankingContainer from './components/containers/BankingContainer'
import Messenger from './components/messenger/Messenger'
import LogoutHandler from './components/gnb/LogoutHandler'
import { store, history } from './redux'
import { Provider } from 'react-redux'
import HomeContainer from './components/containers/HomeContainer'
import PopupContainer from './components/containers/PopupContainer'
import Navigation from './components/controls/Navigation'
import AttentionPopup from './components/popup/AttentionPopup'

import LocalizedStrings from 'localized-strings'
import styles from './styles/StyleGuide.css'

import { GA_TRACKING_ID } from './config'
import Analytics from 'react-router-ga'
import GoogleAnalytics from './components/ga/GoogleAnalytics'

import {detect} from 'detect-browser'
import MobileNavigation from './components/controls/MobileNavigation'
const browser = detect()

const strings = new LocalizedStrings({
  en: {
    popup: {
      cancel: 'Cancel',
      continue: 'Continue',
      belowlevel: 'Mobile Authentication is required.',
      linktomobileauth: 'Mobile Authentication',
      unsupport1: 'You’re using a web browser we don’t support.',
      unsupport2: 'Try one of these options to have a better experience on Quanty.',
      error: 'Error!',
    }
  },
  ko: {
    popup: {
      cancel: '취소',
      continue: '확인',
      belowlevel: '입출금 거래를 위해 보안등급 2단계 휴대전화 인증이 필요합니다.',
      linktomobileauth: '보안등급 2단계 가기',
      unsupport1: '지원하지 않는 웹 브라우저를 사용하고 있습니다.',
      unsupport2: 'Quanty에 대한 더 나은 경험을 가지려면 이 브라우저 중 하나를 사용해보십시오.',
      error: '오류',
    }
  }
})

const menuHidden = () => {
  const path = location.pathname
  const pathToHideMenu = ['/login', '/signup', '/resetpassword']

  if (pathToHideMenu.indexOf(path) >= 0) {
    return true
  }
  return false
}

type Props = {

}

type State = {
  showPopup: boolean,
  popupType: string,
  popupMessage: string,
  checkAttention: boolean,
  showAttPopup: boolean,
  checkBrowser: string,
  mobileMenuVisible: boolean,
  showAlertPopup: boolean,
  errorPopupMessage: string,
}

class Index extends React.Component<Props, State> {

  constructor() {
    super()

    const date = new Date()
    const now = date.getTime()
    const delayTime = localStorage.getItem('delayTime')
    let delayTimePassed: boolean = true
    if (delayTime !== null) {
      if (now - Number(delayTime) < 24 * 7 * 60 * 60 * 1000) {
        delayTimePassed = false
      }
    }

    const showPopupByDate = localStorage.getItem('showPopupByDate')
    const today = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
    let showPopupToday: boolean = false
    if (showPopupByDate === today) {
      showPopupToday = true
    } else {
      localStorage.setItem('showPopupByDate', today)
    }

    let checkBrowser: string = 'checked'
    switch (browser && browser.name) {
      case 'edge':
      case 'ie':
        checkBrowser = 'ie'
        break
      default:
        break
    }

    // switch (browser && browser.os) {
    //   case 'iOS':
    //   case 'Android OS':
    //   case 'BlackBerry OS':
    //   case 'Windows Mobile':
    //   case 'Amazon OS':
    //     checkBrowser = 'mobile'
    //     break
    //
    // }

    const checkPopup = localStorage.getItem('popup_181109') === 'false' || localStorage.getItem('popup_181109') === null

    this.state = {
      showPopup: false,
      popupType: '',
      popupMessage: '',
      checkAttention: false,
      showAttPopup: (checkPopup || delayTimePassed) && !showPopupToday,
      checkBrowser: checkBrowser,
      mobileMenuVisible: false,
      showAlertPopup: false,
      errorPopupMessage: '',
    }
  }

  linkToChrome = () => {
    window.open('https://www.google.com/intl/ko_ALL/chrome/', '_blank')
  }

  linkToFirefox = () => {
    window.open('https://www.mozilla.org/ko/firefox/new/', '_blank')
  }

  linkToBrave = () => {
    window.open('https://brave.com/download/', '_blank')
  }

  handleShowPopup = (type: string, message: string) => {
    this.setState({
      showPopup: true,
      popupType: type,
      popupMessage: message
    })
  }

  handlePopupClick = () => {
    this.handlePopupCancelClick()
    history.push('/myaccount/auth')
  }

  handlePopupCancelClick = () => {
    this.setState({
      showPopup: false,
      popupType: '',
      popupMessage: ''
    })
  }

  handleCheckboxChange = () => {
    localStorage.setItem('popup_181109', (!this.state.checkAttention).toString())

    this.setState({
      checkAttention: !this.state.checkAttention
    })
  }

  handleConfirmAttentionPopup = () => {
    if (this.state.checkAttention) {
      localStorage.setItem('delayTime', new Date().getTime().toString())
    }

    this.setState({
      showAttPopup: false
    })
  }

  showMobileMenu = () => {
    this.setState({
      mobileMenuVisible: true
    })
  }

  hideMobileMenu = () => {
    this.setState({
      mobileMenuVisible: false
    })
  }



  render() {
    const {showPopup, popupType, popupMessage,
      showAttPopup, checkAttention, checkBrowser, mobileMenuVisible} = this.state

    let isMobile = false

    switch (browser && browser.os) {
    case 'iOS':
    case 'Android OS':
    case 'BlackBerry OS':
    case 'Windows Mobile':
    case 'Amazon OS':
      isMobile = true
      break
    }

    return (
      <React.Fragment>
        { checkBrowser === 'checked' &&
        <View flex="fill" backgroundColor="light-gray">
          {!isMobile && <Navigation onShowPopup={this.handleShowPopup} hidden={menuHidden()} path={location.pathname}/>}
          {isMobile && <MobileNavigation mobileMenuVisible={mobileMenuVisible} showMobileMenu={this.showMobileMenu}  hideMobileMenu={this.hideMobileMenu} onShowPopup={this.handleShowPopup} hidden={menuHidden()} path={location.pathname}/>}
          <View flex="fill" style={{zIndex:0}}>
            <Switch>
              <Route exact path="/" component={HomeContainer}/>
              <Route exact path="/exchange/:sub" component={TradingContainer}/>
              <Redirect from="/exchange" to="/exchange/BTC_KRW"/>
              <Route exact path="/login" component={LoginContainer}/>
              <Route exact path="/logout" component={LogoutHandler}/>
              <Route exact path="/signup" component={SignupContainer}/>
              <Redirect from="/myaccount" to="/myaccount/info" exact/>
              <Route exact path="/myaccount/:sub" component={MyAccountContainer}/>
              <Route exact path="/resetpassword" component={ResetPasswordContainer}/>
              <Route path="/balances/:sub" component={BalanceContainer}/>
              <Redirect from="/balances" to="/balances/assets" exact/>
              <Redirect from="/support" to="/support/announce" exact/>
              <Route path="/support/privacy/:sub" component={SupportContainer}/>
              <Route exact path="/support/:sub" component={SupportContainer}/>
              <Redirect from="/banking" to="/banking/deposit" exact/>
              <Route exact path="/banking/:sub" component={BankingContainer}/>

              <Redirect to="/" />
            </Switch>
          </View>
          { !showAttPopup && <Messenger path={location.pathname}/> }

          <PopupContainer onShowPopup={this.handleShowPopup} path={location.pathname}/>
          {
            showPopup && popupType === 'error' &&
            <Popup
              type="error"
              message={popupMessage}
              image='images/monotone.png'
              buttonTitle={strings.popup.continue}
              onButtonClick={this.handlePopupCancelClick} />
          }
          {
            showPopup && popupType === 'success' &&
            <Popup
              type="success"
              message={popupMessage}
              image='images/success.png'
              buttonTitle={strings.popup.continue}
              onButtonClick={this.handlePopupCancelClick} />
          }
          {
            showPopup && popupType === 'belowlevel' &&
            <Popup
              type="error"
              message={strings.popup.belowlevel}
              image='images/monotone.png'
              buttonTitle={strings.popup.linktomobileauth}
              onButtonClick={this.handlePopupClick}
              cancelTitle={strings.popup.cancel}
              onCancelClick={this.handlePopupCancelClick}/>
          }
          { showAttPopup && checkBrowser === 'checked' &&
          <AttentionPopup checkAttention={checkAttention}
                          onCheckboxChange={this.handleCheckboxChange}
                          onConfirmAttentionPopup={this.handleConfirmAttentionPopup}
          />
          }
        </View>
        }
        {
          checkBrowser === 'ie' &&
          <View backgroundColor="light-gray">
            <View padding="large" overflow="y">
              <View style={styles.dontshrink} >
                <View alignItems="center">
                  <Text style={styles.indexTitle}>Improve Your Experience</Text>
                  <Spacer size="large" />
                  <Text>{strings.popup.unsupport1}</Text>
                  <Spacer size="medium" />
                  <Text>{strings.popup.unsupport2}</Text>
                  <Spacer size="xlarge" />
                </View>
                <View flexHorizontal phoneFlexVertical alignItems="center" justifyContent="center">
                  <Image source='/images/home/logo-chrome.png' width={112} height={112} cursor='pointer' onClick={this.linkToChrome}/>
                  <Spacer size="medium-large" />
                  <Image source='/images/home/logo-firefox.png' width={120} height={123} cursor='pointer' onClick={this.linkToFirefox}/>
                  <Spacer size="medium-large" />
                  <Image source='/images/home/logo-brave.png' width={97} height={114} cursor='pointer' onClick={this.linkToBrave}/>
                </View>
              </View>
            </View>
          </View>
        }
      </React.Fragment>
    )
  }
}


const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.render(
    <Router history={history}>
      <Analytics id={GA_TRACKING_ID}>
        <Provider store={store}>
          <Index />
        </Provider>
        <GoogleAnalytics />
      </Analytics>
    </Router>,
    rootElement
  )
}

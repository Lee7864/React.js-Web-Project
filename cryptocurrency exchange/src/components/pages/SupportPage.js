// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import { View, Text, SubMenu, Spacer } from '../controls'
import NoticePage from './NoticePage'
import FeesPage from './FeesPage'
import TermsPage from './TermsPage'
import PrivacyPage from './PrivacyPage'
import styles from '../../styles/StyleGuide.css'
import supportStyles from '../../styles/SupportPage.css'
import Footer from '../controls/Footer'
import Privacy180901 from "./privacy/Privacy180901";

const strings = new LocalizedStrings({
  en: {
    support: {
      announce: 'Announcement',
      help: 'Help',
      fees: 'Fees',
      contact: 'Contact',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      title: 'Support',
    }
  },
  ko: {
    support: {
      announce: '공지사항',
      help: '도움말',
      fees: '수수료 안내',
      contact: '문의하기',
      terms: '이용약관',
      privacy: '개인정보처리방침',
      title: '고객센터',
    }
  }
})


type Props = {
  sub: string,
  noticeList: Array,
  helpList: Array,
  noticePage: Object,
  helpPage: Object,
  onListClick: (type: string, id: string) => void,
  onBackPress: (type: string) => void,
  onSubMenuClick: (string) => void,
  language: string,
  history: Object,
  privacyDate: string
}

type State = {
}

class SupportPage extends React.Component<Props, State> {

  render() {
    const {sub, noticeList, helpList, noticePage, helpPage, privacyDate, onListClick, onBackPress, onSubMenuClick} = this.props
    strings.setLanguage(this.props.language)
    return (
      <View flex='fill' overflow='auto' padding="small" alignItems='center' phonePaddingHorizontal="none">
        <Spacer size="tiny" />
        <Spacer size="xsmall" phoneHidden/>
        <View style={styles.dontshrink} flexHorizontal phoneFlexVertical tabletFlexVertical width='100%' maxWidth={976}>
          <View style={styles.dontshrink} width="100%" flex="fill">
            <Text style={supportStyles.title}>{strings.support.title}</Text>
            <Spacer size="small" />

            <View alignItems='center' backgroundColor="white" style={styles.dontshrink}>
              <View width='100%' maxWidth={1024}>
                <View flexHorizontal overflow="auto">
                  <Spacer size="medium" />
                  <SubMenu thisMenu="announce" currentMenu={sub} title={strings.support.announce} onClick={onSubMenuClick} />
                  <SubMenu thisMenu="help" currentMenu={sub} title={strings.support.help} onClick={onSubMenuClick} />
                  <SubMenu thisMenu="fees" currentMenu={sub} title={strings.support.fees} onClick={onSubMenuClick} />
                  <SubMenu thisMenu="terms" currentMenu={sub} title={strings.support.terms} onClick={onSubMenuClick} />
                  <SubMenu thisMenu="privacy" currentMenu={sub} title={strings.support.privacy} onClick={onSubMenuClick} />
                </View>
              </View>
            </View>

            <View alignItems="center"
                  overflow="auto">
              {
                sub === 'announce' &&
                <NoticePage type='announce'
                            list={noticeList}
                            page={noticePage}
                            onListClick={onListClick}
                            onBackPress={onBackPress}
                language={this.props.language}/>
              }
              {
                sub === 'help' &&
                <NoticePage type='help'
                            list={helpList}
                            page={helpPage}
                            onListClick={onListClick}
                            onBackPress={onBackPress}
                            language={this.props.language}/>
              }
              {
                sub === 'fees' &&
                <FeesPage language={this.props.language}/>
              }
              {
                sub === 'terms' &&
                <TermsPage />
              }

              {
                sub === 'privacy' && privacyDate === '' &&
                <PrivacyPage history={this.props.history}/>
              }

              {
                sub === 'privacy' && privacyDate === '180901' &&
                <Privacy180901 />
              }

            </View>
          </View>
        </View>
        <Footer/>
      </View>
    )
  }
}

export default SupportPage

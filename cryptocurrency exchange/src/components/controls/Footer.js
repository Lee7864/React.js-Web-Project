// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import {View, Text, Spacer, Divider} from '../controls'
import styles from '../../styles/StyleGuide.css'
import {connect} from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import {detect} from 'detect-browser'
import FooterLanguageSelector from '../gnb/FooterLanguageSelector'
const browser = detect()

const strings = new LocalizedStrings({
  en: {
    headers: {
      announce: 'Announcement',
      help: 'Help',
      fees: 'Fees',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      footer1: 'AprilComes, Inc.',
      footer2: 'Business Registration No. 578-87-00843',
      footer3: 'CEO: Sunghyun Kim',
      footer4: '7th floor ES Tower, 14, Teheran-ro 77-gil, Gangnam-gu, Seoul, Korea',
      footer5: 'Customer Support: support@aprilcomes.com'
    }
  },
  ko: {
    headers: {
      announce: '공지사항',
      help: '도움말',
      fees: '수수료 안내',
      terms: '이용약관',
      privacy: '개인정보처리방침',
      footer1: '주식회사 에이프릴컴스',
      footer2: '사업자등록번호: 578-87-00843',
      footer3: '대표: 김성현',
      footer4: '주소: 서울특별시 강남구 테헤란로 77길 14 ES타워 7층 (우) 06158',
      footer5: '문의: support@aprilcomes.com'
    }
  }
})

type Props = {
  language: string
}

class Footer extends React.PureComponent<Props> {

  render() {
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

    const {language} = this.props
    strings.setLanguage(language)
    
    const fontSize = isMobile ? 9 : 13
    const spacingSize = isMobile ? 'tiny' : 'small'
    const flagWidth = isMobile ? 15 : 24
    const flagHeight = isMobile ? 10 : 16

    return (
      <View width='100%' alignItems='center'>
        <Spacer/>
        
        <View flex='fill' flexHorizontal alignItems='center' justifyContent='center' flexWrap>
          <View height={20} justifyContent='center'>
            <Text component={RouterLink} to={'/support/announce'} fontSizeNum={fontSize} textColor='dark-gray' cursor='pointer'>{strings.headers.announce}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='dark-gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text component={RouterLink} to={'/support/help'} fontSizeNum={fontSize} textColor='dark-gray' cursor='pointer'>{strings.headers.help}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='dark-gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text component={RouterLink} to={'/support/fees'} fontSizeNum={fontSize} textColor='dark-gray'cursor='pointer'>{strings.headers.fees}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='dark-gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text component={RouterLink} to={'/support/terms'} fontSizeNum={fontSize} textColor='dark-gray'cursor='pointer'>{strings.headers.terms}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='dark-gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text component={RouterLink} to={'/support/privacy'} fontSizeNum={fontSize} textColor='dark-gray'cursor='pointer'>{strings.headers.privacy}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='dark-gray'>•</Text>
          <Spacer size={spacingSize}/>
          <FooterLanguageSelector width={flagWidth} height={flagHeight}/>
        </View>

        <View height={15} style={styles.dontshrink}/>

        <Divider/>

        <View height={15} style={styles.dontshrink}/>

        <View flex='fill' flexHorizontal alignItems='center' justifyContent='center' flexWrap>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={fontSize} textColor='gray'>{strings.headers.footer1}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={fontSize} textColor='gray'>{strings.headers.footer2}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={fontSize} textColor='gray'>{strings.headers.footer3}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={fontSize} textColor='gray'>{strings.headers.footer4}</Text>
          </View>
          <Spacer size={spacingSize}/>
          <Text fontSizeNum={fontSize} textColor='gray'>•</Text>
          <Spacer size={spacingSize}/>
          <View height={20} justifyContent='center'>
            <Text fontSizeNum={fontSize} textColor='gray'>{strings.headers.footer5}</Text>
          </View>
        </View>

        <View height={50} style={styles.dontshrink}/>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(Footer)
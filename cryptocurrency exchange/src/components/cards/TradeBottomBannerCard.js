// @flow

import * as React from 'react'
import View from '../controls/View'
import styles from '../../styles/StyleGuide.css'
import Text from '../controls/Text'
import LocalizedStrings from 'localized-strings'
import Clock from 'react-live-clock'
import Image from '../controls/Image'
import Spacer from '../controls/Spacer'
import type {BoardArticle} from '../../types/BoardArticle'
import {API_URL} from '../../config'

const strings = new LocalizedStrings({
  en: {
    body: {
      notice: '[Notice]',
      tradeFee: 'Trade Fee'
    }
  },
  ko: {
    body: {
      notice: '[공지사항]',
      tradeFee: '수수료율'
    }
  }
})

type Props = {
  onNoticeClick: (id: number) => void,
  connected: boolean,
  tradeFee: string,
  language: string
}

type State = {
  noticeArticles: BoardArticle[] | null
}

class TradeBottomBannerCard extends React.PureComponent<Props, State> {
  state = {
    noticeArticles: null
  }

  handleNoticeClick = () => {
    if (this.state.noticeArticles !== null && this.state.noticeArticles.length > 0) {
      this.props.onNoticeClick(this.state.noticeArticles[0].id)
    }
  }

  componentDidMount() {
    Promise.all([
      fetch(`${API_URL}/board/title?type=notice&sortingOrder=DESC`)
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([boardArticles]) => {
      this.setState({
        noticeArticles: (boardArticles && boardArticles.length > 0) ? boardArticles : null
      })
    })
  }

  render() {
    const {noticeArticles} = this.state
    const {connected, tradeFee, language} = this.props

    strings.setLanguage(language)

    const tradeFeeStr = `[${strings.body.tradeFee}] ${tradeFee}%`
    const noticeStr = noticeArticles !== null && noticeArticles.length > 0 ? `${strings.body.notice} ${noticeArticles[0].title}` : ''

    return(
      <View flexHorizontal backgroundColor='pale-grey' height={40}>
        <View flexHorizontal width='100%' padding='small' alignItems='center' minWidth={820}>
          <Text fontSizeNum={13} cursor='pointer' onClick={this.handleNoticeClick}>{noticeStr}</Text>
          <View flex='fill'/>
        </View>
        <View width='100%' maxWidth={370} style={styles.dontshrink} padding='small' justifyContent='center'>
          <Text textAlign='center' fontSizeNum={13}>{tradeFeeStr}</Text>
        </View>
        <View width='100%' maxWidth={340} style={styles.dontshrink} padding='small' justifyContent='center'>
          <View flexHorizontal justifyContent='flex-end' alignItems='center'>
            <Text fontSizeNum={13}>
              <Clock format={'YYYY-MM-DD HH:mm:ss'} ticking={true} timezone={'Asia/Seoul'} />
            </Text>
            <Spacer size='large'/>
            {connected && <Image source='/images/connected.svg'/>}
            {!connected && <Image source='/images/disconnected.svg'/>}
            <Spacer size='xsmall'/>
            {connected && <Text fontSizeNum={13} textColor='iris'>Connected</Text>}
            {!connected && <Text fontSizeNum={13} textColor='up-red'>Disconnected</Text>}
          </View>

        </View>
      </View>
    )
  }
}

export default TradeBottomBannerCard
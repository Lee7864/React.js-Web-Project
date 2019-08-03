// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import { View, Text, Button, Spacer, Divider } from '../controls'
import renderHTML from 'react-render-html'
import wysiwygStyles from '../../styles/wysiwyg.css'
import viewStyles from '../controls/View.css'
import styles from '../../styles/StyleGuide.css'
import moment from 'moment/moment'

const strings = new LocalizedStrings({
  en: {
    notice: {
      title: 'TITLE',
      date: 'DATE',
      views: 'VIEWS',
      list: 'LIST',
    }
  },
  ko: {
    notice: {
      title: '제목',
      date: '날짜',
      views: '조회수',
      list: '목록으로',
    }
  }
})

type Props = {
  type: string,
  list: Array,
  page: Object | null,
  onListClick: (type: string, id: string) => void,
  onBackPress: (type: string) => void,
  language: string
}

type State = {
  viewType: string
}

class NoticePage extends React.Component<Props, State> {

  state = {
    viewType: 'list'
  }

  handleListClick = (id: string) => {
    this.props.onListClick(this.props.type, id)
  }

  handleBackPress = () => {
    this.props.onBackPress(this.props.type)
  }

  render() {
    const {list, page} = this.props
    strings.setLanguage(this.props.language)
    return (
      <View maxWidth={1024} width='100%' flex='fill'>
        <View backgroundColor="white" style={styles.dontshrink}>
          <View border="normal" borderColor="light-gray" borderType="top">
            {
              page !== null &&
              <View>
                <View padding="large">
                  <Text fontSize="small-medium">{page.title}</Text>
                </View>
                <Divider color='divider'/>
                <View padding="large">
                  <View style={wysiwygStyles.wysiwyg}>{renderHTML(page.contentHtml)}</View>
                  <Spacer size="large" />
                  <View flexHorizontal>
                    <Spacer flex="fill"/>
                    <Button title={strings.notice.list} backgroundColor="white" size="small" onPress={this.handleBackPress}/>
                  </View>
                </View>
              </View>
            }

            {
              page === null &&
              <View>
                <View flexHorizontal paddingVertical="small">
                  <Spacer size="large"/>
                  <View width='85%' maxWidth={900}>
                    <Spacer size="xsmall"/>
                    <Text fontSize="xsmall" textColor='dark-gray'>{strings.notice.title}</Text>
                  </View>
                  <Spacer size="large"/>
                  <View width='15%' maxWidth={100} minWidth={80}>
                    <Spacer size="xsmall"/>
                    <Text fontSize="xsmall" textColor='dark-gray'>{strings.notice.date}</Text>
                  </View>
                  {/*<View width='5%' maxWidth={50} minWidth={50}>*/}
                    {/*<Spacer size="xsmall"/>*/}
                    {/*<Text fontSize="xsmall" textColor='dark-gray'>{strings.notice.views}</Text>*/}
                  {/*</View>*/}
                  {/*<Spacer size="large" phoneHidden />*/}
                </View>
                <Divider color='divider'/>
              </View>
          }

          {
            page === null && list.map((item) => {
            return (
              <React.Fragment key={item.id}>
                <View style={viewStyles.button} border="normal" borderColor="light-gray" borderType="bottom">
                  <View flexHorizontal
                        paddingVertical="medium"
                        onClick={() => this.handleListClick(item.id)}>
                    <Spacer size="large"/>
                    <View width='85%' maxWidth={900}>
                      <Spacer size="tiny"/>
                      <Text fontSize="small" textColor='dark-gray' cursor='pointer'>{item.title}</Text>
                    </View>
                    <Spacer size="large"/>
                    <View width='15%' maxWidth={100} minWidth={80}>
                      <Spacer size="tiny"/>
                      <Text fontSize="small" textColor='gray' cursor='pointer'>
                        {moment(item.createdAt).format('YYYY.MM.DD')}
                      </Text>
                    </View>
                    {/*<Spacer size="large"/>*/}
                    {/*<View width='5%' maxWidth={50} minWidth={50}>*/}
                      {/*<Spacer size="tiny"/>*/}
                      {/*<Text fontSize="small" textColor='gray' cursor='pointer'>{item.count.toString()}</Text>*/}
                    {/*</View>*/}
                  </View>
                </View>
              </React.Fragment>
              )
            })}

          </View>
        </View>

      </View>
    )
  }
}

export default NoticePage

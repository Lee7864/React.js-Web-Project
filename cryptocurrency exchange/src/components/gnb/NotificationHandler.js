// @flow

import * as React from 'react'
import { View, Text, Spacer } from '../controls'
import type { Profile, Notification } from '../../types/Profile'
import { connect } from 'react-redux'
import notiStyles from './Notification.css'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import {API_URL} from '../../config'
import LocalizedStrings from 'localized-strings'
import moment from 'moment'
import {stringify as qsStringify} from 'querystring'


const strings = new LocalizedStrings({
  en: {
    noti: {
      title: 'Notifications',
      nodata: 'No notifications.'
    }
  },
  ko: {
    noti: {
      title: '알림',
      nodata: '알림이 없습니다.'
    }
  }
})

moment.updateLocale('ko', {
  relativeTime : {
    future : '%s 후',
    past : '%s 전',
    s : '몇 초',
    ss : '%d초',
    m : '1분',
    mm : '%d분',
    h : '1시간',
    hh : '%d시간',
    d : '1일',
    dd : '%d일',
    M : '1달',
    MM : '%d달',
    y : '1년',
    yy : '%d년'
  }
})


type PropsToggle = {
  isNew: boolean,
  showNew: () => void,
  children?: React.Node,
  onClick: (event: SyntheticEvent<HTMLImageElement | HTMLDivElement>) => void,
}

class NotiToggle extends React.PureComponent<PropsToggle> {
  constructor(props, context) {
    super(props, context)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e: SyntheticEvent<HTMLImageElement | HTMLDivElement>) {
    e.preventDefault()

    this.props.onClick(e)

    if(this.props.isNew)  this.props.showNew()
  }

  render() {
    return (
      <View flexHorizontal backgroundColor='white' className={notiStyles.containerBox }>
        <img src='images/notification.svg' alt={strings.noti.title} className={notiStyles.notiimg} onClick={this.handleClick}/>
        {this.props.isNew && <View className={notiStyles.oval} onClick={this.handleClick} />}
        {this.props.children}
      </View>
    )
  }
}


type Props = {
  count: number,
  language: string,
  profile: Profile,
}

type State= {
  notifications: Notification[] | null,
  isNew: ?boolean
}

class NotificationHandler extends React.PureComponent<Props, State> {
  state = {
    notifications: [],
    isNew: false,
  }

  getReadOffset() {
    let cData = window.localStorage.getItem('noti_offset')

    if(cData) {
      if(cData) cData = JSON.parse(cData)
    } else {
      cData = ''
    }
    return  cData
  }

  saveReadOffset()  {
    let { notifications } = this.state
    let lastTimestamp = 0
    if (notifications && notifications.length > 0) lastTimestamp = notifications[0].offset

    window.localStorage.setItem('noti_offset', JSON.stringify({
      read_offset: lastTimestamp
    }))
  }



  startTimer() {
    if (!this.noti_timer) {
      this.noti_timer = setInterval(this.getNewNotifications.bind(this), 60000) // 60sec
    }
  }

  stopTimer() {
    if (this.noti_timer) {
      clearInterval(this.noti_timer)
      this.noti_timer = null
    }
  }

  showNew() {
    const { isNew } = this.state

    if(isNew) {
      this.setOffset()
      this.saveReadOffset()
      this.setState({isNew: false})
    }
  }

  setOffset() {
    const { notifications } = this.state
    let lastTimestamp = 0

    if (notifications && notifications.length > 0)  {
      lastTimestamp = notifications[0].offset

      let body = {
        'offset': lastTimestamp
      }

      fetch(`${API_URL}/notification/read_offset`, {
        method: 'post',
        body: qsStringify(body),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        credentials: 'include'
      }).then(response => {
        if (!response.ok) {
          //console.log('fail: save notification readd-offset')
        }}).catch(error => {})
    }
  }

  getNewNotifications(count: number=20) {
    const { notifications } = this.state

    let lastTimestamp = 0
    if (notifications && notifications.length > 0) lastTimestamp = notifications[0].offset

    fetch(`${API_URL}/notification?count=${count}&exclusiveMinTimestamp=${lastTimestamp}`, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    }).then(response => (
      response.json()
    )).then((data) => {
      if(data && data.responseItems) {
        let noti = [].concat(data.responseItems, notifications)

        if (data.responseItems.length > 0 && data.responseItems[0].offset > lastTimestamp)
          this.setState({
            notifications: noti,
            isNew: true
          })
        else
          this.setState({
            notifications: noti
          })
      }
    }).catch(error => {})
  }

  getNotifications(count: number=20)  {
    Promise.all([
      fetch(`${API_URL}/notification?count=${count}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([data]) => {
      if(data && data.responseItems) {
        let local_readOffset = this.getReadOffset()
        let readOffset = data.readOffset
        let isNew = false

        if(local_readOffset && local_readOffset.read_offset && local_readOffset.read_offset > 0 )
          readOffset = local_readOffset.read_offset

        if(data.responseItems.length > 0 && data.responseItems[0].offset > readOffset) isNew = true

        this.setState({
          notifications: data.responseItems,
          isNew: isNew,
        })
      }
    }).catch(error => {})
  }

  componentDidMount() {
    const { profile, count } = this.props
    //moment.locale(strings.getLanguage())

    if (profile) {
      this.getNotifications(count)
      this.startTimer()
    }
  }

  componentDidUpdate(prevProps)  {
    const { profile, count } = this.props

    // signin
    if(!prevProps.profile && profile && profile.email)  {
      this.getNotifications(count)
      this.startTimer()
    }

    // signout
    if(prevProps.profile && prevProps.profile.email && !profile)  {
      this.stopTimer()
    }
  }


  componentWillUnmount()  {
    this.stopTimer()
  }

  render() {
    const {profile, language} = this.props
    const {notifications, isNew} = this.state

    if (profile === null || profile === undefined) return null
    if (language) {
      strings.setLanguage(language)
      moment.locale(language)
    }

    return (
      <Dropdown id='mynoti' pullRight>
        <NotiToggle bsRole='toggle' isNew={isNew} showNew={this.showNew.bind(this)}></NotiToggle>
        <Dropdown.Menu className={ notiStyles.dropdown }>
          <MenuItem header><Text style={notiStyles.title}>{strings.noti.title}</Text></MenuItem>
          <MenuItem divider />
          {!notifications || notifications.length===0 ? <MenuItem key='index'>{strings.noti.nodata}</MenuItem> : notifications.map( (noti, index) => {
            return (
              <MenuItem key={index}>
                <View flexHorizontal justifyContent='space-between' title={language==='en' ? noti.localeMessages.en : noti.localeMessages.ko}>
                  <Text fontSize='xsmall' fontWeight='normal' textAlign='left' style={notiStyles.textEllipsis} >{language==='en' ? noti.localeMessages.en : noti.localeMessages.ko}</Text>
                  <Spacer size='small'/>
                  <Text fontSize='xsmall' fontWeight='normal' textAlign='right' title={moment(noti.offset).format('YYYY.MM.DD kk:mm')}>{moment(noti.offset).fromNow()}</Text>
                </View>
                <Spacer size='xsmall'/>
              </MenuItem>)
          })}
        </Dropdown.Menu>
      </Dropdown>

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

export default connect(mapStateToProps)(NotificationHandler)

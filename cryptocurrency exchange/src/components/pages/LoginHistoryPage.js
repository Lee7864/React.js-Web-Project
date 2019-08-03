// @flow

import * as React from 'react'
import { View, Text, Image, Button, Spacer, Divider, Popup } from '../controls'
import type {CurrentDevice, Device, LoginHistory} from '../../types/Profile';
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import viewStyles from '../controls/View.css'
import {treatNewline} from '../../data/StringUtil'
import {ClipLoader} from 'react-spinners'
import myaccountStyles from '../../styles/MyAccountPage.css'

const strings = new LocalizedStrings({
  en: {
    loginhistory: {
      title: 'Login History',
      desc1: 'As an extra security measure, Quanty will log any sign in attempts from unregistered browsers. ',
      desc2: 'Please check the logged information below for any suspicious sign in attempts. ',
      desc3: '',
      currentbrowser: 'Current Browser',
      registedbrowsers: 'Registered Browsers',
      registerbrowser: 'Register Browser',
      time: 'Time',
      platform: 'Platform',
      accesslogs: 'Access Logs',
      browser: 'Browser',
      ip: 'IP Address',
      newbrowser: 'New browser detected.',
      status: 'Status',
      unregistered: 'Unregistered',
      registered: 'Registered',
      delete: 'Delete',
      continue: 'Continue',
      prev: 'Prev',
      next: 'Next',
    }
  },
  ko: {
    loginhistory: {
      title: '로그인 관리',
      desc1: '기존에 등록되지 않은 새 브라우저나 새 기기에서 로그인하는 경우, 안전한 계정관리를 위해 추가 인증을 받습니다. ',
      desc2: '자주 로그인하는 기기를 등록하면 해당 기기에서 추가 인증없이 접속할 수 있습니다. ',
      desc3: '의심되는 로그인 기록이 있다면 즉시 비밀번호를 변경하시고 보안등급을 강화해 주세요. ',
      currentbrowser: '현재 기기',
      registedbrowsers: '등록 기기 목록',
      registerbrowser: '현재 기기 등록',
      time: '일시',
      platform: '운영체제',
      accesslogs: '로그인 내역',
      browser: '브라우저',
      ip: 'IP주소',
      newbrowser: '미등록 기기 입니다.',
      status: '상태',
      unregistered: '미등록',
      registered: '등록',
      delete: '삭제',
      continue: '확인',
      prev: '이전',
      next: '다음',
    }
  }
})


type Props = {
  currentDevice: CurrentDevice | null,
  devices: Device[],
  loginHistories: LoginHistory[],
  onRegisterPress: () => void,
  onDeleteClick: (id: string) => void,
  showAlertPopup: boolean,
  popupMessage: string,
  onPopupClick: () => void,
  language: string,
  onPrevClick: () => void,
  onNextClick: () => void,
  loginHistoryPageNo: number,
  nextPageNo: number | null,
  loading: boolean,
}

type State = {
}

const parseDate = (timestamp: string) => {
  let time: Date
  if (timestamp === undefined) {
    time = new Date()
  } else {
    if(timestamp.indexOf('+0000') > -1) {
      timestamp = timestamp.replace('+0000', '+00:00')
    }
    time = new Date(timestamp)
  }
  return time
}

const returnDate = (timestamp: string) => {
  const time: Date = parseDate(timestamp)
  const year = time.getFullYear()
  const month = addZero(time.getMonth() + 1)
  const date = addZero(time.getDate())

  return year + '.' + month + '.' + date
}

const returnTime = (timestamp: string) => {
  const time: Date = parseDate(timestamp)
  const hours = addZero(time.getHours())
  const minutes = addZero(time.getMinutes())

  return hours + ':' + minutes
}

const addZero = (i: number) => {
  let result: string = i.toString()
  if (i < 10) {
    result = '0' + result
  }
  return result;
}

class LoginHistoryPage extends React.Component<Props, State> {

  onDeleteClick = (id: string) => {
    this.props.onDeleteClick(id)
  }

  render() {

    const {currentDevice, devices, loginHistories, showAlertPopup, popupMessage,
      onRegisterPress, onPopupClick, onPrevClick, onNextClick, loginHistoryPageNo, nextPageNo} = this.props
    strings.setLanguage(this.props.language)
    return(

      <View style={styles.dontshrink} width="100%" flex="fill">
        <Text style={myaccountStyles.title}>{strings.loginhistory.title}</Text>
        <Spacer size="small" />
        <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="small">

          <View style={styles.dontshrink}>
            <View flexHorizontal phoneFlexVertical tabletFlexVertical paddingVertical="large">
              <View>
                <Text>
                  {strings.loginhistory.desc1}
                  {strings.loginhistory.desc2}
                  {strings.loginhistory.desc3}
                </Text>
              </View>
              <Spacer size="large"/>
              {
                currentDevice !== null &&
                  <View alignItems="center">
                  <View minWidth={300}>
                    <Text fontSize="small" fontWeight="bold" textColor="gray">{strings.loginhistory.currentbrowser}</Text>
                    <Spacer />
                    <View border="normal"
                          borderRadius="xsmall"
                          borderColor="gray"
                          paddingVertical="large"
                          paddingHorizontal="xsmall"
                          flexHorizontal
                          alignItems="center"
                          justifyContent="center">
                      <Text fontSize="xsmall" paddingVertical="xsmall">{currentDevice.os}</Text>

                      <Spacer size="xsmall" />
                      <View width={1} height={30} border="thin" borderColor="gray"/>
                      <Spacer size="xsmall" />

                      <View justifyContent='center'>
                        <Text fontSize="xsmall">{treatNewline(currentDevice.browser.replace(' ', '\n'))}</Text>
                      </View>

                      <Spacer size="xsmall" />
                      <View width={1} height={30} border="thin" borderColor="gray"/>
                      <Spacer size="xsmall" />

                      <Text fontSize="xsmall" paddingVertical="xsmall">{currentDevice.ipAddr}</Text>

                      <Spacer size="xsmall" />
                      <View width={1} height={30} border="thin" borderColor="gray"/>
                      <Spacer size="xsmall" />

                      <View>
                        <Text fontSize="xsmall">
                          { currentDevice.registered
                            ? returnDate(currentDevice.createdAt + '.000+0000')
                            : returnDate(currentDevice.loggedInAt + '+0000')
                          }
                        </Text>
                        <Spacer size="tiny"/>
                        <Text fontSize="xsmall">
                          { currentDevice.registered
                            ? returnTime(currentDevice.createdAt + '.000+0000')
                            : returnTime(currentDevice.loggedInAt + '+0000')
                          }
                        </Text>
                      </View>
                    </View>
                  </View>

                  {
                    !currentDevice.registered &&
                    <View paddingVertical="tiny" flexHorizontal justifyContent='flex-end'>
                      <Text fontSize="xsmall"
                            textColor="iris"
                            fontWeight="bold"
                            paddingVertical="xsmall">{strings.loginhistory.newbrowser}</Text>
                      <Spacer size="tiny"/>
                      <Button title={strings.loginhistory.registerbrowser}
                              backgroundImage="gradient-iris2"
                              titleColor="white"
                              fontSize="xsmall"
                              size="xsmall"
                              onPress={onRegisterPress}/>
                    </View>
                  }
                  </View>
              }
            </View>

            <View>
              <Text fontSize="small" fontWeight="bold" paddingHorizontal="large" phonePaddingHorizontal="xsmall">
                {strings.loginhistory.registedbrowsers}
              </Text>
              <Spacer/>
              <Divider color='divider'/>
              <View backgroundColor="white"
                    flexHorizontal
                    paddingHorizontal="large"
                    paddingVertical="medium"
                    phonePaddingHorizontal="xsmall"
                    phonePaddingVertical="xsmall">
                <View minWidth={50} width='23%' maxWidth={180} justifyContent='center'>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.time}</Text>
                </View>
                <Spacer />

                <View minWidth={60} width='23%' maxWidth={150} phoneHidden>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.platform}</Text>
                </View>
                <Spacer phoneHidden/>
                <View minWidth={60} width='23%' maxWidth={150} phoneHidden>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.browser}</Text>
                </View>

                <View minWidth={70} width='30%' maxWidth={250} justifyContent='center' phoneOnlyShown>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.platform}</Text>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.browser}</Text>
                </View>

                <Spacer phoneHidden/>
                <View minWidth={70} width='30%' maxWidth={170} justifyContent='center'>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.ip}</Text>
                </View>
                <Spacer phoneHidden/>
                <View width='20%'>
                </View>
              </View>
            </View>

            {devices && devices.map((device) => {
              return (
                <React.Fragment key={device.id}>
                  <Divider color='divider'/>
                  <View backgroundColor="white" flexHorizontal
                        paddingHorizontal="large"
                        paddingVertical="medium"
                        phonePaddingHorizontal="none"
                        phonePaddingHorizontal="xsmall"
                        width='100%'>
                    <View minWidth={50} width='23%' maxWidth={180} justifyContent='center'>
                      <Text fontSize="xsmall" textColor='gray'>
                        {returnDate(device.updatedAt + '.000+0000') + ' ' + returnTime(device.updatedAt + '.000+0000')}
                      </Text>
                    </View>
                    <Spacer />

                    <View minWidth={60} width='23%' maxWidth={150} justifyContent='center' phoneHidden>
                      <Text fontSize="xsmall" textColor="gray">{device.os}</Text>
                    </View>
                    <Spacer phoneHidden/>
                    <View minWidth={60} width='23%' maxWidth={150} justifyContent='center' phoneHidden>
                      <Text fontSize="xsmall" textColor="gray">{device.browser}</Text>
                    </View>

                    <View minWidth={70} width='30%' maxWidth={250} justifyContent='center' phoneOnlyShown>
                      <Text fontSize="xsmall" textColor="gray">{device.os}</Text>
                      <Spacer size="tiny" />
                      <Text fontSize="xsmall" textColor="gray">{device.browser}</Text>
                    </View>

                    <Spacer phoneHidden/>
                    <View minWidth={70} width='30%' maxWidth={170} justifyContent='center'>
                      <Text fontSize="xsmall" textColor="gray">{device.ipAddr}</Text>
                    </View>

                    <Spacer />
                    <View width='20%'
                          justifyContent='center'>
                      <View flexHorizontal onClick={() => this.onDeleteClick(device.id)} style={viewStyles.button}>
                        <Image source="/images/delete.png" width={14} height={18} />
                        <Spacer size="xsmall" phoneHidden/>
                        <Spacer size="tiny" phoneOnlyShown/>
                        <View>
                          <Spacer size="tiny" />
                          <Text fontSize="xsmall" cursor='pointer' >{strings.loginhistory.delete}</Text>
                        </View>
                      </View>
                    </View>

                  </View>
                </React.Fragment>
              )
            })}
            <Divider color='divider'/>
            <Spacer size="large"/>
            <View width='100%'>
              <Text fontSize="small" fontWeight="bold" paddingHorizontal="large">{strings.loginhistory.accesslogs}</Text>
              <Spacer/>
              <Divider color='divider'/>
              <View backgroundColor="white"
                    flexHorizontal
                    paddingHorizontal="large"
                    paddingVertical="medium"
                    phonePaddingHorizontal="xsmall"
                    phonePaddingVertical="xsmall">
                <View minWidth={50} width='23%' maxWidth={180} justifyContent='center'>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.time}</Text>
                </View>
                <Spacer />

                <View minWidth={60} width='23%' maxWidth={150} phoneHidden>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.platform}</Text>
                </View>
                <Spacer phoneHidden/>
                <View minWidth={60} width='23%' maxWidth={150} phoneHidden>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.browser}</Text>
                </View>

                <View minWidth={70} width='30%' maxWidth={250} justifyContent='center' phoneOnlyShown>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.platform}</Text>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.browser}</Text>
                </View>

                <Spacer phoneHidden/>
                <View minWidth={70} width='30%' maxWidth={170} justifyContent='center'>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.ip}</Text>
                </View>
                <Spacer/>

                <View width='20%' justifyContent='center'>
                  <Text fontSize="tiny" textColor='dark-gray'>{strings.loginhistory.status}</Text>
                </View>
              </View>
            </View>

            {loginHistories && loginHistories.map((history) => {
              return (
                <React.Fragment key={history.id}>
                  <Divider color='divider'/>
                  <View backgroundColor="white"
                        flexHorizontal
                        paddingHorizontal="large"
                        paddingVertical="medium"
                        phonePaddingHorizontal="xsmall"
                        phonePaddingVertical="xsmall">
                    <View minWidth={50} width='23%' maxWidth={180} justifyContent='center'>
                      <Text fontSize="xsmall" textColor='gray'>
                        {returnDate(history.createdAt + '.000+0000') + ' ' + returnTime(history.createdAt + '.000+0000')}
                      </Text>
                    </View>
                    <Spacer />
                    <View minWidth={60} width='23%' maxWidth={150} phoneHidden>
                      <Text fontSize="xsmall" textColor="gray">{history.os}</Text>
                    </View>
                    <Spacer phoneHidden/>
                    <View minWidth={60} width='23%' maxWidth={150} phoneHidden>
                      <Text fontSize="xsmall" textColor="gray">{history.browser}</Text>
                    </View>

                    <View minWidth={70} width='30%' maxWidth={250} justifyContent='center' phoneOnlyShown>
                      <Text fontSize="xsmall" textColor="gray">{history.os}</Text>
                      <Spacer size="tiny" />
                      <Text fontSize="xsmall" textColor="gray">{history.browser}</Text>
                    </View>

                    <Spacer phoneHidden/>
                    <View minWidth={70} width='30%' maxWidth={170} justifyContent='center'>
                      <Text fontSize="xsmall" textColor="gray">{history.ipAddr}</Text>
                    </View>
                    <Spacer />

                    <View width='20%' justifyContent='center'>
                      <Text fontSize="xsmall" textColor='gray'>
                        { history.registered ? strings.loginhistory.registered : strings.loginhistory.unregistered}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              )
            })}
            <Divider color='divider'/>
            <View flexHorizontal paddingVertical='small' justifyContent='center'>
              <Button title={strings.loginhistory.prev}
                      backgroundColor={loginHistoryPageNo > 1 ? 'iris' : 'light-gray'}
                      titleColor={loginHistoryPageNo > 1 ? 'white' : 'gray'}
                      fontSize="xsmall"
                      size="xsmall"
                      onPress={onPrevClick}/>
              <Spacer size='large' />
              <Button title={strings.loginhistory.next}
                      backgroundColor={nextPageNo !== null ? 'iris' : 'light-gray'}
                      titleColor={nextPageNo !== null ? 'white' : 'gray'}
                      fontSize="xsmall"
                      size="xsmall"
                      onPress={onNextClick}/>

            </View>
            <Spacer size="large"/>
          </View>
        </View>
        {
          showAlertPopup &&
          <Popup type="error"
                 message={popupMessage}
                 image='images/monotone.png'
                 buttonTitle={strings.loginhistory.continue}
                 onButtonClick={onPopupClick}/>
        }
        <div id="center" style={{position:'fixed', top:'50%', left:'50%'}}>
          <ClipLoader
            sizeUnit={"px"}
            size={40}
            color={'#5c6ac4'}
            loading={this.props.loading}
          />
        </div>
      </View>
    )
  }
}

export default LoginHistoryPage
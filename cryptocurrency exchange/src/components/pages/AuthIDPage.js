// @flow

import * as React from 'react'
import { View, Text, Image, Input, Button, Spacer, Divider } from '../controls'
import type {Profile} from '../../types/Profile'
import LocalizedStrings from 'localized-strings'

const strings = new LocalizedStrings({
  en: {
    authid: {
      title: 'Valid ID Authentication',
      desc: 'Please upload the following items to complete your ID authentication. Your uploaded items will be reviewed by our team to authenticate your ID.',
      step1: '1. Copy of your ID',
      step1desc1: 'Must be a valid ID (Identification Card, Driver License, or Passport)',
      step1desc2: 'Picture on the ID must be clearly identifiable',
      step1desc3: 'Please cover the last digits of the ID number before taking the picture',
      step2: '2. Picture of you holding the ID',
      step2desc1: 'Please attach a hand written name and today’s date note to your ID',
      step2desc2: 'Picture on the ID must be clearly identifiable',
      step2desc3: 'Please cover the last digits of the ID number before taking the picture',
      upload1: '1. Upload a copy of your ID',
      upload2: '2. Upload picture of you holding the ID',
      cancel: 'Cancel',
      upload: 'Upload',
      waitforconfirm: 'Waiting for review.'
    }
  },
  ko: {
    authid: {
      title: '신원 확인',
      desc: '신원 확인을 위해서 필요한 사진을 제출해 주세요. 담당자 검토 후 신원 확인이 완료됩니다. 보내주신 사진은 신원 확인 목적으로만 사용합니다. 개인정보처리방침에 따라 탈퇴 전까지는 안전하게 보관하고, 탈퇴 후에는 6개월 후 파기합니다.',
      step1: '1. 신분증 사진',
      step1desc1: '주민등록증, 운전면허증, 여권이 유효한 신분증으로 인정됩니다.',
      step1desc2: '신분증의 사진과 내용이 선명하게 나온 사진을 보내 주세요.',
      step1desc3: '신분증의 주민번호 뒷자리는 반드시 가려 주세요.',
      step2: '2. 신분증을 들고 있는 본인 사진',
      step2desc1: '자필로 이름과 오늘 날짜를 적은 메모',
      step2desc2: '신분증, 본인의 얼굴이 모두 선명하게 나오도록 예시처럼 촬영해 주세요.',
      step2desc3: '신분증의 주민번호 뒷자리는 반드시 가려 주세요.',
      upload1: '1. 신분증 사진 제출',
      upload2: '2. 신분증을 들고 있는 본인 사진 제출',
      cancel: '취소',
      upload: '전송',
      waitforconfirm: '담당자 검토 대기중입니다.'
    }
  }

})

type Props = {
  profile: Profile | null,
  idUploadReady: boolean,
  checkIdUploadReady: boolean,
  onUploadPress: (photoID: Object, photoSelf: Object) => void,
  onCancelAuthPress: () => void,
  onRequestPhotoIDValidate: () => void,
  language: string
}

type State = {
  photoID: Object | null,
  photoSelf: Object | null,
}

class AuthIDPage extends React.Component<Props, State> {
  state = {
    photoID: null,
    photoSelf: null,
  }

  componentDidMount() {
    this.props.onRequestPhotoIDValidate()
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  onUploadPress = () => {
    const {photoID, photoSelf} = this.state
    if (photoID === null || photoSelf === null) return

    this.props.onUploadPress(photoID, photoSelf)
  }

  fileSelect = (event: Event) => {
    const name = event.currentTarget.name
    const value = event.currentTarget.value

    switch (name) {
      case 'upload1':
        this.setState({
          photoID: value !== '' ? event.currentTarget.files[0] : null
        })
        break;

      case 'upload2':
        this.setState({
          photoSelf: value !== '' ? event.currentTarget.files[0] : null
        })
        break;
    }
  }

  render() {
    const {profile, idUploadReady, checkIdUploadReady, onCancelAuthPress} = this.props
    if (profile === null) return null

    const {photoID, photoSelf} = this.state
    const buttonColor = photoID !== null && photoSelf !== null ? 'iris' : 'light-blue'
    strings.setLanguage(this.props.language)
    return (
      <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="small">
        <Text fontSize="medium" fontWeight="bold" padding="large">{strings.authid.title}</Text>
        <Divider color='divider'/>
        <View alignItems="center">
          <View padding="large" maxWidth={840}>
            <Text fontSize="small" textColor='dark-gray'>{strings.authid.desc}</Text>
            <Spacer size='large'/>
            <Image source='images/myaccount/idupload1.png' width='100%' />
            <Spacer size='large'/>
            <Text fontWeight="bold">{strings.authid.step1}</Text>
            <Spacer size='large'/>
            <View flexHorizontal>
              <Text paddingHorizontal='small' textColor='dark-gray'>•</Text>
              <Text flex='fill' textColor='dark-gray'>{strings.authid.step1desc1}</Text>
            </View>
            <Spacer/>
            <View flexHorizontal>
              <Text paddingHorizontal='small' textColor='dark-gray'>•</Text>
              <Text flex='fill' textColor='dark-gray'>{strings.authid.step1desc2}</Text>
            </View>
            <Spacer/>
            <View flexHorizontal>
              <Text paddingHorizontal='small' textColor='dark-gray'>•</Text>
              <Text flex='fill' textColor='dark-gray'>{strings.authid.step1desc3}</Text>
            </View>
            <Spacer size='large'/>
          </View>

          <View padding="large" maxWidth={840}>
            <Image source='images/myaccount/idupload2.png' width='100%' />
            <Spacer size='large'/>
            <Text fontWeight="bold">{strings.authid.step2}</Text>
            <Spacer size='large'/>
            <View flexHorizontal>
              <Text paddingHorizontal='small' textColor='dark-gray'>•</Text>
              <Text flex='fill' textColor='dark-gray'>{strings.authid.step2desc1}</Text>
            </View>
            <Spacer/>
            <View flexHorizontal>
              <Text paddingHorizontal='small' textColor='dark-gray'>•</Text>
              <Text flex='fill' textColor='dark-gray'>{strings.authid.step2desc2}</Text>
            </View>
            <Spacer/>
            <View flexHorizontal>
              <Text paddingHorizontal='small' textColor='dark-gray'>•</Text>
              <Text flex='fill' textColor='dark-gray'>{strings.authid.step2desc3}</Text>
            </View>
            <Spacer size='large'/>
          </View>
        </View>
        <Divider color='divider'/>
        {
          checkIdUploadReady && !idUploadReady &&
          <View>
            <View padding="large">
              <Text textAlign='center' fontWeight='bold'>{strings.authid.waitforconfirm}</Text>
            </View>
          </View>
        }
        {
          idUploadReady &&
          <View>
            <View paddingHorizontal="large" paddingVertical="medium">
              <Text>{strings.authid.upload1}</Text>
              <Spacer/>
              <Input type="file" onChange={this.fileSelect} name="upload1"/>
            </View>
            <Divider color='divider'/>
            <View paddingHorizontal="large" paddingVertical="medium">
              <Text>{strings.authid.upload2}</Text>
              <Spacer/>
              <Input type="file" onChange={this.fileSelect} name="upload2"/>
            </View>
            <Divider color='divider'/>
            <View padding="large">
              <View flexHorizontal>
                <Button title={strings.authid.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelAuthPress}/>
                <Spacer />
                <Button title={strings.authid.upload}
                        flex="fill"
                        color={buttonColor}
                        borderColor={buttonColor}
                        titleColor="white"
                        onPress={this.onUploadPress}/>
              </View>
            </View>
          </View>
        }
        {
          !idUploadReady &&
          <View padding="large">
            <Button title={strings.authid.cancel} flex="fill" titleWeight="normal" backgroundColor="white" onPress={onCancelAuthPress}/>
          </View>
        }

      </View>
    )
  }
}

export default AuthIDPage
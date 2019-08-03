// @flow

import * as React from 'react'
import { View, Text, Image, Button, Spacer, Divider } from '../controls'
import type {Profile} from '../../types/Profile'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import viewStyles from '../controls/View.css'
import Switch from 'react-switch'
import myaccountStyles from '../../styles/MyAccountPage.css'

const strings = new LocalizedStrings({
  en: {
    info: {
      title: 'My Account',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      mobile: 'Mobile',
      name: 'Name',
      authlevel: 'Authentication Level',
      agreements: 'Communication Preference',
      receiveemail: 'Email communications',
      receivesms: 'SMS communications',
      delete: 'Delete My Account',
      cancel: 'Cancel',
      save: 'Save',
      update: 'Update',
      level: 'Level ',
      nextlevel: 'Next Level',
      address: 'Address',
      noAddress: '(Required for Withdrawal)',
      addaddress: 'Add Address',
    }
  },
  ko: {
    info: {
      title: '회원정보',
      email: '이메일',
      username: '별명',
      password: '비밀번호',
      mobile: '휴대전화',
      name: '이름',
      authlevel: '보안등급',
      agreements: '이벤트 및 중요 안내 수신 동의',
      receiveemail: 'Email 수신에 동의합니다.',
      receivesms: 'SMS 수신에 동의합니다.',
      delete: '회원탈퇴',
      cancel: '취소',
      save: '저장',
      update: '변경',
      level: '',
      level1: ' 단계',
      nextlevel: '다음 단계',
      address: '주소',
      noAddress: '(출금 시 필요)',
      addaddress: '주소등록',
    }
  }
})

type Props = {
  profile: Profile | null,
  language: string,

  onUpdatePress: (type: string) => void,
  onDeleteAccountPress: () => void,
  onSwitchChange: (string) => void,
  handleAddressPress: () => void,
}

type State = {
}

class InfoPage extends React.Component<Props, State> {

  state = {
  }

  onAgreeEmailChange = () => {
    this.props.onSwitchChange('email')
  }

  onAgreeSmsChange = () => {
    this.props.onSwitchChange('sms')
  }

  handleMobileUpdateClick = () => {
    this.props.onUpdatePress('mobileauth')
  }

  handleNicknameUpdateClick = () => {
    this.props.onUpdatePress('nickname')
  }

  handlePasswordUpdateClick = () => {
    this.props.onUpdatePress('password')
  }

  handleAddressUpdateClick = () => {
    this.props.handleAddressPress()
  }

  handleLevelUpdateClick = () => {
    this.props.onUpdatePress('level')
  }

  componentDidMount() {
    const { profile } = this.props
    const level: number = Number(profile.level.substr(5, 1))

    if (level > 1 && !profile.userAddress)
      this.handleAddressUpdateClick()
  }

  render() {
    const { profile, onUpdatePress, onDeleteAccountPress } = this.props
    if (profile === null) return null

    const level: number = Number( profile.level.substr(5, 1) )
    strings.setLanguage(this.props.language)
    return (
      <View style={styles.dontshrink} width="100%" flex="fill">
        <Text style={myaccountStyles.title}>{strings.info.title}</Text>
        <Spacer size="small" />
        <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="small">
          { level > 1 &&
            <View>
              <Spacer size="tiny"/>
              <View flexHorizontal paddingVertical="medium">
                <Text textColor="gray">{strings.info.name}:</Text>
                <Spacer />
                <Text>{ profile.name }</Text>
              </View>
              <Spacer size="tiny"/>
              <Divider color='divider'/>

              <View flexHorizontal paddingVertical="medium" justifyContent="space-between">
                <View flexHorizontal paddingVertical="tiny">
                  <Text textColor="gray">{strings.info.mobile}:</Text>
                  <Spacer />
                  <Text>{ profile.mobileNum }</Text>
                </View>
                <Button title={strings.info.update}
                        titleWeight="normal"
                        backgroundColor="white"
                        fontSize="xsmall"
                        size="xsmall"
                        onPress={this.handleMobileUpdateClick} />
              </View>
              <Divider color='divider'/>
            </View>
          }
          <Spacer size="tiny"/>
          <View flexHorizontal paddingVertical="medium">
            <Text textColor="gray">{strings.info.email}:</Text>
            <Spacer />
            <Text>{ profile.email }</Text>
          </View>
          <Spacer size="tiny"/>
          <Divider color='divider'/>

          <View flexHorizontal  paddingVertical="medium" justifyContent="space-between">
            <View flexHorizontal paddingVertical="tiny">
              <Text textColor="gray">{strings.info.username}:</Text>
              <Spacer />
              <Text>{ profile.nickname }</Text>
            </View>
            <Button title={strings.info.update}
                    titleWeight="normal"
                    backgroundColor="white"
                    fontSize="xsmall"
                    size="xsmall"
                    onPress={this.handleNicknameUpdateClick} />
          </View>
          <Divider color='divider'/>

          <View flexHorizontal paddingVertical="medium" justifyContent="space-between">
            <View flexHorizontal paddingVertical="tiny">
              <Text textColor="gray">{strings.info.password}:</Text>
              <Spacer />
              <Text>********</Text>
            </View>
            <Button title={strings.info.update}
                    titleWeight="normal"
                    backgroundColor="white"
                    fontSize="xsmall"
                    size="xsmall"
                    onPress={this.handlePasswordUpdateClick} />
          </View>
          <Divider color='divider'/>

          <View flexHorizontal paddingVertical="medium" justifyContent="space-between">
            <View flexHorizontal paddingVertical="tiny">
              <Text textColor="gray">{strings.info.address}:</Text>
              <Spacer />
              {profile.userAddress &&
              <View flexHorizontal phoneFlexVertical><Text>{profile.userAddress.roadAddress}</Text>
                <Spacer size='tiny'/>
                <Text>{profile.userAddress.roadDetailAddress} ({profile.userAddress.postalCode})</Text></View>}
              {!profile.userAddress &&
              <Text textColor='gray'>{strings.info.noAddress}</Text>}
            </View>
            {profile.userAddress &&
            <Button title={strings.info.update}
              titleWeight="normal"
              backgroundColor="white"
              fontSize="xsmall"
              size="xsmall"
              onPress={this.handleAddressUpdateClick} />}
            {!profile.userAddress &&
            <Button title={strings.info.addaddress}
              titleWeight="normal"
              titleColor="white"
              backgroundColor="iris"
              fontSize="xsmall"
              size="xsmall"
              onPress={this.handleAddressUpdateClick} />}
          </View>
          <Divider color='divider'/>

          <View flexHorizontal paddingVertical="medium" justifyContent="space-between">
            <View flexHorizontal paddingVertical="tiny">
              <Text textColor="gray">{strings.info.authlevel}:</Text>
              <Spacer />
              <Text>{ strings.info.level !== '' ? strings.info.level + level : level + strings.info.level1 }</Text>
            </View>

            <View flexHorizontal justifyContent="flex-end" onClick={this.handleLevelUpdateClick} style={viewStyles.button}>
              <View>
                <Spacer size="tiny" />
                <Text textColor="iris">{strings.info.nextlevel}</Text>
              </View>
              <Spacer size="tiny" />
              <Image source="/images/chevron-right.png" width={20} height={20}/>
            </View>
          </View>
          <Spacer size="large"/>

          <View flexHorizontal paddingVertical="medium">
            <Text fontWeight="bold">{strings.info.agreements}</Text>
          </View>
          <View flexHorizontal paddingVertical="medium" justifyContent="space-between">
            <Text>{strings.info.receiveemail}</Text>
            <Switch
              onChange={this.onAgreeEmailChange}
              checked={profile.agreeEmail}
              onColor="#7ed321"
              onHandleColor="#ffffff"
              offColor="#dfe3e8"
              offHandleColor="#f4f6f8"
              height={20}
              width={40}
              uncheckedIcon={false}
              checkedIcon={false}
              id="email"
            />
          </View>
          <Divider color='divider'/>

          <View flexHorizontal paddingVertical="medium" justifyContent="space-between">
            <Text>{strings.info.receivesms}</Text>
            <Switch
              onChange={this.onAgreeSmsChange}
              checked={profile.agreeSms}
              onColor="#7ed321"
              onHandleColor="#ffffff"
              offColor="#dfe3e8"
              offHandleColor="#f4f6f8"
              height={20}
              width={40}
              uncheckedIcon={false}
              checkedIcon={false}
              id="sms"
            />
          </View>

          <Spacer size="large"/>
          <View flexHorizontal
                paddingVertical="medium"
                justifyContent="space-between"
                onClick={onDeleteAccountPress}>
            <View>
              <Spacer size='tiny' />
              <Text textColor='up-red'>{strings.info.delete}</Text>
            </View>
            <Image source="/images/chevron-right.png" width={20} height={20}/>
          </View>

        </View>
      </View>
    )
  }
}

export default InfoPage


// @flow
import * as React from 'react'
import { View, Text, Button, Spacer, Divider } from '../controls'
import type {Profile} from '../../types/Profile'
import AuthMobilePage from './AuthMobilePage'
import AuthTFAPage from './AuthTFAPage'
import AuthIDPage from './AuthIDPage'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import viewStyles from '../controls/View.css'
import myaccountStyles from '../../styles/MyAccountPage.css'

const strings = new LocalizedStrings({
  en: {
    auth: {
      title: 'Authentication',
      description: 'Your current authenticated status',
      password: 'Password',
      cancel: 'Cancel',
      continue: 'Continue',
      level: 'Level',
      level1auth: 'Email Authentication',
      level2auth: 'Mobile Authentication',
      level3auth: '2FA Authentication',
      level4auth: 'Valid ID Authentication',
      level4authbutton: 'ID Authentication',
      level1authDone: 'Email Authenticated',
      level2authDone: 'Mobile Authenticated',
      level3authDone: '2FA Authenticated',
      level4authDone: 'Valid ID Authenticated',
      level1authDescTitle: 'Why Level ',
      level1authDesc: 'To unlock unlimited deposits and 1 bitcoin withdraw, Level 2 authentication is required.',
      level2authDesc: 'Lower service fee will be applied when you complete 2 factor authentication.',
      level3authDesc: 'Authenticating your self with a valid ID will unlock 100 daily bitcoin withdrawals and more.',
      level4authDesc: 'Thank you. Your ID has been verified.',
      start: 'Start ',
      authlevel: 'Authentication Level',
      deplimit: 'Dep. Limit',
      withdrawlimit: 'Withdraw Limit',
      fee: 'Fee',
      api: 'API',
      levels: 'Levels',
      canttrade: 'Can’t Trade',
      unlimited: 'Unlimited',
      address: 'Add Address',
      addressDone: 'Address Registered',
    }
  },
  ko: {
    auth: {
      title: '보안인증',
      description: '',
      description1: '님의 현재 보안등급은 ',
      description2: '단계입니다.',
      password: '비밀번호',
      cancel: '취소',
      continue: '확인',
      level: '',
      level1: '단계',
      level2: '단계 인증',
      level1auth: '이메일 인증',
      level2auth: '휴대전화 인증',
      level3auth: '이중 인증',
      level4auth: '신원 확인',
      level4authbutton: '신원 확인',
      level1authDone: '이메일 인증됨',
      level2authDone: '휴대전화 인증됨',
      level3authDone: '이중 인증됨',
      level4authDone: '신원 확인됨',
      level1authDescTitle: '',
      level1authDesc: '',
      level2authDesc: '',
      level3authDesc: '',
      level4authDesc: '',
      start: '',
      start1: ' 시작',
      authlevel: '보안 등급',
      deplimit: '입금한도',
      withdrawlimit: '출금한도',
      fee: '거래수수료',
      api: 'API 이용',
      levels: '등급',
      canttrade: '거래불가',
      unlimited: '무제한',
      address: '주소 등록',
      addressDone: '주소 등록됨',
    }
  }
})

type Props = {
  profile: Profile | null,
  onAuth: boolean,
  qrCodeImage: string,
  secretKey: string,
  idUploadReady: boolean,
  checkIdUploadReady: boolean,

  onStartAuthPress: () => void,
  onCancelAuthPress: () => void,
  onConfirmPress: (string) => void,
  onRequestQRCode: () => void,
  onUploadPress: (photoID: Object, photoSelf: Object) => void,
  onRequestPhotoIDValidate: () => void,
  onCheckProfile: () => void,
  handleAddressPress: () => void,

  closePopupAndShowResult: (result: boolean, type: string) => void,
  language: string
}

type State = {
}

class AuthPage extends React.Component<Props, State> {

  authProcessPage: { current: null | HTMLDivElement }

  constructor(props: Props) {
    super(props)
    this.authProcessPage = React.createRef()
  }

  componentDidMount() {
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  getAuthenticationType = (level: number) => {
    let type: string
    switch (level) {
      case 1:
        type = strings.auth.level1auth
        break

      case 2:
        type = strings.auth.level2auth
        break

      case 3:
        type = strings.auth.level3auth
        break

      case 4:
        type = strings.auth.level4auth
        break

      default:
        type = ''
        break
    }
    return type
  }

  getAuthenticatedType = (level: number) => {
    let type: string
    switch (level) {
      case 1:
        type = strings.auth.level1authDone
        break

      case 2:
        type = strings.auth.level2authDone
        break

      case 3:
        type = strings.auth.level3authDone
        break

      case 4:
        type = strings.auth.level4authDone
        break

      default:
        type = ''
        break
      }
    return type
  }

  getAuthenticationDescription = (level: number) => {
    let description:string
    switch (level) {
      case 1:
        description = strings.auth.level1authDesc
        break

      case 2:
        description = strings.auth.level2authDesc
        break

      case 3:
        description = strings.auth.level3authDesc
        break

      case 4:
        description = strings.auth.level4authDesc
        break;

      default:
        description = ''
        break
    }
    return description
  }

  setFocus = () => {
    if (this.authProcessPage.current !== null) this.authProcessPage.current.setFocus()
  }

  handleAddressUpdateClick = () => {
    this.props.handleAddressPress()
  }

  render() {
    const {profile, onAuth,  qrCodeImage, secretKey, idUploadReady, checkIdUploadReady,
      onStartAuthPress, onCancelAuthPress, onConfirmPress,
      onRequestQRCode, onUploadPress, onRequestPhotoIDValidate, closePopupAndShowResult, onCheckProfile} = this.props;
    if (profile === null) return null;

    strings.setLanguage(this.props.language)

    const level: number = Number(profile.level.substr(5, 1))
    const authTypeCurrent: string = this.getAuthenticatedType(level)
    const authTypeNext: string = this.getAuthenticationType(level + 1)


    return (

      <View style={styles.dontshrink} width="100%" flex="fill">
        <Text style={myaccountStyles.title}>{strings.auth.title}</Text>
        <Spacer size="small" />
        {!onAuth &&
          <View backgroundColor="white" width="100%" paddingHorizontal="xlarge" phonePaddingHorizontal="small">
            <Spacer size="medium" />
            <Text fontWeight="bold" paddingHorizontal="large">
              {strings.auth.description !== '' ? strings.auth.description
                : profile.nickname + strings.auth.description1 + level + strings.auth.description2}
            </Text>
            <Spacer size="medium"/>
            <Divider color='divider'/>

            <View>
              { level < 4 &&
              <View>
                <View paddingVertical="medium">
                  <View flexHorizontal>
                    <View alignItems="center" width="50%">
                      <Text textColor='dark-gray'>
                        {
                          strings.auth.level !== '' ? strings.auth.level + level
                          : level + strings.auth.level1
                        }
                        </Text>
                      <Spacer size="xsmall"/>
                      <Text textColor='dark-gray'>{authTypeCurrent}</Text>
                    </View>
                    <View alignItems="center" width="50%" opacity="0.44">
                      <Text textColor='dark-gray'>
                        {
                          strings.auth.level !== '' ? strings.auth.level + (level + 1)
                            : (level + 1) + strings.auth.level1
                        }
                      </Text>
                      {level === 1 && !profile.userAddress &&
                      <>
                        <Spacer size="xsmall"/>
                        <Text textColor='dark-gray'>{strings.auth.address}</Text>
                      </>}
                      {level === 1 && profile.userAddress &&
                      <>
                        <Spacer size="xsmall"/>
                        <Text textColor='dark-gray'>{strings.auth.addressDone}</Text>
                      </>}
                      <Spacer size="xsmall"/>
                      <Text textColor='dark-gray'>{authTypeNext}</Text>
                    </View>
                  </View>
                </View>
                <Divider color='divider'/>
                <View padding="large">
                  {
                    strings.auth.level1authDescTitle !== '' &&
                    <View>
                      <Text textColor='dark-gray' fontWeight="bold">
                        {strings.auth.level1authDescTitle !== '' ? strings.auth.level1authDescTitle + (level + 1) + "?" : ''}
                      </Text>
                      <Spacer/>
                      <Text textColor='dark-gray'>{this.getAuthenticationDescription(level)}</Text>
                      <Spacer size="xlarge"/>
                    </View>
                  }
                  {level === 1 && !profile.userAddress ?
                    <Button title={strings.auth.start !== '' ? strings.auth.start + strings.auth.address : strings.auth.address + strings.auth.start1}
                            titleWeight="normal"
                            color="iris"
                            titleColor="white"
                            onPress={this.handleAddressUpdateClick}
                            maxWidth={400}/>
                    :
                    <Button title={level < 3
                      ? strings.auth.start !== '' ? strings.auth.start + authTypeNext : authTypeNext + strings.auth.start1
                      : strings.auth.start !== '' ? strings.auth.start + strings.auth.level4authbutton : strings.auth.level4authbutton + strings.auth.start1}
                            titleWeight="normal"
                            color="iris"
                            titleColor="white"
                            onPress={onStartAuthPress}
                            maxWidth={400}/>
                  }
                  <Spacer size="small"/>
                </View>
              </View>
              }
              {
                level === 4 &&
                <View>
                  <View paddingVertical="medium">
                    <View alignItems="center">
                      <Text textColor='dark-gray'>
                        {
                          strings.auth.level !== '' ? strings.auth.level + level
                            : level + strings.auth.level1
                        }
                      </Text>
                      <Spacer size="xsmall"/>
                      <Text textColor='dark-gray'>{authTypeCurrent}</Text>
                    </View>
                  </View>
                  {
                    this.getAuthenticationDescription(level) !== '' &&
                    <React.Fragment>
                      <Divider color='divider'/>
                      <View padding="large">
                        <Text fontSize="small" textColor='dark-gray' fontWeight="bold">{this.getAuthenticationDescription(level)}</Text>
                      </View>
                    </React.Fragment>
                  }
                </View>
              }
            </View>
            <Divider color='divider'/>

            <View padding="large">
              <Text fontWeight="bold">{strings.auth.authlevel}</Text>
            </View>
            <Divider color='divider'/>

            <View overflow='auto'>
              <View flexHorizontal style={styles.dontshrink} flex="fill">
                <View paddingVertical="medium" width='10%' minWidth={50} style={viewStyles.rowBorder}>
                  <Text textAlign='right'textColor="gray">{strings.auth.levels}</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={80} style={viewStyles.rowBorder}>
                  <Text textAlign='right'textColor="gray">{strings.auth.deplimit}</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={120} style={viewStyles.rowBorder}>
                  <Text textAlign='right'textColor="gray">{strings.auth.withdrawlimit}</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={90} style={viewStyles.rowBorder}>
                  <Text textAlign='right'textColor="gray">{strings.auth.fee}</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={70} style={viewStyles.rowBorder}>
                  <Text textAlign='right'textColor="gray">{strings.auth.api}</Text>
                </View>
                <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
              </View>

              <View flexHorizontal style={styles.dontshrink}>
                <View paddingVertical="medium" width='10%' minWidth={50} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>LV. 1</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={80} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>0원</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={120} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>0원</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={90} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>{strings.auth.canttrade}</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={70} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>X</Text>
                </View>
                <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
              </View>

              <View flexHorizontal style={styles.dontshrink}>
                <View paddingVertical="medium" width='10%' minWidth={50} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>LV. 2</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={80} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>{strings.auth.unlimited}</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={120} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>10,000,000원</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={90} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>0.1%</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={70} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>X</Text>
                </View>
                <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
              </View>

              <View flexHorizontal style={styles.dontshrink}>
                <View paddingVertical="medium" width='10%' minWidth={50} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>LV. 3</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={80} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>{strings.auth.unlimited}</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={120} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>10,000,000원</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={90} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>0.05%</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={70} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>X</Text>
                </View>
                <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
              </View>

              <View flexHorizontal style={styles.dontshrink}>
                <View paddingVertical="medium" width='10%' minWidth={50} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>LV. 4</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={80} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>{strings.auth.unlimited}</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={120} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>1,000,000,000원</Text>
                </View>
                <View paddingVertical="medium" width='25%' minWidth={90} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>0.05%</Text>
                </View>
                <View paddingVertical="medium" width='20%' minWidth={70} style={viewStyles.rowBorder}>
                  <Text textAlign='right'>O</Text>
                </View>
                <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
              </View>

            </View>
          </View>
        }
        {onAuth && level === 1 &&
          <View>
            <AuthMobilePage profile={profile}
                            onCancelAuthPress={onCancelAuthPress}
                            closePopupAndShowResult={closePopupAndShowResult}
                            onCheckProfile={onCheckProfile}
                            ref={this.authProcessPage}
            language={this.props.language}/>
          </View>
        }
        {onAuth && level === 2 &&
          <View>
            <AuthTFAPage profile={profile}
                         qrCodeImage={qrCodeImage}
                         secretKey={secretKey}
                         onConfirmPress={onConfirmPress}
                         onCancelAuthPress={onCancelAuthPress}
                         onRequestQRCode={onRequestQRCode}
                         ref={this.authProcessPage}
                         language={this.props.language}/>
          </View>
        }
        {onAuth && level === 3 &&
        <View>
          <AuthIDPage profile={profile}
                      idUploadReady={idUploadReady}
                      checkIdUploadReady={checkIdUploadReady}
                      onUploadPress={onUploadPress}
                      onCancelAuthPress={onCancelAuthPress}
                      onRequestPhotoIDValidate={onRequestPhotoIDValidate}
                      ref={this.authProcessPage}
                      language={this.props.language}/>
        </View>
        }

      </View>
    )
  }
}

export default AuthPage

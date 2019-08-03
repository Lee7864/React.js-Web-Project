// @flow

import * as React from 'react'
import { View, Text, Spacer, Button, Input } from '../controls'
import LocalizedStrings from 'localized-strings'
import addressStyle from '../../styles/ResidenceAddressPage.css'
import type { Profile, Address } from '../../types/Profile'
import {connect} from 'react-redux'
import { API_URL, JUSO_API_KEY, JUSO_MOBILE_API_KEY, JUSO_URL, JUSO_MOBILE_URL, MOBILE_FILTER } from '../../config'
import {userService} from '../../redux/services'
import {store} from '../../redux'


const strings = new LocalizedStrings({
  en: {
    juso: {
      title: 'Add Address',
      desc: 'The address registration is required in order to prevent money laundering and illicit fund transfers.\n' +
        '\n' +
        'You may opt out of Quanty’s collection and use personal information, but you will not be able to withdraw KRW and crypto funds from your account.',
      zipcode: 'Postal Code',
      address1: 'Address 1',
      address2: 'Address 2',
      lookup: 'Look up',
      agreeTitle: 'Privacy Policy & Data Usage Agreement',
      agreeText: 'Purpose: Anti Money Laundering and prevention of illicit fund transfer\n' +
      'Content: Residential Address\n' +
      'Data stored until: Deletion of account or date ordered by the court ',
      agreeCheckText: 'I agree to the terms above.',
      cancel: 'Cancel',
      add: 'Add Address',
      notAgree: 'Please agree to the terms.',
      notComplete: 'Please enter your address.',
      addresschanged: 'Your address has been registered.',
    }
  },
  ko: {
    juso: {
      title: '주소등록',
      desc: '퀀티는 불법자금 유입 및 자금세탁 방지를 위해 주소 정보를 필수로 수집합니다.\n' +
        '\n' +
        '개인정보 수집 및 이용 동의에 거부하실 수 있으며, 거부하시는 경우 암호화폐 및 KRW 출금이 제한됩니다.\n',
      zipcode: '우편번호',
      address1: '기본 주소',
      address2: '상세 주소',
      lookup: '우편번호 찾기',
      agreeTitle: '개인정보 수집 및 이용 동의',
      agreeText: '목적: 불법자금유입 및 자금세탁방지\n' +
      '항목: 주소(거주지)\n' +
      '보유기간: 회원탈퇴 시까지, 법령이 정한 시점',
      agreeCheckText: '개인정보 수집 및 이용에 동의 합니다.',
      cancel: '취소',
      add: '주소등록',
      notAgree: '개인정보 수집 및 이용에 동의하셔야 합니다.',
      notComplete: '주소를 입력해 주세요.',
      addresschanged: '주소가 등록되었습니다.',
    }
  }
})


type Props = {
  language: string,
  profile: Profile | null,
  data: Object,
  onCancelClick: () => void,
  onShowPopup: (type: string, message: string) => void,
}

type State = {
  agree: boolean,
  postalCode: string,
  roadAddress: string,
  roadDetailAddress: string,
  showResidenceAddress: boolean,
  showAlert: boolean,
  message: string,
}


class ResidenceAddressPage extends React.Component<Props, State> {
  state = {
    agree: false,
    postalCode: '',
    roadAddress: '',
    roadDetailAddress: '',
    showResidenceAddress: true,
    showAlert: false,
    message: '',
  }

  treatNewline(str: string)  {
    return     str.split('\n').map( (line, index) => {
      return (<React.Fragment key={index}>{line}<br/></React.Fragment>)
    })
  }

  handleAgreeCheck = () => {
    const { agree } = this.state

    this.setState({
      agree: !agree
    })
  }

  handleChangeAddress = (e: SyntheticEvent<HTMLInputElement>) => {
    if(e.currentTarget.value !== this.state.roadDetailAddress)
      this.setState({roadDetailAddress: e.currentTarget.value})
  }


  handleAddAddress = () => {
    const { data, onCancelClick, onShowPopup } = this.props
    const { agree, postalCode, roadAddress, roadDetailAddress} = this.state

    if (!agree) {
      this.props.onShowPopup('error', strings.juso.notAgree)
      return
    }

    if(!postalCode || !roadAddress || !roadDetailAddress)  {
      this.props.onShowPopup('error', strings.juso.notComplete)
      return
    }

    let body = {
      'postalCode': postalCode,
      'roadAddress': roadAddress,
      'roadDetailAddress': roadDetailAddress,
    }

    fetch(`${API_URL}/user_address`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    }).then(response => {
      if (response.ok) {
        onShowPopup('success', strings.juso.addresschanged)
        onCancelClick()

        data.callback() // MyAccountContainer profile 정보 갱신
        store.dispatch(userService.get_profile()) // store profile 정보 갱신
      } else {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
          default:
            const errorReason = json.error.reasons
            onShowPopup('error', errorReason[0].message)
            break
          }
        })
      }
    }).catch(error => {
      //console.log(error)
    })
  }


  handleJusoPopup = () => {
    let isMobile = !navigator.platform.toLowerCase().match(MOBILE_FILTER)

    if (isMobile) {
      let open_url = `${JUSO_MOBILE_URL}?confmKey=${JUSO_MOBILE_API_KEY}&resultType=3&returnUrl=${encodeURIComponent(API_URL)}/juso/callback`

      window.open(open_url, 'pop', 'scrollbars=yes, resizable=yes')
    } else {
      let open_url = `${JUSO_URL}?confmKey=${JUSO_API_KEY}&resultType=3&returnUrl=${encodeURIComponent(API_URL)}/juso/callback`

      window.open(open_url, 'pop', 'width=570, height=420, scrollbars=yes, resizable=yes')
    }

    window.addEventListener('message', this.handlePostMessage)
  }


  handlePostMessage = (event: MessageEvent) => {
    window.removeEventListener('message', this.handlePostMessage)

    if (typeof event.data === 'string' || event.data instanceof String) {
      Promise.resolve(event.data)
        .then(data => {
          let result = JSON.parse(data)

          if(result.postMessageType === 'USER_ADDRESS' && result.message) {
            let address = result.message

            this.setState({
              postalCode: address.postalCode,
              roadAddress: address.roadAddrPart1,
              roadDetailAddress: address.customerDetailAddr
            })
          }
        })
        .catch(error => {
          //console.log(error)
        })
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.profile && props.profile.userAddress && !state.postalCode)
      return {
        postalCode: props.profile.userAddress.postalCode,
        roadAddress: props.profile.userAddress.roadAddress,
        roadDetailAddress: props.profile.userAddress.roadDetailAddress,
      }

    return null
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage)
  }

  render() {
    const { profile, language, onCancelClick } = this.props
    const { postalCode, roadAddress, roadDetailAddress } = this.state

    strings.setLanguage(language)

    return(
      <View style={addressStyle.addressPopup} overflow='auto'>
        <View  style={addressStyle.addressTitle} >
          <Text fontWeight='semibold' style={addressStyle.addressTitleText}>{strings.juso.title}</Text>
        </View>
        <View style={addressStyle.addressBody}>
          <View >
            <Text textColor='dark-gray' fontWeight='normal'>{this.treatNewline(strings.juso.desc)}</Text>
          </View>

          <Spacer size='large'/>
          <View  flexHorizontal>
            <Input placeholder={strings.juso.zipcode}
              border='normal'
              borderColor='gray'
              width={170}
              height={36}
              name='zipcode'
              readOnly={true}
              value={postalCode}
            />
            <Spacer size='xsmall'/>
            <Button title={strings.juso.lookup}
              width={120}
              titleColor='white'
              color='iris'
              onPress={this.handleJusoPopup.bind(this)}
              style={addressStyle.addressButtontext}
              flex='fill'/>
          </View>
          <Spacer size='xsmall'/>
          <View>
            <Input placeholder={strings.juso.address1}
              border='normal'
              borderColor='gray'
              width={300}
              height={36}
              name='address1'
              fontSize='14px'
              readOnly={true}
              value={roadAddress}
            />
          </View>
          <Spacer size='small'/>
          <View>
            <Input placeholder={strings.juso.address2}
              border='normal'
              borderColor='gray'
              width={300}
              height={36}
              name='address2'
              fontSize='14px'
              value={roadDetailAddress}
              onChange={this.handleChangeAddress}
            />
          </View>

          <Spacer size='large'/>
          <View>
            <Text fontWeight='bold' style={addressStyle.agreeTitle}>
              {this.treatNewline(strings.juso.agreeTitle)}
            </Text>
          </View>
          <Spacer height={10}/>
          <View border='normal' borderColor='gray' style={addressStyle.agreeText} height={language==='ko'?70:102}>
            <Text padding='small' style={addressStyle.agreeTitle}>
              {this.treatNewline(strings.juso.agreeText)}
            </Text>
          </View>
          <Spacer size='xsmall' />
          <View>
            <label>
              <View flexHorizontal alignItems='center'>
                <Input type='checkbox' width={16} height={16} name='addressAgree' onChange={this.handleAgreeCheck}/>
                <Spacer size='tiny'/>
                <Text style={addressStyle.agreeCheck}>
                  {this.treatNewline(strings.juso.agreeCheckText)}
                </Text>
              </View>
            </label>
          </View>
        </View>

        <View style={addressStyle.addressBody}>
          <View flexHorizontal>
            <Button title={strings.juso.cancel}
              height={36}
              titleWeight='normal'
              onPress={onCancelClick}
              style={addressStyle.addressButtontext14}
              flex='fill'
            />
            <Spacer size='xsmall'/>
            <Button title={strings.juso.add}
              height={36}
              titleWeight='normal'
              titleColor='white'
              color='iris'
              onPress={this.handleAddAddress}
              style={addressStyle.addressButtontext14}
              flex='fill'
            />
          </View>
          <Spacer size='large'/>
        </View>
      </View>
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

export default connect(mapStateToProps)(ResidenceAddressPage)
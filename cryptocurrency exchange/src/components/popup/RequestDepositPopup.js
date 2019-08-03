// @flow

import * as React from 'react'
import { View, Text, Spacer, Image, Button } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import {connect} from 'react-redux'
import balanceStyle from '../../styles/BalancePage.css'
import {API_URL} from '../../config'
import {CopyToClipboard} from 'react-copy-to-clipboard'
var QRCode = require('qrcode.react')

const strings = new LocalizedStrings({
  en: {
    assets: {
      erroroccurred: 'An error occurred.',
    },
    deposit: {
      address: 'Deposit Address',
      important: 'Important!',
      copyAddrDesc1: 'Send only {0} to this deposit address. Sending any other coin or token to this address may result in the loss of your deposit.',
      copyAddr: 'Copy Address',
      copied: 'Your ({0}) address has been copied to your clipboard.',
      allocAddrComplete: 'Your ({0}) address has been generated.',
      allocAddr: 'Generate New {0} Address',
      allocAddrDesc: 'To deposit {0}, you must generate a new {0} address by pressing this button.',
      bchSuspended: 'Suspended due to hard fork',
      title: 'Deposit {0}'
    }
  },
  ko: {
    assets: {
      erroroccurred: '오류가 발생했습니다.',
    },
    deposit: {
      address: '입금주소',
      important: '입금 전 반드시 주의하세요.',
      copyAddrDesc1: '- 이 주소는 {0} 입금만 가능합니다.',
      copyAddrDesc2: '- 다른 암호화폐를 이 주소로 잘못 입금하면 손실될 수 있으니 주의해 주세요.',
      copyAddrDesc3: '- 암호화폐별 추가 주의사항',
      copyAddrDesc3KRW: ' ',
      copyAddrDesc3BTC: '- 비트코인 캐시(BCH)나 비트코인 골드(BTG)를 이 주소로 입금하지 않도록 특히 주의 바랍니다. 블록체인 네트워크에서 6번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3BCH: '- 블록체인 네트워크에서 6번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3BTG: '- 블록체인 네트워크에서 50번 승인 후 잔고에  반영됩니다.',
      copyAddrDesc3ETH: '- 이더리움 클래식(ETC)을 이 주소로 입금하지 않도록 특히 주의 바랍니다. 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3ETC: '- 이더리움(ETH)을 이 주소로 입금하지 않도록 특히 주의 바랍니다. 블록체인 네트워크에서 500번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3GNT: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3LTC: '- 블록체인 네트워크에서 6번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3OMG: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3POWR: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3REP: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3SNT: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3ZIL: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddrDesc3ZRX: '- 블록체인 네트워크에서 48번 승인 후 잔고에 반영됩니다.',
      copyAddr: '입금주소 복사',
      copied: '{0} 입금주소가 복사되었습니다.',
      allocAddrComplete: '{0} 입금주소가 생성되었습니다.',
      allocAddr: '{0} 입금주소 생성',
      allocAddrDesc: '입금하려면 {0} 입금주소 생성 버튼을 클릭해 주세요.',
      bchSuspended: '하드포크로 입출금 중지',
      title: '{0} 입금'
    }
  }
})

type Props = {
  language: string,
  data: Object,
  onClose: () => void,
  onShowPopup: (type: string, message: string) => void,
}

type State = {
  depositAddress: string | null,
}

class RequestDepositPopup extends React.Component<Props, State> {

  state = {
    depositAddress: this.props.data.addressInfo.address
  }

  handleDepositAllocateClick = () => {
    const symbol = this.props.data.selectedBalance.currencySymbol

    Promise.all([
      fetch(`${API_URL}/myaccount/deposit/${symbol}/address/allocate`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => (
      Promise.all(responses.map(response => response.json()))
    )).then(([addressInfo]) => {
      if (addressInfo.address !== null) {
        this.setState({
          depositAddress: addressInfo.address
        })
        this.props.onShowPopup('success', strings.formatString(strings.deposit.allocAddrComplete, symbol))

      } else {
        this.props.onShowPopup('error', strings.assets.erroroccurred)
      }
    })
  }

  copyAddress = () => {
    const symbol = this.props.data.selectedBalance.currencySymbol
    this.props.onShowPopup('success', strings.formatString(strings.deposit.copied, symbol))
  }

  render() {

    strings.setLanguage(this.props.language)

    const minWidth = window.innerWidth < 350 ? window.innerWidth * 0.9 : 350
    const maxHeight = window.innerHeight < 800 ? window.innerHeight * 0.9 : 800

    const {data, onClose} = this.props
    const {selectedBalance} = data
    const {depositAddress} = this.state

    const symbol = selectedBalance.currencySymbol

    return (
      <View style={styles.dontshrink}
            backgroundColor="white"
            width='100%'
            maxWidth={830}
            maxHeight={maxHeight}
            overflow="auto">
        <View padding="large"
              style={styles.dontshrink}>
          <View flexHorizontal
                phoneFlexVertical
                tabletFlexVertical
                justifyContent="space-between">
            <View>
              <View paddingHorizontal="small"
                    phonePaddingHorizontal='none'
                    flexHorizontal
                    justifyContent="space-between" minWidth={minWidth}>
                <Text fontSize="large" fontWeight='light'>
                  {strings.formatString(strings.deposit.title, symbol)}
                </Text>
                <Image source="/images/cancel_black.svg" width={20} height={20} cursor='pointer' onClick={onClose}/>
              </View>
              <Spacer size="medium-large" />
              {
                depositAddress === null &&
                <React.Fragment>
                  <Text>{strings.formatString(strings.deposit.allocAddrDesc, symbol)}</Text>
                  <Spacer size="large" />
                  <Button borderColor='iris'
                          color='iris'
                          titleColor='white'
                          title={strings.formatString(strings.deposit.allocAddr, symbol)}
                          onPress={this.handleDepositAllocateClick}/>
                </React.Fragment>
              }
              {
                depositAddress !== null &&
                <View style={balanceStyle.importantMessageDeposit}>
                  <View paddingHorizontal="medium" phonePaddingHorizontal="none" alignSelf='start' minWidth={minWidth}>
                    <View>
                      <Text fontSize="small" fontWeight='normal'>{symbol} {strings.deposit.address}</Text>
                      <Spacer size="small" />
                      <View backgroundColor='white'
                            width='100%' maxWidth={380}
                            paddingVertical='medium'
                            paddingHorizontal='small'
                            border='normal'
                            borderColor='light-gray'
                            borderRadius='xsmall'>
                        <Text wordBreak='break-all'>{depositAddress}</Text>
                      </View>
                    </View>
                    <Spacer size="small" />

                    <View backgroundColor='white'
                          width='100%'
                          maxWidth={196}
                          padding='xsmall'
                          border='normal'
                          borderColor='light-gray'
                          justifyContent='center'>
                      <QRCode value={depositAddress} size={180}/>
                    </View>
                    <Spacer size="small" />

                    <CopyToClipboard text={depositAddress} onCopy={this.copyAddress}>
                      <Button title={strings.deposit.copyAddr}
                              width='100%'

                              padding='medium'
                              titleColor='white'
                              borderColor='iris'
                              backgroundColor='iris'
                              borderRadius='xsmall'
                              alignItems='center'/>
                    </CopyToClipboard>
                  </View>
                  <Spacer size="large" />

                  <View>
                    <View style={balanceStyle.importantMessageBox}>
                      <Text fontSize="small" fontWeight='bold' textColor='dark-blue-grey'>{strings.deposit.important}</Text>
                      <Spacer size="medium" />
                      <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.formatString(strings.deposit.copyAddrDesc1, symbol)}</Text>
                      {
                        strings.getLanguage() === 'ko' &&
                        <React.Fragment>
                          <Spacer size="small" />
                          <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.deposit.copyAddrDesc2}</Text>
                          <Spacer size="small" />
                          <Text fontSize="small" fontWeight='normal' textColor='dark-blue-grey'>{strings.getString('deposit.copyAddrDesc3'+symbol)}</Text>
                        </React.Fragment>
                      }
                    </View>
                  </View>
                </View>
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(RequestDepositPopup)

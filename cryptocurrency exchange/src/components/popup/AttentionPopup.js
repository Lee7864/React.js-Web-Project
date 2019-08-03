// @flow

import * as React from 'react'
import { View, Text, Spacer, Popup, Input, Button } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from './AttentionPopup.css'
import styleGuide from '../../styles/StyleGuide.css'
import {connect} from 'react-redux'

const strings = new LocalizedStrings({
  en: {
    popup: {
      title: 'Notice to Cryptocurrency Trading Customers',
      subtitle1: '1. Cryptocurrency is not a legal currency',
      desc1: 'Cryptography is not a currency issued by a central bank of a particular country and legally guaranteed. Depending on the situation, cryptocurrency can be meaningless assets.',
      subtitle2: '2. The risk of loss from cryptocurrency investment is very large',
      desc2: 'Cryptocurrencies are traded 24 hours a day, 365 days a year and there is no limit to the price fluctuation. Prices can change drastically depending on the impact of many external factors, such as policy changes in each cryptocurrency, network conditions, national regulations, and international prices. If an investor is unable to respond appropriately, it can cause a huge investment loss in a short period of time.',
      subtitle3: '3. Cryptocurrency cannot be restored if it is sent to an address outside the exchange.',
      desc3: 'Due to the nature of the blockchain, which is the basis of the cryptocurrency, the password transaction cannot be modified once it is written to the main network. Losses that occur if you make a mistake cannot be recovered. Therefore, special care is required when withdrawing funds from a foreign exchange address.',
      body: 'You are responsible for all your investment in cryptocurrency. Please be cautious about the risks that may arise from all cryptocurrency transactions.',
      dontopen: 'Don’t show for 7 days',
      buttontitle: 'Confirm',
    }
  },
  ko: {
    popup: {
      title: '암호화폐 거래 전 유의사항',
      subtitle1: '1. 암호화폐는 법정통화가 아닙니다.',
      desc1: '암호화폐는 특정 국가의 중앙은행이 발행하고 법적으로 지급보증을 하는 화폐가 아닙니다. 상황에 따라 보유하고 있는 암호화폐는 전혀 의미없는 자산이 될 수 있습니다.',
      subtitle2: '2. 암호화폐는 투자로 인한 손실 위험이 매우 큽니다.',
      desc2: '암호화폐는 365일 24시간 계속 거래되며 가격 변동폭에 제한이 없습니다. 각 암호화폐의 정책 변경, 네트워크 상황, 국가별 규제, 국제 시세 등 많은 외부 요인의 영향에 따라 가격이 급격하게 변할 수 있습니다. 투자자가 적절히 대응하기 어려운 경우가 발생하면 단기간에 막대한 투자 손실을 입을 수 있습니다.',
      subtitle3: '3. 암호화폐는 거래소 외부 주소로 전송되면 원상복구가 불가능합니다.',
      desc3: '암호화폐의 기반인 블록체인 특성상, 암호화폐 거래내역은 한번 네트워크에 기록되면 수정이 불가능합니다. 잘못 전송했을 경우 발생한 손실은 복구할 수 없습니다. 따라서 거래소 외부 주소로 출금할 때 각별한 주의가 필요합니다.',
      body: '암호화폐 투자에 따른 책임은 고객님 본인에게 있습니다. 이와 같은 암호화폐 거래에서 발생할 수 있는 위험에 유의하여 신중하게 거래하시길 바랍니다.',
      dontopen: '일주일 동안 이 창을 열지 않음',
      buttontitle: '확인',
    }
  }
})

type Props = {
  language: string,
  checkAttention: boolean,
  onCheckboxChange: () => void,
  onConfirmAttentionPopup: () => void
}

class AttentionPopup extends React.Component<Props> {

  render() {
    const {checkAttention, onCheckboxChange, onConfirmAttentionPopup} = this.props

    strings.setLanguage(this.props.language)

    return (
      <Popup style={styles.attPopup}>
        <View
          backgroundColor="white"
          padding="huge"
          phonePaddingHorizontal="medium"
          phonePaddingVertical="medium">
          <Spacer size="tiny" />
          <Text textColor="dark-gray" fontWeight="bold" style={styles.attPopuptitle}>{strings.popup.title}</Text>
          <Spacer size="medium-large" />
          <View overflow="auto">
            <View
              backgroundColor="light-gray"
              padding="large"
              phonePaddingHorizontal="small"
              phonePaddingVertical="small"
              style={styleGuide.dontshrink}>
              <Text textColor="dark-gray" fontWeight="bold" style={styles.attPopuptext}>
                {strings.popup.subtitle1}
              </Text>
              <Spacer size="medium" />
              <Text textColor="dark-gray" lineHeight={1.8} style={styles.attPopuptext}>
                {strings.popup.desc1}
              </Text>
              <Spacer size="xlarge" />
              <Text textColor="dark-gray" fontWeight="bold" style={styles.attPopuptext}>
                {strings.popup.subtitle2}
              </Text>
              <Spacer size="medium" />
              <Text textColor="dark-gray" lineHeight={1.8} style={styles.attPopuptext}>
                {strings.popup.desc2}
              </Text>
              <Spacer size="xlarge" />
              <Text textColor="dark-gray" fontWeight="bold" style={styles.attPopuptext}>
                {strings.popup.subtitle3}
              </Text>
              <Spacer size="medium" />
              <Text textColor="dark-gray" lineHeight={1.8} style={styles.attPopuptext}>
                {strings.popup.desc3}
              </Text>
            </View>
          </View>
          <Spacer size="medium" />
          <Text style={styles.attPopuptext} lineHeight={1.8}>{strings.popup.body}</Text>
          <Spacer size="medium" phoneHidden />
          <Spacer size="xsmall" />
          <View flexHorizontal justifyContent="space-between">
            <View flexHorizontal paddingVertical="tiny" phonePaddingVertical="none" minWidth={220} >
              <label>
                <View flexHorizontal>
                  <Input type='checkbox' name='popupAttention' checked={checkAttention} onChange={onCheckboxChange}/>
                  <View>
                    <Spacer size="medium"/>
                    <Text paddingHorizontal="small" style={styles.attPopuptext}>{strings.popup.dontopen}</Text>
                  </View>
                </View>
              </label>
            </View>
            <View style={styles.attPopupbutton}>
              <Spacer size="tiny" phoneHidden />
              <Button
                title={strings.popup.buttontitle}
                flex='fill'
                backgroundImage="gradient-iris2"
                titleColor="white"
                borderRadius="tiny"
                phonePaddingVertical="none"
                onPress={onConfirmAttentionPopup}/>
            </View>
          </View>
        </View>
      </Popup>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(AttentionPopup)


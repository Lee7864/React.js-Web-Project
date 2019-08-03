// @flow

import * as React from 'react'
import { View, Text, Spacer } from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    fees: {
      title1: 'Transaction Rate by Market',
      title2: 'Transaction Fee Estimates',
      title3: 'Deposit and Withdrawal Fees',
      level: 'LEVEL',
      krwmarket: 'KRW MARKET',
      btcmarket: 'BTC MARKET',
      ethmarket: 'ETH MARKET',
      level2members: 'LEVEL 2 Members:',
      mobileauth: 'Mobile authenticated',
      level34members: 'Level 3 and 4 Members:',
      tfaauth: '2FA and ID authenticated',
      transactionfee: 'TRANSACTION FEE',
      example: 'EXAMPLE',
      quantity: 'QUANTITY',
      price: 'PRICE,',
      feerate: 'FEE RATE',
      buying: 'Buying',
      selling: 'Selling',
      orderqty: 'Order Qty.',
      orderprice: 'Order Price',
      transactionfee2: 'Transaction Fee',
      transactionfee3: 'Transaction Fee',
      balance: 'Balance',
      increase: 'increase',
      deduction: 'deduction',
      depositsfree1: 'All deposits are FREE!',
      depositsfree2: 'Deposits are free for all Quanty members.',
      coins: 'COINS',
      withdraw: 'WITHDRAWAL',
      feedesc: 'The withdrawal fee will be charged on a per-session basis regardless of the amount of withdrawal.',

    }
  },
  ko: {
    fees: {
      title1: '마켓별 거래 수수료율',
      title2: '거래 수수료 산정',
      title3: '입출금 수수료',
      level: '보안등급',
      krwmarket: 'KRW 마켓',
      btcmarket: 'BTC 마켓',
      ethmarket: 'ETH 마켓',
      level2members: '2단계 인증 회원',
      mobileauth: '휴대전화 인증',
      level34members: '3, 4단계 인증 회원',
      tfaauth: '이중 인증, 신원 확인',
      transactionfee: '거래 수수료',
      example: '예시',
      quantity: '수량',
      price: '가격',
      feerate: '수수료',
      buying: '매수',
      selling: '매도',
      orderqty: '주문수량',
      orderprice: '주문총액',
      transactionfee2: '거래 수수료율',
      transactionfee3: '거래 수수료',
      balance: '잔고',
      increase: '증가',
      deduction: '차감',
      depositsfree1: '모든 입금 수수료는 무료입니다.',
      depositsfree2: '',
      coins: '구분',
      withdraw: '출금 수수료',
      feedesc: '출금 수수료는 출금액과 상관 없이 1건당 정액으로 부과됩니다.',

    }
  }
})

type Props = {
  language: string
}

type State = {
}

class FeesPage extends React.Component<Props, State> {

  componentDidMount() {
    window.setTimeout(function() {window.scrollTo(0,0)}, 0)
  }

  render() {

    strings.setLanguage(this.props.language)

    return (
      <View width='100%' maxWidth={1024} style={styles.dontshrink}>

        <View backgroundColor="white" flex="fill">
          <View border="normal" borderColor="light-gray" borderType="topbottom">

            <View padding="large">
              <Text fontSize="small-medium" fontWeight="bold">{strings.fees.title1}</Text>
            </View>

            <View flexHorizontal border="normal" borderColor="light-gray" borderType="top">
              <View padding="medium" width="40%" alignItems='center'>
                <Text fontSize='xsmall' textColor='dark-gray'>{strings.fees.level}</Text>
              </View>
              <View flexHorizontal padding="medium" width="60%" justifyContent='center'>
                  <Text fontSize='xsmall' textColor='dark-gray' paddingHorizontal="large" phonePaddingHorizontal="tiny">{strings.fees.krwmarket}</Text>
                  <Text fontSize='xsmall' textColor='dark-gray' paddingHorizontal="large" phonePaddingHorizontal="tiny">{strings.fees.btcmarket}</Text>
                  <Text fontSize='xsmall' textColor='dark-gray' paddingHorizontal="large" phonePaddingHorizontal="tiny">{strings.fees.ethmarket}</Text>
              </View>
            </View>

            <View flexHorizontal border="normal" borderColor="light-gray" borderType="top">
              <View padding="medium"
                    width="40%"
                    alignItems='center'
                    border="normal"
                    borderColor="light-gray"
                    borderType="right"
                    phonePaddingHorizontal="none">
                <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.level2members}</Text>
                <Spacer size="xsmall"/>
                <Text textColor='dark-gray'>{strings.fees.mobileauth}</Text>
              </View>
              <View padding="medium" width="60%" alignItems='center' justifyContent='center'>
                <Text fontWeight="bold" textColor='dark-gray'>0.1%</Text>
              </View>
            </View>

            <View flexHorizontal border="normal" borderColor="light-gray" borderType="top">
              <View padding="medium"
                    width="40%"
                    alignItems='center'
                    border="normal"
                    borderColor="light-gray"
                    borderType="right"
                    phonePaddingHorizontal="none">
                <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.level34members}</Text>
                <Spacer size="xsmall"/>
                <Text textColor='dark-gray'>{strings.fees.tfaauth}</Text>
              </View>
              <View padding="medium" width="60%" alignItems='center' justifyContent='center'>
                <Text fontWeight="bold" textColor='dark-gray'>0.05%</Text>
              </View>
            </View>

            <View padding="large" border="normal" borderColor="light-gray" borderType="top">
              <Spacer size="large"/>
              <Text fontSize="small-medium" fontWeight="bold">{strings.fees.title2}</Text>
            </View>

            <View border="normal" borderColor="light-gray" borderType="top">
              <View flexHorizontal>
                <View width="15%" alignItems='center' justifyContent="center" padding="medium" phonePaddingHorizontal='none'>
                  <Text fontSize='xsmall' textColor='dark-gray'>{strings.fees.buying + ' / ' + strings.fees.selling}</Text>
                </View>
                <View width="30%" alignItems='center' justifyContent="center" padding="medium" phonePaddingHorizontal='none'>
                  <Text fontSize='xsmall' textColor='dark-gray'>{strings.fees.transactionfee}</Text>
                </View>
                <View width="55%" alignItems='center' padding="medium" phonePaddingHorizontal='small'>
                  <Text fontSize='xsmall' textColor='dark-gray'>
                    {strings.fees.example}: ({strings.fees.quantity}: 1 BTC, {strings.fees.price}: 10,000,000 KRW, {strings.fees.feerate}: 0.05%)
                  </Text>
                </View>
              </View>
            </View>

            <View flexHorizontal border="normal" borderColor="light-gray" borderType="top">

              <View padding="medium" width="15%" alignItems='center' justifyContent='center' border="normal" borderColor="light-gray" borderType="right">
                <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.buying}</Text>
              </View>

              <View padding="medium"
                    width="30%"
                    alignItems='center'
                    justifyContent='center'
                    border="normal"
                    borderColor="light-gray"
                    borderType="right"
                    phonePaddingHorizontal="xsmall">
                <Text textColor='dark-gray'>{strings.fees.orderqty} x {strings.fees.transactionfee2} (%)</Text>
              </View>

              <View paddingHorizontal="large"
                    width="55%"
                    alignItems='center'
                    >
                <View justifyContent='center'>
                  <Spacer size="small" />
                  <Spacer size="medium" phoneHidden/>
                  <View flex='fill' lineHeight="2">
                    <View flexHorizontal flex='fill' flexWrap>
                      <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.transactionfee3} :</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>0.0005 BTC</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>(1 BTC</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>x 0.05%)</Text>
                    </View>
                  </View>

                  <Spacer size="large"/>

                  <View flex='fill' lineHeight="2">
                    <View flexHorizontal flex='fill' flexWrap>
                      <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.balance} :</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>0.9995 BTC</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>{strings.fees.increase}</Text>
                    </View>
                  </View>

                  <View paddingVertical="xsmall" paddingHorizontal="xlarge" phonePaddingHorizontal="none">
                    <Text textColor='dark-gray'>10,000,000 KRW {strings.fees.deduction}</Text>
                  </View>
                  <Spacer size="medium" phoneHidden />

                </View>
              </View>
            </View>

            <View flexHorizontal border="normal" borderColor="light-gray" borderType="top">

              <View padding="medium" width="15%" alignItems='center' justifyContent='center' border="normal" borderColor="light-gray" borderType="right">
                <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.selling}</Text>
              </View>

              <View padding="medium"
                    width="30%"
                    alignItems='center'
                    justifyContent='center'
                    border="normal"
                    borderColor="light-gray"
                    borderType="right"
                    phonePaddingHorizontal="small">
                <Text textColor='dark-gray'>{strings.fees.orderprice} x {strings.fees.transactionfee2} (%)</Text>
              </View>

              <View paddingHorizontal="large"
                    width="55%"
                    alignItems='center'>
                <View justifyContent='center'>
                  <Spacer size="small" />
                  <Spacer size="medium" phoneHidden/>
                  <View flex='fill' lineHeight="2">
                    <View flexHorizontal flex='fill' flexWrap>
                      <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.transactionfee3} :</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>5,000 KRW</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>(10,000,000 KRW</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>x 0.05%)</Text>
                    </View>
                  </View>

                  <Spacer size="large"/>

                  <View flex='fill' lineHeight="2">
                    <View flexHorizontal flex='fill' flexWrap>
                      <Text fontWeight="bold" textColor='dark-gray'>{strings.fees.balance} :</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>9,995,000 KRW</Text>
                      <Spacer size="tiny"/>
                      <Text textColor='dark-gray'>{strings.fees.increase}</Text>
                    </View>
                  </View>

                  <View paddingVertical="xsmall" paddingHorizontal="xlarge" phonePaddingHorizontal="none">
                    <Text textColor='dark-gray'>1 BTC {strings.fees.deduction}</Text>
                  </View>
                  <Spacer size="medium" phoneHidden />

                </View>
              </View>

            </View>

          </View>
        </View>

        <Spacer size="large" />

        <View backgroundColor="white" flex="fill" width='100%' maxWidth={1024}>

          <View border="normal" borderColor="light-gray" borderType="topbottom">
            <View padding="large">
              <Text fontSize="small-medium" fontWeight="bold">{strings.fees.title3}</Text>
            </View>
            <View paddingHorizontal="large">
              <View paddingVertical="large" backgroundColor="light-gray" border="normal" borderColor="iris" alignItems='center'>
                <View flexHorizontal>
                  <Text fontSize="small" fontWeight="bold" textColor="iris">{strings.fees.depositsfree1}</Text>
                  <Spacer size="tiny"/>
                  <Text fontSize="small" textColor="iris">{strings.fees.depositsfree2}</Text>
                </View>
              </View>
              <Spacer size="large"/>
            </View>
          </View>

          <View border="normal" borderColor="light-gray" borderType="bottom">
            <View flexHorizontal border="normal" borderColor="light-gray" borderType="bottom">
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium">
                <Text fontSize='xsmall' textColor='dark-gray'>{strings.fees.coins}</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium">
                <Text fontSize='xsmall' textColor='dark-gray'>{strings.fees.withdraw}</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>KRW</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>1,000 KRW</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>BTC</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.0005 BTC</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>BCH</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.00001 BCH</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>BSV</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.00001 BSV</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>            

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>BTG</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.001 BTG</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>LTC</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.01 LTC</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>ETH</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.01 ETH</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>ETC</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.01 ETC</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>POWR</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>5 POWR</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>OMG</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.4 OMG</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>ZIL</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>25 ZIL</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>ZRX</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>3.5 ZRX</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>REP</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>0.1 REP</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>GNT</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>12 GNT</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View flexHorizontal>
              <View width="15%" alignItems='center' padding="medium">
              </View>
              <View width="30%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>SNT</Text>
              </View>
              <View width="40%" alignItems='center' padding="medium" border="normal" borderColor="light-gray" borderType="bottom">
                <Text fontSize="small" textColor='dark-gray'>15 SNT</Text>
              </View>
              <View width="15%" alignItems='center' padding="medium">
              </View>
            </View>

            <View alignItems='center' padding="large">
              <Text fontSize="xsmall" textColor='dark-gray'>{strings.fees.feedesc}</Text>
            </View>

          </View>

        </View>
      </View>
    );
  }
}

export default FeesPage
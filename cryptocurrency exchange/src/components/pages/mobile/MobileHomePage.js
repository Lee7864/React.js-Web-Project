// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import {Tab, Divider, Spacer, Text, View, Image} from '../../controls'
import styles from '../../../styles/StyleGuide.css'
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'
import type {TabData} from '../../controls/Tab'

import {formatAmountAbbreviation, formatPriceToTickSize} from '../../../data/NumberUtils'
import Candle from '../../controls/Candle'
import MarketDisplayCard from '../../cards/MarketDisplayCard'
import Footer from '../../controls/Footer'

const strings = new LocalizedStrings({
  en: {
    headers: {
      assetName: 'Asset Names',
      price: 'Last Price',
      change: 'Change',
      amount: 'Total',
      announce: 'Announcement',
      help: 'Help',
      fees: 'Fees',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      box1: 'Trade with no fees for first 30 days',
      box2: 'Rest easy knowing your assets are safe and secure in our 100% cold wallet storage',
      box3: 'Earn interest on the cryptocurrency assets you hold with Quanty',
      explore: 'Explore Quanty',
      createaccount: 'Create Account',
      footer1: 'AprilComes, Inc.',
      footer2: '7th floor ES Tower, 14, Teheran-ro 77-gil, Gangnam-gu, Seoul, Korea',
      footer3: 'CEO: Sunghyun Kim',
      footer4: 'Business Registration No. 578-87-00843',
      footer5: '',
      footer6: 'Customer Support'
    }
  },
  ko: {
    headers: {
      assetName: '자산명',
      price: '현재가',
      change: '전일대비',
      amount: '거래대금',
      announce: '공지사항',
      help: '도움말',
      fees: '수수료 안내',
      terms: '이용약관',
      privacy: '개인정보처리방침',
      box1: '신규 가입 후 30일 동안 거래 수수료 무료',
      box2: '암호화폐 100% 콜드 월렛 운영으로 안전한 자산 관리',
      box3: '거래실적에 따라 보유 암호화폐 기준 최대 연 3%까지 이자 지급',
      explore: '거래소 둘러보기',
      createaccount: '회원 가입',
      footer1: '주식회사 에이프릴컴스',
      footer2: '주소: 서울특별시 강남구 테헤란로 77길 14 ES타워 7층 (우) 06158',
      footer3: '대표: 김성현',
      footer4: '사업자등록번호: 578-87-00843',
      footer5: '거래소 이용 관련 중요 가이드는 고객센터 페이지를 통해 제공하고 있습니다.',
      footer6: '고객문의'
    }
  }
})

type RowProps = {
  market: Object,
  history: Object,
  language: string
}

const Row = ({market, history, language}: RowProps) => {
  const changeRate = new Decimal(market.changeRate)
  const textColor = changeRate.greaterThanOrEqualTo(0) ? (changeRate.equals(0) ? undefined : 'up-red') : 'down-blue'
  const changeRateString = (changeRate.greaterThan(0) ? '+' : '') + changeRate.toFixed(2).toString() + '%'

  const onRowClick = () => {
    history.push(`/exchange/${market.marketId}`)
  }

  return (
    <View height={41}>
      <Divider color='divider'/>
      <View onClick={onRowClick} flex='fill' flexHorizontal>
        <View width={10} style={styles.dontshrink}/>

        <View flexGrow={118} height={40} style={styles.dontshrink}>
          <View width={15} height={40} position='absolute' flexHorizontal alignItems='center' style={styles.dontshrink}>
            <View width={7} height={26} style={styles.dontshrink}>
              <Candle open={market.marketSummary.open} close={market.marketSummary.close} high={market.marketSummary.high} low={market.marketSummary.low}/>
            </View>

            <View width={8} style={styles.dontshrink}/>
          </View>
          <View style={{top: 0, left: '15px', right:0, bottom: 0}} height={40} position='absolute' justifyContent='center'>
            <Text fontWeight='semibold' fontSize='xsmall' textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>{market.currencyNames[strings.getLanguage()]}</Text>
            <Spacer size='tiny'/>
            <Text fontSize='tiny'>{market.marketId.replace('_', '/')}</Text>
          </View>
        </View>

        <View flexGrow={72} height={40} style={styles.dontshrink}>
          <View width='100%' height={40} justifyContent='center' position='absolute'>
            <Text textColor={textColor} fontSize='xsmall' fontWeight='semibold' textAlign='right'>{commaNumber(formatPriceToTickSize(new Decimal(market.price), market.tickSizeRanges))}</Text>
          </View>
        </View>

        <View flexGrow={55} height={40} style={styles.dontshrink}>
          <View width='100%' height={40} justifyContent='center' position='absolute'>
            <Text textColor={textColor} fontSize='xsmall' fontWeight='semibold' textAlign='right'>{changeRateString}</Text>
          </View>
        </View>

        <View flexGrow={55} height={40} style={styles.dontshrink}>
          <View width='100%' height={40} justifyContent='center' position='absolute'>
            <Text fontSize='xsmall' textAlign='right'>{formatAmountAbbreviation(market.amount24h, language)}</Text>
          </View>
        </View>

        <View width={10} style={styles.dontshrink}/>
      </View>
    </View>
  )
}

type ElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: ElementProps) => {
  return (
    <View flex='fill' height={45} onClick={onPress}>
      <View height={45} justifyContent='center' alignItems='center'>
        <Text fontSize='small' textColor='black' fontWeight='bold'>{item.key}</Text>
      </View>

      {selected &&
      <View position='absolute' width='100%' height='100%' justifyContent='flex-end'>
        <View width='100%' height={3} style={styles.dontshrink} backgroundColor='iris'/>
      </View>
      }
    </View>
  )
}

type Props = {
  history: Object,
  marketList: Array<Object | null>,
  pricingSymbol: string,
  setSort: (sortValue: string) => void,
  sort: string,
  sortDirection: number,
  onPricingCurrencyClick: (pricingSymbol: string) => void,
  language: string,
  filter: string,
  onMarketSearchChange: (value: string) => void
}

class MobileHomePage extends React.PureComponent<Props> {

  handleLinkClick = (url: string) => {
    this.props.history.push(url)
  }

  render() {
    const { history, marketList, pricingSymbol, onPricingCurrencyClick, language, sort, sortDirection } = this.props
    const data = [{key: 'KRW', value: 'KRW'}, {key: 'BTC', value: 'BTC'}, {key: 'ETH', value: 'ETH'}]

    let selectedIndex = 0
    for (let index = 0; index < data.length; index++) {
      if (data[index].key === pricingSymbol) {
        selectedIndex = index
        break
      }
    }

    strings.setLanguage(language)

    return (
      <View backgroundColor='white' flex='fill' overflow='auto' alignItems='center'>
        <View style={styles.dontshrink} alignItems='center' justifyContent='center' width='100%' height={150}>
          <Image source='/images/home_mobile_top_banner.png' width={292} height={58}/>
        </View>

        <View width='100%'>
          <View flexHorizontal height={45}>
            <View width={10} style={styles.dontshrink}/>
            <View flex='fill'>
              <Tab data={data} onPress={onPricingCurrencyClick} selectedIndex={selectedIndex} tabElement={TabElement} flex='fill'/>
            </View>
            <View width={10} style={styles.dontshrink}/>
          </View>

          <Divider/>

          <MarketDisplayCard marketList={marketList} language={language}/>
        </View>

        <Spacer size='xlarge'/>

        <Footer/>
      </View>
    )
  }
}

export default MobileHomePage
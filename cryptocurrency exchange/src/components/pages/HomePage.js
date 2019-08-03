// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import {Tab, Divider, Image, Spacer, Text, View} from '../controls'
import styles from '../../styles/StyleGuide.css'
import Decimal from 'decimal.js'
import commaNumber from 'comma-number'
import type {TabData} from '../controls/Tab'
import Input from '../controls/Input'

import homeStyle from '../../styles/HomePage.css'
import {formatAmountAbbreviation, formatPriceToTickSize} from '../../data/NumberUtils'
import Candle from '../controls/Candle'
import ChangeRateMarketListCard from '../cards/ChangeRateMarketListCard'
import Footer from '../controls/Footer'
import type {MarketCap} from '../../types/Trading'
import AmountNTotalMarketListCard from '../cards/AmountNTotalMarketListCard'

const strings = new LocalizedStrings({
  en: {
    headers: {
      assetName: 'Asset Names',
      price: 'Last Price',
      change: 'Change',
      high: '24h High',
      low: '24h Low',
      volume: '24h Volume',
      amount: '24h Amount',
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
      footer6: 'Customer Support',
      search: 'Search'
    }
  },
  ko: {
    headers: {
      assetName: '자산명',
      price: '현재가',
      change: '전일대비',
      high: '24h 고가',
      low: '24h 저가',
      volume: '24h 거래량',
      amount: '24h 거래대금',
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
      footer6: '고객문의',
      search: '검색'
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
  const textColor = changeRate.greaterThanOrEqualTo(0) ? (changeRate.equals(0) ? 'dark-gray' : 'up-red') : 'down-blue'
  const changeRateString = (changeRate.greaterThan(0) ? '+' : '') + changeRate.toFixed(2).toString() + '%'

  const onRowClick = () => {
    history.push(`/exchange/${market.marketId}`)
  }

  return (
    <View height={71}>
      <Divider color='divider'/>
      <View onClick={onRowClick} flex='fill' alignItems='center' flexHorizontal height={70} style={homeStyle.button}>
        <View width={10} style={styles.dontshrink}/>

        <View width={9} height={30} style={styles.dontshrink}>
          <Candle open={market.marketSummary.open} close={market.marketSummary.close} high={market.marketSummary.high} low={market.marketSummary.low}/>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={20} height={20} style={styles.dontshrink}>
          <Image source={`/images/coins/${market.baseSymbol}.svg`} width={30} height={30}/>
        </View>

        <View width={10} style={styles.dontshrink}/>

        <View width={151} style={styles.dontshrink}>
          <Text fontSize='small' fontWeight='semibold'>{market.currencyNames[strings.getLanguage()]}</Text>
          <Spacer size='xsmall'/>
          <Text fontSize='xsmall' textColor='dark-gray'>{market.marketId.replace('_', '/')}</Text>
        </View>

        <View width={120} paddingHorizontalNum={10} style={styles.dontshrink}>
          <Text textColor={textColor} fontSize='small' textAlign='right'>{commaNumber(formatPriceToTickSize(new Decimal(market.price), market.tickSizeRanges))}</Text>
        </View>

        <View width={90} paddingHorizontalNum={10} style={styles.dontshrink}>
          <Text textColor={textColor} fontSize='small' textAlign='right'>{changeRateString}</Text>
        </View>

        <View width={120} paddingHorizontalNum={10} style={styles.dontshrink}>
          <Text fontSize='small' textAlign='right' textColor='dark-gray'>{commaNumber(formatPriceToTickSize(new Decimal(market.high24h), market.tickSizeRanges))}</Text>
        </View>

        <View width={120} paddingHorizontalNum={10} style={styles.dontshrink}>
          <Text fontSize='small' textAlign='right' textColor='dark-gray'>{commaNumber(formatPriceToTickSize(new Decimal(market.low24h), market.tickSizeRanges))}</Text>
        </View>

        <View width={120} paddingHorizontalNum={10} style={styles.dontshrink}>
          <Text fontSize='small' textAlign='right' textColor='dark-gray'>{commaNumber(new Decimal(market.volume24h).toFixed(market.decimalPlaces).toString())}</Text>
        </View>

        <View width={120} paddingHorizontalNum={10} style={styles.dontshrink}>
          <View width='100%' flexHorizontal justifyContent='flex-end'>
            <Text fontSize='small' textColor='dark-gray'>{formatAmountAbbreviation(market.amount24h, language)}</Text>
            <Spacer size='tiny'/>
            <Text fontSize='small' textColor='light-gray'>{market.pricingSymbol}</Text>
          </View>
        </View>
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
    <View width={100} height={60} onClick={onPress}>
      <View height='100%' justifyContent='center' alignItems='center'>
        <Text fontSize='small-medium' textColor='black' fontWeight='bold'>{item.key}</Text>
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
  onMarketSearchChange: (value: string) => void,
  marketCaps: {[string]: MarketCap}
}

class HomePage extends React.PureComponent<Props> {

  setMarketIdSort = () => {
    this.props.setSort('marketId')
  }

  setPriceSort = () => {
    this.props.setSort('price')
  }

  setChangeRateSort = () => {
    this.props.setSort('changeRate')
  }

  setHighSort = () => {
    this.props.setSort('high24h')
  }

  setLowSort = () => {
    this.props.setSort('low24h')
  }

  setVolumeSort = () => {
    this.props.setSort('volume24h')
  }

  setAmountSort = () => {
    this.props.setSort('amount24h')
  }

  handleLinkClick = (url: string) => {
    this.props.history.push(url)
  }

  handleMarketSearchChange = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.props.onMarketSearchChange(event.currentTarget.value)
  }

  krwMarketList: Array<Object | null>

  render() {
    const { history, marketList, pricingSymbol, onPricingCurrencyClick, language, sort, sortDirection, marketCaps } = this.props
    const data = [{key: 'KRW', value: 'KRW'}, {key: 'BTC', value: 'BTC'}, {key: 'ETH', value: 'ETH'}]

    let selectedIndex = 0
    for (let index = 0; index < data.length; index++) {
      if (data[index].key === pricingSymbol) {
        selectedIndex = index
        break
      }
    }

    if (pricingSymbol === 'KRW') {
      this.krwMarketList = marketList
    }

    strings.setLanguage(language)

    return (
      <View backgroundColor='white' flex='fill' overflow='auto' alignItems='center' minWidth={1280}>
        <View style={styles.dontshrink} alignItems='center' justifyContent='center' width='100%' height={300}>
          <Image source='/images/home_top_banner.png' width={562} height={74}/>
        </View>

        <View width={1280} style={styles.dontshrink} paddingHorizontalNum={5} flexHorizontal justifyContent='space-between'>
          <View width={900} style={styles.dontshrink}>
            <View style={styles.dontshrink}>
              <View flexHorizontal height={60}>
                <View flex='fill' paddingHorizontalNum={10}>
                  <Tab data={data} onPress={onPricingCurrencyClick} selectedIndex={selectedIndex} tabElement={TabElement}/>
                </View>
                <View height='100%' justifyContent='flex-end' paddingVertical='xsmall'>
                  <View flexHorizontal width={270} height='100%' alignItems='center' border='normal' borderColor='light-gray' borderRadius='xsmall'>
                    <Input id='home_search' onChange={this.handleMarketSearchChange} placeholder={strings.headers.search} width={240} height={28}/>
                    <View component='label' htmlFor='home_search' width={24} height={24} justifyContent='center'>
                      <Image source='/images/search.svg'/>
                    </View>
                  </View>
                </View>
              </View>

              <Divider color='divider'/>

              <View flexHorizontal>
                <View width={210} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.assetName}</Text>
                </View>

                <View width={120} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.price}</Text>
                </View>

                <View width={90} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.change}</Text>
                </View>

                <View width={120} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.high}</Text>
                </View>

                <View width={120} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.low}</Text>
                </View>

                <View width={120} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.volume}</Text>
                </View>

                <View width={120} height={50} justifyContent='center' alignItems='center' style={styles.dontshrink}>
                  <Text textColor='dark-gray' fontSizeNum={13}>{strings.headers.amount}</Text>
                </View>
              </View>

              <View>
                {marketList.map((market) => {
                  if (market !== null) {
                    return <Row market={market} history={history} key={market.marketId} language={language}/>
                  }
                })}
              </View>

              <Divider/>
            </View>
          </View>

          <View width={320} style={styles.dontshrink}>
            <View height={10} style={styles.dontshrink}/>
            <ChangeRateMarketListCard marketList={this.krwMarketList} language={language}/>

            <View height={50} style={styles.dontshrink}/>
            <AmountNTotalMarketListCard marketList={this.krwMarketList} marketCaps={marketCaps} language={language}/>

            <View height={50} style={styles.dontshrink}/>

            <View width='100%' alignItems='center'>
              <Image source='/images/home_isms_mark.png'/>
            </View>
          </View>
        </View>

        <View style={styles.dontshrink} alignItems='center' justifyContent='center' width='100%' height={300}>
          <Image source='/images/home_bottom_banner.png' width={778} height={132}/>
        </View>

        <Footer/>
      </View>
    )
  }
}

export default HomePage
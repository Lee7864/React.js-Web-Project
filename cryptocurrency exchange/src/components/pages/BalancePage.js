// @flow

import * as React from 'react'
import {Divider, Spacer, Tab, Text, View } from '../controls'
import AssetsCard from '../cards/AssetsCard'
import DepositsCard from '../cards/DepositsCard'
import WithdrawalsCard from '../cards/WithdrawalsCard'
import type {Profile} from '../../types/Profile'
import type {Balance, Currency} from '../../types/Balance'
import PricingSymbolsCard from '../cards/PricingSymbolsCard'
import Footer from '../controls/Footer'
import LocalizedStrings from 'localized-strings'
import type {TabData} from '../controls/Tab'
import {Route, Switch} from 'react-router-dom'
import TradeHistoryCard from '../cards/TradeHistoryCard'
import moment from 'moment'
import commaNumber from 'comma-number'
import styles from '../../styles/BalancePage.css'
import tabStyles from '../controls/Tab.css'
import { ClipLoader } from 'react-spinners'
import type { UserLastInterest } from '../../types/Interest'
import { parseUserLastInterest } from '../../data/InterestUtils'


const strings = new LocalizedStrings({
  en: {
    balance: {
      balances: 'Balances',
      tradeHistory: 'Trade History',
      assets: 'Assets',
      deposits: 'Deposits',
      withdrawals: 'Withdrawals',
      continue: 'Continue',
    },
    total: {
      estimated: 'Estimated Value',
      available: 'Available',
      inorder: 'In orders',
      totalearnedinterest: 'TOTAL EARNED INTEREST',
      interestrate: 'INTEREST RATE ({0})',
      interestrateWithoutMonth: 'INTEREST RATE',
    },
  },
  ko: {
    balance: {
      balances: '자산',
      tradeHistory: '거래내역',
      assets: '자산현황',
      deposits: '입금',
      withdrawals: '출금',
      continue: '확인',
    },
    total: {
      estimated: '총 평가금액',
      available: '거래가능금액',
      inorder: '거래중금액',
      totalearnedinterest: '총 누적이자평가액',
      interestrate: '이자율 ({0})',
      interestrateWithoutMonth: '이자율',
    },
  }
})

type ElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: ElementProps) => {
  return (
    <View flexHorizontal>
      <Spacer size='small'/>
      <Spacer size='xsmall' phoneHidden/>
      <View borderType={selected ? 'bottom' : undefined} border={selected ? 'thicker' : undefined} borderColor={selected ? 'iris' : undefined} onClick={onPress} style={tabStyles.padding}>
        <Text fontSize='small' textColor={selected ? 'iris' : 'dark-gray'}>{item.key}</Text>
      </View>
      <Spacer size='xsmall'/>
      <Spacer size='small' phoneHidden/>
    </View>
  )
}

type Props = {
  currencies: Currency[] | null,
  marketTickers: Object | null,
  balances: Balance[] | null,
  balancesObject: Object | null,
  pricingSymbol: string,
  pricingDecimalPlaces: number,
  handlePricingSymbolClick: (symbol: string) => void,
  totalEstimatedValue: string,
  availableValue: string,
  frozenValue: string,
  interest: string,
  depositHistories: Object | null,
  withdrawalHistories: Object | null,
  tradeHistories: Object | null,
  onTabClick: (tabName: string) => void,
  callHistories: (startDate: moment, endDate: moment, type: string, currencySymbol: string, pageNo: number, size: number) => void,
  onWithdrawCancelClick: (withdrawId: string, index: number) => void,
  selectedIndex: number,
  hideZeroBalances: boolean,
  onHideZeroBalanceClick: () => void,
  onBankingClick: (string) => void,
  profile: Profile,
  language: string,
  onLinktoAuthClick: () => void,
  onLinktoMyaccount: () => void,
  handleBalanceUpdated: () => void,
  loading: boolean,
  interestRate: string,
  interestDate: string,
}

class BalancePage extends React.PureComponent<Props> {

  render() {
    const {
      currencies,
      marketTickers,
      balances,
      balancesObject,
      pricingSymbol,
      pricingDecimalPlaces,
      handlePricingSymbolClick,
      totalEstimatedValue,
      availableValue,
      frozenValue,
      interest,
      depositHistories,
      withdrawalHistories,
      tradeHistories,
      onTabClick,
      callHistories,
      onWithdrawCancelClick,
      selectedIndex,
      hideZeroBalances,
      onHideZeroBalanceClick,
      onBankingClick,
      profile,
      language,
      onLinktoAuthClick,
      onLinktoMyaccount,
      handleBalanceUpdated,
      interestRate,
      interestDate
    } = this.props

    strings.setLanguage(language)

    const data = [{key: strings.balance.assets, value: 'assets'},
      {key: strings.balance.deposits, value: 'deposits'},
      {key: strings.balance.withdrawals, value: 'withdrawals'},
      {key: strings.balance.tradeHistory, value: 'trades'}]

    const parsedInterest: UserLastInterest = parseUserLastInterest(interestRate, interestDate, 'YYYY-MM-DD')

    return (
      <View flex='fill' overflow='y' alignItems='center' style={styles.padding}>
        <Spacer size="large" phoneHidden/>
        <View style={[styles.dontshrink, styles.top_padding]} flexHorizontal width='100%' maxWidth={976}>

          <View style={styles.top}>
            <Text style={styles.title}>{strings.balance.balances}</Text>
            <View style={styles.top_pricing_symbol_area}>
              <View width={94} paddingVertical='small' phonePaddingVertical='none'>
                <PricingSymbolsCard selectedSymbol={pricingSymbol} onSymbolClick={handlePricingSymbolClick}/>
              </View>
            </View>
          </View>

          <View flexHorizontal phoneHidden alignItems='flex-end' flexWrap>
            <View style={styles.dontshrink} paddingHorizontal='small' paddingVertical='small'>
              <Text fontSize="xsmall">{strings.total.estimated}</Text>
              <Spacer size="xsmall" />
              <Text>
                <Text fontSize="small-medium" fontWeight='bold'>{commaNumber(totalEstimatedValue)}</Text> <Text fontSize="xsmall">{pricingSymbol}</Text>
              </Text>
            </View>
            <View style={styles.dontshrink} paddingHorizontal='small' paddingVertical='small'>
              <Text fontSize="xsmall">{strings.total.available}</Text>
              <Spacer size="xsmall" />
              <Text>
                <Text fontSize="small-medium">{commaNumber(availableValue)}</Text> <Text fontSize="xsmall">{pricingSymbol}</Text>
              </Text>
            </View>
            <View style={styles.dontshrink} paddingHorizontal='small' paddingVertical='small'>
              <Text fontSize="xsmall">{strings.total.inorder}</Text>
              <Spacer size="xsmall" />
              <Text>
                <Text fontSize="small-medium">{commaNumber(frozenValue)}</Text> <Text fontSize="xsmall">{pricingSymbol}</Text>
              </Text>
            </View>
          </View>


            <View alignItems='flex-end' flexHorizontal phoneHidden style={styles.dontshrink}>
              <View style={styles.top_interest_box_left}>
                <Text fontSize="xsmall">{strings.total.totalearnedinterest}</Text>
                <Spacer size="xsmall"/>
                <Text>
                  <Text fontSize="small-medium" textColor='iris' fontWeight='bold'>{commaNumber(interest)}</Text> <Text
                  fontSize="xsmall">{pricingSymbol}</Text>
                </Text>
              </View>
              <View style={styles.top_interest_box_right}>
                <Text fontSize="xsmall">
                  {parsedInterest.yearMonth ?
                    strings.formatString(strings.total.interestrate, parsedInterest.yearMonth)
                  : strings.total.interestrateWithoutMonth}
                </Text>
                <Spacer size="xsmall"/>
                <Text>
                  <Text fontSize="small-medium">{ parsedInterest.rateOrAmount }</Text> <Text fontSize="xsmall">%</Text>
                </Text>
              </View>
            </View>

        </View>
        <Spacer size="large" phoneHidden/>

        <View width='100%' paddingHorizontal="small" phoneOnlyShown>
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" textColor='dark-gray'>{strings.total.estimated}</Text>
            <Text fontSize="small" fontWeight='bold'>{commaNumber(totalEstimatedValue)} {pricingSymbol}</Text>
          </View>
          <Spacer size="small" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.total.available}</Text>
            <Text fontSize="small" fontWeight='normal'>{commaNumber(availableValue)} {pricingSymbol}</Text>
          </View>
          <Spacer size="small" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.total.inorder}</Text>
            <Text fontSize="small" fontWeight='normal'>{commaNumber(frozenValue)} {pricingSymbol}</Text>
          </View>
          <Spacer size="small" />
          <View flexHorizontal justifyContent="space-between">
            <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.total.totalearnedinterest}</Text>
            <Text fontSize="small" textColor='iris' fontWeight='normal'>{commaNumber(interest)} {pricingSymbol}</Text>
          </View>
          <Spacer size="small" />
          <React.Fragment>
            <View flexHorizontal justifyContent="space-between">
              <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray'
                    textAlign='right'>
                {parsedInterest.yearMonth ?
                  strings.formatString(strings.total.interestrate, parsedInterest.yearMonth)
                  : strings.total.interestrateWithoutMonth}
              </Text>
              <Text fontSize="small" fontWeight='normal'>{parsedInterest.rateOrAmount}%</Text>
            </View>
            <Spacer size="small"/>
          </React.Fragment>
        </View>

        <View style={[styles.dontshrink, styles.content_radius]} width='100%' maxWidth={976} backgroundColor='white'>
          <View justifyContent='space-between'>
            <Tab data={data} tabElement={TabElement} selectedIndex={selectedIndex} onPress={onTabClick}/>
          </View>
          <Divider color='light-blue'/>
          <Switch>
            <Route exact path={'/balances/assets'} component={() => <AssetsCard marketTickers={marketTickers}
                                                                                balances={balances}
                                                                                balancesObject={balancesObject}
                                                                                currencies={currencies}
                                                                                pricingSymbol={pricingSymbol}
                                                                                pricingDecimalPlaces={pricingDecimalPlaces}
                                                                                hideZeroBalances={hideZeroBalances}
                                                                                onHideZeroBalanceClick={onHideZeroBalanceClick}
                                                                                onBankingClick={onBankingClick}
                                                                                profile={profile}
                                                                                onLinktoAuthClick={onLinktoAuthClick}
                                                                                language={language}
                                                                                handleBalanceUpdated={handleBalanceUpdated}
                                                                                onLinktoMyaccount={onLinktoMyaccount}
            />}/>

            <Route exact path={'/balances/deposits'} component={() => <DepositsCard currencies={currencies}
                                                                                    depositHistories={depositHistories}
                                                                                    callHistories={callHistories}
                                                                                    language={language}
            />}/>

            <Route exact path={'/balances/withdrawals'} component={() => <WithdrawalsCard currencies={currencies}
                                                                                          withdrawalHistories={withdrawalHistories}
                                                                                          callHistories={callHistories}
                                                                                          onWithdrawCancelClick={onWithdrawCancelClick}
                                                                                          language={language}
            />}/>

            <Route exact path={'/balances/trades'} component={() => <TradeHistoryCard currencies={currencies}
                                                                                      tradeHistories={tradeHistories}
                                                                                      callHistories={callHistories}
                                                                                      language={language}
            />}/>
          </Switch>

        </View>
        <Footer/>
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

export default BalancePage
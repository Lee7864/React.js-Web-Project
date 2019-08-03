// @flow

import * as React from 'react'
import BalancePage from '../pages/BalancePage'
import type {Balance, Currency, Deposit, Withdrawal} from '../../types/Balance'
import Decimal from 'decimal.js'
import { API_URL } from '../../config'
import { connect } from 'react-redux'
import type {Profile} from '../../types/Profile'
import moment from 'moment'
import {history} from '../../redux'

type Props = {
  history: Object,
  profile: Profile,
  language: string,
  match: Object
}

type State= {
  currencies: Currency[] | null,
  marketTickers: Object | null,
  balances: Balance[] | null,
  balancesObject: Object | null,
  pricingSymbol: string,
  pricingDecimalPlaces: number,
  totalEstimatedValue: string,
  availableValue: string,
  frozenValue: string,
  depositHistories: Object | null,
  withdrawalHistories: Object | null,
  tradeHistories: Object | null,
  selectedIndex: number,
  hideZeroBalances: boolean,
  interest: string,
  interestRate: string,
  interestDate: string,
}


class BalanceContainer extends React.Component<Props, State> {
  state = {
    currencies: null,
    marketTickers: null,
    pricingSymbol: 'KRW',
    pricingDecimalPlaces: 0,
    balances: null,
    balancesObject: null,
    totalEstimatedValue: '',
    availableValue: '',
    frozenValue: '',
    depositHistories: null,
    withdrawalHistories: null,
    tradeHistories: null,
    selectedIndex: 0,
    hideZeroBalances: false,
    loading: true,
    interest: '',
    interestRate: '',
    interestDate: '',
  }

  constructor(props: Props) {
    super(props)

    switch(this.props.match.params.sub) {
    case 'assets':
      this.state.selectedIndex = 0
      break
    case 'deposits':
      this.state.selectedIndex = 1
      break
    case 'withdrawals':
      this.state.selectedIndex = 2
      break
    case 'trades':
      this.state.selectedIndex = 3
      break
    }
  }

  parsePathname = (pathname: string) => {
    const subPath = pathname.substring(1).split('/')[1]
    var newIndex = -1
    switch(subPath) {
    case 'assets':
      newIndex = 0
      break
    case 'deposits':
      newIndex = 1
      break
    case 'withdrawals':
      newIndex = 2
      break
    case 'trades':
      newIndex = 3
      break
    }

    if (newIndex >= 0 && this.state.selectedIndex != newIndex) this.setState({selectedIndex: newIndex})
  }

  componentDidMount() {
    const historyUnlisten = history.listen((location, action) => {
      this.parsePathname(location.pathname)
    })
    this.setState({historyUnlisten: historyUnlisten})

    if (this.props.profile) {
      switch(this.props.match.params.sub) {
      case 'assets':
        this.fetchAssets(true)
        break
      case 'deposits':
        this.fetchDeposits()
        break
      case 'withdrawals':
        this.fetchWithdrawals()
        break
      case 'trades':
        this.fetchTradeHistories()
        break
      }
    } else {
      this.props.history.push('/login#callback=/balances')
    }
  }

  componentWillUnmount() {
    if (this.state.historyUnlisten) this.state.historyUnlisten()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.sub !== this.props.match.params.sub) {
      if (this.props.profile) {
        switch(this.props.match.params.sub) {
        case 'assets':
          if (this.state.balances === null) {
            this.fetchAssets(true)
          }
          break
        case 'deposits':
          if (this.state.depositHistories === null) {
            this.fetchDeposits()
          }
          break
        case 'withdrawals':
          if (this.state.withdrawalHistories === null) {
            this.fetchWithdrawals()
          }
          break
        case 'trades':
          if (this.state.tradeHistories === null) {
            this.fetchTradeHistories()
          }
          break
        }
      } else {
        this.props.history.push('/login#callback=/balances')
      }
    }
  }

  sortCurrencies = (currencies: Currency[]) => {
    for (let idx = 0; idx < currencies.length; idx++) {
      if (currencies[idx].symbol === 'KRW') {
        const krwItem = currencies.splice(idx, 1)
        currencies.unshift(krwItem[0])
        break
      }
    }

    return currencies
  }

  fetchAssets = (updateSelectedIndex) => {
    this.setState({loading: true})
    Promise.all([
      fetch(`${API_URL}/currencies`),
      fetch(`${API_URL}/markets/ticker`),
      fetch(`${API_URL}/myaccount/balances`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => {
      if (responses[2].ok) {
        return Promise.all(responses.map(response => response.json()))
      } else {
        return Promise.reject('login required')
      }
    }).then(([currencies, marketTickers, balances]) => {
      const { pricingSymbol, pricingDecimalPlaces } = this.state
      const marketTickersMap = marketTickers.reduce((object, marketTicker) => (
        (object[marketTicker.marketId] = marketTicker), object
      ), {})

      const valueMap = this.calculatePrice(balances, marketTickersMap, pricingSymbol)
      const newIndex = updateSelectedIndex ? 0 : this.state.selectedIndex
      this.setState({
        currencies: this.sortCurrencies(currencies),
        marketTickers: marketTickersMap,
        balances: balances,
        balancesObject: balances.reduce((object, balance) => (
          (object[balance.currencySymbol] = balance), object
        ), {}),
        totalEstimatedValue: valueMap.totalEstimatedValue.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        availableValue: valueMap.availableValue.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        frozenValue: valueMap.frozenValue.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        interest: valueMap.interest.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        selectedIndex: newIndex,
      })
      this.fetchInterestRate()
    }).catch(error => {
      if (error === 'login required') {
        this.props.history.push('/login#callback=/balances')
      } else {
        this.setState({
          balances: null,
          loading: false
        })
      }
    })
  }


  fetchInterestRate = () => {
    fetch(API_URL + '/myaccount/interest/rate', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) {
          Promise.all([response.status, response.json()]).then(([status, json]) => {
            switch(status) {
            case 200:
              this.setState({
                interestRate: json.interestRate,
                interestDate: json.interestDate,
                loading: false
              })
              break
            }
          })
        } else {
          return Promise.reject('login required')
        }
      })
      .catch(error => {
        if (error === 'login required') {
          this.props.history.push('/login#callback=/balances')
        } else {
          this.setState({
            interestRate: '',
            interestDate: '',
            loading: false
          })
        }
      })
  }

  calculatePrice = (balances: Balance[], marketTickersMap: Object, pricingSymbol: string) => {
    let totalEstimatedValue = new Decimal(0)
    let availableValue = new Decimal(0)
    let frozenValue = new Decimal(0)
    let interest = new Decimal(0)

    if (balances !== null && balances.length > 0) {
      for (let i = 0; i < balances.length; i++) {
        if (balances[i].currencySymbol === pricingSymbol) {
          totalEstimatedValue = totalEstimatedValue.add(new Decimal(balances[i].amount))
          frozenValue = frozenValue.add(new Decimal(balances[i].frozen))
          if (balances[i].interest) interest = interest.add(new Decimal(balances[i].interest))

        } else {
          if (balances[i].currencySymbol === 'BTC' && pricingSymbol === 'ETH') {
            const eth_btc_price = new Decimal(marketTickersMap['ETH_BTC'].price)

            if (!eth_btc_price.equals(0)) {
              totalEstimatedValue = totalEstimatedValue.add(new Decimal(balances[i].amount).dividedBy(eth_btc_price))
              frozenValue = frozenValue.add(new Decimal(balances[i].frozen).dividedBy(eth_btc_price))
              if (balances[i].interest)  interest = interest.add(new Decimal(balances[i].interest).dividedBy(eth_btc_price))
            }
          } else {
            const ticker = marketTickersMap[balances[i].currencySymbol + '_' + pricingSymbol]

            if (ticker) {
              const price = new Decimal(ticker.price)

              totalEstimatedValue = totalEstimatedValue.add(new Decimal(balances[i].amount).mul(price))
              frozenValue = frozenValue.add(new Decimal(balances[i].frozen).mul(price))
              if (balances[i].interest) interest = interest.add(new Decimal(balances[i].interest).mul(price))
            }
          }
        }
      }
      availableValue = totalEstimatedValue.sub(frozenValue)
    }

    return {
      totalEstimatedValue: totalEstimatedValue,
      availableValue: availableValue,
      frozenValue: frozenValue,
      interest: interest
    }
  }

  handlePricingSymbolClick = (symbol: string) => {
    const { balances, marketTickers } = this.state

    switch(symbol) {
    case 'BTC':
    case 'ETH':
      if (balances !== null && marketTickers !== null) {
        const valueMap = this.calculatePrice(balances, marketTickers, symbol)

        this.setState({
          pricingSymbol: symbol,
          pricingDecimalPlaces: 8,
          totalEstimatedValue: valueMap.totalEstimatedValue.toFixed(8, Decimal.ROUND_DOWN).toString(),
          availableValue: valueMap.availableValue.toFixed(8, Decimal.ROUND_DOWN).toString(),
          frozenValue: valueMap.frozenValue.toFixed(8, Decimal.ROUND_DOWN).toString(),
          interest: valueMap.interest.toFixed(8, Decimal.ROUND_DOWN).toString(),
        })
      }
      break
    case 'KRW':
      if (balances !== null && marketTickers !== null) {
        const valueMap = this.calculatePrice(balances, marketTickers, symbol)

        this.setState({
          pricingSymbol: symbol,
          pricingDecimalPlaces: 0,
          totalEstimatedValue: valueMap.totalEstimatedValue.toFixed(0, Decimal.ROUND_DOWN).toString(),
          availableValue: valueMap.availableValue.toFixed(0, Decimal.ROUND_DOWN).toString(),
          frozenValue: valueMap.frozenValue.toFixed(0, Decimal.ROUND_DOWN).toString(),
          interest: valueMap.interest.toFixed(0, Decimal.ROUND_DOWN).toString(),
        })
      }
      break
    }
  }

  fetchDeposits = () => {
    this.callHistories(moment().add(-1, 'month'), moment(), 'DEPOSIT', '', 1, 20)
  }

  fetchWithdrawals = () => {
    this.callHistories(moment().add(-1, 'month'), moment(), 'WITHDRAW', '', 1, 20)
  }

  fetchTradeHistories = () => {
    this.callHistories(moment().add(-1, 'month'), moment(), 'TRADE', '', 1, 20)
  }

  callHistories = (startDate: moment, endDate: moment, type: string, currencySymbol: string, pageNo: number, size: number) => {
    this.setState({loading: true})

    const from = startDate.hour(0).minute(0).second(0).format('x')
    const to = endDate.hour(23).minute(59).second(59).format('x')

    Promise.all([
      fetch(`${API_URL}/currencies`),
      fetch(`${API_URL}/markets/ticker`),
      fetch(`${API_URL}/myaccount/balances`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      }),
      fetch(`${API_URL}/myaccount/histories?fromTimestamp=${from}&toTimestamp=${to}&historyType=${type}&currencySymbol=${currencySymbol}&pageNo=${pageNo}&size=${size}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => {
      if (responses[3].ok) {
        return Promise.all(responses.map(response => response.json()))
      } else if (responses[3].status == 401) {
        return Promise.reject('login required')
      } else {
        return Promise.reject('unknown')
      }
    }).then(([currencies, marketTickers, balances, histories]) => {
      const { pricingSymbol, pricingDecimalPlaces } = this.state
      const marketTickersMap = marketTickers.reduce((object, marketTicker) => (
        (object[marketTicker.marketId] = marketTicker), object
      ), {})

      const valueMap = this.calculatePrice(balances, marketTickersMap, pricingSymbol)

      const balanceData = {
        currencies: this.sortCurrencies(currencies),
        marketTickers: marketTickersMap,
        balances: balances,
        balancesObject: balances.reduce((object, balance) => (
          (object[balance.currencySymbol] = balance), object
        ), {}),
        totalEstimatedValue: valueMap.totalEstimatedValue.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        availableValue: valueMap.availableValue.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        frozenValue: valueMap.frozenValue.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
        interest: valueMap.interest.toFixed(pricingDecimalPlaces, Decimal.ROUND_DOWN).toString(),
      }

      switch(type) {
      case 'TRADE':
      case 'BUY':
      case 'SELL':
        this.setState({
          ...balanceData,
          tradeHistories: {
            historyList: histories.historyList,
            startDate: startDate,
            endDate: endDate,
            type: type,
            currencySymbol: currencySymbol,
            pageNo: histories.pageNo,
            totalPageNo: histories.totalPageNo,
            size: size
          },
          selectedIndex: 3,
          loading: false
        })
        break
      case 'DEPOSIT':
        this.setState({
          ...balanceData,
          depositHistories: {
            historyList: histories.historyList,
            startDate: startDate,
            endDate: endDate,
            type: type,
            currencySymbol: currencySymbol,
            pageNo: histories.pageNo,
            totalPageNo: histories.totalPageNo,
            size: size
          },
          selectedIndex: 1,
          loading: false
        })
        break
      case 'WITHDRAW':
        this.setState({
          ...balanceData,
          withdrawalHistories: {
            historyList: histories.historyList,
            startDate: startDate,
            endDate: endDate,
            type: type,
            currencySymbol: currencySymbol,
            pageNo: histories.pageNo,
            totalPageNo: histories.totalPageNo,
            size: size
          },
          selectedIndex: 2,
          loading: false
        })
        break
      }
    }).catch(error => {
      if (error === 'login required') {
        switch(type) {
        case 'TRADE':
        case 'BUY':
        case 'SELL':
          this.props.history.push('/login#callback=/balances/trades')
          break
        case 'DEPOSIT':
          this.props.history.push('/login#callback=/balances/deposits')
          break
        case 'WITHDRAW':
          this.props.history.push('/login#callback=/balances/withdrawals')
          break
        }
      } else {
        switch(type) {
        case 'TRADE':
        case 'BUY':
        case 'SELL':
          this.setState({
            balances: null,
            tradeHistories: null,
            loading: false
          })
          break
        case 'DEPOSIT':
          this.setState({
            balances: null,
            depositHistories: null,
            loading: false
          })
          break
        case 'WITHDRAW':
          this.setState({
            balances: null,
            withdrawalHistories: null,
            loading: false
          })
          break
        }
      }
    })
  }

  handleTabClick = (tabName: string) => {
    this.props.history.push(`/balances/${tabName}`)
  }

  handleWithdrawCancelClick = (withdrawId: string, index: number) => {
    Promise.all([
      fetch(`${API_URL}/myaccount/withdraw/${withdrawId}`, {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
    ]).then(responses => {
      if (responses[0].ok) {
        const { withdrawalHistories } = this.state

        if (withdrawalHistories !== null && withdrawalHistories.historyList !== null && withdrawalHistories.historyList[index] !== null) {
          const newHistories = withdrawalHistories.historyList.slice()
          newHistories[index]['status'] = 'KILL'
          newHistories[index]['timestamp'] = new Date().getTime()

          const newData = {
            ...withdrawalHistories,
            historyList: newHistories
          }

          this.setState({
            withdrawalHistories: newData,
            balances: null  // 자산현황 업데이트를 위해 null 세팅
          })

          this.fetchAssets(false)
        }
      } else if (responses[0].status == 401) {
        return Promise.reject('login required')
      } else {
        return Promise.reject('unknown')
      }
    }).catch(error => {
      if (error === 'login required') {
        this.props.history.push('/login#callback=/balances/withdrawals')
      }
    })
  }

  handleHideZeroBalance = () => {
    const { hideZeroBalances } = this.state

    this.setState({
      hideZeroBalances: !hideZeroBalances
    })
  }

  handleBankingClick = (type: string) => {
    if (type === 'deposit' || type === 'withdraw') {
      this.props.history.push('/banking/'+type+'?popup=true')
    }
  }

  handleLinktoAuthClick = () => {
    this.props.history.push('/myaccount/auth')
  }

  handleLinktoMyaccount = () => {
    this.props.history.push('/myaccount/info')
  }

  handleBalanceUpdated = () => {
    this.setState({
      withdrawalHistories: null,
    })
    this.fetchAssets(false)
  }

  render() {
    const { currencies, marketTickers, balances, balancesObject, pricingSymbol, pricingDecimalPlaces, totalEstimatedValue,
      availableValue, frozenValue, interest, depositHistories, withdrawalHistories, tradeHistories, selectedIndex,
      hideZeroBalances, loading, interestRate, interestDate} = this.state
    const { profile, language } = this.props
    return (
      <BalancePage
        currencies={currencies}
        marketTickers={marketTickers}
        balances={balances}
        balancesObject={balancesObject}
        pricingSymbol={pricingSymbol}
        pricingDecimalPlaces={pricingDecimalPlaces}
        handlePricingSymbolClick={this.handlePricingSymbolClick}
        totalEstimatedValue={totalEstimatedValue}
        availableValue={availableValue}
        frozenValue={frozenValue}
        interest={interest}
        depositHistories={depositHistories}
        withdrawalHistories={withdrawalHistories}
        tradeHistories={tradeHistories}
        onTabClick={this.handleTabClick}
        callHistories={this.callHistories}
        onWithdrawCancelClick={this.handleWithdrawCancelClick}
        selectedIndex={selectedIndex}
        hideZeroBalances={hideZeroBalances}
        onHideZeroBalanceClick={this.handleHideZeroBalance}
        onBankingClick={this.handleBankingClick}
        profile={profile}
        onLinktoAuthClick={this.handleLinktoAuthClick}
        onLinktoMyaccount={this.handleLinktoMyaccount}
        ref="balancepage"
        language={language}
        handleBalanceUpdated={this.handleBalanceUpdated}
        loading={loading}
        interestRate={interestRate}
        interestDate={interestDate}
      />
    )
  }
}

function mapStateToProps(state) {
  const { login, setLanguage } = state
  const { profile } = login
  const { language } = setLanguage
  return {
    profile,
    language
  }
}

export default connect(mapStateToProps)(BalanceContainer)
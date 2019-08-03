// @flow

import type {Market} from '../../types/Trading'
import { API_URL } from '../../config'

const supportedResolutions: Array<string> = ['1', '5', '15', '30', '60', 'D', 'W', 'M', '12M']

const resolution2Period: { [string]: string } = {
  '1': '1',
  '5': '5',
  '15': '15',
  '30': '30',
  '60': 'hour',
  'D': 'day',
  'W': 'week',
  'M': 'month',
  '12M': 'year'
}

type DataFeedConfig = {
  supports_search: boolean,
  supports_group_request: boolean,
  supported_resolutions: Array<string>,
  supports_marks: boolean,
  supports_timescale_marks: boolean,
  supports_time: boolean
}

const config: DataFeedConfig = {
  supports_search: false,
  supports_group_request: false,
  supported_resolutions: supportedResolutions,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: false
}

// see https://github.com/tradingview/charting_library/wiki/Symbology#symbolinfo-structure
type SymbolInfo = {
  name: string,
  ticker: string,
  description?: string,
  type?: string,
  session?: string,
  exchange?: string,
  timezone?: string,
  minmov?: number,
  pricescale?: number,
  has_intraday?: boolean,
  supported_resolutions: Array<string>,
  intraday_multipliers: Array<string>,
  has_seconds?: boolean,
  has_daily?: boolean,
  has_weekly_and_monthly?: boolean,
  has_empty_bars?: boolean,
  force_session_rebuild?: boolean,
  has_no_volume?: boolean,
  volume_precision?: number,
  data_status?: 'streaming' | 'endofday' | 'pulsed' | 'delayed_streaming',
  currency_code?: string
}

const defaultSymbolInfo: SymbolInfo = {
  name: '',
  ticker: '',
  type: 'bitcoin',
  session: '24x7',
  // exchange: 'Quanty.com',
  timezone: 'Asia/Seoul',
  has_intraday: true,
  supported_resolutions: supportedResolutions,
  intraday_multipliers: ['1', '5', '15', '30', '60'],
  has_daily: true,
  has_weekly_and_monthly: true,
  has_empty_bars: true,
  force_session_rebuild: false,
  has_no_volume: false,
  volume_precision: 8,
  data_status: 'streaming'
}

type Bar = {
  time: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number
}

function convertCandleToBar(candle: Object): Bar {
  return {
    time: candle.timestampFrom,
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close),
    volume: Number(candle.volume)
  }
}

type BarMeta = {
  noData: boolean,
  nextTime?: number
}

type RealtimeCallback = (Bar) => void

type SubscribedRealtimeCallBack = {
  marketId: string,
  resolution: string,
  callback: RealtimeCallback,
}

function fetchCandles(marketId: string, period: string, maxTimestampInSec?: number, limit?: number) {
  const params = {
    optionalCount: limit ? `${limit}` : '',
    exclusiveMaxTimestamp: maxTimestampInSec ? `${maxTimestampInSec * 1000}` : ''
  }

  const query = Object.keys(params)
    .map(k => `${k}=${encodeURIComponent(params[k])}`)
    .join('&')

  return fetch(`${API_URL}/markets/${marketId}/candles/${period}?${query}`)
    .then(response => response.json())
}

class TradingViewDataFeed {
  marketsObject: {[string]: Market}
  subscribedRealtimeCallbacks: {[string]: SubscribedRealtimeCallBack} = {}

  constructor(marketsObject: {[string]: Market}) {
    this.marketsObject = marketsObject
  }

  // override
  onReady(callback: (DataFeedConfig) => void) {
    Promise.resolve().then( () => callback(config) )
  }

  // override
  resolveSymbol(symbolName: string, onSymbolResolvedCallback: (Object) => void, onResolveErrorCallback: (any) => void) {
    const symbols: Array<string> = symbolName.split('/')

    if (symbols.length === 2) {
      const marketId = `${symbols[0]}_${symbols[1]}`
      // TODO use metadata in marketsObject

      Promise.resolve().then(() =>
        onSymbolResolvedCallback({
          ...defaultSymbolInfo,
          name: symbolName,
          ticker: marketId,
          minmov: 1,              // FIXME
          pricescale: Math.pow(10, this.marketsObject[marketId].pricingCurrency.decimalPlaces),  // FIXME
          currency_code: this.marketsObject[marketId].pricingCurrency.symbol   // FIXME
        })
      )
    } else {
      Promise.reject(`malformed symbol name: ${symbolName}`).then(reason =>
        onResolveErrorCallback(reason)
      )
    }
  }

  // override
  getBars(
    symbolInfo: SymbolInfo,
    resolution: string,
    from: number,
    to: number,
    onHistoryCallback: (Array<Bar>, BarMeta) => void,
    onErrorCallback: (any) => void,
    firstDataRequest: boolean) {

    const period = resolution2Period[resolution]
    if (!period) {
      Promise.reject(`invalid resolution: ${resolution}`).catch(reason =>
        onErrorCallback(reason)
      )
    }

    fetchCandles(symbolInfo.ticker, period, firstDataRequest ? undefined : to)
      .then(candles => {

        if (candles && candles.length > 0) {
          onHistoryCallback(
            candles.reverse().map(c => convertCandleToBar(c)),
            { noData: false })
        } else {
          onHistoryCallback([], { noData: true })
        }
      })
      .catch(reason => onErrorCallback(reason))
  }

  // override
  subscribeBars(symbolInfo: Object, resolution: string, onRealtimeCallback: RealtimeCallback, subscriberUID: string, onResetCacheNeededCallback: any) {
    this.subscribedRealtimeCallbacks[subscriberUID] = {
      marketId: symbolInfo.ticker,
      resolution: resolution,
      callback: onRealtimeCallback
    }
  }

  // override
  unsubscribeBars(subscriberUID: string) {
    delete this.subscribedRealtimeCallbacks[subscriberUID]
  }

  // override
  calculateHistoryDepth(resolution: string, resolutionBack: string, intervalBack: number) {
    if (resolution === '12M') {
      return {
        resolutionBack: 'M',
        intervalBack: 120
      }
    }
  }

  // our own
  updateLatestBar(marketId: string) {
    Object.keys(this.subscribedRealtimeCallbacks).forEach((subscriberUID) => {
      const srcb = this.subscribedRealtimeCallbacks[subscriberUID]
      if (marketId === srcb.marketId) {
        const period = resolution2Period[srcb.resolution]
        if (!period) {
          return
        }
        fetchCandles(srcb.marketId, period, undefined, 1)
          .then(candles => {
            if (candles && candles.length > 0) {
              srcb.callback(convertCandleToBar(candles[candles.length - 1]))
            }
          })
          .catch(err => {
          })
      }
    })
  }
}

export default TradingViewDataFeed


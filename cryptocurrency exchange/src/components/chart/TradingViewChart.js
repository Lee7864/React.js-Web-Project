// @flow

import * as React from 'react'

import LocalizedStrings from 'localized-strings'

import { widget } from '../../lib/external/charting_library.min'
import TradingViewDataFeed from './TradingViewDataFeed'
import type {Market} from '../../types/Trading'

const strings = new LocalizedStrings({
  en: {
    _1y: '1Years',
    _6m: '6Months',
    _7d: '1Week',
    _3d: '3Days',
    all: 'All'
  },
  ko: {
    _1y: '1년',
    _6m: '6개월',
    _7d: '1주일',
    _3d: '3일',
    all: '전체'
  }
})

const FILTER = /win16|win32|win64|mac|macintel/

type Props = {
  marketsObject: {[string]: Market},
  marketId: string,
  marketSymbol: string,
  baseSymbol: string,
  pricingSymbol: string,
  sequence: number,
  containerId: string,
  language: string
}

class TradingViewChart extends React.PureComponent<Props> {

  tradingViewWidget: widget
  dataFeed: TradingViewDataFeed

  componentDidMount() {
    this.dataFeed = new TradingViewDataFeed(this.props.marketsObject)
    let downColor = '#007ace'
    let upColor = '#de3618'
    let mobileFeatures = []
    let isMobile = !navigator.platform.toLowerCase().match(FILTER)

    if(isMobile)
      mobileFeatures = ['header_undo_redo', 'header_screenshot', 'header_fullscreen_button', 'timeframes_toolbar', 'property_pages', ];

    strings.setLanguage(this.props.language)

    this.tradingViewWidget = new widget({
      debug: false,
      symbol: this.props.marketSymbol,
      datafeed: this.dataFeed,
      interval: '15',
      container_id: this.props.containerId,
      library_path: '/charting_library/',
      timezone: 'Asia/Seoul',
      locale: strings.getLanguage() || 'en',
      fullscreen: false,
      autosize: true,
      disabled_features: ['uppercase_instrument_names', 'volume_force_overlay', 'header_compare', 'header_symbol_search', 'header_saveload',
        'study_templates', 'compare_symbol', 'border_around_the_chart', 'constraint_dialogs_movement'].concat(mobileFeatures),
      enabled_features: ['side_toolbar_in_fullscreen_mode', 'left_toolbar', 'move_logo_to_main_pane', 'hide_left_toolbar_by_default'],
      overrides: {
        volumePaneSize: 'small', // large, medium, small, tiny
        'paneProperties.topMargin': 10,
        'paneProperties.legendProperties.showLegend': isMobile? false : true,
        'scalesProperties.fontSize' : 10,
        'mainSeriesProperties.showPriceLine': false,
        // Candles styles
        'mainSeriesProperties.candleStyle.upColor': upColor,
        'mainSeriesProperties.candleStyle.downColor': downColor,
        'mainSeriesProperties.candleStyle.wickUpColor': upColor,
        'mainSeriesProperties.candleStyle.wickDownColor': downColor,
        'mainSeriesProperties.candleStyle.borderColor': '#5b1a13',
        'mainSeriesProperties.candleStyle.borderUpColor': upColor,
        'mainSeriesProperties.candleStyle.borderDownColor': downColor,
        // Hollow Candles styles
        'mainSeriesProperties.hollowCandleStyle.upColor': upColor,
        'mainSeriesProperties.hollowCandleStyle.downColor': downColor,
        'mainSeriesProperties.hollowCandleStyle.wickUpColor': upColor,
        'mainSeriesProperties.hollowCandleStyle.wickDownColor': downColor,
        'mainSeriesProperties.hollowCandleStyle.borderColor': '#5b1a13',
        'mainSeriesProperties.hollowCandleStyle.borderUpColor': upColor,
        'mainSeriesProperties.hollowCandleStyle.borderDownColor': downColor,
        'mainSeriesProperties.hollowCandleStyle.wickColor': '#737375',
        // Heikin Ashi styles
        'mainSeriesProperties.haStyle.upColor': upColor,
        'mainSeriesProperties.haStyle.downColor': downColor,
        'mainSeriesProperties.haStyle.drawWick': true,
        'mainSeriesProperties.haStyle.drawBorder': true,
        'mainSeriesProperties.haStyle.borderColor': '#5b1a13',
        'mainSeriesProperties.haStyle.borderUpColor': upColor,
        'mainSeriesProperties.haStyle.borderDownColor': downColor,
        'mainSeriesProperties.haStyle.wickColor': '#737375',
        'mainSeriesProperties.haStyle.wickUpColor': upColor,
        'mainSeriesProperties.haStyle.wickDownColor': downColor,
        // Bar styles
        'mainSeriesProperties.barStyle.upColor': upColor,
        'mainSeriesProperties.barStyle.downColor': downColor,
        // Line styles
        'mainSeriesProperties.lineStyle.color': '#0303F7',
        // Area styles
        'mainSeriesProperties.areaStyle.color1': '#606090',
        'mainSeriesProperties.areaStyle.color2': '#01F6F5',
        'mainSeriesProperties.areaStyle.linecolor': '#0094FF',
        // Baseline styles
        'mainSeriesProperties.baselineStyle.baselineColor': 'rgba( 117, 134, 150, 1)',
        'mainSeriesProperties.baselineStyle.topFillColor1': upColor,
        'mainSeriesProperties.baselineStyle.topFillColor2': upColor,
        'mainSeriesProperties.baselineStyle.bottomFillColor1': downColor,
        'mainSeriesProperties.baselineStyle.bottomFillColor2': downColor,
        'mainSeriesProperties.baselineStyle.topLineColor': upColor,
        'mainSeriesProperties.baselineStyle.bottomLineColor': downColor,
        'mainSeriesProperties.baselineStyle.transparency': 50,
        'mainSeriesProperties.baselineStyle.baseLevelPercentage': 50,
      },
      studies_overrides: {
        'volume.volume.color.0': downColor,
        'volume.volume.color.1': upColor,
        'volume.volume ma.color': downColor,
        'volume.show ma': true,
      },
      time_frames: [
        { text: '1y', resolution: 'W', description: '1 Years', title: strings._1y },
        { text: '6m', resolution: 'D', description: '6 Months', title: strings._6m },
        { text: '7d', resolution: '15', description: '7 Days', title: strings._7d },
        { text: '3d', resolution: '5', description: '3 Days', title: strings._3d },
        { text: '10y', resolution: 'M', description: 'All', title: strings.all },
      ],
      // preset: navigator.platform.toLowerCase().match(FILTER) ? '' : 'mobile',
      toolbar_bg: '#ffffff',
      loading_screen: { backgroundColor: '#f4f6f8', foregroundColor: '#f4f6f8', },
      //theme: 'light', // light, dark
    })


    this.tradingViewWidget.onChartReady(() => {
      this.tradingViewWidget.chart().createStudy('Moving Average', false, false, [15], '', {'plot.color.0' : '#9c6ade'})
      this.tradingViewWidget.chart().createStudy('Moving Average', false, false, [50], '', {'plot.color.0' : '#47c1bf'})
    })

  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.language !== this.props.language) {
      this.tradingViewWidget.setLanguage(this.props.language)
      return
    }

    if (prevProps.marketSymbol !== this.props.marketSymbol) {
      try {
        this.tradingViewWidget.chart().setSymbol(this.props.marketSymbol)
      } catch (e) {
        //console.log('no chart', e)
      }

      return
    }

    if (prevProps.sequence < this.props.sequence) {
      this.dataFeed.updateLatestBar(this.props.marketId)
    }
  }

  componentWillUnmount() {
    if (this.tradingViewWidget) {
      try {
        this.tradingViewWidget.remove()
      } catch(e) {
        // just swallow
      } finally {
        this.tradingViewWidget = null
      }
    }
  }

  render() {
    return null
  }

}

export default TradingViewChart
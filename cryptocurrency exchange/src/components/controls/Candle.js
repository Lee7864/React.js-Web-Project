// @flow

import * as React from 'react'
import View from './View'
import Decimal from 'decimal.js'

type Props = {
  open: string,
  close: string,
  high: string,
  low: string
}

class Candle extends React.PureComponent<Props> {

  render() {
    const {open, close, high, low} = this.props

    const openDecimal = new Decimal(open)
    const closeDecimal = new Decimal(close)
    const highDecimal = new Decimal(high)
    const lowDecimal = new Decimal(low)
    const closeHeight = openDecimal.equals(0) ? 0 : Math.min(Math.max(closeDecimal.sub(openDecimal).dividedBy(openDecimal).absoluteValue().dividedBy(30).mul(10000).toNumber(), 1), 100)
    const highHeight = openDecimal.equals(0) ? 0 : Math.min(Math.max(highDecimal.sub(openDecimal).dividedBy(openDecimal).absoluteValue().dividedBy(30).mul(10000).toNumber(), 0), 100)
    const lowHeight = openDecimal.equals(0) ? 0 : Math.min(Math.max(lowDecimal.sub(openDecimal).dividedBy(openDecimal).absoluteValue().dividedBy(30).mul(10000).toNumber(), 0), 100)

    const lineColor = openDecimal.greaterThan(closeDecimal) ? 'down-blue' : closeDecimal.greaterThan(openDecimal) ? 'up-red' : 'black'

    return (
      <View flex='fill'>
        <View flex='fill' justifyContent='flex-end'>
          <View width='100%' height={closeHeight + '%'} minHeight={1} hidden={openDecimal.greaterThanOrEqualTo(closeDecimal)} backgroundColor='up-red'/>
          <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}} justifyContent='flex-end' alignItems='center'>
            <View width={1} height={highHeight + '%'} backgroundColor={lineColor}/>
          </View>
        </View>

        <View width='100%' height='100%' maxHeight={1} backgroundColor='black' hidden={!openDecimal.equals(closeDecimal)}/>

        <View flex='fill'>
          <View width='100%' height={closeHeight + '%'} minHeight={1} hidden={closeDecimal.greaterThanOrEqualTo(openDecimal)} backgroundColor='down-blue'/>
          <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}} alignItems='center'>
            <View width={1} height={lowHeight + '%'} backgroundColor={lineColor}/>
          </View>
        </View>
      </View>
    )
  }
}

export default Candle
// @flow

import * as React from 'react'
import {Divider, Tab, Text, View} from '../controls'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import MarketDisplayCard from './MarketDisplayCard'
import type {TabData} from '../controls/Tab'
import Decimal from 'decimal.js'

const strings = new LocalizedStrings({
  en: {
    headers: {
      up: 'Up 5',
      down: 'Down 5'
    }
  },
  ko: {
    headers: {
      up: '상승상위',
      down: '하락상위'
    }
  }
})

type ElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: ElementProps) => {
  return (
    <View flex='fill' height={50} onClick={onPress}>
      <View height='100%' justifyContent='center' alignItems='center'>
        <Text textColor='black' fontWeight='bold'>{item.key}</Text>
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
  marketList: Array<Object | null>,
  language: string
}

type State = {
  tabIndex: number
}

class ChangeRateMarketListCard extends React.PureComponent<Props, State> {
  state = {
    tabIndex: 0
  }

  handleTabClick = (value: string) => {
    this.setState({
      tabIndex: value === 'up' ? 0 : 1
    })
  }

  render() {
    const {marketList, language} = this.props
    const {tabIndex} = this.state

    strings.setLanguage(language)

    const data = [{key: strings.headers.up, value: 'up'}, {key: strings.headers.down, value: 'down'}]

    if (tabIndex === 0) {
      this.props.marketList.sort((a, b) => a && b && new Decimal(a['changeRate']).greaterThan(new Decimal(b['changeRate'])) ? -1 : 1)
    } else {
      this.props.marketList.sort((a, b) => a && b && new Decimal(a['changeRate']).greaterThan(new Decimal(b['changeRate'])) ? 1 : -1)
    }

    return (
      <View width='100%'>
        <View flexHorizontal height={50}>
          <View width={10} style={styles.dontshrink}/>
          <View flex='fill'>
            <Tab data={data} onPress={this.handleTabClick} selectedIndex={tabIndex} tabElement={TabElement} flex='fill'/>
          </View>
          <View width={10} style={styles.dontshrink}/>
        </View>

        <Divider color='divider'/>

        <MarketDisplayCard marketList={marketList.slice(0, 5)} language={language}/>
      </View>
    )
  }
}

export default ChangeRateMarketListCard
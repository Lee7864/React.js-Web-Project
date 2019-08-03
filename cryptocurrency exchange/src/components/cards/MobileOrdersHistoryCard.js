// @flow

import * as React from 'react'
import {Divider, Text, View} from '../controls'
import Tab from '../controls/Tab'
import ActiveOrdersCard from './ActiveOrdersCard'
import CompletedOrdersCard from './CompletedOrdersCard'
import LocalizedStrings from 'localized-strings'
import type {TabData} from '../controls/Tab'
import type {CancelOrderHandler, CancelOrderParams, CancelOrderResult} from '../../types/OrderRequest'
import type {Market, Order} from '../../types/Trading'
import styles from '../../styles/StyleGuide.css'

const strings = new LocalizedStrings({
  en: {
    header: {
      activeOrders: 'ACTIVE ORDERS',
      completedOrders: 'COMPLETE ORDERS'
    }
  },
  ko: {
    header: {
      activeOrders: '미체결주문',
      completedOrders: '완료주문'
    }
  }
})

type TabElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const TabElement = ({item, selected, onPress}: TabElementProps) => {
  return (
    <View flex='fill' flexHorizontal>
      <View flex='fill' height={40} onClick={onPress}>
        <View height={40} justifyContent='center' alignItems='center'>
          <Text textColor='black' fontWeight='semibold' fontSizeNum={14}>{item.key}</Text>
        </View>

        {selected &&
        <View position='absolute' width='100%' height='100%' justifyContent='flex-end'>
          <View width='100%' height={3} style={styles.dontshrink} backgroundColor='iris'/>
        </View>
        }
      </View>
    </View>
  )
}

const ordersTabData = [{key: strings.header.activeOrders, value: 'active'}, {key: strings.header.completedOrders, value: 'completed'}]
const hiddenColumns = ['pair', 'side', 'type', 'total']

type Props = {
  ordersTabIndex: number,
  ordersTabClick: (value: string) => void,
  activeOrders: Order[],
  completedOrders: Order[],
  onShowPopup: (popup: Object) => void,
  onClosePopup: () => void,
  language: string,
  onOrderCancelClick: CancelOrderHandler,
  marketsObject: {[string]: Market},
  selectedMarketId: string
}

class MobileOrdersHistoryCard extends React.PureComponent<Props> {

  render() {
    const {ordersTabIndex, ordersTabClick, activeOrders, completedOrders, onShowPopup, language, onOrderCancelClick, marketsObject, selectedMarketId} = this.props

    strings.setLanguage(language)

    return (
      <View backgroundColor='white' flex='fill'>
        <View paddingHorizontalNum={10}>
          <Tab data={ordersTabData} selectedIndex={ordersTabIndex} onPress={ordersTabClick} tabElement={TabElement} flex='fill'/>
        </View>

        <Divider/>

        <View flex='fill' overflow='auto'>
          <View flex='fill' hidden={ordersTabIndex !== 0}>
            <ActiveOrdersCard
              activeOrders={activeOrders.filter((order) => order.marketId === selectedMarketId)}
              marketsObject={marketsObject}
              onOrderCancelClick={onOrderCancelClick}
              onShowPopup={onShowPopup}
              language={language}
              hiddenColumns={hiddenColumns}
            />
          </View>
          <View flex='fill' hidden={ordersTabIndex !== 1}>
            <CompletedOrdersCard
              completedOrders={completedOrders.filter((order) => order.marketId === selectedMarketId)}
              marketsObject={marketsObject}
              language={language}
              hiddenColumns={hiddenColumns}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default MobileOrdersHistoryCard
// @flow

import * as React from 'react'
import View from './View'
import {Spacer, Text} from './index'
import styles from './Tab.css'

type Props = {
  data: TabData[],
  selectedIndex?: number,
  onPress?: (value: string) => void,
  tabElement?: React.ElementType
}

type State = {
  selectedIndex: number
}

type TabData = {
  key: string,
  value: string
}

type ElementProps = {
  item: TabData,
  selected: boolean,
  onPress: () => void
}

const DefaultElement = ({item, selected, onPress}: ElementProps) => {
  return (
    <View flexHorizontal>
      <Spacer size='medium'/>
      <View borderType={selected ? 'bottom' : undefined} border={selected ? 'thicker' : undefined} borderColor={selected ? 'iris' : undefined} onClick={onPress}>
        <Spacer/>
        <Text fontSize='small' textColor={selected ? 'iris' : 'dark-blue-grey'} fontWeight='semibold'>{item.key}</Text>
        <Spacer/>
      </View>
    </View>
  )
}

class Tab extends React.PureComponent<Props, State> {
  state = {
    selectedIndex: this.props.selectedIndex ? this.props.selectedIndex : 0
  }

  static getDerivedStateFromProps(nextProps: Props) {
    if (!isNaN(nextProps.selectedIndex)) {
      return {
        selectedIndex: nextProps.selectedIndex
      }
    }

    return null
  }

  handleTabClick = (index: number) => {
    const {data, onPress} = this.props
    const {selectedIndex} = this.state

    if (selectedIndex !== index && data[index] && data[index] !== null) {
      if (onPress) {
        onPress(data[index].value)
      }

      this.setState({
        selectedIndex: index
      })
    }
  }

  render() {
    const {data, tabElement, onPress, selectedIndex, ...props} = this.props

    const TabComponent = tabElement || DefaultElement

    return (
      <View flexHorizontal overflow='auto'>
        {data.map((item, index) => {
          const selected = index === this.state.selectedIndex
          return (
            <View flexHorizontal key={item.key} style={[styles.dontshrink, styles.button]} {...props}>
              <TabComponent item={item} selected={selected} onPress={() => this.handleTabClick(index)} />
            </View>
          )
        })}
      </View>
    )
  }
}

export default Tab

export type {
  TabData
}
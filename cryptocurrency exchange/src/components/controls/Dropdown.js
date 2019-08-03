// @flow

import * as React from 'react'
import {Text, View} from './index'
import style from './Dropdown.css'
import Image from './Image'
import type {Color} from './index'
import type {Border} from './View'
import Spacer from './Spacer'

type RowProps = {
  title: string,
  value: string,
  onPress: (title: string, value: string) => void,
  selected: boolean,
  fontSize: 'small' | 'xsmall'
}

class Row extends React.PureComponent<RowProps> {

  handleClick = () => {
    const { title, value, onPress } = this.props
    onPress(title, value)
  }

  render() {
    const { title, selected, fontSize } = this.props
    const backgroundColor = selected ? 'light-gray' : undefined

    return (
      <View flex='fill' onClick={this.handleClick} padding={fontSize} style={style.item} backgroundColor={backgroundColor}>
        <Text style={style.item} fontSize={fontSize} textColor='dark-gray'>{title}</Text>
      </View>
    )
  }
}

type ItemProps = {
  children: React.Node,
  title: string,
  value: string,
  childProps: Object,
  selected: boolean
}

const Item = ({ children, title, value, childProps, ...restProps }: ItemProps) => {
  return (
    <View flexHorizontal {...restProps}>
      {React.Children.map(children, (child) => (
        React.cloneElement(child, childProps)
      ))}
    </View>
  )
}

type Props = {
  children: Item[],
  title?: string,
  selectedValue: string,
  onItemClick: (value: string) => void,
  color?: Color,
  border?: Border,
  selectedAlign?: 'left' | 'right',
  fontSize?: 'small' | 'xsmall',
  noPadding?: boolean,
  borderRadius?: 'none' | 'small' | 'xsmall'
}

type State = {
  itemsVisible: boolean,
  selectedItem: string,
  selectedValue: string
}

class Dropdown extends React.PureComponent<Props, State> {
  static Item: Item = Item

  state = {
    itemsVisible: false,
    selectedItem: '',
    selectedValue: ''
  }

  static getDerivedStateFromProps(nextProps: Props) {
    if (nextProps.children && nextProps.children.length > 0) {
      const result = {}
      if (nextProps.selectedValue) {
        for (let idx = 0; idx < nextProps.children.length; idx++) {
          if (nextProps.selectedValue === nextProps.children[idx].props.value) {
            result.selectedItem = nextProps.children[idx].props.title
            result.selectedValue = nextProps.children[idx].props.value
            break
          }
        }
      } else {
        result.selectedItem = nextProps.children[0].props.title
        result.selectedValue = nextProps.children[0].props.value
      }

      return result
    }

    return null
  }

  showItems = () => {
    window.document.addEventListener('mousedown', this.mouseDown)

    this.setState({
      itemsVisible: true
    })
  }

  mouseDown = (event: SyntheticEvent<HTMLElement>) => {
    window.document.removeEventListener('mousedown', this.mouseDown)

    if (event.target.className.indexOf('Dropdown_item') < 0) {
      this.setState({
        itemsVisible: false
      })
    }
  }

  handleClick = (title: string, value: string) => {
    const { onItemClick } = this.props

    onItemClick(value)

    this.setState({
      itemsVisible: false,
      selectedItem: title
    })
  }

  render() {
    const { children, title, color, border, selectedAlign, fontSize, noPadding, borderRadius} = this.props

    const buttonImageUrl = color ? '/images/dropdown_button_dark_blue_grey.svg' : '/images/dropdown_button.svg'
    const borderColor = color ? color : 'light-blue'
    const borderType = border ? border : 'normal'
    const align = selectedAlign && selectedAlign === 'right' ? 'right' : 'left'
    const textSize = fontSize ? fontSize : 'small'
    const imageSize = fontSize ? fontSize === 'xsmall' ? 10 : 16 : 16

    return (
      <View flex='fill' padding={noPadding ? 'none' : 'xsmall'} height='100%'>
        <View flexHorizontal height='100%'>
          {title && (
            <Text padding="small">{title}</Text>
          )}

          <View flex='fill' height='100%'>
            <View backgroundColor='white' border={borderType} borderRadius={borderRadius ? borderRadius : 'small'} borderColor={borderColor} onClick={this.showItems} height='100%' justifyContent='center'>
              <View flexHorizontal justifyContent='space-between' padding={textSize}>
                <Text flex='fill' textAlign={align} fontSize={textSize} textColor='dark-gray'>{this.state.selectedItem}</Text>
                <Spacer size='tiny'/>
                <Image source={buttonImageUrl} width={imageSize} height={9}/>
              </View>
            </View>
            <View flex='fill' style={[style.items, this.state.itemsVisible && style.visible]} backgroundColor='white' border='normal' borderRadius={borderRadius ? borderRadius : 'small'} borderColor={borderColor} overflow='hidden'>
              <Row title={this.state.selectedItem} value={this.state.selectedValue} onPress={this.handleClick} selected={true} fontSize={textSize}/>
              {React.Children.map(children, (child, index) => {
                if (child !== null) {
                  return (
                    <React.Fragment>
                      <Row key={index} title={child.props.title} value={child.props.value} onPress={this.handleClick} selected={this.state.selectedItem === child.props.title} fontSize={textSize}/>
                    </React.Fragment>
                  )
                }
              })}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Dropdown
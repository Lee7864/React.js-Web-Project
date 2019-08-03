// @flow

import * as React from 'react'

import { View, Divider } from '.'

import styles from './View.css'
import type { Style } from '.'

type Props = {
  children: React.Node,
  style?: Style
}

const List = (props: Props) => {
  const {
    children,
    style,
    ...restProps
  } = props

  const rootStyle = [
    styles.root,
    style
  ]

  return (
    <View component="ul" style={rootStyle} {...restProps}>
      {React.Children.map(children, child => (
        <View component="li">
          <Divider />
          {child}
        </View>
      ))}
    </View>
  )
}

export default List

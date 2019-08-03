// @flow

import * as React from 'react'

import { View, Text, type Style } from '.'

import styles from './Card.css'

type Props = {
  children?: React.Node,
  style?: Style
}

const Card = ({children, style, ...props}: Props) => {
  return (
    <View backgroundColor="white" style={[styles.root, style]} {...props}>
      {children}
    </View>
  )
}

export default Card

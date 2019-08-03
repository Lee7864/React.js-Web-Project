// @flow

import * as React from 'react'

import { View, Text, type Color, type FontWeight } from '.'

import styles from './Button.css'
import type {Padding, Style} from './View'

type Props = {
  style?: Style,
  title: string,
  titleColor?: Color,
  titleWeight?: FontWeight,
  color?: Color,
  borderColor?: Color,
  size?: 'xsmall' | 'medium' | 'tiny',
  paddingVertical?: Padding,
  onPress?: () => void,
  fontSize?: 'xsmall' | 'small',
}

const Button = ({title, style, titleColor, titleWeight, size, color, borderColor, onPress, fontSize, paddingVertical, ...props}: Props) => {
  const rootProps = {
    paddingVertical: paddingVertical,
    paddingHorizontal: 'medium',
    borderRadius: 'xsmall',
    backgroundColor: color,
    borderColor: borderColor,
    alignItems: 'center',
    ...props
  }

  const rootStyle = [
    size && styles[`size-${size}`]
  ]

  return (
    <View component="button" style={[styles.root, rootStyle, style]} onClick={onPress} {...rootProps}>
      <View flex='fill' justifyContent='center'>
        <Text fontSize={fontSize} fontWeight={titleWeight || 'semibold'} textColor={titleColor}>
          {title}
        </Text>
      </View>
    </View>
  )
}

export default Button

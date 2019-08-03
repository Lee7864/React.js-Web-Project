// @flow

import * as React from 'react'

import { View } from '.'
import type { Style, Color } from '.'

import textStyles from './Text.css'
import globalStyles from '../../styles/StyleGuide.css'

const styles = { ...textStyles, ...globalStyles }

type Props = {
  children: React.Node,
  style?: Style,
  textColor?: Color,
  fontSize?: 'tiny' | 'xsmall' | 'small' | 'small-medium' | 'medium' | 'large' | 'xlarge' | 'huge' | 'small-medium-more' | 'home-title',
  fontSizeNum?: number,
  fontWeight?: 'normal' | 'bold' | 'semibold' | 'light' | 'semi-light',
  textAlign?: 'left' | 'center' | 'right',
  cursor?: string,
  letterSpacing?: 'm1' | 'm2' | 'p4',
  wordWrap?: 'normal' | 'break',
  wordBreak?: 'break-all',
  textOverflow?: string,
  overflow?: string,
  whiteSpace?: string
}

const Text = ({
  children,
  style,
  textColor,
  fontSize,
  fontSizeNum,
  fontWeight,
  textAlign,
  cursor,
  letterSpacing,
  wordWrap,
  wordBreak,
  textOverflow,
  overflow,
  whiteSpace,
  ...rootProps
}: Props) => {
  const rootStyle = [
    textColor && styles[`text-color-${textColor}`] || styles['text-color-default'],
    fontSize && styles[`font-size-${fontSize}`],
    fontSizeNum !== undefined && {fontSize: fontSizeNum},
    fontWeight && styles[`font-weight-${fontWeight}`],
    textAlign && styles[`text-align-${textAlign}`],
    cursor && styles[`cursor-${cursor}`],
    letterSpacing && styles[`letter-spacing-${letterSpacing}`],
    wordWrap && styles[`text-word-wrap-${wordWrap}`],
    wordBreak && styles[`text-word-break-${wordBreak}`],
    textOverflow !== undefined && {textOverflow: textOverflow},
    overflow !== undefined && {overflow: overflow},
    whiteSpace !== undefined && {whiteSpace: whiteSpace},
    style
  ]

  return (
    <View style={[styles.root, rootStyle]} {...rootProps}>
      {React.Children.map(children, child => (
        typeof child === 'string' ? child : React.cloneElement(child)
      ))}
    </View>
  )
}

export default Text

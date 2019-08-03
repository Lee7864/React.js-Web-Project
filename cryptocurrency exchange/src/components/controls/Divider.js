// @flow

import * as React from 'react'

import { View, Spacer } from '.'
import type {Color, Style} from '.'

import dividerStyles from './Divider.css'

const styles = { ...dividerStyles }

type Props = {
  size?: 'small' | 'medium' | 'large',
  color?: Color
}

const Divider = (props: Props) => {
  const {
    size,
    color,
    ...restProps
  } = props

  return (
    <View style={[styles.root]} {...restProps}>
      <View backgroundColor='divider' style={[styles.line]} />
    </View>
  )
}

export default Divider

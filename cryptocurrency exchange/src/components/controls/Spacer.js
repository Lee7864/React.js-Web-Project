import * as React from 'react'

import { View } from '.'

import styles from './View.css'

const Spacer = ({children, style, size, ...props}) => {
  const rootStyle = [
    styles.root,
    styles[`spacing-${size || 'small'}`],
    style
  ]

  return (
    <View style={rootStyle} {...props}>
      {children}
    </View>
  )
}

export default Spacer

import * as React from 'react'

import { View, Text, Spacer } from '.'
import { Link as RouterLink } from 'react-router-dom'

import styles from './Link.css'

const Link = ({children, to, ...props}) => {
  const rootStyle = [
    styles.root
  ]

  return (
    <Text component={RouterLink} to={to} textColor="down-blue" style={rootStyle} {...props}>
      {children}
    </Text>
  )
}

export default Link

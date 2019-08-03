import * as React from 'react'

import { View, Text } from '.'

import styles from './Stack.css'

const Stack = ({children}) => {
  return (
    <View flexHorizontal style={styles.root}>
      {React.Children.map(children, child => (
        <View style={styles.item}>
          {child}
        </View>
      ))}
    </View>
  )
}

export default Stack

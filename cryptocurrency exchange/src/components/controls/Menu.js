import * as React from 'react'

import { View, Text, Spacer } from '.'

import styles from './Menu.css'

const Menu = ({children, ...props}) => {
  return (
    <View padding="small" style={styles.root} {...props}>
      {React.Children.map(children, (child, index) => (
        <React.Fragment>
          {index > 0 && <Spacer />}
          {child}
        </React.Fragment>
      ))}
      <Spacer size="large" />
    </View>
  )
}

export default Menu

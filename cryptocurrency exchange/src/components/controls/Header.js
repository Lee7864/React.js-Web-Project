// @flow

import * as React from 'react'
import {Link, Spacer, Text, View, Image} from './index'
import LocalizedStrings from 'localized-strings'
import styles from '../../styles/StyleGuide.css'
import { history } from '../../redux'


const Header = () => {
  return (
    <View padding='medium' style={styles.dontshrink}>
      <Link to="/" fontSize="xsmall" textColor="gray"><Image source="/images/logo-quanty-white.svg" height={46}/></Link>
    </View>
  )
}

export default Header
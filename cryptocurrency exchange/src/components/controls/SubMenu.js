// @flow

import * as React from 'react'
import { View, Spacer, Text } from '.'
import styles from './SubMenu.css'
import globalStyles from '../../styles/StyleGuide.css'

type SubMenuProps = {
  thisMenu: string,
  currentMenu: string,
  title: string,
  onClick: (string) => void
}

const SubMenu = ({ thisMenu, currentMenu, title, onClick }: SubMenuProps) => {

  const handleClick = () => {
    onClick(thisMenu)
  }

  return (
    <View flexHorizontal onClick={handleClick} style={[styles.button, globalStyles.dontshrink]}>
      <Spacer size="xsmall"/>
      <View border={ thisMenu === currentMenu ? 'thicker' : 'none' } borderColor='iris' borderType="bottom" >
        <Spacer size="tiny"/>
        <View paddingVertical="medium">
          <Text
            fontWeight={ thisMenu === currentMenu ? 'bold' : 'normal' }
            textColor={ thisMenu === currentMenu ? 'iris' : 'dark-gray' }
          >{title}</Text>
        </View>
        <Spacer size="tiny"/>
      </View>
      <Spacer size="xsmall"/>
    </View>
  )
}

export default SubMenu
// @flow

import * as React from 'react'

import { View, Text, Spacer, Image } from '.'

import inputStyles from './Input.css'
import type {Color , Border} from '.'

const styles = { ...inputStyles }

type Props = {
  value?: string,
  label?: string,
  placeholder?: string,
  message?: string,
  name?: string,
  autoComplete?: "on" | "off",
  hideMessage?: boolean,
  onChange?: Function,
  border?: Border,
  borderColor?: Color,
  backgroundColor?: Color,
  onFocus?: Function,
  onBlur?: Function,
  messageColor?: Color,
  innerRef?: Object,
  icon?: string,
  innerText?: string,
}

const Input = ({
                 label, placeholder, message, name, value, autoComplete, border, borderColor,
                 hideMessage, onChange, onFocus, onBlur, backgroundColor, messageColor, innerRef,
                 icon, innerText, ...restProps
}: Props) => {
  const rootStyle = [
    border && styles[`border-${border}`],
    borderColor && styles[`border-color-${borderColor}`],
    styles.root
  ]

  const messageStyle = [
    messageColor && styles[`message-color-${messageColor}`],
  ]

  const iconStyle = [
    styles.icon,
    icon && styles[`icon-${icon}`],
  ]

  const innerTextStyle = [
    styles.innerText,
  ]

  return (
    <View>
      {label && (
        <React.Fragment>
          <Text>{label}</Text>
          <Spacer size="xsmall" />
        </React.Fragment>
      )}
      <View
        component="input"
        placeholder={placeholder}
        style={rootStyle}
        name={name}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        backgroundColor={backgroundColor}
        innerRef={innerRef}
        {...restProps}
      />
      {
        icon &&
        <View style={iconStyle}/>
      }
      {
        innerText &&
        <Text style={innerTextStyle}>{innerText}</Text>
      }
      {message && (
        <React.Fragment>
          <Spacer size="xsmall" />
          <Text fontSize="xsmall" style={messageStyle}>{message}</Text>
        </React.Fragment>
      )}
    </View>
  )
}

export default Input

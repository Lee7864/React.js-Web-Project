// @flow

import * as React from 'react'

import { View } from '.'

type Props = {
  source: string,
  rotate?: string,
  cursor?: string,
}

const Image = (props: Props) => {
  const {
    source,
    rotate,
    cursor,
    ...restProps
  } = props

  return (
    <View component="img" rotate={rotate} src={source} cursor={cursor} {...restProps} />
  )
}

export default Image

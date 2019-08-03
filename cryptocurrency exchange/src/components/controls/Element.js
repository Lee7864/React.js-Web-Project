// @flow

import * as React from 'react'

const extract = (style, classNames = []) => {
  if (typeof style === 'string') {
    if (!classNames.includes(style)) {
      classNames.push(style)
    }
  } else if (style instanceof Array) {
    for (var s of style) {
      extract(s, classNames)
    }
  }

  return classNames
}

type Props = {
  children?: React.Node,
  tag?: string
}

const Element = (props: Props) => {
  const {
    children,
    tag,
    ...restProps
  } = props

  const Tag: string = tag || 'div'

  return (
    <Tag {...restProps}>
      {children}
    </Tag>
  )
}

export default Element

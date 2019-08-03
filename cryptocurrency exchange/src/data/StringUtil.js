import * as React from 'react'
export const treatNewline = (str: string) => {
  return str.split('\n').map( (line, index) => {
    return (<span key={index}>{line}<br/></span>)
  })
}
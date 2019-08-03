// @flow

import * as React from 'react'
import View from './View'
import {Text, Spacer} from './index'
import type {Color} from './View'

type PageProps = {
  title: string,
  textColor: Color,
  fontWeight: 'normal' | 'bold',
  pageNo: number,
  onPageClick: (pageNo: number) => void
}

const Page = ({title, textColor, fontWeight, pageNo, onPageClick}: PageProps) => {
  return (
    <View padding='xsmall' onClick={() => onPageClick(pageNo)}>
      <Text cursor='pointer' textColor={textColor} fontWeight={fontWeight}>{title}</Text>
    </View>
  )
}

type Props = {
  pageNo: number,
  totalPageNo: number,
  onPageClick: (pageNo: number) => void
}

class Pagination extends React.PureComponent<Props> {

  render() {
    const { pageNo, totalPageNo, onPageClick } = this.props
    if (pageNo ===0 && totalPageNo === 0) {
      return (
        <View>
          <Spacer size='xsmall'/>
          <Spacer size='xsmall'/>
        </View>
      )
    }

    const startPageNo = parseInt((pageNo - 1) / 10) * 10 + 1
    const endPageNo = Math.min(startPageNo + 9, totalPageNo)

    let pageArray = []

    if (pageNo > 1) {
      pageArray.push(<Page title={'<<'} textColor='iris' fontWeight='normal' pageNo={1} onPageClick={onPageClick} key={'first'}/>)
      pageArray.push(<Page title={'<'} textColor='iris' fontWeight='normal' pageNo={pageNo - 1} onPageClick={onPageClick} key={'prev'}/>)
    } else {
      pageArray.push(<View padding='xsmall' key={'first'}><Text textColor='disabled'>{'<<'}</Text></View>)
      pageArray.push(<View padding='xsmall' key={'prev'}><Text textColor='disabled'>{'<'}</Text></View>)
    }

    for (let i = startPageNo; i <= endPageNo; i++) {
      const textColor = i !== pageNo ? 'iris' : 'default'
      const weight = i !== pageNo ? 'normal' : 'bold'
      pageArray.push(<Page title={i.toString()} textColor={textColor} fontWeight={weight} pageNo={i} onPageClick={onPageClick} key={i}/>)
    }

    if (pageNo < totalPageNo) {
      pageArray.push(<Page title={'>'} textColor='iris' fontWeight='normal' pageNo={pageNo + 1} onPageClick={onPageClick} key={'next'}/>)
      pageArray.push(<Page title={'>>'} textColor='iris' fontWeight='normal' pageNo={totalPageNo} onPageClick={onPageClick} key={'last'}/>)
    } else {
      pageArray.push(<View padding='xsmall' key={'next'}><Text textColor='disabled'>{'>'}</Text></View>)
      pageArray.push(<View padding='xsmall' key={'last'}><Text textColor='disabled'>{'>>'}</Text></View>)
    }

    return (
      <View>
        <Spacer size='xsmall'/>
        <View flexHorizontal>
          {pageArray}
        </View>
        <Spacer size='xsmall'/>
      </View>
    )
  }
}

export default Pagination
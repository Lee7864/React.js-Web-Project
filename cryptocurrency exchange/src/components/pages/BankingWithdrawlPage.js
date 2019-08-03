// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import { View, Text, Spacer, Button } from '../controls'

import styles from '../../styles/StyleGuide.css'
import viewStyles from '../controls/View.css'
import type {Withdrawal} from '../../types/Balance'
import Pagination from '../controls/Pagination'
import moment from 'moment/moment'
import commaNumber from 'comma-number'

const strings = new LocalizedStrings({
  en: {
    withdrawals: {
      asset: 'Asset',
      status: 'Status',
      amount: 'Amount',
      date: 'Request Date',
      detail: 'Withdrawal Details',
      cancel: 'Cancel',
      transactionId: 'Transaction Id',
      address: 'Address',
      noItems: 'There is no withdrawal history',
      withdrawbank: 'Withdrawl Bank',
      accountnumber: 'Account Number',         
      accountholder: 'Account Holder',
      withdrawamount: 'Withdrawl Amount',
      withdrawfee: 'Withdrawl Fee',
    },
    status: {
      KILL: 'Canceled',
      FREEZE: 'Processing',
      DONE: 'Complete',
      COMPLETED: 'Complete',
      ONGOING: 'Ongoing'
    },
    type: {
      buy: 'Buy',
      sell: 'Sell',
      deposit: 'Deposit',
      withdraw: 'Withdrawal',
      all: 'All',
      BUY: 'BUY',
      SELL: 'SELL',
      DEPOSIT: 'DEPOSIT',
      WITHDRAW: 'WITHDRAW',
      ALL: 'All',
    }
  },
  ko: {
    withdrawals: {
      asset: '자산명',
      status: '상태',
      amount: '출금수량',
      date: '요청일시',
      detail: '출금 정보',
      cancel: '출금 취소',
      transactionId: '거래 ID',
      address: '주소',
      noItems: '출금 내역이 없습니다.',
      withdrawbank: '출금은행',
      accountnumber: '계좌번호',         
      accountholder: '예금주',
      withdrawamount: '출금액',
      withdrawfee: '출금수수료',
    },
    status: {
      KILL: '취소',
      FREEZE: '대기',
      DONE: '완료',
      COMPLETED: '완료',
      ONGOING: '처리중'
    },
    type: {
      buy: '매수',
      sell: '매도',
      deposit: '입금',
      withdraw: '출금',
      all: '전체',
      BUY: '매수',
      SELL: '매도',
      DEPOSIT: '입금',
      WITHDRAW: '출금',
      ALL: '전체',
    }
  }
})

type Props = {
  withdrawRequests: Withdrawal[],
  pageWithdrawRequest: number,
  pagesWithdrawRequest: number,
  onWithdrawRequestPageClick: (number) => void,
  onWithdrawCancelClick: (withdrawid: string, index: number) => void,
  language: string,
}

type State = {}

class BankingWithdrawlPage extends React.Component<Props, State> {

  handleCancelClick = (request: Withdrawal) => {
    if (request.withdrawId) {
      this.props.onWithdrawCancelClick(request.withdrawId, this.props.withdrawRequests.indexOf(request))
    }
  }

  render() {
    const {withdrawRequests, pageWithdrawRequest, pagesWithdrawRequest, onWithdrawRequestPageClick} = this.props
    strings.setLanguage(this.props.language)

    return (
      <View flex="fill">
        <View flex="fill" overflow='auto'>
          <View flexHorizontal flex="fill" width='100%' style={styles.dontshrink} phoneHidden>
            <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}>
            </View>
            <View paddingVertical="medium" width='20%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.date}</Text>
            </View>
            <View paddingVertical="medium" minWidth={20} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" width='20%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.withdrawbank}</Text>
            </View>
            <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" width='20%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.accountnumber}</Text>
            </View>
            <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" width='15%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.accountholder}</Text>
            </View>
            <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" width='25%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.withdrawfee}</Text>
            </View>
            <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" width='25%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.withdrawamount}</Text>
            </View>
            <View paddingVertical="medium" minWidth={10} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" width='15%' minWidth={150} style={viewStyles.rowBorder} flexHorizontal justifyContent='flex-end'>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.withdrawals.status}</Text>
            </View>
            <View paddingVertical="medium" minWidth={27} style={viewStyles.rowBorder}></View>
          </View>
          {
            withdrawRequests && withdrawRequests.map((request) => {
              var bankName = ''
              var accountNumber = ''
              var accountHolder = ''

              if (request.address) {
                const addrSp = request.address.split('|')
                if (addrSp.length > 2) accountHolder = addrSp[2]
                if (addrSp.length > 1) accountNumber = addrSp[1]
                if (addrSp.length > 0) bankName = addrSp[0]
              }
              return (
                <React.Fragment key={request.timestamp+request.amount+request.status}>
                  <View flexHorizontal flex="fill" width='100%' phoneHidden>
                    <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
                    <View paddingVertical="medium" width='20%' minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{moment(request.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={20} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" width='20%' minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{bankName}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" width='20%' minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{accountNumber}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" width='15%' minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{accountHolder}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" width='25%' minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{request.fee !== undefined ? commaNumber(request.fee) : '-'}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" width='25%' minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{commaNumber(request.amount)}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={10} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="small" width='15%' minWidth={150} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <View flexHorizontal justifyContent='flex-end'>
                        {request.status === 'FREEZE' &&
                        <View flexHorizontal justifyContent='space-between'>
                          <View paddingHorizontal="tiny">
                            <Spacer size="tiny" />
                            <Text fontSize="xsmall" textAlign="right">{strings.getString('status.'+ request.status)? strings.getString('status.'+ request.status) : request.status}</Text>
                          </View>
                          <View>
                            <Button title={strings.withdrawals.cancel} size='tiny' fontSize='xsmall' onPress={() => this.handleCancelClick(request)}/>
                          </View>
                        </View>
                        }
                        {request.status !== 'FREEZE' &&
                        <View>
                          <Spacer size="tiny" />
                          <Text fontSize="xsmall" textAlign="right">{strings.getString('status.'+ request.status)? strings.getString('status.'+ request.status) : request.status}</Text>
                        </View>
                        }
                      </View>
                    </View>
                    <View paddingVertical="medium" minWidth={27} style={viewStyles.rowBorder}></View>
                  </View>

                  <View width='100%' paddingHorizontal='xsmall' phoneOnlyShown style={viewStyles.rowBorder}>
                    <Spacer size="small" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.date}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(request.timestamp).format('YYYY.MM.DD kk:mm')}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.withdrawbank}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{bankName}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.accountnumber}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{accountNumber}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.accountholder}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{accountHolder}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.withdrawfee}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{request.fee !== undefined ? commaNumber(request.fee) : '-'}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.withdrawamount}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(request.amount)}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.withdrawals.status}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('status.'+ request.status)? strings.getString('status.'+ request.status) : request.status}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    {
                      request.status === 'FREEZE' &&
                      <View onClick={() => this.handleCancelClick(request)}
                        width={'100%'}
                        paddingVertical='medium'
                        paddingHorizontal='xsmall'
                        alignItems='center'
                        style={{cursor:'pointer'}}>
                        <Text fontSize="small" cursor='pointer'>{strings.withdrawals.cancel}</Text>
                      </View>
                    }
                  </View>

                </React.Fragment>
              )
            })
          }
        </View>

        {withdrawRequests.length > 0 &&
        <View alignItems='center'>
          <Pagination
            pageNo={pageWithdrawRequest}
            totalPageNo={pagesWithdrawRequest}
            onPageClick={onWithdrawRequestPageClick}
          />
        </View>
        }

      </View>
    )
  }
}

export default BankingWithdrawlPage

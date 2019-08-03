// @flow

import * as React from 'react'
import LocalizedStrings from 'localized-strings'
import { View, Text, Image, Spacer, Divider } from '../controls'
import Pagination from '../controls/Pagination'
import styles from '../../styles/StyleGuide.css'
import viewStyles from '../controls/View.css'
import type {DepositRequest} from '../../types/Balance'
import moment from 'moment/moment'
import commaNumber from 'comma-number'

const strings = new LocalizedStrings({
  en: {
    bankingdeposit: {
      expirationdate: 'Request Date',
      depositbank: 'Deposit Bank',
      accountholder: 'Account Holder',
      depositcode: 'Deposit Code',
      depositamount: 'Deposit Amount',
      status: 'Status',
      accountnumber: 'Account Number',
    },
    status: {
      WAITING: 'Pending Approval',
      DONE: 'Processed',
      DONE_BY_ADMIN: 'Processed',
      EXPIRED: 'Failed',
    }
  },
  ko: {
    bankingdeposit: {
      expirationdate: '요청일시',
      depositbank: '입금은행',
      accountholder: '예금주',
      depositcode: '입금코드',
      depositamount: '입금액',
      status: '상태',
      accountnumber: '계좌번호',
    },
    status: {
      WAITING: '대기중',
      DONE: '완료',
      DONE_BY_ADMIN: '오입금처리',
      EXPIRED: '실패',
    }
  }
})
type Props = {
  depositRequests: DepositRequest[],
  pageDepositRequest: number,
  pagesDepositRequest: number,
  onDepositRequestPageClick: (number) => void,
  language: string,
}

type State = {}

class BankingDepositPage extends React.Component<Props, State> {

  render() {
    const {depositRequests, pageDepositRequest, pagesDepositRequest, onDepositRequestPageClick} = this.props

    strings.setLanguage(this.props.language)

    return (
      <View flex="fill">
        <View flex="fill" overflow='auto' >
          <View flexHorizontal flex="fill" width='100%' style={styles.dontshrink} phoneHidden>
            <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}>
            </View>
            <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.expirationdate}</Text>
            </View>
            <View paddingVertical="medium" minWidth={20} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.depositbank}</Text>
            </View>
            <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.accountnumber}</Text>
            </View>
            <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
            <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.accountholder}</Text>
            </View>
            <View paddingVertical="medium" width='15%' minWidth={120} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.depositcode}</Text>
            </View>
            <View paddingVertical="medium" width='20%' minWidth={140} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.depositamount}</Text>
            </View>
            <View paddingVertical="medium" width='15%' minWidth={100} style={viewStyles.rowBorder}>
              <Text fontSize="xsmall" textColor="iris" textAlign="right">{strings.bankingdeposit.status}</Text>
            </View>
            <View paddingVertical="medium" minWidth={27} style={viewStyles.rowBorder}></View>
          </View>

          {
            depositRequests && depositRequests.map((request) => {
              return (
                <React.Fragment key={request.id}>
                  <View flexHorizontal flex="fill" width='100%' phoneHidden>
                    <View paddingVertical="medium" minWidth={15} style={viewStyles.rowBorder}></View>
                    <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder} justifyContent='center'>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{moment(moment.utc(request.createdAt).toDate()).format('YYYY.MM.DD kk:mm')}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={20} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{request.bankName}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{request.accountNumber}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={30} style={viewStyles.rowBorder} phoneHidden tabletHidden></View>
                    <View paddingVertical="medium" minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{request.accountHolder}</Text>
                    </View>
                    <View paddingVertical="medium" width='15%' justifyContent="center"  minWidth={120} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{request.otpCode}</Text>
                    </View>
                    <View paddingVertical="medium" width='20%' justifyContent="flex-end" minWidth={140} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{commaNumber(request.amount)}</Text>
                    </View>
                    <View paddingVertical="medium" width='15%' justifyContent="flex-end" minWidth={100} style={viewStyles.rowBorder}>
                      <Spacer size="xsmall"/>
                      <Text fontSize="xsmall" textAlign="right">{strings.getString('status.'+ request.status)? strings.getString('status.'+ request.status) : request.status}</Text>
                    </View>
                    <View paddingVertical="medium" minWidth={27} style={viewStyles.rowBorder}></View>
                  </View>

                  <View width='100%' paddingHorizontal='xsmall' phoneOnlyShown style={viewStyles.rowBorder}>
                    <Spacer size="small" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.expirationdate}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{moment(moment.utc(request.createdAt).toDate()).format('YYYY.MM.DD kk:mm')}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.depositbank}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{request.bankName}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.accountnumber}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{request.accountNumber}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.accountHolder}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{request.accountHolder}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.depositcode}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{request.otpCode}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.depositamount}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{commaNumber(request.amount)}</Text>
                    </View>

                    <Spacer size="xsmall" />
                    <View flexHorizontal justifyContent="space-between">
                      <Text fontSize="xsmall" fontWeight='normal' textColor='dark-gray' textAlign='right'>{strings.bankingdeposit.status}</Text>
                      <Text fontSize="xsmall" fontWeight='normal' textAlign='right'>{strings.getString('status.'+ request.status)? strings.getString('status.'+ request.status) : request.status}</Text>
                    </View>

                    <Spacer size="xsmall" />
                  </View>

                </React.Fragment>
              )

            })
          }
        </View>

        {depositRequests.length > 0 &&
          <View alignItems='center'>
            <Pagination
              pageNo={pageDepositRequest}
              totalPageNo={pagesDepositRequest}
              onPageClick={onDepositRequestPageClick}
            />
          </View>
        }

      </View>
    )
  }
}

export default BankingDepositPage

// @flow

type Balance = {
  currencySymbol: string,
  amount: string,
  frozen: string,
  fee: string,
  revision?: string,
  interest?: string,
  interestLast?: string,
  interestLastAt?: string,
}

type Currency = {
  type: string,
  symbol: string,
  names: {
    en: string,
    ko: string,
  },
  minBuyAmount: string,
  minSellFee: string,
  transeferable: boolean,
  transferFee: string,
  decimalPlaces: number
}

type Deposit = {
  symbol: string,
  address: string,
  amount: string,
  status: string,
  timestamp: number,
  type: string,
  transactionId: ?string,
  withdrawId: ?string,
}

type Withdrawal = {
  symbol: string,
  address: string,
  amount: string,
  status: string,
  timestamp: number,
  type: string,
  transactionId: ?string,
  withdrawId: ?string,
  fee: string
}

type BankAccount = {
  bankName: string,
  accountHolder: string,
  accountNumber: string,
  monthLimit: number,
  popupLimit: number,
  used: number,
  available: number,
  popup: number
}

type DepositRequest = {
  accountHolder: string,
  accountNumber: string,
  amount: string,
  bankName: string,
  createdAt: string,
  expiredAt: string,
  id: number,
  otpCode: string,
  status: string,
  symbol: string,
  updatedAt: string,
}

type Quota = {
  available: string,
  availableKRW: string,
  dayLimit: string,
  dayLimitKRW: string,
  perLimitKRW: string,
  used: string,
  usedKRW: string,
}

export type {
  Balance,
  Currency,
  Deposit,
  Withdrawal,
  BankAccount,
  DepositRequest,
  Quota
}
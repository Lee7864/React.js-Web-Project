// @flow

type Profile = {
  agreeEmail: boolean,
  agreeSms: boolean,
  email: string,
  level: string,
  mobileNum?: string,
  name?: string,
  nickname: string,
  intrcmUserHash: string,
  twoFAEnabled: boolean,
  userAddress?: Address,
  maxTradeFee?: string,
  maxTradeFeeValidUntil?: number,
  defaultMaxTradeFee?: string
}

type CurrentDevice = {
  browser: string,
  createdAt: string,
  ipAddr: string,
  loggedInAt: string,
  os: string,
  registered: boolean
}

type Device = {
  active: boolean,
  browser: string,
  createdAt: string,
  current: boolean,
  ipAddr: string,
  os: string,
  updatedAt: string,
  id: number
}

type LoginHistory = {
  browser: string,
  os: string,
  ipAddr: string,
  registered: boolean,
  createdAt: string,
  id: number
}

type Notification = {
  message: string,
  timestamp: string,
  offset: number,
  category: string,
}

type Address = {
  postalCode: string,
  roadAddress: string,
  roadDetailAddress: string,
}

export type {
  Profile,
  CurrentDevice,
  Device,
  LoginHistory,
  Notification,
  Address,
}

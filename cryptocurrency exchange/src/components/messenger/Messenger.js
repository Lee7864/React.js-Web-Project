// @flow

import * as React from 'react'
import { connect } from 'react-redux';
import Intercom from 'react-intercom'
import { matchPath } from 'react-router'
import type {Profile} from '../../types/Profile'

type Props = {
  profile: Profile,
  path: string
}

class Messenger extends React.Component<Props> {

  render() {
    if (matchPath(this.props.path, {
      path: '/exchange',
      exact: false
    })) {
      return null
    }

    const { profile } = this.props
    if (!profile) {
      return (
        <Intercom appID="glbhfxd4"/>
      )
    }

    return (
      <Intercom appID="glbhfxd4" email={profile.email} name={profile.nickname}
                user_hash={profile.intrcmUserHash}/>
    )
  }
}

function mapStateToProps(state) {
  const { login } = state
  const { profile } = login
  return {
    profile
  }
}

export default connect(mapStateToProps)(Messenger)
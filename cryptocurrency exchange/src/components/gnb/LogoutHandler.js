// @flow

import * as React from 'react'
import { connect } from 'react-redux';
import { userService } from '../../redux/services'


class LogoutHandler extends React.Component {

  componentDidMount() {
    this.props.dispatch(userService.logout());
  }

  render() {
    return null;
  }

}

export default connect()(LogoutHandler);


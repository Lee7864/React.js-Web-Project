import React from 'react'
import { withRouter } from 'react-router-dom'
import { MARKETING_GA_TRACKING_ID } from '../../config'

class GoogleAnalytics extends React.Component {

    state = {
      location : {pathname: ''}
    };

    static getDerivedStateFromProps(nextProps, prevState) {
      const gtag = window.gtag
      const location = nextProps.location
      const history = nextProps.history

      if (location.pathname === prevState.location.pathname) {
        // don't log identical link clicks (nav links likely)
        return nextProps
      }

      if (history.action === 'PUSH' &&
        typeof(gtag) === 'function') {
        gtag('js', new Date())
        gtag('config', MARKETING_GA_TRACKING_ID)
      }
      return nextProps
    }

    render () {
      return null
    }
}

export default withRouter(GoogleAnalytics)
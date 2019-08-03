// @flow
import * as React from 'react'
import SupportPage from '../pages/SupportPage'
import { API_URL } from '../../config'
import {connect} from 'react-redux'

type Props = {
  match: Object,
  history: Object,
  location: Object,
  language: string,
}

type State = {
  subPage: string,
  search: string,
  id: number | undefined,
  noticeList: Array,
  helpList: Array,
  noticePage: Object | null,
  helpPage: Object | null,
  privacyDate: string
}

const decodeURLParams = (search: string = '') => {
  const hashes = search.slice(search.indexOf("?") + 1).split("&");
  return hashes.reduce((params, hash) => {
    const split = hash.indexOf("=")

    if (split < 0) {
      return Object.assign(params, {
        [hash]: null
      })
    }

    const key = hash.slice(0, split)
    const val = hash.slice(split + 1)

    return Object.assign(params, { [key]: decodeURIComponent(val) })
  }, {})
}

class SupportContainer extends React.Component<Props, State> {

  state = {
    subPage: '',
    search: '',
    id: undefined,
    noticeList: [],
    helpList: [],
    noticePage: null,
    helpPage: null,
    privacyDate: ''
  }

  componentDidMount() {
    if (decodeURLParams(this.props.location.search).id !== undefined) {
      this.requestPage(this.props.match.params.sub, decodeURLParams(this.props.location.search).id.toString())
    } else {
      this.requestList(this.props.match.params.sub)
    }
  }

  static getDerivedStateFromProps(nextProps:Props, prevState:State) {

    if (nextProps.match.params.sub !== prevState.subPage) {
      if (nextProps.match.params.sub === 'privacy' && decodeURLParams(nextProps.location.search).date !== undefined) {
        return {
          subPage: nextProps.match.params.sub,
          privacyDate: decodeURLParams(nextProps.location.search).date
        }
      } else {
        return {
          subPage: nextProps.match.params.sub,
          privacyDate: ''
        }
      }

    } else if (nextProps.location.search !== prevState.search) {
      if (nextProps.match.params.sub === 'privacy') {
        if (decodeURLParams(nextProps.location.search).date !== undefined) {
          return {
            privacyDate: decodeURLParams(nextProps.location.search).date
          }
        } else {
          return {
            privacyDate: ''
          }
        }

      } else {
        const params = decodeURLParams(nextProps.location.search)
        if (params.id === undefined) {
          return {
            search: nextProps.location.search,
            id: params.id,
            noticePage: null,
            helpPage: null
          }
        } else {
          return {
            search: nextProps.location.search,
            id: params.id
          }
        }
      }
    }
    return null
  }

  componentDidUpdate(prevProps:Props, prevState:State) {
    if (prevProps.match.params.sub !== this.props.match.params.sub) {
      const sub = this.props.match.params.sub
      this.requestList(sub)
    } else if (prevState.id !== this.state.id) {
      const {id, subPage} = this.state
      if (id === undefined) {
        this.requestList(subPage)
      } else {
        this.requestPage(subPage, id)
      }
    }
  }

  requestList = (type: string) => {
    if (type === 'announce' && this.state.noticeList.length !== 0) return
    if (type === 'help' && this.state.helpList.length !== 0) return

    let boardType = type
    if (type === 'announce') boardType = 'notice'
    fetch(API_URL + '/board/title?type=' + boardType + '&sortingOrder=DESC', {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.getListSuccess(type, json)
              break;

            case 400:
            default:
              //const errorReason = json.error.reasons
              //alert(errorReason[0].message)
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getListSuccess = (type: string, data: Array) => {
    if (type === 'announce') {
      this.setState({
        noticeList: data
      })
    } else if (type === 'help') {
      this.setState({
        helpList: data
      })
    }
  }

  requestPage = (type: string, id: string) => {
    fetch(API_URL + '/board/page/' + id, {
      method: 'get',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })
      .then(response => {
        Promise.all([response.status, response.json()]).then(([status, json]) => {
          switch(status) {
            case 200:
              this.getPageSuccess(type, json)
              break;

            case 400:
            default:
              this.getPageFail(type)
              break;
          }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getPageFail = (type: string) => {
    this.props.history.push('/support/' + type)
    this.requestList(type)
  }

  getPageSuccess = (type: string, data: Object) => {
    if (type === 'announce') {
      this.setState({
        noticePage: data,
      })
    } else if (type === 'help') {
      this.setState({
        helpPage: data,
      })
    }
  }

  handleListClick = (type: string, id: string) => {
    this.props.history.push(`/support/${type}?id=${id}`)
  }

  handleBackPress = (type: string) => {
    this.props.history.push('/support/' + type)
  }

  handleSubMenuClick = (menu: string) => {
    if ( menu === this.state.subPage ) return
    this.setState({
      id: undefined,
      search: '',
      noticePage: null,
      helpPage: null
    })
    this.props.history.push('/support/' + menu)
  }

  render() {

    const {subPage, noticeList, helpList, noticePage, helpPage, privacyDate} = this.state

    return (
      <SupportPage sub={subPage}
                   noticeList={noticeList}
                   helpList={helpList}

                   noticePage={noticePage}
                   helpPage={helpPage}

                   onListClick={this.handleListClick}
                   onBackPress={this.handleBackPress}
                   onSubMenuClick={this.handleSubMenuClick}

                   history={this.props.history}
                   privacyDate={privacyDate}

                   language={this.props.language}/>
    )
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage.language
  }
}

export default connect(mapStateToProps)(SupportContainer)

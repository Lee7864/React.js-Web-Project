// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import { View } from '../controls'
import { store } from '../../redux'
import {popupService} from '../../redux/services'
import RequestDepositKRWPopup from '../popup/RequestDepositKRWPopup'
import RequestDepositPopup from '../popup/RequestDepositPopup'
import RequestWithdrawKRWPopup from '../popup/RequestWithdrawKRWPopup'
import RequestWithdrawPopup from '../popup/RequestWithdrawPopup'
import ResidenceAddressPage from '../pages/ResidenceAddressPage'
import styles from '../popup/PopupContainer.css'

type State = {

}

type Props = {
  path: string,
  isShowPopup: boolean,
  popupData: Object,
  onShowPopup: (type: string, message: string) => void,
  handlePopupUpdateClick: () => {},
  closePopupAndShowResult: () => {},
}

class PopupContainer extends React.Component<Props, State> {
  state = {

  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.path !== prevProps.path && this.props.isShowPopup) {
      this.onClose()
    }
  }

  onClose = () => {
    store.dispatch(popupService.remove())
  }

  render() {
    const { isShowPopup, popupData, onShowPopup, handlePopupUpdateClick, closePopupAndShowResult, } = this.props
    if ( !isShowPopup || popupData === null ) return null

    const { popupType } = popupData
    return (
      <View style={styles.root}>
        <View style={styles.body}>
          {
            popupType === 'requestdepositkrw' &&
            <RequestDepositKRWPopup data={popupData}
                                 onClose={this.onClose}
                                 onShowPopup={onShowPopup}/>
          }
          {
            popupType === 'requestwithdrawkrw' &&
            <RequestWithdrawKRWPopup data={popupData}
                                  onClose={this.onClose}
                                  onShowPopup={onShowPopup}/>
          }
          {
            popupType === 'requestdeposit' &&
            <RequestDepositPopup data={popupData}
                                 onClose={this.onClose}
                                 onShowPopup={onShowPopup}/>
          }
          {
            popupType === 'requestwithdraw' &&
            <RequestWithdrawPopup data={popupData}
                                  onClose={this.onClose}
                                  onShowPopup={onShowPopup}/>
          }
          {
            popupType === 'address' &&
            <ResidenceAddressPage data={popupData}
                               onShowPopup={onShowPopup}
                               onCancelClick={this.onClose}
                               closePopupAndShowResult={closePopupAndShowResult}
                             //  ref={this.popupUpdate}
            />
          }

        </View>
      </View>
    )
  }
}


function mapStateToProps(state) {
  return {
    isShowPopup: state.popup.isShowPopup,
    popupData: state.popup.popupData
  }
}

export default connect(mapStateToProps)(PopupContainer)
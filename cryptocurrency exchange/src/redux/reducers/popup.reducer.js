import { popupConstants } from '..';

const initialState = {
  isShowPopup: false
}

export function popup(state = initialState, action) {
  switch (action.type) {
    case popupConstants.CREATE_POPUP:
      return {
        isShowPopup: true,
        popupData: action.popupData
      }
    case popupConstants.REMOVE_POPUP:
      return {
        isShowPopup: false
      }
    default:
      return state
  }
}


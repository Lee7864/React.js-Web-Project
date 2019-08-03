import { popupConstants } from '..'

function create(data: Object) {
  return (dispatch) => {
    dispatch({
      type: popupConstants.CREATE_POPUP,
      popupData: data
    })
  }
}

function remove() {
  return (dispatch) => {
    dispatch({
      type: popupConstants.REMOVE_POPUP,
      popupData: null
    })
  }
}

export const popupService = {
  create,
  remove,
}
import { userConstants } from '..';

let profile = JSON.parse(localStorage.getItem('quanty.profile'));
const initialState = profile ? { loggedIn: true, profile } : {};

export function login(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_PROFILE:
      return {
        loggedIn: true,
        profile: action.profile
      };      
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}
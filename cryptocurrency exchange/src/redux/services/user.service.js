import { store, userConstants, history } from '..';
import { API_URL } from '../../config'

export const userService = {
    get_profile,
    logout,
};

var profileErrorCount = 0
function get_profile() {
    return dispatch => {
        fetch(API_URL + '/me', {
          method: 'get',
          credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                profileErrorCount = 0
                return response.json()
            } else {
                profileErrorCount++
                return Promise.reject('login required')
            }
            
        })
        .then(profile => {
            if (profile) localStorage.setItem('quanty.profile', JSON.stringify(profile));

            dispatch(profile_success(profile));
        })
        .then(() => {
            if (location.pathname == '/login') {
              /*
               * ex) /login#callback=/myaccount/auth
               */
              if (location.hash && location.hash.indexOf('#callback=') == 0) {
                history.push(location.hash.substring(10));
              } else {
                history.push('/');
              }
            }
        })
        .catch(error => {
            if (profileErrorCount >= 2) {
              localStorage.removeItem('quanty.profile')
              dispatch(profile_error())
            } else {
              dispatch(get_profile())
            }
        });
    }
}

function logout() {
    return dispatch => {
        fetch(API_URL + '/deauthenticate', {
          method: 'post',
          credentials: 'include'
        }).then(response => {
          dispatch(logout_success());
          localStorage.removeItem('quanty.profile');

          // refresh whole page
          location.assign('/');
        }).catch(error => {
          console.log(error);
          localStorage.removeItem('quanty.profile');
          
          // refresh whole page
          location.assign('/');
        });
    }
}

function profile_success(profile) { return { type: userConstants.LOGIN_PROFILE, profile } }
function profile_error() { return { type: userConstants.LOGIN_PROFILE } }
function logout_success() { return { type: userConstants.LOGOUT } }
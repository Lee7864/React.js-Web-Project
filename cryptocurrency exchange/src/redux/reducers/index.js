import { combineReducers } from 'redux';

import { login } from './login.reducer';
import { setLanguage } from './language.reducer'
import { popup } from './popup.reducer'

const rootReducer = combineReducers({
  login,
  setLanguage,
  popup,
});

export default rootReducer;
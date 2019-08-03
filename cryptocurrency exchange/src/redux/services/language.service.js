import LocalizedStrings from 'localized-strings'

import { languageConstants } from '..'
import $script from 'scriptjs'

const strings = new LocalizedStrings({
  en : {
    hello: 'hello'
  },
  ko : {
    hello: '안녕'
  }
})

function loadLanguageForReCaptcha(lang) {
  const url = 'https://www.google.com/recaptcha/api.js?render=explicit&hl='+lang+'&timestamp='+Date.now()
  $script(url)
}

function select_default_language() {
  return (dispatch) => {

    const defaultLanguage = localStorage.getItem('quanty_language') ? localStorage.getItem('quanty_language') : 'ko'

    if (defaultLanguage === 'ko') {
      dispatch({
        type: languageConstants.SET_LANG_KO
      })
      loadLanguageForReCaptcha('ko')
    } else {
      dispatch({
        type: languageConstants.SET_LANG_EN
      })
      loadLanguageForReCaptcha('en')
    }
  }
}

function select_language(lang) {
  return (dispatch) => {
    if (lang === 'ko') {
      dispatch({
        type: languageConstants.SET_LANG_KO
      })
      loadLanguageForReCaptcha('ko')
      localStorage.setItem('quanty_language', 'ko')
    } else {
      dispatch({
        type: languageConstants.SET_LANG_EN
      })
      loadLanguageForReCaptcha('en')
      localStorage.setItem('quanty_language', 'en')
    }
  }
}

export const languageService = {
  select_default_language,
  select_language
}
import LocalizedStrings from 'localized-strings'

import { languageConstants } from '..'

const strings = new LocalizedStrings({
  en : {
    hello: 'hello'
  },
  ko : {
    hello: '안녕'
  }
})

const initialState = {
  language: strings.getLanguage()
}

export function setLanguage(state = initialState, action) {
  switch (action.type) {
    case languageConstants.SET_LANG_EN:
      return {
        language: 'en'
      }
    case languageConstants.SET_LANG_KO:
      return {
        language: 'ko'
      }
    default:
      return state
  }
}


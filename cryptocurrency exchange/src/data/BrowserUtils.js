// @flow

import Fingerprint2 from 'fingerprintjs2'

export const getCachedFingerprint = () => {
  return localStorage.getItem('fingerprint');
}

export const generateFingerprint = (callback: (string) => void) => {
  setTimeout(() => {
    Fingerprint2.get({
      screen: { detectScreenOrientation: false },
    }, (components) => {
      const values = components.map(c => c.value)
      const murmur = Fingerprint2.x64hash128(values.join(''), 31)
      localStorage.setItem('fingerprint', murmur)
      callback(murmur)
    })
  }, 500)
}
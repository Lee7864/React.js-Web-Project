// @flow

import { STREAM_URL } from '../config'

const parseEvent = (event): Array<Object> => {
  if (event && event.data) {
    const lines: Array<string> = event.data.split('\n')

    const objects = []
    for (var i = 0; i < lines.length; i++) {
      objects.push(JSON.parse(lines[i]))
    }
    return objects
  }
  throw new Error('no data')
}

export type EventStreamConfig = {
  identifier: string,
  uri: string,
  withCredentials?: boolean,
  openHandler?: (string) => void,
  errorHandler?: (string, Error) => void,
  dataHandlers: {[string]: (string, Array<Object>) => void},
  dataErrorHandler?: (string, Error) => void,
}

class EventStream {
  identifier: string
  source: EventSource
  handlers: Object

  close() {
    // console.log('[', this.identifier, '] EventStream#close() called')
    Object.keys(this.handlers).forEach((eventName) => {
      this.source.removeEventListener(eventName, this.handlers[eventName])
    })
    this.source.close()
  }
}

function wrap(identifier: string, handler: (string, Array<Object>) => void, errorHandler?: (string, Error) => void): (Object) => void {
  return (evt) => {
    let data: Array<Object>
    try {
      data = parseEvent(evt)
    } catch(e) {
      if (errorHandler) {
        errorHandler(identifier, e)
      } else {
        // console.error(identifier, e)
      }
      return
    }

    handler(identifier, data)
  }
}

const connectEventStream = (config: EventStreamConfig): EventStream => {
  const {
    identifier,
    uri,
    withCredentials,
    openHandler,
    errorHandler,
    dataHandlers,
    dataErrorHandler,
  } = config

  const evtSrc = new EventSource(`${STREAM_URL}${uri}`, { withCredentials : withCredentials })

  if (openHandler) {
    evtSrc.onopen = () => {
      openHandler(identifier)
    }
  }

  if (errorHandler) {
    evtSrc.onerror = (err: Error) => {
      errorHandler(identifier, err)
    }
  }

  const handlers = {}
  Object.keys(dataHandlers).forEach(
    (eventName) => {
      const handler = wrap(identifier, dataHandlers[eventName], dataErrorHandler)
      evtSrc.addEventListener(eventName, handler)
      handlers[eventName] = handler
    }
  )

  const stream = new EventStream()
  stream.identifier = identifier
  stream.source = evtSrc
  stream.handlers = handlers
  return stream
}

export { EventStream }
export default connectEventStream


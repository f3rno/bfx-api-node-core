'use strict'

const debug = require('debug')('bfx:api:manager:events:ws:close')

/**
 * Notifies ws2:close and closes the websocket if it hasn't already been closed
 * elsewhere (managedClose flag)
 *
 * @param {Manager} m
 * @param {number} wsID
 */
module.exports = (m, wsID) => {
  const ws = m.getWS(wsID)

  if (!ws) {
    debug('error: tried to close unknown socket %s', wsID)
    return
  }

  m.notifyPlugins('ws2', 'ws', 'close', { id: wsID })
  m.emit('ws2:close', { id: wsID })

  // may have already been closed
  if (ws.readyState < 2 && !ws.managedClose) {
    debug('removing connection (%d)', wsID)
    m.closeWS(wsID)
  }

  debug('ws client connection closed (%d)', wsID)
}

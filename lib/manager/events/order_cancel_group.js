'use strict'

const sendWS = require('../../ws2/send')

/**
 * Cancels the requested order ID
 *
 * @param {Manager} m
 * @param {number} wsID - socket ID
 * @param {number} gid - group GID to cancel
 */
module.exports = (m, wsID, gid) => {
  const ws = m.getWS(wsID)

  sendWS(ws, [0, 'oc', null, { gid }])
}

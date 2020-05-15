'use strict'

const debug = require('debug')('bfx:api:ws2:orders:cancel-group')

/**
 * Cancels an order from either an order object, array, or raw ID.
 *
 * @param {Object} state
 * @param {string|number} gid - group ID
 */
const cancelGroup = (state = {}, gid) => {
  const { emit } = state

  debug('canceling order group: %s', gid)
  emit('exec:order:cancel:group', gid)
}

module.exports = cancelGroup

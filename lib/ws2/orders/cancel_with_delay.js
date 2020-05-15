'use strict'

const Promise = require('bluebird')
const cancelOrder = require('./cancel')

/**
 * Cancels an order from either an order object, array, or raw ID, after the
 * specified delay.
 *
 * @param {Object} state
 * @param {number} delay - in ms
 * @param {Object|Array|number} order
 * @return {Promise} p - resolves/rejects upon confirmation
 */
module.exports = async (state = {}, delay, o) => {
  await Promise.delay(delay)
  return cancelOrder(state, o)
}

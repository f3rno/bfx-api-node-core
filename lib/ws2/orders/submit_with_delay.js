'use strict'

const Promise = require('bluebird')
const submitOrder = require('./submit')

/**
 * Submits an order with either an order model or raw order object, after the
 * specified delay.
 *
 * @param {Object} state
 * @param {number} delay - in ms
 * @param {Object|Array} order
 * @return {Promise} p - resolves/rejects upon confirmation
 */
module.exports = async (state = {}, delay, o) => {
  await Promise.delay(delay)
  return submitOrder(state, o)
}

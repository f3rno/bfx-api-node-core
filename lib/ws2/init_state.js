'use strict'

const { DEBUG_TRACE } = process.env
const _mapValues = require('lodash/mapValues')
const { nonce } = require('bfx-api-node-util')
const debug = require('debug')('bfx:api:ws2:init_state')

const initPluginState = require('../plugins/init_state')
const { WS_URL } = require('../config')
const open = require('./open')

/**
 * Creates & opens a WSv2 API connection, and returns the resulting state object
 *
 * @param {Object} opts
 * @param {string?} opts.url - defaults to production Bitfinex WSv2 API url
 * @param {Object?} opts.agent - connection agent
 * @param {boolean?} opts.transform - if true, raw API data arrays will be automatically converted to bfx-api-node-models instances
 * @param {string?} opts.apiKey - for later authentication
 * @param {string?} opts.apiSecret - for later authentication
 * @param {Object?} opts.plugins - optional set of plugins to use with the connection
 * @return {Object} state
 */
const state = (opts = {}) => {
  const {
    agent,
    apiKey,
    apiSecret,
    plugins = {},
    transform,
    url = WS_URL
  } = opts

  const { ev, ws } = open(url, agent)
  const emit = (type, ...args) => {
    if (DEBUG_TRACE) {
      const { stack } = new Error()
      debug('emit %s (%j): %s', type, ...args, stack)
    }

    // NOTE: This used to be scheduled in a 0 timeout. If strange behavior
    // arises, consider reverting, but be aware it will break automated tests
    // that rely on the event being handled when emit() is called (critical
    // for scheduling order submits/cancellations, and later cancelling the
    // relevant timeouts)
    ev.emit(type, ...args)
  }

  return {
    channels: {},
    pendingSubscriptions: [],
    pendingUnsubscriptions: [],
    plugins: _mapValues(plugins, initPluginState),
    id: nonce(),
    isOpen: false,
    sendBuffer: [],

    apiKey,
    apiSecret,
    transform,
    agent,
    emit,
    url,
    ev,
    ws
  }
}

module.exports = { state } // returns object so it can be stubbed

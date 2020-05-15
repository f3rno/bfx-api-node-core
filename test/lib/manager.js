/* eslint-env mocha */
'use strict'

const { assert } = require('chai')
const sinon = require('sinon')
const { EventEmitter } = require('events')
const Manager = require('../../lib/manager')
const auth = require('../../lib/ws2/auth')
const subscribe = require('../../lib/ws2/subscribe')
const initWS = require('../../lib/ws2/init_state')

describe('Manager', () => {
  describe('authentication', () => {
    const credentials = { apiKey: 'key', apiSecret: 'secret' }
    const authParams = { calc: 0, dms: 4 }

    it('authenticates with credentials passed to constructor', async () => {
      const m = new Manager(credentials)
      const s = m.openWS()

      const authStub = sinon.stub(auth, 'ws').resolves({
        ...s,
        ...credentials
      })

      await m.auth(authParams)

      assert.deepStrictEqual(authStub.getCall(0).args[0], {
        ...s,
        ...credentials
      })

      assert.deepStrictEqual(authStub.getCall(0).args[1], authParams)
      assert.strictEqual(s.apiKey, credentials.apiKey)
      assert.strictEqual(s.apiSecret, credentials.apiSecret)
      authStub.restore()
    })

    it('allows override of credentials when doing auth', async () => {
      const m = new Manager(credentials)
      const s = m.openWS()

      const credentialOverrides = { apiKey: 'some-key', apiSecret: '42' }
      const authStub = sinon.stub(auth, 'ws').resolves({
        ...s,
        ...credentialOverrides
      })

      await m.auth(credentialOverrides)

      assert.deepStrictEqual(authStub.getCall(0).args[0], {
        ...s,
        ...credentialOverrides
      })

      const newSocketRef = m.getWS(s.id)

      assert.deepStrictEqual(authStub.getCall(0).args[1], { calc: 0, dms: 0 })
      assert.strictEqual(newSocketRef.apiKey, credentialOverrides.apiKey)
      assert.strictEqual(newSocketRef.apiSecret, credentialOverrides.apiSecret)
      authStub.restore()
    })

    it('authenticates all existing sockets', async () => {
      const m = new Manager(credentials)
      const sA = m.openWS()
      const sB = m.openWS()
      const sC = m.openWS()

      const authStub = sinon.stub(auth, 'ws')

      authStub.returns({ ...sA, ...credentials })
      await m.auth()

      authStub.returns({ ...sB, ...credentials })
      await m.auth()

      authStub.returns({ ...sC, ...credentials })
      await m.auth()

      assert.deepStrictEqual(authStub.getCall(0).args[1], { calc: 0, dms: 0 })
      assert.deepStrictEqual(authStub.getCall(0).args[0], {
        ...sA, ...credentials
      })

      assert.deepStrictEqual(authStub.getCall(1).args[1], { calc: 0, dms: 0 })
      assert.deepStrictEqual(authStub.getCall(1).args[0], {
        ...sB, ...credentials
      })

      assert.deepStrictEqual(authStub.getCall(2).args[1], { calc: 0, dms: 0 })
      assert.deepStrictEqual(authStub.getCall(2).args[0], {
        ...sC, ...credentials
      })

      authStub.restore()
    })
  })

  describe('WSv2 socket pool', () => {
    const getSocket = (id = 42) => ({
      id,
      sendBuffer: [],
      pendingSubscriptions: [],
      ev: new EventEmitter(),
      ws: { send: () => {} }
    })

    it('respects channel limit specified in constructor, creating new sockets when needed', () => {
      const m = new Manager({ channelsPerSocket: 1 })
      assert.strictEqual(m.getChannelsPerSocket(), 1)

      const initStateStub = sinon.stub(initWS, 'state')

      initStateStub.returns(getSocket())
      m.withFreeDataSocket(s => subscribe(s, 'ticker', { symbol: 'tLEOUSD' }))
      m.getWSByIndex(0).ev.emit('self:open')

      initStateStub.returns(getSocket())
      m.withFreeDataSocket(s => subscribe(s, 'ticker', { symbol: 'tBTCUSD' }))
      m.getWSByIndex(1).ev.emit('self:open')

      assert.strictEqual(m.getWSPoolSize(), 2)

      const sA = m.getWSByIndex(0)
      const sB = m.getWSByIndex(1)

      assert.strictEqual(sA.id, 42)
      assert.deepStrictEqual(sA.pendingSubscriptions[0], ['ticker', { symbol: 'tLEOUSD' }])
      assert.strictEqual(sB.id, 42)
      assert.deepStrictEqual(sB.pendingSubscriptions[0], ['ticker', { symbol: 'tBTCUSD' }])

      initStateStub.restore()
    })

    it('supports querying sockets from the pool by a variety of methods', () => {

    })

    it('allows closing all sockets at once', () => {

    })

    it('allows reconnecting all sockets at once', () => {

    })

    it('emits all events received from individual sockets', () => {

    })

    it('allows binding of event handlers mapped to specific sockets in the pool', () => {

    })
  })

  describe('plugins', () => {
    it('uses plugins as specified in constructor', () => {

    })

    it('can notify plugins of events', () => {

    })
  })
})


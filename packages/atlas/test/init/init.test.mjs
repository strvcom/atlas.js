import path from 'path'
import { FrameworkError } from '@atlas.js/errors'
import { Atlas } from '../..'
import * as testservices from './demoapp/services'
import * as testactions from './demoapp/actions'
import * as testhooks from './demoapp/hooks'
import * as testaliases from './demoapp/aliases'

describe('Atlas::init()', () => {
  beforeEach(function() {
    this.sandbox.stub(Atlas.prototype, 'action').returnsThis()
    this.sandbox.stub(Atlas.prototype, 'hook').returnsThis()
    this.sandbox.stub(Atlas.prototype, 'service').returnsThis()
  })


  it('exists', () => {
    expect(Atlas).itself.to.respondTo('init')
  })

  it('throws when no root is provided', () => {
    expect(() => Atlas.init({ env: 'test' }))
      .to.throw(FrameworkError, /root must be explicitly specified/u)
  })

  it('does not throw TypeError when options is not provided', () => {
    expect(() => Atlas.init()).to.not.throw(TypeError)
  })

  it('loads all actions, hooks and services from the specified locations', () => {
    const proto = Atlas.prototype
    const root = path.resolve(__dirname, 'demoapp')
    const atlas = Atlas.init({
      root,
      env: 'test',
      config: 'config',
      hooks: 'hooks',
      actions: 'actions',
      services: 'services',
      aliases: 'aliases',
    })

    // Test services
    for (const [name, Component] of Object.entries(testservices)) {
      const aliases = testaliases.services[name]
      expect(proto.service).to.have.been.calledWith(name, Component, { aliases })
    }
    // Test actions
    for (const [name, Component] of Object.entries(testactions)) {
      const aliases = testaliases.actions[name]
      expect(proto.action).to.have.been.calledWith(name, Component, { aliases })
    }
    // Test hooks
    for (const [name, Component] of Object.entries(testhooks)) {
      const aliases = testaliases.hooks[name]
      expect(proto.hook).to.have.been.calledWith(name, Component, { aliases })
    }

    // Stuff directly on atlas
    expect(atlas.config).to.have.all.keys(['atlas', 'services', 'hooks', 'actions'])
    expect(atlas.config.atlas).to.include.keys(['test', 'override'])
    expect(atlas.config.services).to.eql({ dummy: {
      test: true,
      override: true,
    } })
    expect(atlas.config.hooks).to.eql({ dummy: {
      test: true,
      override: true,
    } })
    expect(atlas.config.actions).to.eql({ dummy: {
      test: true,
      override: true,
    } })
  })

  it('provides defaults for paths to services, hooks, actions, aliases and config dirs', () => {
    const root = path.resolve(__dirname, 'demoapp')
    const atlas = Atlas.init({
      root,
      env: 'test',
    })

    // Should not throw
    return atlas.prepare()
  })


  describe('Exception handling', () => {
    const root = path.resolve(__dirname, 'demoapp')
    const types = [
      'config',
      'services',
      'actions',
      'hooks',
      'aliases',
    ]

    for (const type of types) {
      it(`does not throw when ${type} module does not exist`, () => {
        Atlas.init({
          root,
          env: 'test',
          config: 'lolconf',
          services: 'lolserv',
          actions: 'lolactions',
          hooks: 'lolhooks',
          aliases: 'lolaliases',
        })
      })

      it(`throws when ${type} module contains errors`, () => {
        expect(() => {
          Atlas.init({
            root,
            env: 'test',
            [type]: 'will-throw',
          })
        }).to.throw()
      })
    }
  })
})

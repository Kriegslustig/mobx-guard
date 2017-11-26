// @flow

const { restore } = require('../')
const mobx = require('mobx')

describe('BaseAtom.reportObserved', () => {
  it('should throw if a derivation is untracked', () => {
    const observable = mobx.observable({ x: true })
    expect(() => { observable.x }).toThrow()
  })
})

describe('mobx.untracked', () => {
  it('should allow running untracked derivations', () => {
    const observable = mobx.observable({ x: true })
    const fn = () => mobx.untracked(() => { observable.x })
    expect(fn).not.toThrow()
  })

  it('should propagate the return value', () => {
    const returnValue = true
    const observable = mobx.observable({ x: returnValue })

    const output = mobx.untracked(() => observable.x)

    expect(output).toBe(returnValue)
  })
})

describe('restore', () => {
  it('should restore the derivation tracking', () => {
    restore()
    const observable = mobx.observable({ x: true })
    expect(() => { observable.x }).not.toThrow()
  })
})

// @flow

const mobx = require('mobx')
const { setup, restore, runGuarded, guard } = require('../')

describe('BaseAtom.reportObserved', () => {
  it('should throw if a derivation is untracked', () => {
    setup()
    const observable = mobx.observable({ x: true })

    expect(() => { observable.x }).toThrow()

    restore()
  })

  it('should allow untracked access to mobx-react props', () => {
    const atom = new mobx.Atom('reactive props', () => {}, () => {})
    const fn = guard(() => { atom.reportObserved })
    expect(fn).not.toThrow()
  })

  it('should allow untracked access to mobx-react state', () => {
    const atom = new mobx.Atom('reactive state', () => {}, () => {})
    const fn = guard(() => { atom.reportObserved })
    expect(fn).not.toThrow()
  })

  it('should allow untracked access withing actions', () => {
    const x = mobx.observable({ y: true })
    const action = guard(() => mobx.runInAction(() => x.y))
    expect(action).not.toThrow()
  })
})

describe('mobx.untracked', () => {
  setup()

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

  restore()
})

describe('restore', () => {
  it('should restore the derivation tracking', () => {
    restore()
    const observable = mobx.observable({ x: true })
    expect(() => { observable.x }).not.toThrow()
  })
})

describe('runGuarded', () => {
  restore()
  const x = mobx.observable({ y: true })

  it('should disallow untracked derivations', () => {
    const fn = () => runGuarded(() => { x.y })
    expect(fn).toThrow()
  })

  it('should propagate the return value', () => {
    const expected = Symbol('Test')
    const output = runGuarded(() => expected)
    expect(output).toBe(expected)
  })
})

describe('guard', () => {
  it('should call the given function in a guard', () => {
    const x = mobx.observable({ y: true })
    const fn = guard(() => { x.y })
    expect(fn).toThrow()
  })

  it('should pass the given arguments to the function', () => {
    const fn = jest.fn()
    const args = [1, 2, 3]

    guard(fn)(...args)

    expect(fn).toHaveBeenCalledWith(...args)
  })

  it('should propagate the return value', () => {
    const expected = Symbol('Test')
    const output = guard(() => expected)()
    expect(output).toBe(expected)
  })
})

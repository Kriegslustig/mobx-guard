// @flow

const mobx = require('mobx')

let isExplicitUntract = false

const untracked = mobx.untracked
const reportObserved = mobx.BaseAtom.prototype.reportObserved

const guardedReportObserved = function () {
  if (
    this.name !== 'reactive props' &&
    this.name !== 'reactive state' &&
    mobx.extras.getGlobalState().inBatch === 0 &&
    !isExplicitUntract &&
    !mobx.extras.isComputingDerivation()
  ) {
    //console.log(this)
    throw new Error('Untracked access to atom')
  }

  reportObserved.call(this)
}

const guardedUntracked = <T>(fn: () => T): T => {
  isExplicitUntract = true
  const returnValue = untracked(fn)
  isExplicitUntract = false
  return returnValue
}

const setup = module.exports.setup = (): void => {
  mobx.BaseAtom.prototype.reportObserved = guardedReportObserved

  Reflect.defineProperty(mobx, 'untracked', {
    value: guardedUntracked,
    configurable: true,
  })

  Reflect.defineProperty(mobx.default, 'untracked', {
    value: guardedUntracked,
    configurable: true,
  })
}

const restore = module.exports.restore = (): void => {
  mobx.untracked = untracked
  mobx.BaseAtom.prototype.reportObserved = reportObserved
}

const runGuarded = module.exports.runGuarded = <T>(fn: () => T): T => {
  setup()
  const returnValue = fn()
  restore()
  return returnValue
}

type Guard =
  <T, A>(fn: (A) => T) => (a: A) => T

const guard = <T, A>(
    fn: (...args: Array<A>) => T
  ): (...args: Array<A>) => T =>
    (...args: Array<A>): T =>
      runGuarded(() => fn(...args))

module.exports.guard = guard
module.exports.untracked = guardedUntracked

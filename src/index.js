// @flow

const mobx = require('mobx')

let isExplicitUntract = false

const reportObserved = mobx.BaseAtom.prototype.reportObserved

mobx.BaseAtom.prototype.reportObserved = function () {
  if (
    !isExplicitUntract &&
    !mobx.extras.isComputingDerivation()
  ) {
    throw new Error('Untracked access to atom')
  }

  reportObserved.call(this)
}

const untracked = mobx.untracked
const untrackedOverride = <T>(fn: () => T): T => {
  isExplicitUntract = true
  const returnValue = untracked(fn)
  isExplicitUntract = false
  return returnValue
}

mobx.untracked = untrackedOverride

module.exports.restore = (): void => {
  mobx.untracked = untracked
  mobx.BaseAtom.prototype.reportObserved = reportObserved
}

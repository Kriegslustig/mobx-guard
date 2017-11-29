# MobX Guard

[![Build Status](https://travis-ci.org/Kriegslustig/mobx-guard.svg?branch=master)](https://travis-ci.org/Kriegslustig/mobx-guard)

Disallow untracked observations in MobX.

```javascript
import * as mobx from 'mobx'
import { guard, untracked } from 'mobx-guard'

const something = mobx.observable({ x: true })

expect(() => {
  something.x
}).toThrow()

expect(() => {
  autorun(() => {
    something.x
  })
}).not.toThrow()
```

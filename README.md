# React Reactive Programming Toolkit

Inspired by [bacon.react.html](https://github.com/polytypic/bacon.react.html),
[react-combinators](https://github.com/polytypic/bacon.react.html) and
[Cycle.js](http://cycle.js.org/) but has no external dependencies (except React) and works with
any reactive library that is compatible with 
[ECMAScript Observable spec](https://github.com/zenparsing/es-observable)

[![Build Status](https://img.shields.io/travis/milankinen/react-reactive-toolkit.svg?style=flat-square)](https://travis-ci.org/milankinen/react-reactive-toolkit)
[![NPM Version](https://img.shields.io/npm/v/react.reactive.svg?style=flat-square)](https://www.npmjs.com/package/react.reactive)
[![Join Gitter chat](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/milankinen/react-reactive-toolkit)

## API

To use `react.reactive`, you must install it first with npm
```bash
npm i --save react.reactive
```

`react.reactive` works only with CommonJS compatible package managers
(such as Webpack and Browserify).

### Embedding observables to virtual dom

Observables can be embedded into VDOM by using `react.reactive` components.
These VDOM components act like sinks/observers, causing the value of the embedded 
observable to be rendered every time it changes.

Components are lazy - they won't subscribe to the embedded observables until
component gets mounted.

**ATTENTION:** Components subscribe **only** to observables that are in their 
properties or direct children. 

```javascript 
import R from "react.reactive"
import {Observable} from "rx"

const Example = () => {
  const time = Observable.interval(1000)
    .startWith(null)
    .map(() => new Date().toTimeString())
    
  return (
    <div>
      <h1>Example</h1>
      <R.div>Time is {time}</R.div>
    </div>
  )
}
```

`react.reactive` contains components for all normal HTML tags. If you want to
make your own custom component reactive, you can use factory function `R`. Components
created with this method behave exactly like built-in `react.reactive` components

```javascript
import R from "react.reactive"
import DatePicker from "react-date-picker"
import moment from "moment"
import {Observable} from "rx"


// make DatePicker reactive
const RDatePicker = R(DatePicker)

const Example = ({date}) => {
  const date = Observable.interval(1000)
    .startWith(null)
    .scan(m => moment(m).add(1, "day"), moment())
    .map(m => m.toDate())
    
  return (
    <div>
      <h1>Hello react.reactive!</h1>
      {/* now you can embed observables into it like R.div in prev example */}
      <RDatePicker date={date} />
    </div>
  )
}
```

### Creating observables from DOM events

#### Emitting events

Reactive components can declare the events they send by using `emits` property.
The property takes one JSON object that has event types as its keys and emitted
event names as its values, e.g.

```javascript
<R.button emits={{click: "my-btn-clicked"}}>My Button</R.button>
<R.input emits={{change: "event-name-can-be-anything"}} />
```

All React events (including `onChange`) are supported but they must be listened
by using their lowercase name without *on* prefix: e.g. `onChange => change` and
`onKeyDown => keydown`

Also custom event types work but they must be referenced by their original name,
e.g.
```javascript
const RDatePicker = R(DatePicker)
<RDatePicker emits={{onDateChange: "date-changed"}} />
```

#### Observing events

All events that are emitted from reactive components can be observed by any
parent (or ancestor) component. When you make your component reactive with the
`R` function, it adds an additional `events` property that is an event emitter
/ event target -- this means that you can use your observable library's utility
functions to subscribe to the given event target `fromEventTarget`, `fromEvent`, 
etc.)

```javascript
import {Observable} from "rx"
import R from "react.reactive"


const Counter = R(({events}) => {
  const inc$ = Observable.fromEvent(events, "inc-click").map(() => +1)
  const dec$ = Observable.fromEvent(events, "dec-click").map(() => -1)
  const counter$ =
    inc$.merge(dec$)
      .startWith(0)
      .scan((val, d) => val + d, 0)
      .shareReplay()

  return (
    <div>
      <R.h1>Counter {counter$}</R.h1>
      <R.button emits={{click: "inc-click"}}>++</R.button>
      <R.button emits={{click: "dec-click"}}>--</R.button>
    </div>
  )
})

```


## Questions?

All questions are welcome. Please raise an **[issue](https://github.com/milankinen/react-reactive-toolkit)** 
or join the chat at **[Gitter](https://gitter.im/milankinen/react-reactive-toolkit)**!


## License

MIT

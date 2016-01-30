# React Reactive Programming Toolkit

Inspired by [bacon.react.html](https://github.com/polytypic/bacon.react.html),
[react-combinators](https://github.com/polytypic/bacon.react.html) and
[Cycle.js](http://cycle.js.org/) but has no external dependencies (except React) and works with
any reactive library that is compatible with 
[ECMAScript Observable spec](https://github.com/zenparsing/es-observable)

[![Build Status](https://img.shields.io/travis/milankinen/react-reactive-toolkit.svg?style=flat-square)](https://travis-ci.org/milankinen/react-reactive-toolkit)
[![NPM Version](https://img.shields.io/npm/v/react.reactive.svg?style=flat-square)](https://www.npmjs.com/package/react.reactive)

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


## License

MIT

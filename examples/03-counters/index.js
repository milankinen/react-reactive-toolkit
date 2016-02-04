import React from "react"
import {Observable} from "rx"
import R, {withEvents} from "react.reactive"
import {render} from "react-dom"


const $app =
  document.getElementById("app")

// Reactive component provides "events" property that makes possible to
// listen and subscribe to sub-tree DOM events
const App = R(({events}) => {
  const inc$ = Observable.fromEvent(events, "inc-click").map(() => +1)
  const dec$ = Observable.fromEvent(events, "dec-click").map(() => -1)

  // also React onChange is supported
  const text$ = Observable.fromEvent(events, "text-change")
    .map(e => e.target.value)
    .startWith("tsers")
    .shareReplay()

  const counter$ =
    inc$.merge(dec$)
      .startWith(0)
      .scan((val, d) => val + d, 0)
      .shareReplay()

  const style$ =
    Observable.combineLatest([text$, counter$])
      .map(([text, counter]) => text.length === counter ? "red" : "black")
      .map(color => ({color}))

  // You can emit events from reactive components by giving an object
  // containing the event types as object keys and emitted event names
  // as object values - when event occurs, it'll be emitted to parent
  // (or grand parent) component's "events" emitter
  return (
    <div>
      <R.h1 style={style$}>Counter {counter$}</R.h1>
      <R.button emits={{click: "inc-click"}}>++</R.button>
      <R.button emits={{click: "dec-click"}}>--</R.button>
      <R.input emits={{change: "text-change"}} value={text$} />
    </div>
  )
})

render(<App />, $app)

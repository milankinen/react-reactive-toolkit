import React from "react"
import {Observable} from "rx"
import R, {withEvents} from "react.reactive"
import {render} from "react-dom"


const $app =
  document.getElementById("app")

// withEvents provides "events" property that makes possible to
// listen and subscribe to sub-tree DOM events
const App = withEvents(({events}) => {
  const inc$ = Observable.fromEvent(events(".inc"), "click").map(() => +1)
  const dec$ = Observable.fromEvent(events(".dec"), "click").map(() => -1)

  // also React onChange is supported
  const text$ = Observable.fromEvent(events("input"), "change")
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

  return (
    <div>
      <R.h1 style={style$}>Counter {counter$}</R.h1>
      <button className="inc">++</button>
      <button className="dec">--</button>
      <R.input value={text$} />
    </div>
  )
})

render(<App />, $app)

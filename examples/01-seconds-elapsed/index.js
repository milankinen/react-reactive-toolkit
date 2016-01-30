import React from "react"
import R from "react.reactive"
import {render} from "react-dom"
import {Observable} from "rx"


const $app =
  document.getElementById("app")

const App = ({time}) =>
  <div>
    <h1>Hello react.reactive!</h1>
    <R.p>
      Time is now {time}
    </R.p>
  </div>


const time =
  Observable.interval(1000)
    .startWith(null)
    .map(() => new Date().toTimeString())

render(<App time={time} />, $app)

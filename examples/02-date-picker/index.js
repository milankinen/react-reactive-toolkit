import React from "react"
import R from "react.reactive"
import {render} from "react-dom"
import {Observable} from "rx"
import moment from "moment"
import DatePicker from "react-date-picker"


// make DatePicker reactive
const RDatePicker = R(DatePicker)

const $app =
  document.getElementById("app")

const App = ({date}) =>
  <div>
    <h1>Hello react.reactive!</h1>
    {/* now you can embed observables into it like R.div in prev example */}
    <RDatePicker date={date} />
  </div>


const date =
  Observable.interval(1000)
    .startWith(null)
    .scan(m => moment(m).add(1, "day"), moment())
    .map(m => m.toDate())

render(<App date={date} />, $app)

import React from "react"
import EventSource from "./EventSource"
import {typeByName} from "./eventTypeMapping"

export default Class => React.createClass({
  displayName: `R.WithEvents(${Class.displayName || Class.name || Class.toString()})`,

  getInitialState() {
    return { src: new EventSource() }
  },

  componentDidMount() {
    this.state.src.start(this)
  },

  componentWillUnmount() {
    this.state.src.end()
  },

  render() {
    const {props, state: {src}} = this
    const events = (selector, type) =>
      new DelegateEventEmitter(src, selector, type)

    return React.createElement(
      Class,
      {...props, events},
      props.children
    )
  }
})

function DelegateEventEmitter(source, selector) {
  this.source = source
  this.selector = selector
}

DelegateEventEmitter.prototype.on = function(name, fn) {
  this.source.subscribe(typeByName(name), {fn, selector: this.selector})
}

DelegateEventEmitter.prototype.off = function(selector, fn) {
  this.source.dispose(typeByName(name), {fn, selector: this.selector})
}

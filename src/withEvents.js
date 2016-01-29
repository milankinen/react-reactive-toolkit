import React from "react"
import EventSource from "./EventSource"

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
    return React.createElement(
      Class,
      {...props, events: (selector, type) => new DelegateEventEmitter(src, selector, type)},
      props.children
    )
  }
})

function DelegateEventEmitter(source, selector) {
  this.source = source
  this.selector = selector
}

DelegateEventEmitter.prototype.on = function(type, fn) {
  this.source.subscribe(type, {fn, selector: this.selector})
}

DelegateEventEmitter.prototype.off = function(selector, fn) {
  this.source.dispose(type, {fn, selector: this.selector})
}

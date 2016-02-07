import React from "react"
import Map from "./util/map"
import EventEmitter from "./util/EventEmitter"
import toBindings from "./toBindings"
import {isFunction, keys} from "./util/base"
import {typeByName} from "./eventTypeMapping"

export default Class => React.createClass({

  ...createContext(Class),

  displayName: `R.${Class.displayName || Class.name || Class.toString()}`,


  getInitialState() {
    return {
      bindingMap: new Map(),
      waiting: new Map(),
      updated: 0,
      eventSink: new EventSink(this.context && this.context._eventSink)
    }
  },

  componentWillReceiveProps(nextProps, nextContext) {
    this._subscribe(nextProps)
    const nextSink = nextContext && nextContext._eventSink
    if (nextSink !== this.state.eventSink.parent) {
      this.setState({eventSink: new EventSink(nextSink)})
    }
  },

  componentWillMount() {
    this._subscribe(this.props)
  },

  shouldComponentUpdate(_, nextState) {
    return nextState.updated !== this.state.updated
  },

  componentWillUnmount() {
    const {bindingMap} = this.state
    const values = bindingMap.values()
    for (var b of values) {
      b.dispose()
    }

    this.state.eventSink.emitter = null

    this.setState({
      bindingMap: new Map(),
      waiting: new Map(),
      props: null,
      pendingProps: null
    })
  },

  render() {
    const {props} = this.state
    return props ? this.renderInner() : null
  },

  renderInner() {
    const {props, eventSink} = this.state
    const newProps = bindEventSink(Class, eventSink, props)
    if (newProps.onMount || newProps.onUnmount) {
      newProps.ref = node => {
        if (node === null && newProps.onUnmount) {
          newProps.onUnmount(node)
        } else if (node !== null && newProps.onMount) {
          newProps.onMount(node)
        }
      }
    }
    return React.createElement(Class, newProps, props.children)
  },

  _onObsNext(obs) {
    const {waiting, props, pendingProps} = this.state
    waiting.delete(obs)
    if (waiting.size === 0) {
      this._requestUpdate(props || pendingProps)
    }
  },

  _requestUpdate(props) {
    this.setState({
      props,
      updated: this.state.updated + 1,
      pendingProps: null
    })
  },

  _subscribe(props) {
    const {bindingMap, waiting} = this.state
    const {props: copiedProps, bindings} = toBindings(props)

    const bindingsToAdd = []
    const existingBindings = []
    bindings.forEach(b => {
      const existing = bindingMap.get(b.obs)
      bindingMap.delete(b.obs)
      if (!existing) {
        bindingsToAdd.push(b)
        waiting.set(b.obs, true)
        b.onNext = this._onObsNext
      } else {
        existing.update(b.ctx, b.key)
        existingBindings.push(existing)
      }
    })

    // remaining bindings should be disposed
    const bVals = bindingMap.values()
    for (var b of bVals) {
      waiting.delete(b.obs)
      b.dispose()
    }

    const newBindingMap = new Map()
    // add new and existing bindings to map
    existingBindings.forEach(b => {
      newBindingMap.set(b.obs, b)
    })
    bindingsToAdd.forEach(b => {
      newBindingMap.set(b.obs, b)
      b.subscribe()
    })

    this.setState({
      pendingProps: copiedProps,
      bindingMap: newBindingMap
    })
    if (waiting.size === 0) {
      this._requestUpdate(copiedProps)
    }
  }
})

function EventSink(parent) {
  this.parent = parent
}

EventSink.prototype.next = function(name, event) {
  this.emitter && this.emitter.emit(name, [ event ])
  this.parent && this.parent.next(name, event)
}

EventSink.prototype.newEmitter = function() {
  this.emitter = new EventEmitter()
  return this.emitter
}

function bindEventSink(Class, sink, props) {
  const clone = {...props}
  keys(props.emits || {}).forEach(key => {
    const type = typeByName(key) || key
    const name = props.emits[key]
    clone[type] = e => sink.next(name, e)
  })
  if (isFunction(Class)) {
    clone.events = sink.newEmitter()
  }
  return clone
}


function createContext(Class) {
  let ctx = {
    contextTypes: {
      _eventSink: React.PropTypes.object
    }
  }
  if (isFunction(Class)) {
    ctx = {
      ...ctx,
      childContextTypes: {
        _eventSink: React.PropTypes.object
      },
      getChildContext() {
        return {_eventSink: this.state.eventSink}
      }
    }
  }
  return ctx
}

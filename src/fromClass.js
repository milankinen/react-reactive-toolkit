import React from "react"
import Map from "./util/map"
import toBindings from "./toBindings"

export default Class => React.createClass({

  displayName: `R.${Class.displayName || Class.name || Class.toString()}`,

  getInitialState() {
    return {
      bindingMap: new Map(),
      waiting: new Map(),
      updated: 0
    }
  },

  componentWillReceiveProps(nextProps) {
    this._subscribe(nextProps)
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

    this.setState({
      bindingMap: new Map(),
      waiting: new Map(),
      props: null,
      pendingProps: null
    })
  },

  render() {
    const {props} = this.state
    return props ? React.createElement(Class, props, props.children) : null
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

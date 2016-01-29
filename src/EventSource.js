import ReactBrowserEventEmitter from "react/lib/ReactBrowserEventEmitter"
import EventPluginHub from "react/lib/EventPluginHub"


export default EventSource

function EventSource() {
  this.subscriptions = {}
  this.element = null
}


EventSource.prototype.tryListen = function(eventType) {
  const {listener, handlers} = (this.subscriptions[eventType] || {})
  if (this.element && !listener) {
    this.subscriptions[eventType].listener = new Listener(eventType, this.element, handlers)
  }
}

EventSource.prototype.start = function(element) {
  this.element = element
  for (var key in this.subscriptions) {
    this.tryListen(key)
  }
}

EventSource.prototype.end = function() {
  if (this.element) {
    const elem = this.element
    for (var key in this.subscriptions) {
      const {listener} =  this.subscriptions[key]
      if (listener) {
        listener.unbind(elem)
      }
    }
  }
  this.element = null
  this.subscriptions = {}
}

EventSource.prototype.subscribe = function(eventType, handler) {
  if (!this.subscriptions[eventType]) {
    this.subscriptions[eventType] = { handlers: [] }
  }
  this.subscriptions[eventType].handlers.push(handler)
  this.tryListen(eventType)
}

EventSource.prototype.dispose = function(eventType, {fn, selector}) {
  const {handlers, listener} = (this.subscriptions[eventType] || {})
  if (handlers) {
    const idx = handlers.findIndex(h => h.fn === fn && h.selector === selector)
    if (idx >= 0) handlers.slice(idx, 1)
    if (handlers.length === 0) {
      delete this.subscriptions[eventType]
      listener.unbind(this.element)
    }
  }
}

function Listener(eventType, element, handlers) {
  this.handlers = handlers
  this.fn = this.fn.bind(this)
  ReactBrowserEventEmitter.listenTo(eventType, document)
  EventPluginHub.putListener(getRootId(element), eventType, this.fn)
}

Listener.prototype.fn = function(event) {
  this.handlers.forEach(h => {
    if (event.target.matches(h.selector)) h.fn(event)
  })
}

Listener.prototype.unbind = function(element) {
  this.handlers = []
  EventPluginHub.deleteListener(getRootId(element), this.fn)
}

function getRootId(element) {
  return element._reactInternalInstance._rootNodeID
}

import {isFunction} from "./base"

export const isObs = x =>
  x && (isFunction(x.toESObservable) || isFunction(x.subscribe))



export const subscribe = (next, x) => {
  const error = err => {
    // TODO: better error handling?
    window.console && window.console.error && window.console.error(err)
  }
  let d
  if (isFunction(x.toESObservable)) {
    d = x.toESObservable().subscribe({next, error})
  } else if (isFunction(x.subscribe)) {
    if (x.subscribe.length > 1) {
      // fuk'n rx
      d = x.subscribe(next, error)
    } else {
      d = x.subscribe({next, error})
    }
  } else {
    throw new Error("No subscribe function found from " + x)
  }
  if (isFunction(d)) {
    return d
  } else if (d && isFunction(d.dispose)) {
    return () => d.dispose()
  } else if (d && isFunction(d.unsubscribe)) {
    return () => d.unsubscribe()
  } else {
    throw new Error("Observable returned unknown disposable " + d)
  }
}

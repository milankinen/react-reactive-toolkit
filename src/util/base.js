

export const isFunction = x =>
  typeof x === "function"

export const isPlainObject = x =>
  x && x.constructor === Object

export const isArray = x =>
  x && x.constructor === Array

export const keys = x =>
  Object.keys(x)

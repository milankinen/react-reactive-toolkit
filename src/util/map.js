
if (typeof global.Map !== "undefined") {

  module.exports = global.Map
  module.exports.default = module.exports

} else {

  module.exports = shim()
  module.exports.default = module.exports

}

function shim() {
  function Map() {
    this._keys = []
    this._values = []
  }

  Map.prototype.has = function(key) {
    return this._keys.indexOf(key) >= 0
  }

  Map.prototype.set = function(key, value) {
    if (!this.has(key)) {
      this._keys.push(key)
      this._values.push(value)
    }
  }

  Map.prototype.get = function(key) {
    const i = this._keys.indexOf(key)
    if (i >= 0) {
      return this._values[i]
    }
  }

  Map.prototype.delete = function(key) {
    const i = this._keys.indexOf(key)
    if (i >= 0) {
      this._keys.splice(i, 1)
      this._values.splice(i, 1)
    }
  }

  Map.prototype.values = function() {
    return new ArrayIterator(this._values)
  }

  Map.prototype.clear = function() {
    this._keys = []
    this._values = []
  }

  Object.defineProperty(Map.prototype, "size", {
    get: function() {
      return this._values.length
    }
  })

  function ArrayIterator(arr) {
    this.array = arr
    this.i = 0
  }

  ArrayIterator.prototype.next = function() {
    const array = this.array
    return this.i < array.length ? {value: array[this.i++], done: false} : {done: true}
  }

  return Map
}

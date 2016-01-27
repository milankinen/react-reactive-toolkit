import {isArray, keys} from "./util/base"
import {isObs, subscribe} from "./util/obs"


const NONE = {}

function Binding(obs, ctx, key) {
  this.value = NONE
  this.obs = obs
  this.ctx = ctx
  this.key = key
  this.onNext = void 0
  this._next = this._next.bind(this)
}

Binding.prototype._next = function(val) {
  this.ctx[this.key] = val
  this.value = val
  if (this.onNext) this.onNext(this.obs)
}

Binding.prototype.update = function(ctx, key) {
  this.ctx = ctx
  this.key = key
  if (this.value !== NONE) {
    ctx[key] = this.value
  }
}

Binding.prototype.subscribe = function() {
  this._dispose = subscribe(this._next, this.obs)
}

Binding.prototype.dispose = function() {
  const d = this._dispose
  this._dispose = void 0
  if (d) d()
}


export default props => {
  if (!props) {
    return props
  }

  const copy = {...props}
  if (isArray(props.children)) {
    copy.children = props.children.slice()
  }

  const bindings = []

  keys(props).forEach(key => {
    const prop = props[key]
    if (key === "children") {
      const children = prop
      if (isObs(children)) {
        bindings.push(new Binding(children, copy, "children"))
      } else if (isArray(children)) {
        children.forEach((child, idx) => {
          if (isObs(child)) {
            bindings.push(new Binding(child, copy.children, idx))
          }
        })
      }
    } else {
      if (isObs(prop)) {
        bindings.push(new Binding(prop, copy, key))
      }
    }
  })

  return {bindings, props: copy}
}



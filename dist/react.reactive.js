(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactReactiveToolkit"] = factory(require("react"));
	else
		root["ReactReactiveToolkit"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _fromClass = __webpack_require__(1);

	var _fromClass2 = _interopRequireDefault(_fromClass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tagNames = "a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite," + "code,col,colgroup,data,datalist,dd,del,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form," + "h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,meta," + "meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp," + "script,section,select,small,source,span,strong,style,sub,sup,table,tbody,td,template,textarea,tfoot,th," + "thead,time,title,tr,track,u,ul,var,video,wbr";

	tagNames.split(",").forEach(function (tag) {
	  _fromClass2.default[tag] = (0, _fromClass2.default)(tag);
	});

	exports.default = _fromClass2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _map = __webpack_require__(3);

	var _map2 = _interopRequireDefault(_map);

	var _toBindings2 = __webpack_require__(4);

	var _toBindings3 = _interopRequireDefault(_toBindings2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (Class) {
	  return _react2.default.createClass({

	    displayName: "R." + (Class.displayName || Class.name || Class.toString()),

	    getInitialState: function getInitialState() {
	      return {
	        bindingMap: new _map2.default(),
	        waiting: new _map2.default(),
	        updated: 0
	      };
	    },
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	      this._subscribe(nextProps);
	    },
	    componentWillMount: function componentWillMount() {
	      this._subscribe(this.props);
	    },
	    shouldComponentUpdate: function shouldComponentUpdate(_, nextState) {
	      return nextState.updated !== this.state.updated;
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      var bindingMap = this.state.bindingMap;

	      var values = bindingMap.values();
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var b = _step.value;

	          b.dispose();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      this.setState({
	        bindingMap: new _map2.default(),
	        waiting: new _map2.default(),
	        props: null,
	        pendingProps: null
	      });
	    },
	    render: function render() {
	      var props = this.state.props;

	      return props ? _react2.default.createElement(Class, props, props.children) : null;
	    },
	    _onObsNext: function _onObsNext(obs) {
	      var _state = this.state;
	      var waiting = _state.waiting;
	      var props = _state.props;
	      var pendingProps = _state.pendingProps;

	      waiting.delete(obs);
	      if (waiting.size === 0) {
	        this._requestUpdate(props || pendingProps);
	      }
	    },
	    _requestUpdate: function _requestUpdate(props) {
	      this.setState({
	        props: props,
	        updated: this.state.updated + 1,
	        pendingProps: null
	      });
	    },
	    _subscribe: function _subscribe(props) {
	      var _this = this;

	      var _state2 = this.state;
	      var bindingMap = _state2.bindingMap;
	      var waiting = _state2.waiting;

	      var _toBindings = (0, _toBindings3.default)(props);

	      var copiedProps = _toBindings.props;
	      var bindings = _toBindings.bindings;

	      var bindingsToAdd = [];
	      var existingBindings = [];
	      bindings.forEach(function (b) {
	        var existing = bindingMap.get(b.obs);
	        bindingMap.delete(b.obs);
	        if (!existing) {
	          bindingsToAdd.push(b);
	          waiting.set(b.obs, true);
	          b.onNext = _this._onObsNext;
	        } else {
	          existing.update(b.ctx, b.key);
	          existingBindings.push(existing);
	        }
	      });

	      // remaining bindings should be disposed
	      var bVals = bindingMap.values();
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = bVals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var b = _step2.value;

	          waiting.delete(b.obs);
	          b.dispose();
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      var newBindingMap = new _map2.default();
	      // add new and existing bindings to map
	      existingBindings.forEach(function (b) {
	        newBindingMap.set(b.obs, b);
	      });
	      bindingsToAdd.forEach(function (b) {
	        newBindingMap.set(b.obs, b);
	        b.subscribe();
	      });

	      this.setState({
	        pendingProps: copiedProps,
	        bindingMap: newBindingMap
	      });
	      if (waiting.size === 0) {
	        this._requestUpdate(copiedProps);
	      }
	    }
	  });
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	if (typeof global.Map !== "undefined") {

	  module.exports = global.Map;
	  module.exports.default = module.exports;
	} else {

	  module.exports = shim();
	  module.exports.default = module.exports;
	}

	function shim() {
	  function Map() {
	    this._keys = [];
	    this._values = [];
	  }

	  Map.prototype.has = function (key) {
	    return this._keys.indexOf(key) >= 0;
	  };

	  Map.prototype.set = function (key, value) {
	    if (!this.has(key)) {
	      this._keys.push(key);
	      this._values.push(value);
	    }
	  };

	  Map.prototype.get = function (key) {
	    var i = this._keys.indexOf(key);
	    if (i >= 0) {
	      return this._values[i];
	    }
	  };

	  Map.prototype.delete = function (key) {
	    var i = this._keys.indexOf(key);
	    if (i >= 0) {
	      this._keys.splice(i, 1);
	      this._values.splice(i, 1);
	    }
	  };

	  Map.prototype.values = function () {
	    return new ArrayIterator(this._values);
	  };

	  Map.prototype.clear = function () {
	    this._keys = [];
	    this._values = [];
	  };

	  Object.defineProperty(Map.prototype, "size", {
	    get: function get() {
	      return this._values.length;
	    }
	  });

	  function ArrayIterator(arr) {
	    this.array = arr;
	    this.i = 0;
	  }

	  ArrayIterator.prototype.next = function () {
	    var array = this.array;
	    return this.i < array.length ? { value: array[this.i++], done: false } : { done: true };
	  };

	  return Map;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _base = __webpack_require__(5);

	var _obs = __webpack_require__(6);

	var NONE = {};

	function Binding(obs, ctx, key) {
	  this.value = NONE;
	  this.obs = obs;
	  this.ctx = ctx;
	  this.key = key;
	  this.onNext = void 0;
	  this._next = this._next.bind(this);
	}

	Binding.prototype._next = function (val) {
	  this.ctx[this.key] = val;
	  this.value = val;
	  if (this.onNext) this.onNext(this.obs);
	};

	Binding.prototype.update = function (ctx, key) {
	  this.ctx = ctx;
	  this.key = key;
	  if (this.value !== NONE) {
	    ctx[key] = this.value;
	  }
	};

	Binding.prototype.subscribe = function () {
	  this._dispose = (0, _obs.subscribe)(this._next, this.obs);
	};

	Binding.prototype.dispose = function () {
	  var d = this._dispose;
	  this._dispose = void 0;
	  if (d) d();
	};

	exports.default = function (props) {
	  if (!props) {
	    return props;
	  }

	  var copy = _extends({}, props);
	  if ((0, _base.isArray)(props.children)) {
	    copy.children = props.children.slice();
	  }

	  var bindings = [];

	  (0, _base.keys)(props).forEach(function (key) {
	    var prop = props[key];
	    if (key === "children") {
	      var children = prop;
	      if ((0, _obs.isObs)(children)) {
	        bindings.push(new Binding(children, copy, "children"));
	      } else if ((0, _base.isArray)(children)) {
	        children.forEach(function (child, idx) {
	          if ((0, _obs.isObs)(child)) {
	            bindings.push(new Binding(child, copy.children, idx));
	          }
	        });
	      }
	    } else {
	      if ((0, _obs.isObs)(prop)) {
	        bindings.push(new Binding(prop, copy, key));
	      }
	    }
	  });

	  return { bindings: bindings, props: copy };
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isFunction = exports.isFunction = function isFunction(x) {
	  return typeof x === "function";
	};

	var isPlainObject = exports.isPlainObject = function isPlainObject(x) {
	  return x && x.constructor === Object;
	};

	var isArray = exports.isArray = function isArray(x) {
	  return x && x.constructor === Array;
	};

	var keys = exports.keys = function keys(x) {
	  return Object.keys(x);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.subscribe = exports.isObs = undefined;

	var _base = __webpack_require__(5);

	var isObs = exports.isObs = function isObs(x) {
	  return x && ((0, _base.isFunction)(x.toESObservable) || (0, _base.isFunction)(x.subscribe));
	};

	var subscribe = exports.subscribe = function subscribe(next, x) {
	  var error = function error(err) {
	    // TODO: better error handling?
	    window.console && window.console.error && window.console.error(err);
	  };
	  var d = undefined;
	  if ((0, _base.isFunction)(x.toESObservable)) {
	    d = x.toESObservable().subscribe({ next: next, error: error });
	  } else if ((0, _base.isFunction)(x.subscribe)) {
	    if (x.subscribe.length > 1) {
	      // fuk'n rx
	      d = x.subscribe(next, error);
	    } else {
	      d = x.subscribe({ next: next, error: error });
	    }
	  } else {
	    throw new Error("No subscribe function found from " + x);
	  }
	  if ((0, _base.isFunction)(d)) {
	    return d;
	  } else if (d && (0, _base.isFunction)(d.dispose)) {
	    return function () {
	      return d.dispose();
	    };
	  } else if (d && (0, _base.isFunction)(d.unsubscribe)) {
	    return function () {
	      return d.unsubscribe();
	    };
	  } else {
	    throw new Error("Observable returned unknown disposable " + d);
	  }
	};

/***/ }
/******/ ])
});
;
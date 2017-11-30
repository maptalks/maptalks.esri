/*!
 * maptalks.esri v0.0.1
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
import { Ajax, Coordinate, Layer, renderer } from 'maptalks';

var cors = window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest();

var trimText = function (isNative) {
    return function (input) {
        return isNative ? isNative.apply(input) : ((input || '') + '').replace(/^\s+|\s+$/g, '');
    };
}(String.prototype.trim);

var cleanUrl = function (url) {
    url = trimText(url);

    if (url[url.length - 1] !== '/') {
        url += '/';
    }
    return url;
};

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var asyncGeneratorDelegate = function (inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      return pump("return", value);
    };
  }

  return iter;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineEnumerableProperties = function (obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  return obj;
};

var defaults = function (obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
};

var _instanceof = function (left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
};

var interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};

var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};

var newArrowCheck = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};

var objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var selfGlobal = typeof global === "undefined" ? self : global;

var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var slicedToArrayLoose = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
};

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var temporalRef = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  } else {
    return val;
  }
};

var temporalUndefined = {};

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};



var babelHelpers$1 = Object.freeze({
	jsx: jsx,
	asyncIterator: asyncIterator,
	asyncGenerator: asyncGenerator,
	asyncGeneratorDelegate: asyncGeneratorDelegate,
	asyncToGenerator: asyncToGenerator,
	classCallCheck: classCallCheck,
	createClass: createClass,
	defineEnumerableProperties: defineEnumerableProperties,
	defaults: defaults,
	defineProperty: defineProperty,
	get: get,
	inherits: inherits,
	interopRequireDefault: interopRequireDefault,
	interopRequireWildcard: interopRequireWildcard,
	newArrowCheck: newArrowCheck,
	objectDestructuringEmpty: objectDestructuringEmpty,
	objectWithoutProperties: objectWithoutProperties,
	possibleConstructorReturn: possibleConstructorReturn,
	selfGlobal: selfGlobal,
	set: set,
	slicedToArray: slicedToArray,
	slicedToArrayLoose: slicedToArrayLoose,
	taggedTemplateLiteral: taggedTemplateLiteral,
	taggedTemplateLiteralLoose: taggedTemplateLiteralLoose,
	temporalRef: temporalRef,
	temporalUndefined: temporalUndefined,
	toArray: toArray,
	toConsumableArray: toConsumableArray,
	typeof: _typeof,
	extends: _extends,
	instanceof: _instanceof
});

var merge = function merge() {
  var _babelHelpers;

  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return (_babelHelpers = babelHelpers$1).extends.apply(_babelHelpers, [{}].concat(sources));
};

var serializeParams = function serializeParams(params) {
    var data = '';
    params.f = params.f || 'json';

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var param = params[key];
            var type = Object.prototype.toString.call(param);
            var value;

            if (data.length) {
                data += '&';
            }

            if (type === '[object Array]') {
                value = Object.prototype.toString.call(param[0]) === '[object Object]' ? JSON.stringify(param) : param.join(',');
            } else if (type === '[object Object]') {
                value = JSON.stringify(param);
            } else if (type === '[object Date]') {
                value = param.valueOf();
            } else {
                value = param;
            }

            data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
    }

    return data;
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var zousanMin = createCommonjsModule(function (module) {
  !function (t) {
    "use strict";
    function e(t) {
      if (t) {
        var e = this;t(function (t) {
          e.resolve(t);
        }, function (t) {
          e.reject(t);
        });
      }
    }function n(t, e) {
      if ("function" == typeof t.y) try {
        var n = t.y.call(i, e);t.p.resolve(n);
      } catch (o) {
        t.p.reject(o);
      } else t.p.resolve(e);
    }function o(t, e) {
      if ("function" == typeof t.n) try {
        var n = t.n.call(i, e);t.p.resolve(n);
      } catch (o) {
        t.p.reject(o);
      } else t.p.reject(e);
    }var r,
        i,
        c = "fulfilled",
        u = "rejected",
        s = "undefined",
        f = function () {
      function e() {
        for (; n.length - o;) {
          try {
            n[o]();
          } catch (e) {
            t.console && t.console.error(e);
          }n[o++] = i, o == r && (n.splice(0, r), o = 0);
        }
      }var n = [],
          o = 0,
          r = 1024,
          c = function () {
        if ((typeof MutationObserver === "undefined" ? "undefined" : _typeof(MutationObserver)) !== s) {
          var t = document.createElement("div"),
              n = new MutationObserver(e);return n.observe(t, { attributes: !0 }), function () {
            t.setAttribute("a", 0);
          };
        }return (typeof setImmediate === "undefined" ? "undefined" : _typeof(setImmediate)) !== s ? function () {
          setImmediate(e);
        } : function () {
          setTimeout(e, 0);
        };
      }();return function (t) {
        n.push(t), n.length - o == 1 && c();
      };
    }();e.prototype = { resolve: function resolve(t) {
        if (this.state === r) {
          if (t === this) return this.reject(new TypeError("Attempt to resolve promise with self"));var e = this;if (t && ("function" == typeof t || "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)))) try {
            var o = !0,
                i = t.then;if ("function" == typeof i) return void i.call(t, function (t) {
              o && (o = !1, e.resolve(t));
            }, function (t) {
              o && (o = !1, e.reject(t));
            });
          } catch (u) {
            return void (o && this.reject(u));
          }this.state = c, this.v = t, e.c && f(function () {
            for (var o = 0, r = e.c.length; r > o; o++) {
              n(e.c[o], t);
            }
          });
        }
      }, reject: function reject(n) {
        if (this.state === r) {
          this.state = u, this.v = n;var i = this.c;i ? f(function () {
            for (var t = 0, e = i.length; e > t; t++) {
              o(i[t], n);
            }
          }) : !e.suppressUncaughtRejectionError && t.console && t.console.log("You upset Zousan. Please catch rejections: ", n, n ? n.stack : null);
        }
      }, then: function then(t, i) {
        var u = new e(),
            s = { y: t, n: i, p: u };if (this.state === r) this.c ? this.c.push(s) : this.c = [s];else {
          var l = this.state,
              a = this.v;f(function () {
            l === c ? n(s, a) : o(s, a);
          });
        }return u;
      }, "catch": function _catch(t) {
        return this.then(null, t);
      }, "finally": function _finally(t) {
        return this.then(t, t);
      }, timeout: function timeout(t, n) {
        n = n || "Timeout";var o = this;return new e(function (e, r) {
          setTimeout(function () {
            r(Error(n));
          }, t), o.then(function (t) {
            e(t);
          }, function (t) {
            r(t);
          });
        });
      } }, e.resolve = function (t) {
      var n = new e();return n.resolve(t), n;
    }, e.reject = function (t) {
      var n = new e();return n.reject(t), n;
    }, e.all = function (t) {
      function n(n, c) {
        n && "function" == typeof n.then || (n = e.resolve(n)), n.then(function (e) {
          o[c] = e, r++, r == t.length && i.resolve(o);
        }, function (t) {
          i.reject(t);
        });
      }for (var o = [], r = 0, i = new e(), c = 0; c < t.length; c++) {
        n(t[c], c);
      }return t.length || i.resolve(o), i;
    }, 'object' != s && module.exports && (module.exports = e), t.define && t.define.amd && t.define([], function () {
      return e;
    }), t.Zousan = e, e.soon = f;
  }("undefined" != typeof commonjsGlobal ? commonjsGlobal : commonjsGlobal);
});

var promise = void 0;

if (typeof Promise !== 'undefined') {
    promise = Promise;
} else {
    promise = zousanMin;
}

var Promise$1 = promise;

var _options$1 = {
    proxy: false,
    useCors: cors,
    timeout: 0
};

var Service = function () {
    function Service(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, Service);

        this._options = merge({}, _options$1, options);
        this._url = cleanUrl(url);
        this._token = this._options.token || null;
    }

    Service.prototype.authenticate = function authenticate(token) {
        this._token = token;
    };

    Service.prototype.request = function request(method, path, params) {
        var url = this._options.proxy ? this._options.proxy + '?' + this._url + path : this._url + path;

        params = !!this._token ? merge({}, params, { token: this._token }) : merge({}, params);

        method = method.toLowerCase();

        if (method === 'get' && !this._options.useCors) {
            return new Promise$1(function (resolve, reject) {
                Ajax.jsonp(url + '?' + serializeParams(params), function (err, resp) {
                    err === null ? resolve(resp) : reject(err);
                });
            });
        } else if (method === 'get') {
            return new Promise$1(function (resolve, reject) {
                Ajax.get(url + '?' + serializeParams(params), function (err, resp) {
                    err === null ? resolve(resp) : reject(err);
                });
            });
        } else if (method === 'post') {
            return new Promise$1(function (resolve, reject) {
                Ajax.get(url, params, function (err, resp) {
                    err === null ? resolve(resp) : reject(err);
                });
            });
        }
    };

    return Service;
}();

var Task = function () {
  function Task(service) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Task);

    this._service = service;

    this._formatted = false;

    this._params = {};
  }

  Task.prototype.request = function request(method, params) {
    var _params = merge({}, this._params, params);
    return this._service.request(method, this._path, _params);
  };

  Task.prototype.run = function run() {
    throw Error(this.constructorName + 'is no implemention run function');
  };

  createClass(Task, [{
    key: 'token',
    set: function set$$1(value) {
      this._service.authenticate(value);
    }
  }, {
    key: 'formatted',
    set: function set$$1(boolean) {
      this._formatted = boolean;
    }
  }]);
  return Task;
}();

var IdentifyTask = function (_Task) {
    inherits(IdentifyTask, _Task);

    function IdentifyTask(endpoint, params) {
        classCallCheck(this, IdentifyTask);

        var _this = possibleConstructorReturn(this, _Task.call(this, endpoint, params));

        _this._path = 'identify';
        return _this;
    }

    IdentifyTask.prototype.between = function between(start, end) {
        this._time = [start.valueOf(), end.valueOf()];
        return this;
    };

    return IdentifyTask;
}(Task);

var IdentifyImageTask = function (_IdentifyTask) {
    inherits(IdentifyImageTask, _IdentifyTask);

    function IdentifyImageTask() {
        classCallCheck(this, IdentifyImageTask);
        return possibleConstructorReturn(this, _IdentifyTask.apply(this, arguments));
    }

    IdentifyImageTask.prototype.run = function run(callback, context) {
        this.request(function (error, response) {
            var resp = this._resolveResponse(response);
            callback.call(context, resp);
        }, this);
    };

    IdentifyImageTask.prototype._resolveResponse = function _resolveResponse(response) {
        var location = response.location,
            catalogItems = response.catalogItems,
            catalogItemVisibilities = response.catalogItemVisibilities;

        var geoJson = {
            'pixel': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [location.x, location.y]
                },
                'crs': {
                    'type': 'EPSG',
                    'properties': {
                        'code': location.spatialReference.wkid
                    }
                },
                'properties': {
                    'OBJECTID': response.objectId,
                    'name': response.name,
                    'value': response.value
                },
                'id': response.objectId
            }
        };

        if (response.properties && response.properties.Values) {
            geoJSON.pixel.properties.values = response.properties.Values;
        }

        if (catalogItems && catalogItems.features) {
            geoJSON.catalogItems = responseToFeatureCollection(catalogItems);
            if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
                for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
                    geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i];
                }
            }
        }
        return geoJSON;
    };

    return IdentifyImageTask;
}(IdentifyTask);

var MetadataTask = function (_Task) {
    inherits(MetadataTask, _Task);

    function MetadataTask(service) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, MetadataTask);

        var _this = possibleConstructorReturn(this, _Task.call(this, service, options));

        _this._path = "";
        return _this;
    }

    MetadataTask.prototype.run = function run() {
        return this.request('get', {});
    };

    return MetadataTask;
}(Task);

var ExportImageTask = function (_Task) {
    inherits(ExportImageTask, _Task);

    function ExportImageTask(endpoint, params) {
        classCallCheck(this, ExportImageTask);

        var _this = possibleConstructorReturn(this, _Task.call(this, endpoint, params));

        _this._path = 'exportImage';
        return _this;
    }

    ExportImageTask.prototype.run = function run() {
        return this.request('get', this._params);
    };

    createClass(ExportImageTask, [{
        key: 'params',
        set: function set$$1() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._params = merge({}, this._params, value);
        }
    }]);
    return ExportImageTask;
}(Task);

var ImageService = function (_Service) {
    inherits(ImageService, _Service);

    function ImageService() {
        classCallCheck(this, ImageService);
        return possibleConstructorReturn(this, _Service.apply(this, arguments));
    }

    ImageService.prototype.metadata = function metadata() {
        this._metadataTask = this._metadataTask || new MetadataTask(this);
        return this._metadataTask.run();
    };

    ImageService.prototype.GetSamples = function GetSamples() {};

    ImageService.prototype.CouputeClassStatistics = function CouputeClassStatistics() {};

    ImageService.prototype.ComputeHistograms = function ComputeHistograms() {};

    ImageService.prototype.exportImage = function exportImage(params) {
        this._exportImageTask = this._exportImageTask || new ExportImageTask(this);
        this._exportImageTask.params = params;
        return this._exportImageTask.run();
    };

    ImageService.prototype.query = function query() {};

    ImageService.prototype.identify = function identify() {
        return new IdentifyImageTask(this);
    };

    return ImageService;
}(Service);

var _options = {
    updateInterval: 150,
    format: 'jpgpng',
    transparent: true,
    f: 'image'
};

var ImageMapLayer = function (_maptalks$Layer) {
    inherits(ImageMapLayer, _maptalks$Layer);

    function ImageMapLayer(id) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, ImageMapLayer);

        var _this = possibleConstructorReturn(this, _maptalks$Layer.call(this, id, options));

        _this._options = merge({}, _options, options);
        _this._url = options.url;
        _this._service = new ImageService(_this._url);
        return _this;
    }

    ImageMapLayer.prototype.onAdd = function onAdd() {
        var params = this._buildExportParams(),
            that = this;
        this._service.exportImage(params).then(function (resp) {
            that._cacheData = JSON.parse(resp);
        }, function (err) {});
    };

    ImageMapLayer.prototype._buildExportParams = function _buildExportParams() {
        var map = this.getMap(),
            params = {},
            prj_extent = map.getProjExtent(),
            map_size = map.getSize();
        params.bbox = [prj_extent.xmin, prj_extent.ymin, prj_extent.xmax, prj_extent.ymax];
        params.size = map_size.width + ',' + map_size.height;
        params.format = this._options.format;
        params.transparent = this._options.transparent;

        params.bboxSR = "";
        params.imageSR = "";
        return params;
    };

    createClass(ImageMapLayer, [{
        key: 'cacheData',
        get: function get$$1() {
            return this._cacheData;
        }
    }]);
    return ImageMapLayer;
}(Layer);

ImageMapLayer.registerRenderer('canvas', function (_maptalks$renderer$Ca) {
    inherits(_class, _maptalks$renderer$Ca);

    function _class() {
        classCallCheck(this, _class);
        return possibleConstructorReturn(this, _maptalks$renderer$Ca.apply(this, arguments));
    }

    _class.prototype.onAdd = function onAdd() {};

    _class.prototype.draw = function draw() {
        this.prepareCanvas();
        this._drawImage();
        this.completeRender();
    };

    _class.prototype._drawImage = function _drawImage() {
        var imgObj = this.layer.cacheData;
        var that = this;
        if (!!imgObj) {
            var img = new Image();
            img.src = imgObj.href;
            img.onload = function () {
                var pt = that.layer.getMap().prjToContainerPoint(new Coordinate(imgObj.extent.xmin, imgObj.extent.ymax));
                that.context.drawImage(img, 0, 0);
            };
        }
    };

    _class.prototype.drawOnInteracting = function drawOnInteracting() {
        this.draw();
    };

    return _class;
}(renderer.CanvasRenderer));

var esri = {
  ImageMapLayer: ImageMapLayer

};

export { esri };

typeof console !== 'undefined' && console.log('maptalks.esri v0.0.1');

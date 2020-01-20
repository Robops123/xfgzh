(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 10:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 16:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 168:
/*!***************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/static/js/myPull.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /**
                                                                                                                                                                                                                                                                                                                * @name 封装下拉
                                                                                                                                                                                                                                                                                                                * @params getList 刷新数据的函数
                                                                                                                                                                                                                                                                                                                * @params listData 存放数据的变量名
                                                                                                                                                                                                                                                                                                                * @params page 页数变量名
                                                                                                                                                                                                                                                                                                                */var _default =
function _default(_ref) {var _ref$getList = _ref.getList,getList = _ref$getList === void 0 ? "getList" : _ref$getList,_ref$listData = _ref.listData,listData = _ref$listData === void 0 ? "listData" : _ref$listData,_ref$page = _ref.page,page = _ref$page === void 0 ? "page" : _ref$page,_ref$initIndex = _ref.initIndex,initIndex = _ref$initIndex === void 0 ? "initIndex" : _ref$initIndex,_ref$modelData = _ref.modelData,modelData = _ref$modelData === void 0 ? "modelData" : _ref$modelData;
  var startPoint = {};
  var endPoint = {};
  return {
    data: function data() {var _ref2;
      return _ref2 = {}, _defineProperty(_ref2,
      listData, []), _defineProperty(_ref2,
      page, 1), _defineProperty(_ref2,
      initIndex, 0), _defineProperty(_ref2,
      modelData, [
      { label: "全部", backgroud: "color:#000000" },
      { label: "告警", backgroud: "color:#FF0000" },
      { label: "故障", backgroud: "color:#FFB400" },
      { label: "离线", backgroud: "color:#666666" }]), _ref2;


    },
    onPullDownRefresh: function onPullDownRefresh() {
      this.refreshes();
    },
    // onReachBottom() {
    // 	this[getList].call(this, this[page], this.__pulldone);
    // },
    methods: {
      refreshes: function refreshes() {
        this[page] = 1;
        this[getList].call(this, this[page], this.__pulldone);
      },
      __pulldone: function __pulldone(data) {
        var db = data || [];
        if (this[page] == 1) {
          this[listData] = db;
        } else {
          this[listData] = (this[listData] || []).concat(db);
        }
        uni.stopPullDownRefresh();
        this[page]++;
      },

      /**
          * @name 动态开启或关闭pulldown
          * @params {boolean} isOpen
          */
      setPullDown: function setPullDown(isOpen) {











      },

      /**
          * @name 开始滑动
          */
      touchstart: function touchstart(e) {
        startPoint = {
          pageX: e.pageX || e.changedTouches[0].pageX,
          pageY: e.pageY || e.changedTouches[0].pageY };

      },

      /**
          * @name 滑动结束
          */
      touchend: function touchend(e) {
        endPoint = {
          pageX: e.mp.changedTouches[0].pageX,
          pageY: e.mp.changedTouches[0].pageY

          // 判断是左滑动还是右滑动 当横向位移大于10，纵向位移大于100，则判定为滑动事件
        };var disX = endPoint.pageX - startPoint.pageX; //计算移动的位移差
        var disY = endPoint.pageY - startPoint.pageY;
        if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
          if (Math.abs(disX) > Math.abs(disY)) {//判断是横向滑动还是纵向滑动
            if (disX > 10) {
              this.swiperight(); //右滑
            };
            if (disX < -10) {
              this.swipeleft(); //左滑
            };
          }
        }
      },

      /**
          * @name 向左滑动
          */
      swipeleft: function swipeleft() {
        if (this[initIndex] < this[modelData].length - 1) this[initIndex]++;
        console.log("左滑");
      },

      /**
          * @name 监听右滑
          */
      swiperight: function swiperight() {
        if (this[initIndex] > 0) this[initIndex]--;
        console.log("右滑");
      } } };


};exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 17:
/*!***************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/Json.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* 用户 */
var userInfo = {
  status: 1,
  data: {
    id: 1,
    mobile: 18888888888,
    nickname: 'Leo yo',
    portrait: 'http://img.61ef.cn/news/201409/28/2014092805595807.jpg' },

  msg: '提示'

  /* 首页轮播图 */ };
var carouselList = [{
  src: "/static/temp/banner3.jpg",
  background: "rgb(203, 87, 60)" },

{
  src: "/static/temp/banner2.jpg",
  background: "rgb(205, 215, 218)" },

{
  src: "/static/temp/banner4.jpg",
  background: "rgb(183, 73, 69)" }];


/* 商品列表 */
var goodsList = [{
  image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",
  image2: "http://pic.rmb.bdstatic.com/819a044daa66718c2c40a48c1ba971e6.jpeg",
  image3: "http://img001.hc360.cn/y5/M00/1B/45/wKhQUVYFE0uEZ7zVAAAAAMj3H1w418.jpg",
  title: "古黛妃 短袖t恤女夏装2019新款韩版宽松",
  price: 179,
  sales: 61 },

{
  image: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg",
  image2: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554013048&di=a3dc9fd1406dd7bad7fbb97b5489ec04&imgtype=jpg&er=1&src=http%3A%2F%2Fimg009.hc360.cn%2Fhb%2FnKo44ac2656F831c684507E3Da0E3a26841.jpg",
  image3: "http://img.zcool.cn/community/017a4e58b4eab6a801219c77084373.jpg",
  title: "潘歌针织连衣裙",
  price: 78,
  sales: 16 },

{
  image: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg",
  image2: "http://m.360buyimg.com/n12/jfs/t247/42/1078640382/162559/3628a0b/53f5ad09N0dd79894.jpg%21q70.jpg",
  image3: "http://ikids.61kids.com.cn/upload/2018-12-29/1546070626796114.jpg",
  title: "巧谷2019春夏季新品新款女装",
  price: 108.8,
  sales: 5 },
{
  image: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=756705744,3505936868&fm=11&gp=0.jpg",
  image2: "http://images.jaadee.com/images/201702/goods_img/30150_d85aed83521.jpg",
  image3: "http://img13.360buyimg.com/popWaterMark/jfs/t865/120/206320620/138889/dcc94caa/550acedcN613e2a9d.jpg",
  title: "私萱连衣裙",
  price: 265,
  sales: 88 },
{
  image: "https://img13.360buyimg.com/n8/jfs/t1/30343/20/1029/481370/5c449438Ecb46a15b/2b2adccb6dc742fd.jpg",
  image2: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553418265666&di=d4a7f7eb0ae3c859edeb921641ee1c3a&imgtype=0&src=http%3A%2F%2Fimg003.hc360.cn%2Fy3%2FM02%2FF8%2F9F%2FwKhQh1TuSkGELIlQAAAAAPuLl4M987.jpg",
  image3: "http://img.ef43.com.cn/product/2016/8/05100204b0c.jpg",
  title: "娇诗茹 ulzzang原宿风学生潮韩版春夏短",
  price: 422,
  sales: 137 },
{
  image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",
  image2: "http://image5.suning.cn/uimg/b2c/newcatentries/0070158827-000000000622091973_2_800x800.jpg",
  image3: "http://img.61ef.cn/news/201903/20/2019032009251784.jpg",
  title: "古黛妃 短袖t恤女夏装2019新款韩版宽松",
  price: 179,
  sales: 95 }];



/* 购物车 */
var cartList = [{
  id: 1,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553005139&di=3368549edf9eee769a9bcb3fbbed2504&imgtype=jpg&er=1&src=http%3A%2F%2Fimg002.hc360.cn%2Fy3%2FM01%2F5F%2FDB%2FwKhQh1T7iceEGRdWAAAAADQvqk8733.jpg',
  attr_val: '春装款 L',
  stock: 15,
  title: 'OVBE 长袖风衣',
  price: 278.00,
  number: 1 },

{
  id: 3,
  image: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2319343996,1107396922&fm=26&gp=0.jpg',
  attr_val: '激光导航 扫拖一体',
  stock: 3,
  title: '科沃斯 Ecovacs 扫地机器人',
  price: 1348.00,
  number: 5 },

{
  id: 4,
  image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2668268226,1765897385&fm=26&gp=0.jpg',
  attr_val: 'XL',
  stock: 55,
  title: '朵绒菲小西装',
  price: 175.88,
  number: 1 },

{
  id: 5,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552410549432&di=06dd3758053fb6d6362516f30a42d055&imgtype=0&src=http%3A%2F%2Fimgcache.mysodao.com%2Fimg3%2FM0A%2F67%2F42%2FCgAPD1vNSsHNm-TnAAEy61txQb4543_400x400x2.JPG',
  attr_val: '520 #粉红色',
  stock: 15,
  title: '迪奥（Dior）烈艳唇膏',
  price: 1089.00,
  number: 1 },

{
  id: 6,
  image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1031875829,2994442603&fm=26&gp=0.jpg',
  attr_val: '樱花味润手霜 30ml',
  stock: 15,
  title: "欧舒丹（L'OCCITANE）乳木果",
  price: 128,
  number: 1 },

{
  id: 7,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553007107&di=390915aa8a022cf0b03c03340881b0e7&imgtype=jpg&er=1&src=http%3A%2F%2Fimg13.360buyimg.com%2Fn0%2Fjfs%2Ft646%2F285%2F736444951%2F480473%2Faa701c97%2F548176feN10c9ed7b.jpg',
  attr_val: '特级 12个',
  stock: 7,
  title: '新疆阿克苏苹果 特级',
  price: 58.8,
  number: 10 },

{
  id: 8,
  image: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2319343996,1107396922&fm=26&gp=0.jpg',
  attr_val: '激光导航 扫拖一体',
  stock: 15,
  title: '科沃斯 Ecovacs 扫地机器人',
  price: 1348.00,
  number: 1 },

{
  id: 9,
  image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2668268226,1765897385&fm=26&gp=0.jpg',
  attr_val: 'XL',
  stock: 55,
  title: '朵绒菲小西装',
  price: 175.88,
  number: 1 },

{
  id: 10,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552410549432&di=06dd3758053fb6d6362516f30a42d055&imgtype=0&src=http%3A%2F%2Fimgcache.mysodao.com%2Fimg3%2FM0A%2F67%2F42%2FCgAPD1vNSsHNm-TnAAEy61txQb4543_400x400x2.JPG',
  attr_val: '520 #粉红色',
  stock: 15,
  title: '迪奥（Dior）烈艳唇膏',
  price: 1089.00,
  number: 1 },

{
  id: 11,
  image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1031875829,2994442603&fm=26&gp=0.jpg',
  attr_val: '樱花味润手霜 30ml',
  stock: 15,
  title: "欧舒丹（L'OCCITANE）乳木果",
  price: 128,
  number: 1 },

{
  id: 12,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553007107&di=390915aa8a022cf0b03c03340881b0e7&imgtype=jpg&er=1&src=http%3A%2F%2Fimg13.360buyimg.com%2Fn0%2Fjfs%2Ft646%2F285%2F736444951%2F480473%2Faa701c97%2F548176feN10c9ed7b.jpg',
  attr_val: '特级 12个',
  stock: 7,
  title: '新疆阿克苏苹果 特级',
  price: 58.8,
  number: 10 },

{
  id: 13,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552405266625&di=a703f2b2cdb0fe7f3f05f62dd91307ab&imgtype=0&src=http%3A%2F%2Fwww.78.cn%2Fzixun%2Fnews%2Fupload%2F20190214%2F1550114706486250.jpg',
  attr_val: '春装款/m',
  stock: 15,
  title: '女装2019春秋新款',
  price: 420.00,
  number: 1 }];


//详情展示页面
var detailData = {
  title: '纯种金毛幼犬活体有血统证书',
  title2: '拆家小能手 你值得拥有',
  favorite: true,
  imgList: [{
    src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg' },

  {
    src: 'http://img.pconline.com.cn/images/upload/upc/tx/itbbs/1309/06/c4/25310541_1378426131583.jpg' },

  {
    src: 'http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1610/26/c4/28926240_1477451226577_mthumb.jpg' },

  {
    src: 'http://picture.ik123.com/uploads/allimg/190219/12-1Z219105139.jpg' }],


  episodeList: [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],

  guessList: [{
    src: 'http://img.52z.com/upload/news/image/20180530/20180530081619_31029.jpg',
    title: '猫眼指甲油',
    title2: '独树一帜的免照灯猫眼指甲' },

  {
    src: 'http://m.china-7.net/uploads/14778449362891.jpg',
    title: '创意屋',
    title2: '创意屋形上下双层高低床' },

  {
    src: 'http://www.k73.com/up/allimg/130415/22-130415093527.jpg',
    title: 'MissCandy 指甲油',
    title2: '十分适合喜欢素净的妹纸，尽显淡雅的气质' },

  {
    src: 'http://img0.imgtn.bdimg.com/it/u=2108933440,2194129200&fm=214&gp=0.jpg	',
    title: 'RMK 2017星空海蓝唇釉',
    title2: '唇釉质地，上唇后很滋润。少女也会心动的蓝色，透明液体形状。' }],


  evaList: [{
    src: 'http://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/77c6a7efce1b9d1663174705fbdeb48f8d546486.jpg',
    nickname: 'Ranth Allngal',
    time: '09-20 12:54',
    zan: '54',
    content: '评论不要太苛刻，不管什么产品都会有瑕疵，客服也说了可以退货并且商家承担运费，我觉得至少态度就可以给五星。' },

  {
    src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg',
    nickname: 'Ranth Allngal',
    time: '09-20 12:54',
    zan: '54',
    content: '楼上说的好有道理。' }] };



var shareList = [{
  type: 1,
  icon: '/static/temp/share_wechat.png',
  text: '微信好友' },

{
  type: 2,
  icon: '/static/temp/share_moment.png',
  text: '朋友圈' },

{
  type: 3,
  icon: '/static/temp/share_qq.png',
  text: 'QQ好友' },

{
  type: 4,
  icon: '/static/temp/share_qqzone.png',
  text: 'QQ空间' }];


var lazyLoadList = [{
  src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg' },

{
  src: 'http://img.pconline.com.cn/images/upload/upc/tx/itbbs/1309/06/c4/25310541_1378426131583.jpg' },

{
  src: 'http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1610/26/c4/28926240_1477451226577_mthumb.jpg' },

{
  src: 'http://picture.ik123.com/uploads/allimg/190219/12-1Z219105139.jpg' },

{
  src: 'http://img5.imgtn.bdimg.com/it/u=2904900134,438461613&fm=26&gp=0.jpg' },

{
  src: 'http://img1.imgtn.bdimg.com/it/u=1690475408,2565370337&fm=26&gp=0.jpg' },

{
  src: 'http://img.99114.com/group1/M00/7F/99/wKgGS1kVrPGAe5LmAAU2KrJmb3Q923_600_600.jpg' },

{
  src: 'http://img4.imgtn.bdimg.com/it/u=261047209,372231813&fm=26&gp=0.jpg' },

{
  src: 'http://i2.17173cdn.com/i7mz64/YWxqaGBf/tu17173com/20150107/eMyVMObjlbcvDEv.jpg' },

{
  src: 'http://img008.hc360.cn/m4/M02/E7/87/wKhQ6FSrfU6EfUoyAAAAAITAfyc280.jpg' },

{
  src: 'http://pic1.win4000.com/wallpaper/d/5991569950166.jpg' },

{
  src: 'http://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/6f061d950a7b0208f9fe945e60d9f2d3572cc85e.jpg' },

{
  src: 'http://pic41.nipic.com/20140429/18169759_125841756000_2.jpg' },

{
  src: 'http://www.k73.com/up/allimg/130415/22-130415093527.jpg' },

{
  src: 'http://img.52z.com/upload/news/image/20180530/20180530081619_31029.jpg' },

{
  src: 'http://b-ssl.duitang.com/uploads/item/201410/02/20141002111638_tXAzU.jpeg' },

{
  src: 'http://img2.ph.126.net/C4JW6f57QWSB21-8jh2UGQ==/1762596304262286698.jpg' },

{
  src: 'http://att.bbs.duowan.com/forum/201405/17/190257nzcvkkdg6w2e8226.jpg' },

{
  src: 'http://attach.bbs.miui.com/forum/201504/10/223644v3intigyvva0vgym.jpg' },

{
  src: 'http://pic1.win4000.com/mobile/3/57888a298d61d.jpg' }];



var orderList = [{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg' },

  {
    image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg' }] },



{
  time: '2019-04-06 11:37',
  state: 9,
  goodsList: [{
    title: '古黛妃 短袖t恤女 春夏装2019新款韩版宽松',
    price: 179.5,
    image: 'https://img13.360buyimg.com/n8/jfs/t1/30343/20/1029/481370/5c449438Ecb46a15b/2b2adccb6dc742fd.jpg',
    number: 1,
    attr: '珊瑚粉 M' }] },


{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i2/2120460599/O1CN01LBPS4C1GINkwsOTXS_!!2120460599.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/i2/1069876356/TB2ocTQG4WYBuNjy1zkXXXGGpXa_!!1069876356.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i4/2120460599/O1CN01YsmgwZ1GINkv38rkn_!!2120460599.jpg_430x430q90.jpg' }] },



{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    title: '回力女鞋高帮帆布鞋女学生韩版鞋子女2019潮鞋女鞋新款春季板鞋女',
    price: 69,
    image: 'https://img.alicdn.com/imgextra/i3/2128794607/TB2gzzoc41YBuNjy1zcXXbNcXXa_!!2128794607.jpg_430x430q90.jpg',
    number: 1,
    attr: '白色-高帮 39' }] },


{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i4/3358098495/O1CN01dhYyid2Ccl5MWLDok_!!3358098495.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i3/3358098495/O1CN01AWsnFA2Ccl5OzvqsL_!!3358098495.jpg_430x430q90.jpg' }] },



{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://img.alicdn.com/imgextra/i4/3470687433/O1CN0124mMQOSERr18L1h_!!3470687433.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/i3/2888462616/O1CN01ERra5J1VCAbZaKI5n_!!0-item_pic.jpg_430x430q90.jpg' },

  {
    image: 'https://gd3.alicdn.com/imgextra/i3/819381730/O1CN01YV4mXj1OeNhQIhQlh_!!819381730.jpg_400x400.jpg' }] }];





var cateList = [{
  id: 1,
  name: '手机数码' },

{
  id: 2,
  name: '礼品鲜花' },

{
  id: 3,
  name: '男装女装' },

{
  id: 4,
  name: '母婴用品' },

{
  id: 5,
  pid: 1,
  name: '手机通讯' },

{
  id: 6,
  pid: 1,
  name: '运营商' },

{
  id: 8,
  pid: 5,
  name: '全面屏手机',
  picture: '/static/temp/cate2.jpg' },

{
  id: 9,
  pid: 5,
  name: '游戏手机',
  picture: '/static/temp/cate3.jpg' },

{
  id: 10,
  pid: 5,
  name: '老人机',
  picture: '/static/temp/cate1.jpg' },

{
  id: 11,
  pid: 5,
  name: '拍照手机',
  picture: '/static/temp/cate4.jpg' },

{
  id: 12,
  pid: 5,
  name: '女性手机',
  picture: '/static/temp/cate5.jpg' },

{
  id: 14,
  pid: 6,
  name: '合约机',
  picture: '/static/temp/cate1.jpg' },

{
  id: 15,
  pid: 6,
  name: '选好卡',
  picture: '/static/temp/cate4.jpg' },

{
  id: 16,
  pid: 6,
  name: '办套餐',
  picture: '/static/temp/cate5.jpg' },

{
  id: 17,
  pid: 2,
  name: '礼品' },

{
  id: 18,
  pid: 2,
  name: '鲜花' },

{
  id: 19,
  pid: 17,
  name: '公益摆件',
  picture: '/static/temp/cate7.jpg' },

{
  id: 20,
  pid: 17,
  name: '创意礼品',
  picture: '/static/temp/cate8.jpg' },

{
  id: 21,
  pid: 18,
  name: '鲜花',
  picture: '/static/temp/cate9.jpg' },

{
  id: 22,
  pid: 18,
  name: '每周一花',
  picture: '/static/temp/cate10.jpg' },

{
  id: 23,
  pid: 18,
  name: '卡通花束',
  picture: '/static/temp/cate11.jpg' },

{
  id: 24,
  pid: 18,
  name: '永生花',
  picture: '/static/temp/cate12.jpg' },

{
  id: 25,
  pid: 3,
  name: '男装' },

{
  id: 26,
  pid: 3,
  name: '女装' },

{
  id: 27,
  pid: 25,
  name: '男士T恤',
  picture: '/static/temp/cate13.jpg' },

{
  id: 28,
  pid: 25,
  name: '男士外套',
  picture: '/static/temp/cate14.jpg' },

{
  id: 29,
  pid: 26,
  name: '裙装',
  picture: '/static/temp/cate15.jpg' },

{
  id: 30,
  pid: 26,
  name: 'T恤',
  picture: '/static/temp/cate16.jpg' },

{
  id: 31,
  pid: 26,
  name: '上装',
  picture: '/static/temp/cate15.jpg' },

{
  id: 32,
  pid: 26,
  name: '下装',
  picture: '/static/temp/cate16.jpg' },

{
  id: 33,
  pid: 4,
  name: '奶粉' },

{
  id: 34,
  pid: 4,
  name: '营养辅食' },

{
  id: 35,
  pid: 4,
  name: '童装' },

{
  id: 39,
  pid: 4,
  name: '喂养用品' },

{
  id: 36,
  pid: 33,
  name: '有机奶粉',
  picture: '/static/temp/cate17.jpg' },

{
  id: 37,
  pid: 34,
  name: '果泥/果汁',
  picture: '/static/temp/cate18.jpg' },

{
  id: 39,
  pid: 34,
  name: '面条/粥',
  picture: '/static/temp/cate20.jpg' },

{
  id: 42,
  pid: 35,
  name: '婴童衣橱',
  picture: '/static/temp/cate19.jpg' },

{
  id: 43,
  pid: 39,
  name: '吸奶器',
  picture: '/static/temp/cate21.jpg' },

{
  id: 44,
  pid: 39,
  name: '儿童餐具',
  picture: '/static/temp/cate22.jpg' },

{
  id: 45,
  pid: 39,
  name: '牙胶安抚',
  picture: '/static/temp/cate23.jpg' },

{
  id: 46,
  pid: 39,
  name: '围兜',
  picture: '/static/temp/cate24.jpg' }];var _default =



{
  carouselList: carouselList,
  cartList: cartList,
  detailData: detailData,
  lazyLoadList: lazyLoadList,
  userInfo: userInfo,
  shareList: shareList,
  goodsList: goodsList,
  orderList: orderList,
  cateList: cateList };exports.default = _default;

/***/ }),

/***/ 18:
/*!*******************************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/node_modules/vue-baidu-map/index.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
!function (t, e) { true ? module.exports = e() : undefined;}(void 0, function () {return function (t) {function e(i) {if (n[i]) return n[i].exports;var o = n[i] = { i: i, l: !1, exports: {} };return t[i].call(o.exports, o, o.exports, e), o.l = !0, o.exports;}var n = {};return e.m = t, e.c = n, e.i = function (t) {return t;}, e.d = function (t, n, i) {e.o(t, n) || Object.defineProperty(t, n, { configurable: !1, enumerable: !0, get: i });}, e.n = function (t) {var n = t && t.__esModule ? function () {return t.default;} : function () {return t;};return e.d(n, "a", n), n;}, e.o = function (t, e) {return Object.prototype.hasOwnProperty.call(t, e);}, e.p = "", e(e.s = 42);}([function (t, e) {t.exports = function (t, e, n, i) {var o,a = t = t || {},r = typeof t.default;"object" !== r && "function" !== r || (o = t, a = t.default);var s = "function" == typeof a ? a.options : a;if (e && (s.render = e.render, s.staticRenderFns = e.staticRenderFns), n && (s._scopeId = n), i) {var l = s.computed || (s.computed = {});Object.keys(i).forEach(function (t) {var e = i[t];l[t] = function () {return e;};});}return { esModule: o, exports: a, options: s };};}, function (t, e, n) {var i, o, a;!function (n, r) {o = [t, e], i = r, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e) {"use strict";function n(t, e) {if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");}function i() {var t = this.unload,e = this.renderByParent,n = this.$parent;e && n.reload(), t();}Object.defineProperty(e, "__esModule", { value: !0 });var o = { control: { unload: "removeControl" }, layer: { unload: "removeTileLayer" }, overlay: { unload: "removeOverlay" }, contextMenu: { unload: "removeContextMenu" } },a = function t(e) {return e.abstract || e.$el === e.$children[0].$el ? t(e.$parent) : e;},r = function t(e) {n(this, t), this.methods = { ready: function ready() {var t = a(this.$parent),e = this.BMap = t.BMap,n = this.map = t.map;this.load(), this.$emit("ready", { BMap: e, map: n });}, transmitEvent: function transmitEvent(t) {this.$emit(t.type.replace(/^on/, ""), t);}, reload: function reload() {var t = this;this && this.BMap && this.$nextTick(function () {t.unload(), t.$nextTick(t.load);});}, unload: function unload() {var t = this.map,n = this.originInstance;try {switch (e.type) {case "search":return n.clearResults();case "autoComplete":case "lushu":return n.dispose();case "markerClusterer":return n.clearMarkers();default:t[o[e.type].unload](n);}} catch (t) {}} }, this.computed = { renderByParent: function renderByParent() {return this.$parent.preventChildrenRender;} }, this.mounted = function () {var t = a(this.$parent),e = t.map,n = this.ready;e ? n() : t.$on("ready", n);}, this.destroyed = i, this.beforeDestroy = i;};e.default = function (t) {return new r({ type: t });}, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (n, r) {o = [e], i = r, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t) {"use strict";function e(t) {var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},n = e.lng,i = e.lat;return new t.Point(n, i);}function n(t) {var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},n = e.x,i = e.y;return new t.Pixel(n, i);}function i(t) {var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},i = n.sw,o = n.ne;return new t.Bounds(e(t, i), e(t, o));}function o(t) {var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},n = e.width,i = e.height;return new t.Size(n, i);}function a(t) {var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},n = e.url,i = e.size,a = e.opts,r = void 0 === a ? {} : a;return new t.Icon(n, o(t, i), { anchor: r.anchor && o(t, r.anchor), imageSize: r.imageSize && o(t, r.imageSize), imageOffset: r.imageOffset && o(t, r.imageOffset), infoWindowAnchor: r.infoWindowAnchor && o(t, r.infoWindowAnchor), printImageUrl: r.printImageUrl });}function r(t) {var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},i = n.content,a = n.opts;return new t.Label(i, { offset: a.offset && o(t, a.offset), position: a.position && e(t, a.position), enableMassClear: a.enableMassClear });}Object.defineProperty(t, "__esModule", { value: !0 }), t.createPoint = e, t.createPixel = n, t.createBounds = i, t.createSize = o, t.createIcon = a, t.createLabel = r;});}, function (t, e) {var n;n = function () {return this;}();try {n = n || Function("return this")() || (0, eval)("this");} catch (t) {"object" == typeof window && (n = window);}t.exports = n;}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(41)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 }), e.default = function (t, e) {var n = this,o = e || i.default[this.$options.name];o && o.forEach(function (e) {var i = "on" === e.slice(0, 2),o = i ? e.slice(2) : e,a = n.$listeners[o];a && t.addEventListener(e, a.fns);});};var i = function (t) {return t && t.__esModule ? t : { default: t };}(n);t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [e, n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 }), t.getPosition = t.checkType = t.isPoint = void 0;var n = t.isPoint = function (t) {return t.lng && t.lat;};t.checkType = function (t) {return Object.prototype.toString.call(t).slice(8, -1);}, t.getPosition = function (t, i) {return n(i) ? (0, e.createPoint)(t, i) : i;};});}, function (t, e, n) {var i = n(0)(n(71), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(43), n(89), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(44), n(87), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(45), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(46), n(94), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(47), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(48), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(49), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(50), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(51), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(52), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(53), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(54), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(55), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(56), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(57), n(90), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(58), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(59), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(60), n(97), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(61), n(82), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(62), n(95), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(63), n(86), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(64), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(65), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(66), n(83), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(67), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(68), n(96), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(69), n(84), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(70), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(72), null, null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(73), n(91), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(74), n(85), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(75), n(93), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(76), n(92), null, null);t.exports = i.exports;}, function (t, e, n) {var i = n(0)(n(77), n(88), null, null);t.exports = i.exports;}, function (t, e, n) {var i, o, a;!function (n, r) {o = [t, e], i = r, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { "bm-map": ["click", "dblclick", "rightclick", "rightdblclick", "maptypechange", "mousemove", "mouseover", "mouseout", "movestart", "moving", "moveend", "zoomstart", "zoomend", "addoverlay", "addcontrol", "removecontrol", "removeoverlay", "clearoverlays", "dragstart", "dragging", "dragend", "addtilelayer", "removetilelayer", "load", "resize", "hotspotclick", "hotspotover", "hotspotout", "tilesloaded", "touchstart", "touchmove", "touchend", "longpress"], "bm-geolocation": ["locationSuccess", "locationError"], "bm-overview-map": ["viewchanged", "viewchanging"], "bm-marker": ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "infowindowclose", "infowindowopen", "dragstart", "dragging", "dragend", "rightclick"], "bm-polyline": ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "lineupdate"], "bm-polygon": ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "lineupdate"], "bm-circle": ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "lineupdate"], "bm-label": ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "rightclick"], "bm-info-window": ["close", "open", "maximize", "restore", "clickclose"], "bm-ground": ["click", "dblclick"], "bm-autocomplete": ["onconfirm", "onhighlight"], "bm-point-collection": ["click", "mouseover", "mouseout"] }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [e, n(24), n(25), n(17), n(14), n(13), n(15), n(12), n(11), n(9), n(16), n(10), n(32), n(34), n(35), n(6), n(28), n(29), n(31), n(30), n(33), n(8), n(7), n(38), n(39), n(40), n(37), n(36), n(22), n(23), n(27), n(26), n(21), n(20), n(19), n(18)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o, a, r, s, l, c, u, h, p, d, f, m, g, y, v, _, b, x, w, M, C, k, I, S, B, P, O, E, T, z, j, L) {"use strict";function R(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(t, "__esModule", { value: !0 }), t.BmlCurveLine = t.BmlHeatmap = t.BmlLushu = t.BmlMarkerClusterer = t.BmAutoComplete = t.BmBoundary = t.BmTraffic = t.BmTile = t.BmBus = t.BmDriving = t.BmWalking = t.BmTransit = t.BmLocalSearch = t.BmContextMenuItem = t.BmContextMenu = t.BmOverlay = t.BmInfoWindow = t.BmLabel = t.BmGround = t.BmCircle = t.BmPolygon = t.BmPolyline = t.BmPointCollection = t.BmMarker = t.BmControl = t.BmPanorama = t.BmCityList = t.BmCopyright = t.BmGeolocation = t.BmOverviewMap = t.BmMapType = t.BmNavigation = t.BmScale = t.BmView = t.BaiduMap = void 0;var A = R(e),$ = R(n),F = R(i),W = R(o),N = R(a),D = R(r),Z = R(s),V = R(l),H = R(c),G = R(u),U = R(h),J = R(p),K = R(d),X = R(f),q = R(m),Q = R(g),Y = R(y),tt = R(v),et = R(_),nt = R(b),it = R(x),ot = R(w),at = R(M),rt = R(C),st = R(k),lt = R(I),ct = R(S),ut = R(B),ht = R(P),pt = R(O),dt = R(E),ft = R(T),mt = R(z),gt = R(j),yt = R(L);t.default = { install: function install(t, e) {var n = e.ak;t.prototype._BMap = function () {return { ak: n };}, t.component("baidu-map", A.default), t.component("bm-view", $.default), t.component("bm-scale", F.default), t.component("bm-navigation", W.default), t.component("bm-map-type", N.default), t.component("bm-overview-map", D.default), t.component("bm-geolocation", Z.default), t.component("bm-copyright", V.default), t.component("bm-city-list", H.default), t.component("bm-panorama", G.default), t.component("bm-control", U.default), t.component("bm-marker", J.default), t.component("bm-point-collection", K.default), t.component("bm-polyline", X.default), t.component("bm-polygon", q.default), t.component("bm-circle", Q.default), t.component("bm-ground", Y.default), t.component("bm-label", tt.default), t.component("bm-info-window", et.default), t.component("bm-overlay", nt.default), t.component("bm-context-menu", it.default), t.component("bm-context-menu-item", ot.default), t.component("bm-local-search", at.default), t.component("bm-transit", rt.default), t.component("bm-walking", st.default), t.component("bm-driving", lt.default), t.component("bm-bus", ct.default), t.component("bm-tile", ut.default), t.component("bm-traffic", ht.default), t.component("bm-auto-complete", dt.default), t.component("bm-boundary", pt.default);} }, t.BaiduMap = A.default, t.BmView = $.default, t.BmScale = F.default, t.BmNavigation = W.default, t.BmMapType = N.default, t.BmOverviewMap = D.default, t.BmGeolocation = Z.default, t.BmCopyright = V.default, t.BmCityList = H.default, t.BmPanorama = G.default, t.BmControl = U.default, t.BmMarker = J.default, t.BmPointCollection = K.default, t.BmPolyline = X.default, t.BmPolygon = q.default, t.BmCircle = Q.default, t.BmGround = Y.default, t.BmLabel = tt.default, t.BmInfoWindow = et.default, t.BmOverlay = nt.default, t.BmContextMenu = it.default, t.BmContextMenuItem = ot.default, t.BmLocalSearch = at.default, t.BmTransit = rt.default, t.BmWalking = st.default, t.BmDriving = lt.default, t.BmBus = ct.default, t.BmTile = ut.default, t.BmTraffic = ht.default, t.BmBoundary = pt.default, t.BmAutoComplete = dt.default, t.BmlMarkerClusterer = ft.default, t.BmlLushu = mt.default, t.BmlHeatmap = gt.default, t.BmlCurveLine = yt.default;});}, function (t, e, n) {var i, o, a;!function (n, r) {o = [t, e], i = r, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "bm-context-menu-item", props: { callback: { type: Function, default: function _default() {} }, text: { type: String }, iconUrl: { type: String }, id: { type: String }, disabled: { type: Boolean }, seperator: { type: Boolean } }, methods: { reload: function reload() {this.$parent.map && this.$parent.load();} }, watch: { text: function text() {this.reload();}, iconUrl: function iconUrl() {this.reload();}, id: function id() {this.reload();}, disabled: function disabled() {this.reload();}, iseperator: function iseperator() {this.reload();}, callback: function callback() {this.reload();} }, destroyed: function destroyed() {this.reload();}, mounted: function mounted() {this.reload();} }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var i = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-context-menu", props: { width: { type: Number } }, mixins: [(0, i.default)("contextMenu")], methods: { load: function load() {var t = this.width,e = this.BMap,n = this.map,i = this.$parent,o = this.parent = i.originInstance || n;this.originInstance && o.removeContextMenu(this.originInstance);var a = this.originInstance = new e.ContextMenu(),r = !0,s = !1,l = void 0;try {for (var c, u = this.$children[Symbol.iterator](); !(r = (c = u.next()).done); r = !0) {(function () {var i = c.value;if (i.seperator) return a.addSeparator(), "continue";var r = new e.MenuItem(i.text, function (t, a) {i.callback({ point: t, pixel: a, BMap: e, map: n, target: o });}, { width: t, id: i.id, iconUrl: i.iconUrl });i.disabled ? r.disable() : r.enable(), i.originInstance = r, a.addItem(r);})();}} catch (t) {s = !0, l = t;} finally {try {!r && u.return && u.return();} finally {if (s) throw l;}}o.addContextMenu(a);} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-city-list", render: function render() {}, mixins: [(0, a.default)("control")], props: { anchor: { type: String }, offset: { type: Object } }, watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,a = this.offset,r = this;this.originInstance = new t.CityListControl({ anchor: i[n], offset: a && (0, o.createSize)(t, a), onChangeBefore: function onChangeBefore() {r.$emit("changeBefore");}, onChangeAfter: function onChangeAfter() {r.$emit("changeAfter");} }), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-control", mixins: [(0, a.default)("control")], props: ["anchor", "offset"], watch: { anchor: function anchor(t) {this.originInstance.setAnchor(t);}, offset: function offset(t) {this.originInstance.setOffset(t);} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,a = this.offset,r = this.$el,s = function s() {this.defaultAnchor = i[n || "BMAP_ANCHOR_TOP_LEFT"], this.defaultOffset = (0, o.createSize)(t, a);};s.prototype = new t.Control(), s.prototype.initialize = function (t) {return t.getContainer().appendChild(r);}, this.originInstance = new s(n, a), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-copyright", render: function render() {}, mixins: [(0, a.default)("control")], props: ["anchor", "offset", "copyright"], watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();}, copyright: function copyright() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.offset,a = this.anchor,r = this.updateCopyrightList;this.originInstance = new t.CopyrightControl({ anchor: i[a], offset: n && (0, o.createSize)(t, n) }), r(), e.addControl(this.originInstance);}, updateCopyrightList: function updateCopyrightList() {var t = this,e = this.BMap,n = this.map,i = this.originInstance,o = i.removeCopyright,a = i.getCopyrightCollection,r = a();r && r.forEach(function (t) {o(t.id);}), this.copyright && this.copyright.forEach(function (i) {var o = i.bounds ? new e.Bounds(new e.Point(i.bounds.sw.lng, i.bounds.sw.lat), new e.Point(i.bounds.ne.lng, i.bounds.ne.lat)) : n.getBounds();t.originInstance.addCopyright({ id: i.id, content: i.content, bounds: o }), t.originInstance.getCopyrightCollection();});} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";function r(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var s = r(n),l = r(o);e.default = { name: "bm-geolocation", render: function render() {}, mixins: [(0, s.default)("control")], props: { anchor: { type: String }, offset: { type: Object }, showAddressBar: { type: Boolean }, autoLocation: { type: Boolean }, locationIcon: { type: Object } }, watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();}, showAddressBar: function showAddressBar() {this.reload();}, autoLocation: function autoLocation() {this.reload();}, locationIcon: function locationIcon() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,o = this.showAddressBar,r = this.autoLocation,s = this.locationIcon,c = this.offset;this.originInstance = new t.GeolocationControl({ anchor: i[n], showAddressBar: o, enableAutoLocation: r, offset: c && (0, a.createSize)(t, c), locationIcon: s && (0, a.createIcon)(t, s) }), l.default.call(this, this.originInstance), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-map-type", render: function render() {}, mixins: [(0, a.default)("control")], props: ["type", "mapTypes", "anchor", "offset"], watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();}, type: function type() {this.reload();}, mapTypes: function mapTypes() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,a = this.offset,r = this.type,s = [];this.mapTypes && this.mapTypes.forEach(function (t) {return s.push(i[t]);}), this.originInstance = new t.MapTypeControl({ anchor: i[n], offset: a && (0, o.createSize)(t, a), type: i[r], mapTypes: s }), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-navigation", render: function render() {}, mixins: [(0, a.default)("control")], props: { anchor: { type: String }, offset: { type: Object }, type: { type: String }, showZoomInfo: { type: Boolean }, enableGeolocation: { type: Boolean, default: !1 } }, watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();}, type: function type() {this.reload();}, showZoomInfo: function showZoomInfo() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,a = this.offset,r = this.type,s = this.showZoomInfo,l = this.enableGeolocation;this.originInstance = new t.NavigationControl({ anchor: i[n], offset: a && (0, o.createSize)(t, a), type: i[r], showZoomInfo: s, enableGeolocation: l }), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(2), n(1), n(4)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";function r(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var s = r(o),l = r(a);e.default = { name: "bm-overview-map", mixins: [(0, s.default)("control")], render: function render() {}, props: { anchor: { type: String }, offset: { type: Object }, size: { type: Object }, isOpen: { type: Boolean } }, watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();}, size: function size() {this.reload();}, isOpen: function isOpen() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,o = this.isOpen,a = this.size,r = this.offset,s = this.anchor,c = [];this.mapTypes && this.mapTypes.forEach(function (t) {c.push(i[t]);}), this.originInstance = new t.OverviewMapControl({ anchor: i[s], offset: (0, n.createSize)(t, r), size: (0, n.createSize)(t, a), isOpen: o }), l.default.call(this, this.originInstance), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-panorama", mixins: [(0, a.default)("control")], render: function render() {}, props: ["anchor", "offset"], watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,a = this.offset;this.originInstance = new t.PanoramaControl({ anchor: i[n], offset: a && (0, o.createSize)(t, a) }), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-scale", render: function render() {}, mixins: [(0, a.default)("control")], props: { anchor: { type: String }, offset: { type: Object } }, watch: { anchor: function anchor() {this.reload();}, offset: function offset() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.anchor,a = this.offset;this.originInstance = new t.ScaleControl({ anchor: i[n], offset: a && (0, o.createSize)(t, a) }), e.addControl(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(78), n(1), n(4), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o, a) {"use strict";function r(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var s = r(n),l = r(i),c = r(o),u = ["click", "dblclick", "mousedown", "mouseup", "mouseout", "mouseover", "remove", "lineupdate"];e.default = { name: "bml-curve-line", render: function render() {}, mixins: [(0, l.default)("overlay")], props: { points: { type: Array, default: Array }, strokeColor: { type: String }, strokeWeight: { type: Number }, strokeOpacity: { type: Number }, strokeStyle: { type: String }, massClear: { type: Boolean, default: !0 }, clicking: { type: Boolean, default: !0 }, editing: { type: Boolean, default: !1 } }, watch: { points: { handler: function handler(t, e) {this.originInstance.disableEditing(), this.reload();}, deep: !0 }, strokeColor: function strokeColor(t) {this.originInstance.setStrokeColor(t);}, strokeOpacity: function strokeOpacity(t) {this.originInstance.setStrokeOpacity(t);}, strokeWeight: function strokeWeight(t) {this.originInstance.setStrokeWeight(t);}, strokeStyle: function strokeStyle(t) {this.originInstance.setStrokeStyle(t);}, editing: function editing(t) {t ? this.originInstance.enableEditing() : this.originInstance.disableEditing();}, massClear: function massClear(t) {t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();}, clicking: function clicking(t) {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.points,i = this.strokeColor,o = this.strokeWeight,r = this.strokeOpacity,l = this.strokeStyle,h = this.editing,p = this.massClear,d = this.clicking,f = new s.default(n.map(function (e) {return (0, a.createPoint)(t, e);}), { strokeColor: i, strokeWeight: o, strokeOpacity: r, strokeStyle: l, enableMassClear: p, enableClicking: d });h ? f.enableEditing() : f.disableEditing(), this.originInstance = f, e.addOverlay(f), c.default.call(this, f, u);} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(79)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i) {"use strict";function o(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var a = o(n),r = o(i);e.default = { name: "bml-heatmap", render: function render() {}, mixins: [(0, a.default)("overlay")], props: { data: { type: Array, default: Array }, max: { type: Number }, radius: { type: Number }, gradient: { type: Object }, opacity: { type: Number } }, watch: { data: { handler: function handler() {this.reload();}, deep: !0 }, max: function max() {this.reload();}, radius: function radius(t) {var e = this.originInstance,n = this.opacity,i = this.gradient;e.setOptions({ radius: t, opacity: n, gradient: i });}, gradient: { handler: function handler(t) {var e = this.originInstance,n = this.radius,i = this.opacity;e.setOptions({ radius: n, opacity: i, gradient: t });}, deep: !0 }, opacity: function opacity(t) {var e = this.originInstance,n = this.radius,i = this.gradient;e.setOptions({ radius: n, opacity: t, gradient: i });} }, methods: { load: function load() {var t = this.map,e = this.data,n = this.max,i = this.radius,o = this.opacity,a = this.gradient,s = this.originInstance = new r.default({ radius: i, opacity: o, gradient: a });t.addOverlay(s), s.setDataSet({ data: e, max: n });} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(2), n(80)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(o);e.default = { name: "bm-lushu", render: function render(t) {}, mixins: [(0, r.default)("lushu")], props: { path: { type: Array, default: [] }, landmarkPois: { type: Array, default: function _default() {return [];} }, icon: { type: Object }, speed: { type: Number, default: 4e3 }, content: { type: String, default: "" }, autoView: { type: Boolean, default: !1 }, rotation: { type: Boolean, default: !1 }, infoWindow: { type: Boolean, default: !0 }, play: { type: Boolean, default: !0 } }, watch: { path: { handler: function handler(t) {this.reload();}, deep: !0 }, landmarkPois: { handler: function handler(t) {this.reload();}, deep: !0 }, icon: { handler: function handler(t) {var e = this.originInstance,n = (this.content, (0, i.createIcon)(BMap, t));e._opts.icon = n, e._marker = n;}, deep: !0 }, speed: function speed(t) {var e = this.originInstance;this.content;e._opts.speed = t;}, content: function content(t) {var e = this.originInstance,n = this.infoWindow;t && n ? e.showInfoWindow() : e.hideInfoWindow(), e._opts.defaultContent = t, e._overlay && e._overlay.setHtml(t);}, autoView: function autoView(t) {var e = this.originInstance;this.content;e._opts.autoView = t;}, rotation: function rotation(t) {var e = this.originInstance;this.content;e._opts.enableRotation = t;}, infoWindow: function infoWindow(t) {var e = this.originInstance,n = this.content;e && t && n ? e.showInfoWindow() : e.hideInfoWindow();}, play: function play(t) {var e = this.originInstance;t && e ? e.start() : !this._isEnd && e.pause();} }, methods: { load: function load() {var t = this,e = this.BMap,n = this.map,o = this.path,a = this.landmarkPois,r = this.icon,l = this.speed,c = this.content,u = this.autoView,h = this.rotation,p = this.infoWindow,d = this.play,f = this.originInstance = new s.default(n, o, { enableRotation: h, landmarkPois: a, showInfoWindow: p, defaultContent: c, icon: r && (0, i.createIcon)(e, r), speed: l, autoView: u, onstart: function onstart(e) {t._isEnd = !1, t.$emit("start");}, onstop: function onstop(e) {t._isEnd = !0, t.$emit("stop");}, onpause: function onpause(e) {return t.$emit("pause");} });d && o.length && f.start(this), o.length && (c && p ? f.showInfoWindow() : f.hideInfoWindow());} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(81), n(2), n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(o);e.default = { name: "bml-marker-clusterer", mixins: [(0, s.default)("markerClusterer")], props: { gridSize: { type: Object }, maxZoom: { type: Number }, minClusterSize: { type: Number }, styles: { type: Array, default: function _default() {return [];} }, averageCenter: { type: Boolean, default: !1 } }, watch: { gridSize: { handler: function handler(t) {var e = this.BMap;this.originInstance.setGridSize(e, t.map);}, deep: !0 }, maxZoom: function maxZoom(t) {this.originInstance.setMaxZoom(t);}, minClusterSize: { handler: function handler(t) {var e = this.BMap;this.originInstance.setMinClusterSize((0, i.createSize)(e, t));}, deep: !0 }, styles: { handler: function handler(t) {var e = this.BMap,n = this.originInstance,o = JSON.parse(JSON.stringify(t)).map(function (t) {return t.size = t.size && (0, i.createSize)(e, t.size), t;});n.setStyles(o);}, deep: !0 }, averageCenter: function averageCenter(t) {this.reload();} }, methods: { load: function load() {var t = this,e = this.BMap,n = this.map,o = this.gridSize,a = this.minClusterSize,s = this.maxZoom,l = this.styles,c = this.averageCenter;this.originInstance = new r.default(n, { gridSize: o && (0, i.createSize)(e, o), maxZoom: s, minClusterSize: a && (0, i.createSize)(e, a), styles: l.map(function (t) {return t.size = (0, i.createSize)(e, t.size), t;}), isAverageCenter: c }), this.$nextTick(function () {var n = t.$children.map(function (t) {return t.originInstance;}).filter(function (t) {return t instanceof e.Marker;});t.originInstance.addMarkers(n);});} }, beforeCreate: function beforeCreate() {this.preventChildrenRender = !0;} }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var o = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-tile", render: function render(t) {}, mixins: [(0, o.default)("layer")], props: { transparentPng: { type: Boolean }, tileUrlTemplate: { type: String }, copyright: {}, zIndex: { type: Number } }, watch: { transparentPng: function transparentPng() {this.reload();}, tileUrlTemplate: function tileUrlTemplate() {this.reload();}, copyright: function copyright() {this.reload();}, zIndex: function zIndex() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.transparentPng,o = this.tileUrlTemplate,a = this.copyright,r = this.zIndex;this.originInstance = new t.TileLayer({ transparentPng: n, tileUrlTemplate: o, copyright: a && { id: a.id, content: a.content, bounds: a.bounds && (0, i.createBounds)(a.bounds) }, zIndex: r }), e.addTileLayer(this.originInstance);} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var i = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-triffic", render: function render(t) {}, mixins: [(0, i.default)("layer")], props: { predictDate: { type: Object } }, watch: { "pridictDate.weekday": function pridictDateWeekday() {this.reload();}, "pridictDate.hour": function pridictDateHour() {this.reload();}, pridictDate: function pridictDate() {this.reload();} }, methods: { load: function load() {var t = this.pridictDate,e = this.BMap,n = this.map;this.originInstance = new e.TrafficLayer({ pridictDate: t }), n.addTileLayer(this.originInstance);} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(4), n(5)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(n);e.default = { name: "bm-map", props: { ak: { type: String }, center: { type: [Object, String] }, zoom: { type: Number }, minZoom: { type: Number }, maxZoom: { type: Number }, highResolution: { type: Boolean, default: !0 }, mapClick: { type: Boolean, default: !0 }, mapType: { type: String }, dragging: { type: Boolean, default: !0 }, scrollWheelZoom: { type: Boolean, default: !1 }, doubleClickZoom: { type: Boolean, default: !0 }, keyboard: { type: Boolean, default: !0 }, inertialDragging: { type: Boolean, default: !0 }, continuousZoom: { type: Boolean, default: !0 }, pinchToZoom: { type: Boolean, default: !0 }, autoResize: { type: Boolean, default: !0 }, theme: { type: Array }, mapStyle: { type: Object } }, watch: { center: function center(t, e) {var n = this.map,i = this.zoom;"String" === (0, o.checkType)(t) && t !== e && n.centerAndZoom(t, i);}, "center.lng": function centerLng(t, e) {var n = this.BMap,i = this.map,o = this.zoom,a = this.center;t !== e && t >= -180 && t <= 180 && i.centerAndZoom(new n.Point(t, a.lat), o);}, "center.lat": function centerLat(t, e) {var n = this.BMap,i = this.map,o = this.zoom,a = this.center;t !== e && t >= -74 && t <= 74 && i.centerAndZoom(new n.Point(a.lng, t), o);}, zoom: function zoom(t, e) {var n = this.map;t !== e && t >= 3 && t <= 19 && n.setZoom(t);}, minZoom: function minZoom(t) {this.map.setMinZoom(t);}, maxZoom: function maxZoom(t) {this.map.setMaxZoom(t);}, highResolution: function highResolution() {this.reset();}, mapClick: function mapClick() {this.reset();}, mapType: function mapType(t) {this.map.setMapType(i[t]);}, dragging: function dragging(t) {var e = this.map;t ? e.enableDragging() : e.disableDragging();}, scrollWheelZoom: function scrollWheelZoom(t) {var e = this.map;t ? e.enableScrollWheelZoom() : e.disableScrollWheelZoom();}, doubleClickZoom: function doubleClickZoom(t) {var e = this.map;t ? e.enableDoubleClickZoom() : e.disableDoubleClickZoom();}, keyboard: function keyboard(t) {var e = this.map;t ? e.enableKeyboard() : e.disableKeyboard();}, inertialDragging: function inertialDragging(t) {var e = this.map;t ? e.enableInertialDragging() : e.disableInertialDragging();}, continuousZoom: function continuousZoom(t) {var e = this.map;t ? e.enableContinuousZoom() : e.disableContinuousZoom();}, pinchToZoom: function pinchToZoom(t) {var e = this.map;t ? e.enablePinchToZoom() : e.disablePinchToZoom();}, autoResize: function autoResize(t) {var e = this.map;t ? e.enableAutoResize() : e.disableAutoResize();}, theme: function theme(t) {this.map.setMapStyle({ styleJson: t });}, "mapStyle.features": { handler: function handler(t, e) {var n = this.map,i = this.mapStyle,o = i.style,a = i.styleJson;n.setMapStyle({ styleJson: a, features: t, style: o });}, deep: !0 }, "mapStyle.style": function mapStyleStyle(t, e) {var n = this.map,i = this.mapStyle,o = i.features,a = i.styleJson;n.setMapStyle({ styleJson: a, features: o, style: t });}, "mapStyle.styleJson": { handler: function handler(t, e) {var n = this.map,i = this.mapStyle,o = i.features,a = i.style;n.setMapStyle({ styleJson: t, features: o, style: a });}, deep: !0 }, mapStyle: function mapStyle(t) {var e = this.map;!this.theme && e.setMapStyle(t);} }, methods: { setMapOptions: function setMapOptions() {var t = this.map,e = this.minZoom,n = this.maxZoom,o = this.mapType,a = this.dragging,r = this.scrollWheelZoom,s = this.doubleClickZoom,l = this.keyboard,c = this.inertialDragging,u = this.continuousZoom,h = this.pinchToZoom,p = this.autoResize;e && t.setMinZoom(e), n && t.setMaxZoom(n), o && t.setMapType(i[o]), a ? t.enableDragging() : t.disableDragging(), r ? t.enableScrollWheelZoom() : t.disableScrollWheelZoom(), s ? t.enableDoubleClickZoom() : t.disableDoubleClickZoom(), l ? t.enableKeyboard() : t.disableKeyboard(), c ? t.enableInertialDragging() : t.disableInertialDragging(), u ? t.enableContinuousZoom() : t.disableContinuousZoom(), h ? t.enablePinchToZoom() : t.disablePinchToZoom(), p ? t.enableAutoResize() : t.disableAutoResize();}, init: function init(t) {if (!this.map) {var e = this.$refs.view,n = !0,i = !1,o = void 0;try {for (var r, s = (this.$slots.default || [])[Symbol.iterator](); !(n = (r = s.next()).done); n = !0) {var l = r.value;l.componentOptions && "bm-view" === l.componentOptions.tag && (this.hasBmView = !0, e = l.elm);}} catch (t) {i = !0, o = t;} finally {try {!n && s.return && s.return();} finally {if (i) throw o;}}var c = new t.Map(e, { enableHighResolution: this.highResolution, enableMapClick: this.mapClick });this.map = c;var u = this.setMapOptions,h = this.zoom,p = this.getCenterPoint,d = this.theme,f = this.mapStyle;d ? c.setMapStyle({ styleJson: d }) : c.setMapStyle(f), u(), a.default.call(this, c), c.reset(), c.centerAndZoom(p(), h), this.$emit("ready", { BMap: t, map: c });}}, getCenterPoint: function getCenterPoint() {var t = this.center,e = this.BMap;switch ((0, o.checkType)(t)) {case "String":return t;case "Object":return new e.Point(t.lng, t.lat);default:return new e.Point();}}, initMap: function initMap(t) {this.BMap = t, this.init(t);}, getMapScript: function getMapScript() {if (i.BMap) return i.BMap._preloader ? i.BMap._preloader : Promise.resolve(i.BMap);var t = this.ak || this._BMap().ak;return i.BMap = {}, i.BMap._preloader = new Promise(function (e, n) {i._initBaiduMap = function () {e(i.BMap), i.document.body.removeChild(o), i.BMap._preloader = null, i._initBaiduMap = null;};var o = document.createElement("script");i.document.body.appendChild(o), o.src = "https://api.map.baidu.com/api?v=2.0&ak=" + t + "&callback=_initBaiduMap";}), i.BMap._preloader;}, reset: function reset() {var t = this.getMapScript,e = this.initMap;t().then(e);} }, mounted: function mounted() {this.reset();}, data: function data() {return { hasBmView: !1 };} }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (n, r) {o = [t, e], i = r, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "bm-view" }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(4)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i) {"use strict";function o(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var a = o(n),r = o(i);e.default = { name: "bm-autocomplete", mixins: [(0, a.default)()], props: { types: { type: String }, location: { type: String }, sugStyle: { type: Object, default: function _default() {return {};} } }, watch: { types: function types() {this.reload();}, location: function location() {this.reload();} }, methods: { load: function load() {var t = this,e = this.BMap,n = this.map,i = this.$el,o = this.types,a = this.location,s = this.sugStyle,l = i.querySelector("input");l && (this.originInstance = new e.Autocomplete({ input: l, types: o, location: a || n, onSearchComplete: function onSearchComplete(e) {var n = document.querySelectorAll(".tangram-suggestion-main"),i = !0,o = !1,a = void 0;try {for (var r, l = n[Symbol.iterator](); !(i = (r = l.next()).done); i = !0) {var c = r.value;for (var u in s) {c.style[u] = s[u].toString();}}} catch (t) {o = !0, a = t;} finally {try {!i && l.return && l.return();} finally {if (o) throw a;}}t.$emit("searchcomplete", e);} }), this.originInstance.addEventListener("onconfirm", function (e) {var n = e.item.value;t.$emit("input", n.province + n.city + n.district + n.street + n.business);}), r.default.call(this, this.originInstance));} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(6), n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i) {"use strict";function o(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var a = o(n),r = o(i),s = function () {function t(t, e) {var n = [],i = !0,o = !1,a = void 0;try {for (var r, s = t[Symbol.iterator](); !(i = (r = s.next()).done) && (n.push(r.value), !e || n.length !== e); i = !0) {;}} catch (t) {o = !0, a = t;} finally {try {!i && s.return && s.return();} finally {if (o) throw a;}}return n;}return function (e, n) {if (Array.isArray(e)) return e;if (Symbol.iterator in Object(e)) return t(e, n);throw new TypeError("Invalid attempt to destructure non-iterable instance");};}();e.default = { mixins: [(0, r.default)("abstract")], props: ["name", "strokeColor", "strokeWeight", "strokeOpacity", "strokeStyle", "fillColor", "fillOpacity", "massClear", "clicking"], data: function data() {return { paths: [] };}, components: { BmPolygon: a.default }, watch: { name: function name() {this.reload();} }, methods: { load: function load() {var t = this,e = this.BMap,n = this.name;new e.Boundary().get(n, function (e) {t.paths = e.boundaries.map(function (t) {return (t || []).split(";").map(function (t) {return function (t) {var e = s(t, 2);return { lng: e[0], lat: e[1] };}(t.split(",").map(function (t) {return +t;}));});});});} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(i);e.default = { name: "bm-circle", render: function render() {}, mixins: [(0, r.default)("overlay")], props: { center: {}, radius: {}, strokeColor: { type: String }, strokeWeight: { type: Number }, strokeOpacity: { type: Number }, strokeStyle: { type: String }, fillColor: { type: String }, fillOpacity: { type: Number }, massClear: { type: Boolean, default: !0 }, clicking: { type: Boolean, default: !0 }, editing: { type: Boolean, default: !1 } }, watch: { "center.lng": function centerLng(t, e) {var n = this.BMap,i = this.originInstance,a = this.isEditing,r = this.disableEditing,s = this.enableEditing,l = this.center,c = this.editing;if (!a) {r();var u = t;t.toString() !== e.toString() && u >= -180 && u <= 180 && i.setCenter((0, o.createPoint)(n, { lng: u, lat: l.lat })), c && s();}}, "center.lat": function centerLat(t, e) {var n = this.BMap,i = this.originInstance,a = this.isEditing,r = this.disableEditing,s = this.enableEditing,l = this.center,c = this.editing;if (!a) {r();var u = t;t.toString() !== e.toString() && u >= -74 && u <= 74 && i.setCenter((0, o.createPoint)(n, { lng: l.lng, lat: u })), c && s();}}, radius: function radius(t, e) {var n = this.originInstance,i = this.isEditing,o = this.disableEditing,a = this.enableEditing,r = this.editing;i || (o(), n.setRadius(t), r && a());}, strokeColor: function strokeColor(t) {this.originInstance.setStrokeColor(t);}, strokeOpacity: function strokeOpacity(t) {this.originInstance.setStrokeOpacity(t);}, strokeWeight: function strokeWeight(t) {this.originInstance.setStrokeWeight(t);}, strokeStyle: function strokeStyle(t) {this.originInstance.setStrokeStyle(t);}, fillColor: function fillColor(t) {this.originInstance.setFillColor(t);}, fillOpacity: function fillOpacity(t) {this.originInstance.setFillOpacity(t);}, editing: function editing(t) {t ? this.enableEditing() : this.disableEditing();}, massClear: function massClear(t) {t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();}, clicking: function clicking(t) {this.reload();} }, methods: { dragStartHandler: function dragStartHandler() {this.isEditing = !0;}, dragEndHandler: function dragEndHandler() {this.isEditing = !1, this.bindEditingNodeEvents();}, bindEditingNodeEvents: function bindEditingNodeEvents() {var t = this.originInstance,e = this.editingKey,n = this.dragStartHandler,i = this.dragEndHandler;t[e].forEach(function (t) {t.addEventListener("dragstart", n), t.addEventListener("dragend", i);});}, enableEditing: function enableEditing() {var t = this.originInstance,e = this.bindEditingNodeEvents;t.enableEditing(), e();}, disableEditing: function disableEditing() {this.originInstance.disableEditing();}, getEditingKey: function getEditingKey(t) {var e = this,n = [];t.enableEditing(), setTimeout(function () {for (var i in t) {t[i] && 2 === t[i].length && n.push(i);}t.disableEditing();for (var o in t) {t[o] && 0 === t[o].length && ~n.indexOf(o) && (e.editingKey = o);}}, 0);}, load: function load() {var t = this.BMap,e = this.map,n = this.center,i = this.radius,a = this.strokeColor,r = this.strokeWeight,l = this.strokeOpacity,c = this.strokeStyle,u = this.fillColor,h = this.fillOpacity,p = this.editing,d = this.massClear,f = this.clicking,m = this.enableEditing,g = this.disableEditing,y = this.getEditingKey,v = this.editingKey,_ = new t.Circle((0, o.createPoint)(t, { lng: n.lng, lat: n.lat }), i, { strokeColor: a, strokeWeight: r, strokeOpacity: l, strokeStyle: c, fillColor: u, fillOpacity: h, enableMassClear: d, enableClicking: f });this.originInstance = _, e.addOverlay(_), s.default.call(this, _), !v && y(_), setTimeout(function () {p ? m() : g();}, 0);} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(i);e.default = { name: "bm-ground", render: function render() {}, mixins: [(0, r.default)("overlay")], props: { bounds: { type: Object }, opacity: { type: Number }, imageURL: { type: String }, displayOnMinLevel: { type: Number }, displayOnMaxLevel: { type: Number } }, watch: { bounds: { handler: function handler(t) {var e = this.BMap;this.originInstance.setBounds((0, o.createBounds)(e, t));}, deep: !0 }, opacity: function opacity(t) {this.originInstance.setOpacity(t);}, imageURL: function imageURL(t) {this.originInstance.setImageURL(t);}, displayOnMinLevel: function displayOnMinLevel(t) {this.originInstance.setDisplayOnMinLevel(t);}, displayOnMaxLevel: function displayOnMaxLevel(t) {this.originInstance.setDisplayOnMaxLevel(t);} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.bounds,i = this.opacity,a = this.imageURL,r = this.displayOnMinLevel,l = this.displayOnMaxLevel,c = new t.GroundOverlay(n && (0, o.createBounds)(t, n), { opacity: i, imageURL: a, displayOnMaxLevel: l, displayOnMinLevel: r });c.setImageURL(a), this.originInstance = c, s.default.call(this, c), e.addOverlay(c);} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";function r(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var s = r(n),l = r(o);e.default = { name: "bm-info-window", mixins: [(0, s.default)("overlay")], props: { show: { type: Boolean }, position: { type: Object }, title: { type: String }, width: { type: Number }, height: { type: Number }, maxWidth: { type: Number }, offset: { type: Object }, maximize: { type: Boolean }, autoPan: { type: Boolean }, closeOnClick: { type: Boolean, default: !0 }, message: { type: String } }, watch: { show: function show(t) {t ? this.openInfoWindow() : this.closeInfoWindow();}, "position.lng": function positionLng(t, e) {this.reload();}, "position.lat": function positionLat(t, e) {this.reload();}, "offset.width": function offsetWidth(t, e) {this.reload();}, "offset.height": function offsetHeight(t) {this.reload();}, maxWidth: function maxWidth() {this.reload();}, width: function width(t) {this.originInstance.setWidth(t);}, height: function height(t) {this.originInstance.setHeight(t);}, title: function title(t) {this.originInstance.setTitle(t);}, maximize: function maximize(t) {t ? this.originInstance.enableMaximize() : this.originInstance.disableMaximize();}, autoPan: function autoPan(t) {t ? this.originInstance.enableAutoPan() : this.originInstance.disableAutoPan();}, closeOnClick: function closeOnClick(t) {t ? this.originInstance.enableCloseOnClick() : this.originInstance.disableCloseOnClick();} }, methods: { redraw: function redraw() {this.originInstance.redraw();}, load: function load() {var t = this.BMap,e = this.map,n = this.show,i = this.title,o = this.width,r = this.height,s = this.maxWidth,c = this.offset,u = this.autoPan,h = this.closeOnClick,p = this.message,d = this.maximize,f = this.bindObserver,m = this.$parent,g = this.$el,y = new t.InfoWindow(g, { width: o, height: r, title: i, maxWidth: s, offset: (0, a.createSize)(t, c), enableAutoPan: u, enableCloseOnClick: h, enableMessage: void 0 === p, message: p });d ? y.enableMaximize() : y.disableMaximize(), l.default.call(this, y), this.originInstance = y, y.redraw(), [].forEach.call(g.querySelectorAll("img"), function (t) {t.onload = function () {return y.redraw();};}), f(), this.$container = m.originInstance && m.originInstance.openInfoWindow ? m.originInstance : e, n && this.openInfoWindow();}, bindObserver: function bindObserver() {var t = i.MutationObserver;if (t) {var e = this.$el,n = this.originInstance;this.observer = new t(function (t) {return n.redraw();}), this.observer.observe(e, { attributes: !0, childList: !0, characterData: !0, subtree: !0 });}}, openInfoWindow: function openInfoWindow() {var t = this.BMap,e = this.$container,n = this.position,i = this.originInstance;e.openInfoWindow(i, (0, a.createPoint)(t, n));}, closeInfoWindow: function closeInfoWindow() {this.$container.closeInfoWindow(this.originInstance);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(i);e.default = { name: "bm-label", render: function render() {}, mixins: [(0, r.default)("overlay")], props: { content: { type: String }, title: { type: String }, offset: {}, position: {}, labelStyle: {}, zIndex: { type: Number, default: 0 }, massClear: { type: Boolean, default: !0 } }, watch: { content: function content(t) {this.originInstance.setContent(t);}, title: function title(t) {this.originInstance.setTitle(t);}, "offset.width": function offsetWidth(t, e) {var n = this.BMap;t.toString() !== e.toString() && this.originInstance.setOffset((0, o.createSize)(n, { width: t, height: this.offset.height }));}, "offset.height": function offsetHeight(t, e) {var n = this.BMap;t.toString() !== e.toString() && this.originInstance.setOffset((0, o.createSize)(n, { width: this.offset.width, height: t }));}, "position.lng": function positionLng(t, e) {var n = this.BMap,i = t;t.toString() !== e.toString() && i >= -180 && i <= 180 && this.originInstance.setCenter((0, o.createPoint)(n, { lng: i, lat: this.center.lat }));}, "position.lat": function positionLat(t, e) {var n = this.BMap,i = t;t.toString() !== e.toString() && i >= -74 && i <= 74 && this.originInstance.setCenter((0, o.createPoint)(n, { lng: this.center.lng, lat: i }));}, labelStyle: { handler: function handler(t) {this.originInstance.setStyle(t);}, deep: !0 }, zIndex: function zIndex(t) {this.originInstance.setZIndex(t);}, massClear: function massClear(t) {t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.content,i = this.title,a = this.offset,r = this.position,l = this.labelStyle,c = this.zIndex,u = this.massClear,h = this.$parent,p = new t.Label(n, { offset: (0, o.createSize)(t, a), position: (0, o.createPoint)(t, r), enableMassClear: u });this.originInstance = p;try {h.originInstance.setLabel(p);} catch (t) {e.addOverlay(p);}i && p.setTitle(i), l && p.setStyle(l), c && p.setZIndex(c), s.default.call(this, p);} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";function r(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var s = r(n),l = r(o);e.default = { name: "bm-marker", mixins: [(0, s.default)("overlay")], props: { position: {}, offset: {}, icon: {}, massClear: { type: Boolean, default: !0 }, dragging: { type: Boolean, default: !1 }, clicking: { type: Boolean, default: !0 }, raiseOnDrag: { type: Boolean, default: !1 }, draggingCursor: { type: String }, rotation: { type: Number }, shadow: { type: Object }, title: { type: String }, label: { type: Object }, animation: { type: String }, top: { type: Boolean, default: !1 }, zIndex: { type: Number, default: 0 } }, watch: { "position.lng": function positionLng(t, e) {var n = this.BMap,i = this.originInstance,o = this.position,r = this.renderByParent,s = this.$parent;t !== e && t >= -180 && t <= 180 && i.setPosition((0, a.createPoint)(n, { lng: t, lat: o.lat })), r && s.reload();}, "position.lat": function positionLat(t, e) {var n = this.BMap,i = this.originInstance,o = this.position,r = this.renderByParent,s = this.$parent;t !== e && t >= -74 && t <= 74 && i.setPosition((0, a.createPoint)(n, { lng: o.lng, lat: t })), r && s.reload();}, "offset.width": function offsetWidth(t, e) {var n = this.BMap,i = this.originInstance;t !== e && i.setOffset(new n.Size(t, this.offset.height));}, "offset.height": function offsetHeight(t, e) {var n = this.BMap,i = this.originInstance;t !== e && i.setOffset(new n.Size(this.offset.width, t));}, icon: { deep: !0, handler: function handler(t) {var e = this.BMap,n = this.originInstance,i = this.rotation;n && n.setIcon((0, a.createIcon)(e, t)), i && n && n.setRotation(i);} }, massClear: function massClear(t) {t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();}, dragging: function dragging(t) {t ? this.originInstance.enableDragging() : this.originInstance.disableDragging();}, clicking: function clicking() {this.reload();}, raiseOnDrag: function raiseOnDrag() {this.reload();}, draggingCursor: function draggingCursor(t) {this.originInstance.setDraggingCursor(t);}, rotation: function rotation(t) {this.originInstance.setRotation(t);}, shadow: function shadow(t) {this.originInstance.setShadow(t);}, title: function title(t) {this.originInstance.setTitle(t);}, label: function label(t) {this.reload();}, animation: function animation(t) {this.originInstance.setAnimation(i[t]);}, top: function top(t) {this.originInstance.setTop(t);}, zIndex: function zIndex(t) {this.originInstance.setZIndex(t);} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.position,o = this.offset,r = this.icon,s = this.massClear,c = this.dragging,u = this.clicking,h = this.raiseOnDrag,p = this.draggingCursor,d = this.rotation,f = this.shadow,m = this.title,g = this.label,y = this.animation,v = this.top,_ = this.renderByParent,b = this.$parent,x = this.zIndex,w = new t.Marker(new t.Point(n.lng, n.lat), { offset: o, icon: r && (0, a.createIcon)(t, r), enableMassClear: s, enableDragging: c, enableClicking: u, raiseOnDrag: h, draggingCursor: p, rotation: d, shadow: f, title: m });this.originInstance = w, g && w && w.setLabel((0, a.createLabel)(t, g)), w.setTop(v), w.setZIndex(x), l.default.call(this, w), _ ? b.reload() : e.addOverlay(w), w.setAnimation(i[y]);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n) {"use strict";function i(t, e) {if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");}function o(t, e) {if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return !e || "object" != typeof e && "function" != typeof e ? t : e;}function a(t, e) {if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);}Object.defineProperty(e, "__esModule", { value: !0 });var r = function (t) {return t && t.__esModule ? t : { default: t };}(n),s = function () {function t(t, e) {for (var n = 0; n < e.length; n++) {var i = e[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);}}return function (e, n, i) {return n && t(e.prototype, n), i && t(e, i), e;};}();e.default = { name: "bm-overlay", mixins: [(0, r.default)("overlay")], props: { pane: { type: String } }, watch: { pane: function pane() {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.$el,r = this.pane,l = this.$emit.bind(this),c = function (c) {function u() {return i(this, u), o(this, (u.__proto__ || Object.getPrototypeOf(u)).apply(this, arguments));}return a(u, c), s(u, [{ key: "initialize", value: function value() {l("initialize", { BMap: t, map: e, el: n, overlay: this });try {e.getPanes()[r].appendChild(n);} catch (t) {}return n;} }, { key: "draw", value: function value() {l("draw", { BMap: t, map: e, el: n, overlay: this });} }]), u;}(t.Overlay),u = new c();this.originInstance = u, e.addOverlay(u);} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(1), n(4), n(2)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";function r(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var s = r(n),l = r(o);e.default = { render: function render() {}, name: "bm-point-collection", mixins: [(0, s.default)("overlay")], props: { points: { type: Array, default: function _default() {return [];} }, shape: { type: String, default: "BMAP_POINT_SHAPE_CIRCLE" }, color: { type: String }, size: { type: String, default: "BMAP_POINT_SIZE_NORMAL" } }, watch: { shape: function shape(t) {var e = this.originInstance,n = this.color,o = this.size;e.setStyles({ shape: i[t], color: n, size: i[o] });}, size: function size(t) {var e = this.originInstance,n = this.color,o = this.shape;e.setStyles({ shape: i[o], color: n, size: i[t] });}, color: function color(t) {var e = this.originInstance,n = this.shape,o = this.size;e.setStyles({ shape: i[n], color: t, size: i[o] });}, points: { deep: !0, handler: function handler(t) {var e = this.originInstance;e.clear(), e.setPoints(t);} } }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.points,o = this.shape,r = this.color,s = this.size,c = this.originInstance = new t.PointCollection(n.map(function (e) {return (0, a.createPoint)(t, e);}), { shape: i[o], color: r, size: i[s] });l.default.call(this, c), e.addOverlay(c);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(i);e.default = { name: "bm-polygon", render: function render() {}, mixins: [(0, r.default)("overlay")], props: { path: { type: Array, default: function _default() {return [];} }, strokeColor: { type: String }, strokeWeight: { type: Number }, strokeOpacity: { type: Number }, strokeStyle: { type: String }, fillColor: { type: String }, fillOpacity: { type: Number }, massClear: { type: Boolean, default: !0 }, clicking: { type: Boolean, default: !0 }, editing: { type: Boolean, default: !1 } }, watch: { path: { handler: function handler(t, e) {this.reload();}, deep: !0 }, strokeColor: function strokeColor(t) {this.originInstance.setStrokeColor(t);}, strokeOpacity: function strokeOpacity(t) {this.originInstance.setStrokeOpacity(t);}, strokeWeight: function strokeWeight(t) {this.originInstance.setStrokeWeight(t);}, strokeStyle: function strokeStyle(t) {this.originInstance.setStrokeStyle(t);}, fillColor: function fillColor(t) {this.originInstance.setFillColor(t);}, fillOpacity: function fillOpacity(t) {this.originInstance.setFillOpacity(t);}, editing: function editing(t) {t ? this.originInstance.enableEditing() : this.originInstance.disableEditing();}, massClear: function massClear(t) {t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();}, clicking: function clicking(t) {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.path,i = this.strokeColor,a = this.strokeWeight,r = this.strokeOpacity,l = this.strokeStyle,c = this.fillColor,u = this.fillOpacity,h = this.editing,p = this.massClear,d = this.clicking,f = new t.Polygon(n.map(function (e) {return (0, o.createPoint)(t, { lng: e.lng, lat: e.lat });}), { strokeColor: i, strokeWeight: a, strokeOpacity: r, strokeStyle: l, fillColor: c, fillOpacity: u, enableMassClear: p, enableClicking: d });this.originInstance = f, e.addOverlay(f), s.default.call(this, f), h ? f.enableEditing() : f.disableEditing();} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(1), n(4), n(2)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";function a(t) {return t && t.__esModule ? t : { default: t };}Object.defineProperty(e, "__esModule", { value: !0 });var r = a(n),s = a(i);e.default = { name: "bm-polyline", render: function render() {}, mixins: [(0, r.default)("overlay")], props: { path: { type: Array }, strokeColor: { type: String }, strokeWeight: { type: Number }, strokeOpacity: { type: Number }, strokeStyle: { type: String }, massClear: { type: Boolean, default: !0 }, clicking: { type: Boolean, default: !0 }, editing: { type: Boolean, default: !1 } }, watch: { path: { handler: function handler(t, e) {this.reload();}, deep: !0 }, strokeColor: function strokeColor(t) {this.originInstance.setStrokeColor(t);}, strokeOpacity: function strokeOpacity(t) {this.originInstance.setStrokeOpacity(t);}, strokeWeight: function strokeWeight(t) {this.originInstance.setStrokeWeight(t);}, strokeStyle: function strokeStyle(t) {this.originInstance.setStrokeStyle(t);}, editing: function editing(t) {t ? this.originInstance.enableEditing() : this.originInstance.disableEditing();}, massClear: function massClear(t) {t ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear();}, clicking: function clicking(t) {this.reload();} }, methods: { load: function load() {var t = this.BMap,e = this.map,n = this.path,i = this.strokeColor,a = this.strokeWeight,r = this.strokeOpacity,l = this.strokeStyle,c = this.editing,u = this.massClear,h = this.clicking,p = new t.Polyline(n.map(function (e) {return (0, o.createPoint)(t, { lng: e.lng, lat: e.lat });}), { strokeColor: i, strokeWeight: a, strokeOpacity: r, strokeStyle: l, enableEditing: c, enableMassClear: u, enableClicking: h });this.originInstance = p, e.addOverlay(p), s.default.call(this, p);} } }, t.exports = e.default;});}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(2), n(5), n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(o);e.default = { name: "bm-bus", mixins: [(0, a.default)("search")], props: { location: { type: [Object, String] }, keyword: { type: String }, panel: { type: Boolean, default: !0 }, pageCapacity: { type: Number }, autoViewport: { type: Boolean }, selectFirstResult: { type: Boolean } }, watch: { location: { handler: function handler(t) {var e = this.originInstance,n = this.map;e.setLocation(t || n);}, deep: !0 }, keyword: function keyword(t) {this.search(t);}, panel: function panel() {this.reload();}, autoViewport: function autoViewport(t) {this.reload();}, selectFirstResult: function selectFirstResult(t) {this.reload();} }, methods: { search: function search(t) {this.originInstance.getBusList(t);}, load: function load() {var t = this,e = this.location,o = this.selectFirstResult,a = this.autoViewport,r = this.highlightMode,s = this.keyword,l = this.search,c = this.BMap,u = this.map,h = this.originInstance,p = e ? (0, i.isPoint)(e) ? (0, n.createPoint)(c, e) : e : u,d = this.originInstance = new c.BusLineSearch(p, { renderOptions: { map: u, panel: this.$el, selectFirstResult: o, autoViewport: a, highlightMode: r }, onGetBusListComplete: function onGetBusListComplete(e) {h && h !== d && h.clearResults(), t.$emit("getbuslistcomplete", e);}, onGetBusLineComplete: function onGetBusLineComplete(e) {h && h !== d && h.clearResults(), t.$emit("getbuslinecomplete", e);}, onBusListHtmlSet: function onBusListHtmlSet(e) {t.$emit("buslisthtmlset", e);}, onBusLineHtmlSet: function onBusLineHtmlSet(e) {t.$emit("buslinehtmlset", e);}, onMarkersSet: function onMarkersSet(e) {t.$emit("markersset", e);}, onPolylinesSet: function onPolylinesSet(e) {t.$emit("polylinesset", e);} });l(s);} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(2), n(5), n(1)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var r = function (t) {return t && t.__esModule ? t : { default: t };}(a);e.default = { name: "bm-driving", mixins: [(0, r.default)("search")], props: { location: { type: [Object, String] }, start: { type: [Object, String] }, end: { type: [Object, String] }, startCity: { type: [String, Number] }, endCity: { type: [String, Number] }, waypoints: { type: Array }, policy: { type: String }, panel: { type: Boolean, default: !0 }, autoViewport: { type: Boolean }, selectFirstResult: { type: Boolean } }, watch: { location: { handler: function handler(t) {var e = this.originInstance,n = this.map;e.setLocation(t || n);}, deep: !0 }, start: { handler: function handler(t) {var e = this.originInstance,n = this.end,i = this.startCity,a = this.endCity,r = this.waypoints,s = this.BMap,l = this.getWaypoints;e.search((0, o.getPosition)(s, t), (0, o.getPosition)(s, n), { startCity: i, endCity: a, waypoints: l(r) });}, deep: !0 }, end: { handler: function handler(t) {var e = this.originInstance,n = this.start,i = this.startCity,a = this.endCity,r = this.waypoints,s = this.BMap,l = this.getWaypoints;e.search((0, o.getPosition)(s, n), (0, o.getPosition)(s, t), { startCity: i, endCity: a, waypoints: l(r) });}, deep: !0 }, startCity: function startCity(t) {var e = this.originInstance,n = this.start,i = this.end,o = this.endCity,a = this.waypoints,r = this.getWaypoints;e.search(n, i, { val: t, endCity: o, waypoints: r(a) });}, endCity: function endCity(t) {var e = this.originInstance,n = this.start,i = this.end,o = this.startCity,a = this.waypoints,r = this.getWaypoints;e.search(n, i, { startCity: o, val: t, waypoints: r(a) });}, waypoints: { handler: function handler(t) {var e = this.originInstance,n = this.start,i = this.end,o = this.startCity,a = this.endCity,r = this.getWaypoints;e.search(n, i, { startCity: o, endCity: a, waypoints: r(t) });}, deep: !0 }, panel: function panel() {this.reload();}, policy: function policy(t) {this.reload();}, autoViewport: function autoViewport() {this.reload();}, selectFirstResult: function selectFirstResult() {this.reload();}, highlightMode: function highlightMode() {this.reload();} }, methods: { search: function search(t, e, n) {var i = n.startCity,o = n.endCity,a = n.waypoints,r = this.originInstance,s = this.getWaypoints;r.search(t, e, { startCity: i, endCity: o, waypoints: s(a) });}, getWaypoints: function getWaypoints(t) {var e = this.BMap;if (t) return t.map(function (t) {return (0, o.getPosition)(e, t);});}, load: function load() {var t = this,e = this.map,a = this.BMap,r = this.location,s = this.policy,l = this.selectFirstResult,c = this.autoViewport,u = this.highlightMode,h = this.search,p = this.start,d = this.end,f = this.startCity,m = this.endCity,g = this.waypoints,y = this.originInstance,v = this.getWaypoints,_ = r ? (0, o.isPoint)(r) ? (0, n.createPoint)(a, r) : r : e,b = this.originInstance = new a.DrivingRoute(_, { renderOptions: { map: e, panel: this.$el, selectFirstResult: l, autoViewport: c, highlightMode: u }, policy: i[s], onSearchComplete: function onSearchComplete(e) {y && y !== b && y.clearResults(), t.$emit("searchcomplete", e);}, onMarkersSet: function onMarkersSet(e) {t.$emit("markersset", e);}, onInfoHtmlSet: function onInfoHtmlSet(e) {t.$emit("infohtmlset", e);}, onPolylinesSet: function onPolylinesSet(e) {t.$emit("polylinesset", e);}, onResultsHtmlSet: function onResultsHtmlSet(e) {t.$emit("resultshtmlset", e);} });h((0, o.getPosition)(a, p), (0, o.getPosition)(a, d), { startCity: f, endCity: m, waypoints: v(g) });} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(2), n(5), n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(o);e.default = { name: "bm-local-search", mixins: [(0, a.default)("search")], props: { location: { type: [Object, String] }, keyword: { type: [Array, String] }, panel: { type: Boolean, default: !0 }, forceLocal: { type: Boolean }, customData: { type: Object }, bounds: { type: Object }, nearby: { type: Object }, pageCapacity: { type: Number }, autoViewport: { type: Boolean }, selectFirstResult: { type: Boolean } }, watch: { location: { handler: function handler(t) {var e = this.originInstance,n = this.search;e.setLocation(t || this.map), n();}, deep: !0 }, keyword: function keyword() {this.search();}, bounds: { handler: function handler(t) {(0, this.searchInBounds)(t);}, deep: !0 }, nearby: { handler: function handler(t) {(0, this.searchNearby)(t);}, deep: !0 }, forceLocal: function forceLocal() {this.reload();}, customData: { deep: !0, handler: function handler() {this.reload();} }, pageCapacity: function pageCapacity(t) {this.originInstance && this.originInstance.setPageCapacity(t);}, autoViewport: function autoViewport(t) {this.originInstance && (t ? this.originInstance.enableAutoViewport() : this.originInstance.disableAutoViewport());}, selectFirstResult: function selectFirstResult(t) {this.originInstance && (t ? this.originInstance.enableFirstResultSelection() : this.originInstance.disableFirstResultSelection());}, highlightMode: function highlightMode() {this.reload();} }, methods: { searchNearby: function searchNearby(t) {var e = this.originInstance,i = this.keyword,o = this.customData,a = this.BMap;e.searchNearby(i, (0, n.createPoint)(a, t.center), t.radius, o);}, searchInBounds: function searchInBounds(t) {var e = this.originInstance,i = this.keyword,o = this.customData,a = this.BMap;e.searchInBounds(i, (0, n.createBounds)(a, t), o);}, search: function search() {var t = this.originInstance,e = this.keyword,n = this.forceLocal,i = this.customData,o = this.nearby,a = this.bounds,r = this.searchNearby,s = this.searchInBounds;o ? r(o) : a ? s(a) : t.search(e, { forceLocal: n, customData: i });}, load: function load() {var t = this,e = this.map,o = this.BMap,a = this.search,r = this.pageCapacity,s = this.autoViewport,l = this.selectFirstResult,c = this.highlightMode,u = this.location,h = this.originInstance,p = u ? (0, i.isPoint)(u) ? (0, n.createPoint)(o, u) : u : e,d = this.originInstance = new o.LocalSearch(p, { onMarkersSet: function onMarkersSet(e) {t.$emit("markersset", e);}, onInfoHtmlSet: function onInfoHtmlSet(e) {t.$emit("infohtmlset", e);}, onResultsHtmlSet: function onResultsHtmlSet(e) {t.$emit("resultshtmlset", e);}, onSearchComplete: function onSearchComplete(e) {h && h !== d && h.clearResults(), t.$emit("searchcomplete", e);}, pageCapacity: r, renderOptions: { map: e, panel: this.$el, selectFirstResult: l, autoViewport: s, highlightMode: c } });a();} } }, t.exports = e.default;});}, function (t, e, n) {(function (i) {var o, a, r;!function (i, s) {a = [t, e, n(2), n(5), n(1)], o = s, void 0 !== (r = "function" == typeof o ? o.apply(e, a) : o) && (t.exports = r);}(0, function (t, e, n, o, a) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var r = function (t) {return t && t.__esModule ? t : { default: t };}(a);e.default = { name: "bm-transit", mixins: [(0, r.default)("search")], props: { location: { type: [Object, String] }, start: { type: [Object, String] }, end: { type: [Object, String] }, panel: { type: Boolean, default: !0 }, policy: { type: String }, pageCapacity: { type: Number }, autoViewport: { type: Boolean }, selectFirstResult: { type: Boolean } }, watch: { location: { handler: function handler(t) {var e = this.originInstance,n = this.map;e.setLocation(t || n);}, deep: !0 }, start: { handler: function handler(t) {var e = this.originInstance,n = this.end,i = this.BMap;e.search((0, o.getPosition)(i, t), (0, o.getPosition)(i, n));}, deep: !0 }, end: { handler: function handler(t) {var e = this.originInstance,n = this.start,i = this.BMap;e.search((0, o.getPosition)(i, n), (0, o.getPosition)(i, t));}, deep: !0 }, panel: function panel() {this.reload();}, policy: function policy(t) {this.originInstance.setPolicy(i[t]);}, pageCapacity: function pageCapacity(t) {this.originInstance && this.originInstance.setPageCapacity(t);}, autoViewport: function autoViewport(t) {this.originInstance && (t ? this.originInstance.enableAutoViewport() : this.originInstance.disableAutoViewport());}, selectFirstResult: function selectFirstResult() {this.reload();}, highlightMode: function highlightMode() {this.reload();} }, methods: { search: function search(t, e) {this.originInstance.search(t, e);}, load: function load() {var t = this,e = this.map,a = this.BMap,r = this.location,s = this.policy,l = this.pageCapacity,c = this.selectFirstResult,u = this.autoViewport,h = this.highlightMode,p = this.search,d = this.start,f = this.end,m = this.originInstance,g = r ? (0, o.isPoint)(r) ? (0, n.createPoint)(a, r) : r : e,y = this.originInstance = new a.TransitRoute(g, { renderOptions: { map: e, panel: this.$el, selectFirstResult: c, autoViewport: u, highlightMode: h }, policy: i[s], pageCapacity: l, onSearchComplete: function onSearchComplete(e) {m && m !== y && m.clearResults(), t.$emit("searchcomplete", e);}, onMarkersSet: function onMarkersSet(e) {t.$emit("markersset", e);}, onInfoHtmlSet: function onInfoHtmlSet(e) {t.$emit("infohtmlset", e);}, onPolylinesSet: function onPolylinesSet(e) {t.$emit("polylinesset", e);}, onResultsHtmlSet: function onResultsHtmlSet(e) {t.$emit("resultshtmlset", e);} });p((0, o.isPoint)(d) ? (0, n.createPoint)(a, d) : d, (0, o.isPoint)(f) ? (0, n.createPoint)(a, f) : f);} } }, t.exports = e.default;});}).call(e, n(3));}, function (t, e, n) {var i, o, a;!function (r, s) {o = [t, e, n(2), n(5), n(1)], i = s, void 0 !== (a = "function" == typeof i ? i.apply(e, o) : i) && (t.exports = a);}(0, function (t, e, n, i, o) {"use strict";Object.defineProperty(e, "__esModule", { value: !0 });var a = function (t) {return t && t.__esModule ? t : { default: t };}(o);e.default = { name: "bm-walking", mixins: [(0, a.default)("search")], props: { location: { type: [Object, String] }, start: { type: [Object, String] }, end: { type: [Object, String] }, panel: { type: Boolean, default: !0 }, pageCapacity: { type: Number }, autoViewport: { type: Boolean }, selectFirstResult: { type: Boolean } }, watch: { location: { handler: function handler(t) {var e = this.originInstance,n = this.map;e.setLocation(t || n);}, deep: !0 }, start: { handler: function handler(t) {var e = this.originInstance,n = this.end,o = this.BMap;e.search((0, i.getPosition)(o, t), (0, i.getPosition)(o, n));}, deep: !0 }, end: { handler: function handler(t) {var e = this.originInstance,n = this.start,o = this.BMap;e.search((0, i.getPosition)(o, n), (0, i.getPosition)(o, t));}, deep: !0 }, panel: function panel() {this.reload();}, autoViewport: function autoViewport(t) {this.reload();}, selectFirstResult: function selectFirstResult(t) {this.reload();}, highlightMode: function highlightMode() {this.reload();} }, methods: { search: function search(t, e) {this.originInstance.search(t, e);}, load: function load() {var t = this,e = this.map,o = this.BMap,a = this.location,r = this.selectFirstResult,s = this.autoViewport,l = this.highlightMode,c = this.search,u = this.start,h = this.end,p = this.originInstance,d = a ? (0, i.isPoint)(a) ? (0, n.createPoint)(o, a) : a : e,f = this.originInstance = new o.WalkingRoute(d, { renderOptions: { map: e, panel: this.$el, selectFirstResult: r, autoViewport: s, highlightMode: l }, onSearchComplete: function onSearchComplete(e) {p && p !== f && p.clearResults(), t.$emit("searchcomplete", e);}, onMarkersSet: function onMarkersSet(e) {t.$emit("markersset", e);}, onInfoHtmlSet: function onInfoHtmlSet(e) {t.$emit("infohtmlset", e);}, onPolylinesSet: function onPolylinesSet(e) {t.$emit("polylinesset", e);}, onResultsHtmlSet: function onResultsHtmlSet(e) {t.$emit("resultshtmlset", e);} });c((0, i.isPoint)(u) ? (0, n.createPoint)(o, u) : u, (0, i.isPoint)(h) ? (0, n.createPoint)(o, h) : h);} } }, t.exports = e.default;});}, function (t, e, n) {!function (e, n) {t.exports = n();}(0, function () {function t(t, n) {try {BMap;} catch (t) {throw Error("Baidu Map JS API is not ready yet!");}var i = e(t),o = new BMap.Polyline(i, n);return o.addEventListener("lineupdate", function () {this.isEditing && this.enableEditing();}), o.cornerPoints = t, o.editMarkers = [], o.enableEditing = function () {var t = this;if (t.map) {t.disableEditing();for (var n = 0; n < t.cornerPoints.length; n++) {var i = new BMap.Marker(t.cornerPoints[n], { icon: new BMap.Icon("http://api.map.baidu.com/library/CurveLine/1.5/src/circle.png", new BMap.Size(16, 16)), enableDragging: !0, raiseOnDrag: !0 });i.addEventListener("dragend", function () {t.cornerPoints.length = 0;for (var n = 0; n < t.editMarkers.length; n++) {t.cornerPoints.push(t.editMarkers[n].getPosition());}var i = e(t.cornerPoints);t.setPath(i);}), i.index = n, t.editMarkers.push(i), t.map.addOverlay(i);}}t.isEditing = !0;}, o.disableEditing = function () {this.isEditing = !1;for (var t = 0; t < this.editMarkers.length; t++) {this.map.removeOverlay(this.editMarkers[t]), this.editMarkers[t] = null;}this.editMarkers.length = 0;}, o.getPath = function () {return i;}, o;}function e(t) {for (var e = [], i = 0; i < t.length - 1; i++) {var o = n(t[i], t[i + 1]);o && o.length > 0 && (e = e.concat(o));}return e;}function n(t, e) {var n = [];if (!(t && e && t instanceof BMap.Point && e instanceof BMap.Point)) return null;var i,o,a,r,s,l,c = function c(t) {return 1 - 2 * t + t * t;},u = function u(t) {return 2 * t - 2 * t * t;},h = function h(t) {return t * t;},p = 0,d = 0;if (void 0 === e) return void (void 0 !== n && (n = []));var f = parseFloat(t.lat),m = parseFloat(e.lat),g = parseFloat(t.lng),y = parseFloat(e.lng);for (y > g && parseFloat(y - g) > 180 && g < 0 && (g = parseFloat(360 + g)), g > y && parseFloat(g - y) > 180 && y < 0 && (y = parseFloat(360 + y)), 0, l = 0, m == f ? (i = 0, o = g - y) : y == g ? (i = Math.PI / 2, o = f - m) : (i = Math.atan((m - f) / (y - g)), o = (m - f) / Math.sin(i)), 0 == l && (l = i + Math.PI / 5), a = o / 2, s = a * Math.cos(l) + g, r = a * Math.sin(l) + f, p = 0; p < 31; p++) {n.push(new BMap.Point(g * c(d) + s * u(d) + y * h(d), f * c(d) + r * u(d) + m * h(d))), d += 1 / 30;}return n;}return t;});}, function (t, e, n) {!function (e, n) {t.exports = n();}(0, function () {function t(t, e, n) {var i,o,a = t.prototype,r = new Function();r.prototype = e.prototype, o = t.prototype = new r();for (i in a) {o[i] = a[i];}t.prototype.constructor = t, t.superClass = e.prototype, "string" == typeof n && (o._className = n);}var e = function () {var t = function t(_t) {var e = { data: [], heatmap: _t };this.max = 1, this.get = function (t) {return e[t];}, this.set = function (t, n) {e[t] = n;};};t.prototype = { addDataPoint: function addDataPoint(t, e) {if (!(t < 0 || e < 0)) {var n = this,i = n.get("heatmap"),o = n.get("data");if (o[t] || (o[t] = []), o[t][e] || (o[t][e] = 0), o[t][e] += arguments.length < 3 ? 1 : arguments[2], n.set("data", o), n.max < o[t][e]) return i.get("actx").clearRect(0, 0, i.get("width"), i.get("height")), void n.setDataSet({ max: o[t][e], data: o }, !0);i.drawAlpha(t, e, o[t][e], !0);}}, setDataSet: function setDataSet(t, e) {var n = this,i = n.get("heatmap"),o = [],a = t.data,r = a.length;if (i.clear(), this.max = t.max, i.get("legend") && i.get("legend").update(t.max), null != e && e) {for (var s in a) {if (void 0 !== s) for (var l in a[s]) {void 0 !== l && i.drawAlpha(s, l, a[s][l], !1);}}} else for (; r--;) {var c = a[r];i.drawAlpha(c.x, c.y, c.count, !1), o[c.x] || (o[c.x] = []), o[c.x][c.y] || (o[c.x][c.y] = 0), o[c.x][c.y] = c.count;}i.colorize(), this.set("data", a);}, exportDataSet: function exportDataSet() {var t = this,e = t.get("data"),n = [];for (var i in e) {if (void 0 !== i) for (var o in e[i]) {void 0 !== o && n.push({ x: parseInt(i, 10), y: parseInt(o, 10), count: e[i][o] });}}return { max: t.max, data: n };}, generateRandomDataSet: function generateRandomDataSet(t) {var e = this.get("heatmap"),n = e.get("width"),i = e.get("height"),o = {},a = Math.floor(1e3 * Math.random() + 1);o.max = a;for (var r = []; t--;) {r.push({ x: Math.floor(Math.random() * n + 1), y: Math.floor(Math.random() * i + 1), count: Math.floor(Math.random() * a + 1) });}o.data = r, this.setDataSet(o);} };var e = function e(t) {this.config = t;var e = { element: null, labelsEl: null, gradientCfg: null, ctx: null };this.get = function (t) {return e[t];}, this.set = function (t, n) {e[t] = n;}, this.init();};e.prototype = { init: function init() {var t,e,n = this,i = n.config,o = i.title || "Legend",a = i.position,r = i.offset || 10,s = (i.gradient, document.createElement("ul")),l = "";n.processGradientObject(), a.indexOf("t") > -1 ? l += "top:" + r + "px;" : l += "bottom:" + r + "px;", a.indexOf("l") > -1 ? l += "left:" + r + "px;" : l += "right:" + r + "px;", t = document.createElement("div"), t.style.cssText = "border-radius:5px;position:absolute;" + l + "font-family:Helvetica; width:256px;z-index:10000000000; background:rgba(255,255,255,1);padding:10px;border:1px solid black;margin:0;", t.innerHTML = "<h3 style='padding:0;margin:0;text-align:center;font-size:16px;'>" + o + "</h3>", s.style.cssText = "position:relative;font-size:12px;display:block;list-style:none;list-style-type:none;margin:0;height:15px;", e = document.createElement("div"), e.style.cssText = ["position:relative;display:block;width:256px;height:15px;border-bottom:1px solid black; background-image:url(", n.createGradientImage(), ");"].join(""), t.appendChild(s), t.appendChild(e), n.set("element", t), n.set("labelsEl", s), n.update(1);}, processGradientObject: function processGradientObject() {var t = this,e = this.config.gradient,n = [];for (var i in e) {e.hasOwnProperty(i) && n.push({ stop: i, value: e[i] });}n.sort(function (t, e) {return t.stop - e.stop;}), n.unshift({ stop: 0, value: "rgba(0,0,0,0)" }), t.set("gradientArr", n);}, createGradientImage: function createGradientImage() {var t,e = this,n = e.get("gradientArr"),i = n.length,o = document.createElement("canvas"),a = o.getContext("2d");o.width = "256", o.height = "15", t = a.createLinearGradient(0, 5, 256, 10);for (var r = 0; r < i; r++) {t.addColorStop(1 / (i - 1) * r, n[r].value);}a.fillStyle = t, a.fillRect(0, 5, 256, 10), a.strokeStyle = "black", a.beginPath();for (var r = 0; r < i; r++) {a.moveTo(.5 + (1 / (i - 1) * r * 256 >> 0), 0), a.lineTo(.5 + (1 / (i - 1) * r * 256 >> 0), 0 == r ? 15 : 5);}return a.moveTo(255.5, 0), a.lineTo(255.5, 15), a.moveTo(255.5, 4.5), a.lineTo(0, 4.5), a.stroke(), e.set("ctx", a), o.toDataURL();}, getElement: function getElement() {return this.get("element");}, update: function update(t) {for (var e, n, i = this, o = i.get("gradientArr"), a = i.get("ctx"), r = i.get("labelsEl"), s = "", l = 0; l < o.length; l++) {e = t * o[l].stop >> 0, n = a.measureText(e).width / 2 >> 0, 0 == l && (n = 0), l == o.length - 1 && (n *= 2), s += '<li style="position:absolute;left:' + (((1 / (o.length - 1) * l * 256 || 0) >> 0) - n + .5) + 'px">' + e + "</li>";}r.innerHTML = s;} };var n = function n(e) {var n = { radius: 40, element: {}, canvas: {}, acanvas: {}, ctx: {}, actx: {}, legend: null, visible: !0, width: 0, height: 0, max: !1, gradient: !1, opacity: 180, premultiplyAlpha: !1, bounds: { l: 1e3, r: 0, t: 1e3, b: 0 }, debug: !1 };this.store = new t(this), this.get = function (t) {return n[t];}, this.set = function (t, e) {n[t] = e;}, this.configure(e), this.init();};return n.prototype = { configure: function configure(t) {var n = this;if (n.set("radius", t.radius || 40), n.set("element", t.element instanceof Object ? t.element : document.getElementById(t.element)), n.set("visible", null == t.visible || t.visible), n.set("max", t.max || !1), n.set("gradient", t.gradient || { .45: "rgb(0,0,255)", .55: "rgb(0,255,255)", .65: "rgb(0,255,0)", .95: "yellow", 1: "rgb(255,0,0)" }), n.set("opacity", parseInt(255 / (100 / t.opacity), 10) || 180), n.set("width", t.width || 0), n.set("height", t.height || 0), n.set("debug", t.debug), t.legend) {var i = t.legend;i.gradient = n.get("gradient"), n.set("legend", new e(i));}}, resize: function resize() {var t = this,e = t.get("element"),n = t.get("canvas"),i = t.get("acanvas");n.width = i.width = t.get("width") || e.style.width.replace(/px/, "") || t.getWidth(e), this.set("width", n.width), n.height = i.height = t.get("height") || e.style.height.replace(/px/, "") || t.getHeight(e), this.set("height", n.height);}, init: function init() {var t = this,e = document.createElement("canvas"),n = document.createElement("canvas"),i = e.getContext("2d"),o = n.getContext("2d"),a = t.get("element");t.initColorPalette(), t.set("canvas", e), t.set("ctx", i), t.set("acanvas", n), t.set("actx", o), t.resize(), e.style.cssText = n.style.cssText = "position:absolute;top:0;left:0;z-index:10000000;", t.get("visible") || (e.style.display = "none"), a.appendChild(e), t.get("legend") && a.appendChild(t.get("legend").getElement()), t.get("debug") && document.body.appendChild(n), o.shadowOffsetX = 15e3, o.shadowOffsetY = 15e3, o.shadowBlur = 15;}, initColorPalette: function initColorPalette() {var t,e,n,i = this,o = document.createElement("canvas"),a = i.get("gradient");o.width = "1", o.height = "256", t = o.getContext("2d"), e = t.createLinearGradient(0, 0, 1, 256), n = t.getImageData(0, 0, 1, 1), n.data[0] = n.data[3] = 64, n.data[1] = n.data[2] = 0, t.putImageData(n, 0, 0), n = t.getImageData(0, 0, 1, 1), i.set("premultiplyAlpha", n.data[0] < 60 || n.data[0] > 70);for (var r in a) {e.addColorStop(r, a[r]);}t.fillStyle = e, t.fillRect(0, 0, 1, 256), i.set("gradient", t.getImageData(0, 0, 1, 256).data);}, getWidth: function getWidth(t) {var e = t.offsetWidth;return t.style.paddingLeft && (e += t.style.paddingLeft), t.style.paddingRight && (e += t.style.paddingRight), e;}, getHeight: function getHeight(t) {var e = t.offsetHeight;return t.style.paddingTop && (e += t.style.paddingTop), t.style.paddingBottom && (e += t.style.paddingBottom), e;}, colorize: function colorize(t, e) {var n,i,o,a,r,s,l,c,u,h = this,p = h.get("width"),d = h.get("radius"),f = h.get("height"),m = h.get("actx"),g = h.get("ctx"),y = 3 * d,v = h.get("premultiplyAlpha"),_ = h.get("gradient"),b = h.get("opacity"),x = h.get("bounds");null != t && null != e ? (t + y > p && (t = p - y), t < 0 && (t = 0), e < 0 && (e = 0), e + y > f && (e = f - y), n = t, i = e, a = t + y, o = e + y) : (n = x.l < 0 ? 0 : x.l, a = x.r > p ? p : x.r, i = x.t < 0 ? 0 : x.t, o = x.b > f ? f : x.b), r = m.getImageData(n, i, a - n, o - i), s = r.data.length;for (var w = 3; w < s; w += 4) {l = r.data[w], c = 4 * l, c && (u = l < b ? l : b, r.data[w - 3] = _[c], r.data[w - 2] = _[c + 1], r.data[w - 1] = _[c + 2], v && (r.data[w - 3] /= 255 / u, r.data[w - 2] /= 255 / u, r.data[w - 1] /= 255 / u), r.data[w] = u);}g.putImageData(r, n, i);}, drawAlpha: function drawAlpha(t, e, n, i) {var o = this,a = o.get("radius"),r = o.get("actx"),s = (o.get("max"), o.get("bounds")),l = t - 1.5 * a >> 0,c = e - 1.5 * a >> 0,u = t + 1.5 * a >> 0,h = e + 1.5 * a >> 0;r.shadowColor = "rgba(0,0,0," + (n ? n / o.store.max : "0.1") + ")", r.shadowOffsetX = 15e3, r.shadowOffsetY = 15e3, r.shadowBlur = 15, r.beginPath(), r.arc(t - 15e3, e - 15e3, a, 0, 2 * Math.PI, !0), r.closePath(), r.fill(), i ? o.colorize(l, c) : (l < s.l && (s.l = l), c < s.t && (s.t = c), u > s.r && (s.r = u), h > s.b && (s.b = h));}, toggleDisplay: function toggleDisplay() {var t = this,e = t.get("visible"),n = t.get("canvas");n.style.display = e ? "none" : "block", t.set("visible", !e);}, getImageData: function getImageData() {return this.get("canvas").toDataURL();}, clear: function clear() {var t = this,e = t.get("width"),n = t.get("height");t.store.set("data", []), t.get("ctx").clearRect(0, 0, e, n), t.get("actx").clearRect(0, 0, e, n);}, cleanup: function cleanup() {var t = this;t.get("element").removeChild(t.get("canvas"));} }, { create: function create(t) {return new n(t);}, util: { mousePosition: function mousePosition(t) {var e, n;if (t.layerX ? (e = t.layerX, n = t.layerY) : t.offsetX && (e = t.offsetX, n = t.offsetY), void 0 !== e) return [e, n];} } };}(),n = function n(e) {try {BMap;} catch (t) {throw Error("Baidu Map JS API is not ready yet!");}if (!n._isExtended) {n._isExtended = !0, t(n, BMap.Overlay, "HeatmapOverlay");var i = new n(e);this.__proto__ = i.__proto__;}this.conf = e, this.heatmap = null, this.latlngs = [], this.bounds = null, this._moveendHandler = this._moveendHandler.bind(this);};return n.prototype.initialize = function (t) {this._map = t;var n = document.createElement("div");return n.style.position = "absolute", n.style.top = 0, n.style.left = 0, n.style.border = 0, n.style.width = this._map.getSize().width + "px", n.style.height = this._map.getSize().height + "px", this.conf.element = n, t.getPanes().mapPane.appendChild(n), this.heatmap = e.create(this.conf), this._div = n, n;}, n.prototype.draw = function () {var t = this._map.getBounds();if (!t.equals(this.bounds)) {this.bounds = t;var e = this._map.pointToOverlayPixel(t.getNorthEast()),n = this._map.pointToOverlayPixel(t.getSouthWest());if (e && n) {var i = e.y,o = n.x,a = n.y - e.y,r = e.x - n.x;if (this.conf.element.style.left = o + "px", this.conf.element.style.top = i + "px", this.conf.element.style.width = r + "px", this.conf.element.style.height = a + "px", this.heatmap.store.get("heatmap").resize(), this.latlngs.length > 0) {this.heatmap.clear();for (var s = this.latlngs.length, l = { max: this.heatmap.store.max, data: [] }; s--;) {var c = this.latlngs[s].latlng;if (t.containsPoint(c)) {var u = this._map.pointToOverlayPixel(c),h = new BMap.Pixel(u.x - o, u.y - i),p = this.pixelTransform(h);l.data.push({ x: p.x, y: p.y, count: this.latlngs[s].c });}}this.heatmap.store.setDataSet(l);}}}}, n.prototype.pixelTransform = function (t) {for (var e = this.heatmap.get("width"), n = this.heatmap.get("height"); t.x < 0;) {t.x += e;}for (; t.x > e;) {t.x -= e;}for (; t.y < 0;) {t.y += n;}for (; t.y > n;) {t.y -= n;}return t.x = t.x >> 0, t.y = t.y >> 0, t;}, n.prototype._moveendHandler = function (t) {this.setDataSet(this._data), delete this._data, this._map.removeEventListener("moveend", this._moveendHandler);}, n.prototype.setDataSet = function (t) {if (this._map) {var e = this._map.getBounds(),n = this._map.pointToOverlayPixel(e.getNorthEast()),i = this._map.pointToOverlayPixel(e.getSouthWest());n && i || (this._data = t, this._map.addEventListener("moveend", this._moveendHandler));var o = { max: t.max, data: [] },a = t.data,r = a.length;for (this.latlngs = []; r--;) {var s = new BMap.Point(a[r].lng, a[r].lat);if (this.latlngs.push({ latlng: s, c: a[r].count }), e.containsPoint(s)) {var l = this._map.pointToOverlayPixel(s),c = this._map.pointToOverlayPixel(e.getSouthWest()).x,u = this._map.pointToOverlayPixel(e.getNorthEast()).y,h = new BMap.Pixel(l.x - c, l.y - u),p = this.pixelTransform(h);o.data.push({ x: p.x, y: p.y, count: a[r].count });}}this.heatmap.clear(), this.heatmap.store.setDataSet(o);}}, n.prototype.addDataPoint = function (t, e, n) {var i = new BMap.Point(t, e),o = this.pixelTransform(this._map.pointToOverlayPixel(i));this.heatmap.store.addDataPoint(o.x, o.y, n), this.latlngs.push({ latlng: i, c: n });}, n.prototype.toggle = function () {this.heatmap.toggleDisplay();}, n;});}, function (t, e, n) {!function (e, n) {t.exports = n();}(0, function () {function t(t, e) {this._point = t, this._html = e;}function e() {t.prototype = new BMap.Overlay(), t.prototype.initialize = function (t) {var e = this._div = n.dom.create("div", { style: "border:solid 1px #ccc;width:auto;min-width:50px;text-align:center;position:absolute;background:#fff;color:#000;font-size:12px;border-radius: 10px;padding:5px;white-space: nowrap;" });return e.innerHTML = this._html, t.getPanes().floatPane.appendChild(e), this._map = t, e;}, t.prototype.draw = function () {this.setPosition(this.lushuMain._marker.getPosition(), this.lushuMain._marker.getIcon().size);}, n.object.extend(t.prototype, { setPosition: function setPosition(t, e) {var i = this._map.pointToOverlayPixel(t),o = n.dom.getStyle(this._div, "width"),a = n.dom.getStyle(this._div, "height"),r = parseInt(this._div.clientWidth || o, 10);parseInt(this._div.clientHeight || a, 10);this._div.style.left = i.x - r / 2 + "px", this._div.style.bottom = -(i.y - e.height) + "px";}, setHtml: function setHtml(t) {this._div.innerHTML = t;}, setRelatedClass: function setRelatedClass(t) {this.lushuMain = t;} });}var n = {};n.dom = {}, n.dom.g = function (t) {return "string" == typeof t || t instanceof String ? document.getElementById(t) : t && t.nodeName && (1 == t.nodeType || 9 == t.nodeType) ? t : null;}, n.g = n.G = n.dom.g, n.lang = n.lang || {}, n.lang.isString = function (t) {return "[object String]" == Object.prototype.toString.call(t);}, n.isString = n.lang.isString, n.dom._g = function (t) {return n.lang.isString(t) ? document.getElementById(t) : t;}, n._g = n.dom._g, n.dom.getDocument = function (t) {return t = n.dom.g(t), 9 == t.nodeType ? t : t.ownerDocument || t.document;}, n.browser = n.browser || {}, n.browser.ie = n.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp.$1 : void 0, n.dom.getComputedStyle = function (t, e) {t = n.dom._g(t);var i,o = n.dom.getDocument(t);return o.defaultView && o.defaultView.getComputedStyle && (i = o.defaultView.getComputedStyle(t, null)) ? i[e] || i.getPropertyValue(e) : "";}, n.dom._styleFixer = n.dom._styleFixer || {}, n.dom._styleFilter = n.dom._styleFilter || [], n.dom._styleFilter.filter = function (t, e, i) {for (var o, a = 0, r = n.dom._styleFilter; o = r[a]; a++) {(o = o[i]) && (e = o(t, e));}return e;}, n.string = n.string || {}, n.string.toCamelCase = function (t) {return t.indexOf("-") < 0 && t.indexOf("_") < 0 ? t : t.replace(/[-_][^-_]/g, function (t) {return t.charAt(1).toUpperCase();});}, n.dom.getStyle = function (t, e) {var i = n.dom;t = i.g(t), e = n.string.toCamelCase(e);var o = t.style[e] || (t.currentStyle ? t.currentStyle[e] : "") || i.getComputedStyle(t, e);if (!o) {var a = i._styleFixer[e];a && (o = a.get ? a.get(t) : n.dom.getStyle(t, a));}return (a = i._styleFilter) && (o = a.filter(e, o, "get")), o;}, n.getStyle = n.dom.getStyle, n.dom._NAME_ATTRS = function () {var t = { cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", rowspan: "rowSpan", valign: "vAlign", usemap: "useMap", frameborder: "frameBorder" };return n.browser.ie < 8 ? (t.for = "htmlFor", t.class = "className") : (t.htmlFor = "for", t.className = "class"), t;}(), n.dom.setAttr = function (t, e, i) {return t = n.dom.g(t), "style" == e ? t.style.cssText = i : (e = n.dom._NAME_ATTRS[e] || e, t.setAttribute(e, i)), t;}, n.setAttr = n.dom.setAttr, n.dom.setAttrs = function (t, e) {t = n.dom.g(t);for (var i in e) {n.dom.setAttr(t, i, e[i]);}return t;}, n.setAttrs = n.dom.setAttrs, n.dom.create = function (t, e) {var i = document.createElement(t),o = e || {};return n.dom.setAttrs(i, o);}, n.object = n.object || {}, n.extend = n.object.extend = function (t, e) {for (var n in e) {e.hasOwnProperty(n) && (t[n] = e[n]);}return t;};var i = function i(t, e, n) {try {BMap;} catch (t) {throw Error("Baidu Map JS API is not ready yet!");}!e || e.length < 1 || (this._map = t, this._path = e, this.i = 0, this._setTimeoutQuene = [], this._projection = this._map.getMapType().getProjection(), this._opts = { icon: null, speed: 4e3, defaultContent: "", showInfoWindow: !1 }, this._setOptions(n), this._rotation = 0, !this._opts.icon instanceof BMap.Icon && (this._opts.icon = defaultIcon));};return i.prototype._setOptions = function (t) {if (t) for (var e in t) {t.hasOwnProperty(e) && (this._opts[e] = t[e]);}}, i.prototype.start = function () {var t = this,e = t._path.length;if (this._opts.onstart && this._opts.onstart(t), t.i && t.i < e - 1) {if (!t._fromPause) return;t._fromStop || t._moveNext(++t.i);} else !t._marker && t._addMarker(), t._timeoutFlag = setTimeout(function () {!t._overlay && t._addInfoWin(), t._moveNext(t.i);}, 400);this._fromPause = !1, this._fromStop = !1;}, i.prototype.stop = function () {this.i = 0, this._fromStop = !0, clearInterval(this._intervalFlag), this._clearTimeout();for (var t = 0, e = this._opts.landmarkPois, n = e.length; t < n; t++) {e[t].bShow = !1;}this._opts.onstop && this._opts.onstop(this);}, i.prototype.pause = function () {clearInterval(this._intervalFlag), this._fromPause = !0, this._clearTimeout(), this._opts.onpause && this._opts.onpause(this);}, i.prototype.hideInfoWindow = function () {this._opts.showInfoWindow = !1, this._overlay && (this._overlay._div.style.visibility = "hidden");}, i.prototype.showInfoWindow = function () {this._opts.showInfoWindow = !0, this._overlay && (this._overlay._div.style.visibility = "visible");}, i.prototype.dispose = function () {clearInterval(this._intervalFlag), this._setTimeoutQuene && this._clearTimeout(), this._map && (this._map.removeOverlay(this._overlay), this._map.removeOverlay(this._marker));}, n.object.extend(i.prototype, { _addMarker: function _addMarker(t) {this._marker && (this.stop(), this._map.removeOverlay(this._marker), clearTimeout(this._timeoutFlag)), this._overlay && this._map.removeOverlay(this._overlay);var e = new BMap.Marker(this._path[0]);this._opts.icon && e.setIcon(this._opts.icon), this._map.addOverlay(e), e.setAnimation(BMAP_ANIMATION_DROP), this._marker = e;}, _addInfoWin: function _addInfoWin() {var n = this;!t.prototype.initialize && e();var i = new t(n._marker.getPosition(), n._opts.defaultContent);i.setRelatedClass(this), this._overlay = i, this._map.addOverlay(i), this._opts.showInfoWindow ? this.showInfoWindow() : this.hideInfoWindow();}, _getMercator: function _getMercator(t) {return this._map.getMapType().getProjection().lngLatToPoint(t);}, _getDistance: function _getDistance(t, e) {return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));}, _move: function _move(t, e, n) {var i = this,o = 0,a = this._opts.speed / 100,r = this._projection.lngLatToPoint(t),s = this._projection.lngLatToPoint(e),l = Math.round(i._getDistance(r, s) / a);if (l < 1) return void i._moveNext(++i.i);i._intervalFlag = setInterval(function () {if (o >= l) {if (clearInterval(i._intervalFlag), i.i > i._path.length) return;i._moveNext(++i.i);} else {o++;var a = n(r.x, s.x, o, l),c = n(r.y, s.y, o, l),u = i._projection.pointToLngLat(new BMap.Pixel(a, c));if (1 == o) {var h = null;i.i - 1 >= 0 && (h = i._path[i.i - 1]), 1 == i._opts.enableRotation && i.setRotation(h, t, e), i._opts.autoView && (i._map.getBounds().containsPoint(u) || i._map.setCenter(u));}i._marker.setPosition(u), i._setInfoWin(u);}}, 10);}, setRotation: function setRotation(t, e, n) {var i = this,o = 0;if (e = i._map.pointToPixel(e), n = i._map.pointToPixel(n), n.x != e.x) {var a = (n.y - e.y) / (n.x - e.x);o = 360 * Math.atan(a) / (2 * Math.PI), o = n.x < e.x ? 90 - o + 90 : -o, i._marker.setRotation(-o);} else {var r = n.y - e.y,s = 0;s = r > 0 ? -1 : 1, i._marker.setRotation(90 * -s);}}, linePixellength: function linePixellength(t, e) {return Math.sqrt(Math.abs(t.x - e.x) * Math.abs(t.x - e.x) + Math.abs(t.y - e.y) * Math.abs(t.y - e.y));}, pointToPoint: function pointToPoint(t, e) {return Math.abs(t.x - e.x) * Math.abs(t.x - e.x) + Math.abs(t.y - e.y) * Math.abs(t.y - e.y);}, _moveNext: function _moveNext(t) {var e = this;t < this._path.length - 1 ? e._move(e._path[t], e._path[t + 1], e._tween.linear) : e.stop();}, _setInfoWin: function _setInfoWin(t) {var e = this;e._overlay.setPosition(t, e._marker.getIcon().size);var n = e._troughPointIndex(t);-1 != n ? (clearInterval(e._intervalFlag), e._overlay.setHtml(e._opts.landmarkPois[n].html), e._overlay.setPosition(t, e._marker.getIcon().size), e._pauseForView(n)) : e._overlay.setHtml(e._opts.defaultContent);}, _pauseForView: function _pauseForView(t) {var e = this,n = setTimeout(function () {e._moveNext(++e.i);}, 1e3 * e._opts.landmarkPois[t].pauseTime);e._setTimeoutQuene.push(n);}, _clearTimeout: function _clearTimeout() {for (var t in this._setTimeoutQuene) {clearTimeout(this._setTimeoutQuene[t]);}this._setTimeoutQuene.length = 0;}, _tween: { linear: function linear(t, e, n, i) {return (e - t) * n / i + t;} }, _troughPointIndex: function _troughPointIndex(t) {for (var e = this._opts.landmarkPois, n = 0, i = e.length; n < i; n++) {if (!e[n].bShow && this._map.getDistance(new BMap.Point(e[n].lng, e[n].lat), t) < 10) return e[n].bShow = !0, n;}return -1;} }), i;});}, function (t, e, n) {(function (e) {var i, o;!function (e, n) {t.exports = n();}(0, function () {"use strict";function t(t) {this._markerClusterer = t, this._map = t.getMap(), this._minClusterSize = t.getMinClusterSize(), this._isAverageCenter = t.isAverageCenter(), this._center = null, this._markers = [], this._gridBounds = null, this._isReal = !1, this._clusterMarker = new s(this._center, this._markers.length, { styles: this._markerClusterer.getStyles() });}var a = "undefined" != typeof window ? window : void 0 !== e ? e : this,r = function (t, e) {return e = { exports: {} }, t(e, e.exports, a), e.exports;}(function (t, e, a) {!function (a, r) {"object" == typeof e ? t.exports = r() : (i = r, void 0 !== (o = "function" == typeof i ? i.call(e, n, e, t) : i) && (t.exports = o));}(0, function () {var t,e = t = e || { version: "1.3.8" },n = {};e.guid = "$BAIDU$", n[e.guid] = n[e.guid] || {}, e.dom = e.dom || {}, e.dom.g = function (t) {return "string" == typeof t || t instanceof String ? document.getElementById(t) : t && t.nodeName && (1 == t.nodeType || 9 == t.nodeType) ? t : null;}, e.g = e.G = e.dom.g, e.dom.getDocument = function (t) {return t = e.dom.g(t), 9 == t.nodeType ? t : t.ownerDocument || t.document;}, e.lang = e.lang || {}, e.lang.isString = function (t) {return "[object String]" == Object.prototype.toString.call(t);}, e.isString = e.lang.isString, e.dom._g = function (t) {return e.lang.isString(t) ? document.getElementById(t) : t;}, e._g = e.dom._g, e.browser = e.browser || {}, /msie (\d+\.\d)/i.test(navigator.userAgent) && (e.browser.ie = e.ie = document.documentMode || +RegExp.$1), e.dom.getComputedStyle = function (t, n) {t = e.dom._g(t);var i,o = e.dom.getDocument(t);return o.defaultView && o.defaultView.getComputedStyle && (i = o.defaultView.getComputedStyle(t, null)) ? i[n] || i.getPropertyValue(n) : "";}, e.dom._styleFixer = e.dom._styleFixer || {}, e.dom._styleFilter = e.dom._styleFilter || [], e.dom._styleFilter.filter = function (t, n, i) {for (var o, a = 0, r = e.dom._styleFilter; o = r[a]; a++) {(o = o[i]) && (n = o(t, n));}return n;}, e.string = e.string || {}, e.string.toCamelCase = function (t) {return t.indexOf("-") < 0 && t.indexOf("_") < 0 ? t : t.replace(/[-_][^-_]/g, function (t) {return t.charAt(1).toUpperCase();});}, e.dom.getStyle = function (t, n) {var i = e.dom;t = i.g(t), n = e.string.toCamelCase(n);var o = t.style[n] || (t.currentStyle ? t.currentStyle[n] : "") || i.getComputedStyle(t, n);if (!o) {var a = i._styleFixer[n];a && (o = a.get ? a.get(t) : e.dom.getStyle(t, a));}return (a = i._styleFilter) && (o = a.filter(n, o, "get")), o;}, e.getStyle = e.dom.getStyle, /opera\/(\d+\.\d)/i.test(navigator.userAgent) && (e.browser.opera = +RegExp.$1), e.browser.isWebkit = /webkit/i.test(navigator.userAgent), e.browser.isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent), e.browser.isStrict = "CSS1Compat" == document.compatMode, e.dom.getPosition = function (t) {t = e.dom.g(t);var n,i,o = e.dom.getDocument(t),a = e.browser,r = e.dom.getStyle,s = (a.isGecko > 0 && o.getBoxObjectFor && "absolute" == r(t, "position") && ("" === t.style.top || t.style.left), { left: 0, top: 0 }),l = a.ie && !a.isStrict ? o.body : o.documentElement;if (t == l) return s;if (t.getBoundingClientRect) {i = t.getBoundingClientRect(), s.left = Math.floor(i.left) + Math.max(o.documentElement.scrollLeft, o.body.scrollLeft), s.top = Math.floor(i.top) + Math.max(o.documentElement.scrollTop, o.body.scrollTop), s.left -= o.documentElement.clientLeft, s.top -= o.documentElement.clientTop;var c = o.body,u = parseInt(r(c, "borderLeftWidth")),h = parseInt(r(c, "borderTopWidth"));a.ie && !a.isStrict && (s.left -= isNaN(u) ? 2 : u, s.top -= isNaN(h) ? 2 : h);} else {n = t;do {if (s.left += n.offsetLeft, s.top += n.offsetTop, a.isWebkit > 0 && "fixed" == r(n, "position")) {s.left += o.body.scrollLeft, s.top += o.body.scrollTop;break;}n = n.offsetParent;} while (n && n != t);for ((a.opera > 0 || a.isWebkit > 0 && "absolute" == r(t, "position")) && (s.top -= o.body.offsetTop), n = t.offsetParent; n && n != o.body;) {s.left -= n.scrollLeft, a.opera && "TR" == n.tagName || (s.top -= n.scrollTop), n = n.offsetParent;}}return s;}, e.event = e.event || {}, e.event._listeners = e.event._listeners || [], e.event.on = function (t, n, i) {n = n.replace(/^on/i, ""), t = e.dom._g(t);var o,a = function a(e) {i.call(t, e);},r = e.event._listeners,s = e.event._eventFilter,l = n;return n = n.toLowerCase(), s && s[n] && (o = s[n](t, n, a), l = o.type, a = o.listener), t.addEventListener ? t.addEventListener(l, a, !1) : t.attachEvent && t.attachEvent("on" + l, a), r[r.length] = [t, n, i, a, l], t;}, e.on = e.event.on, function () {var t = n[e.guid];e.lang.guid = function () {return "TANGRAM__" + (t._counter++).toString(36);}, t._counter = t._counter || 1;}(), n[e.guid]._instances = n[e.guid]._instances || {}, e.lang.isFunction = function (t) {return "[object Function]" == Object.prototype.toString.call(t);}, e.lang.Class = function (t) {this.guid = t || e.lang.guid(), n[e.guid]._instances[this.guid] = this;}, n[e.guid]._instances = n[e.guid]._instances || {}, e.lang.Class.prototype.dispose = function () {delete n[e.guid]._instances[this.guid];for (var t in this) {e.lang.isFunction(this[t]) || delete this[t];}this.disposed = !0;}, e.lang.Class.prototype.toString = function () {return "[object " + (this._className || "Object") + "]";}, e.lang.Event = function (t, e) {this.type = t, this.returnValue = !0, this.target = e || null, this.currentTarget = null;}, e.lang.Class.prototype.addEventListener = function (t, n, i) {if (e.lang.isFunction(n)) {!this.__listeners && (this.__listeners = {});var o,a = this.__listeners;if ("string" == typeof i && i) {if (/[^\w\-]/.test(i)) throw "nonstandard key:" + i;n.hashCode = i, o = i;}0 != t.indexOf("on") && (t = "on" + t), "object" != typeof a[t] && (a[t] = {}), o = o || e.lang.guid(), n.hashCode = o, a[t][o] = n;}}, e.lang.Class.prototype.removeEventListener = function (t, n) {if (void 0 === n || (!e.lang.isFunction(n) || (n = n.hashCode)) && e.lang.isString(n)) {!this.__listeners && (this.__listeners = {}), 0 != t.indexOf("on") && (t = "on" + t);var i = this.__listeners;if (i[t]) if (void 0 !== n) i[t][n] && delete i[t][n];else for (var o in i[t]) {delete i[t][o];}}}, e.lang.Class.prototype.dispatchEvent = function (t, n) {e.lang.isString(t) && (t = new e.lang.Event(t)), !this.__listeners && (this.__listeners = {}), n = n || {};for (var i in n) {t[i] = n[i];}var i,o = this.__listeners,a = t.type;if (t.target = t.target || this, t.currentTarget = this, 0 != a.indexOf("on") && (a = "on" + a), e.lang.isFunction(this[a]) && this[a].apply(this, arguments), "object" == typeof o[a]) for (i in o[a]) {o[a][i].apply(this, arguments);}return t.returnValue;}, e.lang.inherits = function (t, e, n) {var i,o,a = t.prototype,r = new Function();r.prototype = e.prototype, o = t.prototype = new r();for (i in a) {o[i] = a[i];}t.prototype.constructor = t, t.superClass = e.prototype, "string" == typeof n && (o._className = n);}, e.inherits = e.lang.inherits;var i = function i(e, n, o) {try {BMap;} catch (t) {throw Error("Baidu Map JS API is not ready yet!");}t.lang.inherits(i, BMap.Overlay, "TextIconOverlay"), this._position = e, this._text = n, this._options = o || {}, this._styles = this._options.styles || [], !this._styles.length && this._setupDefaultStyles();};return i.prototype._setupDefaultStyles = function () {for (var t, e = [53, 56, 66, 78, 90], n = 0; t = e[n]; n++) {this._styles.push({ url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m" + n + ".png", size: new BMap.Size(t, t) });}}, i.prototype.initialize = function (t) {return this._map = t, this._domElement = document.createElement("div"), this._updateCss(), this._updateText(), this._updatePosition(), this._bind(), this._map.getPanes().markerMouseTarget.appendChild(this._domElement), this._domElement;}, i.prototype.draw = function () {this._map && this._updatePosition();}, i.prototype.getText = function () {return this._text;}, i.prototype.setText = function (t) {!t || this._text && this._text.toString() == t.toString() || (this._text = t, this._updateText(), this._updateCss(), this._updatePosition());}, i.prototype.getPosition = function () {return this._position;}, i.prototype.setPosition = function (t) {!t || this._position && this._position.equals(t) || (this._position = t, this._updatePosition());}, i.prototype.getStyleByText = function (t, e) {var n = parseInt(t),i = parseInt(n / 10);return i = Math.max(0, i), i = Math.min(i, e.length - 1), e[i];}, i.prototype._updateCss = function () {if (this._domElement) {var t = this.getStyleByText(this._text, this._styles);this._domElement.style.cssText = this._buildCssText(t);}}, i.prototype._updateText = function () {this._domElement && (this._domElement.innerHTML = this._text);}, i.prototype._updatePosition = function () {if (this._domElement && this._position) {var t = this._domElement.style,e = this._map.pointToOverlayPixel(this._position);e.x -= Math.ceil(parseInt(t.width) / 2), e.y -= Math.ceil(parseInt(t.height) / 2), t.left = e.x + "px", t.top = e.y + "px";}}, i.prototype._buildCssText = function (e) {var n = e.url,i = e.size,o = e.anchor,a = e.offset,r = e.textColor || "black",s = e.textSize || 10,l = [];if (t.browser.ie < 7) l.push('filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="' + n + '");');else {l.push("background-image:url(" + n + ");");var c = "0 0";a instanceof BMap.Size && (c = a.width + "px " + a.height + "px"), l.push("background-position:" + c + ";");}return i instanceof BMap.Size && (o instanceof BMap.Size ? (o.height > 0 && o.height < i.height && l.push("height:" + (i.height - o.height) + "px; padding-top:" + o.height + "px;"), o.width > 0 && o.width < i.width && l.push("width:" + (i.width - o.width) + "px; padding-left:" + o.width + "px;")) : (l.push("height:" + i.height + "px; line-height:" + i.height + "px;"), l.push("width:" + i.width + "px; text-align:center;"))), l.push("cursor:pointer; color:" + r + "; position:absolute; font-size:" + s + "px; font-family:Arial,sans-serif; font-weight:bold"), l.join("");}, i.prototype._bind = function () {function e(e, n) {var o = e.srcElement || e.target,a = e.clientX || e.pageX,r = e.clientY || e.pageY;if (e && n && a && r && o) {var s = t.dom.getPosition(i.getContainer());n.pixel = new BMap.Pixel(a - s.left, r - s.top), n.point = i.pixelToPoint(n.pixel);}return n;}if (this._domElement) {var n = this,i = this._map,o = t.lang.Event;t.event.on(this._domElement, "mouseover", function (t) {n.dispatchEvent(e(t, new o("onmouseover")));}), t.event.on(this._domElement, "mouseout", function (t) {n.dispatchEvent(e(t, new o("onmouseout")));}), t.event.on(this._domElement, "click", function (t) {n.dispatchEvent(e(t, new o("onclick")));});}}, i;});}),s = r && "object" == typeof r && "default" in r ? r.default : r,l = function l(t, e, n) {e = c(e);var i = t.pointToPixel(e.getNorthEast()),o = t.pointToPixel(e.getSouthWest());i.x += n, i.y -= n, o.x -= n, o.y += n;var a = t.pixelToPoint(i),r = t.pixelToPoint(o);return new BMap.Bounds(r, a);},c = function c(t) {var e = u(t.getNorthEast().lng, -180, 180),n = u(t.getSouthWest().lng, -180, 180),i = u(t.getNorthEast().lat, -74, 74),o = u(t.getSouthWest().lat, -74, 74);return new BMap.Bounds(new BMap.Point(n, o), new BMap.Point(e, i));},u = function u(t, e, n) {return e && (t = Math.max(t, e)), n && (t = Math.min(t, n)), t;},h = function h(t) {return "[object Array]" === Object.prototype.toString.call(t);},p = function p(t, e) {var n = -1;if (h(e)) if (e.indexOf) n = e.indexOf(t);else for (var i, o = 0; i = e[o]; o++) {if (i === t) {n = o;break;}}return n;},d = function d(t, e) {try {BMap;} catch (t) {throw Error("Baidu Map JS API is not ready yet!");}if (t) {this._map = t, this._markers = [], this._clusters = [];var n = e || {};this._gridSize = n.gridSize || 60, this._maxZoom = n.maxZoom || 18, this._minClusterSize = n.minClusterSize || 2, this._isAverageCenter = !1, void 0 != n.isAverageCenter && (this._isAverageCenter = n.isAverageCenter), this._styles = n.styles || [];var i = this;this._map.addEventListener("zoomend", function () {i._redraw();}), this._map.addEventListener("moveend", function () {i._redraw();});var o = n.markers;h(o) && this.addMarkers(o);}};return d.prototype.addMarkers = function (t) {if (t.length) {for (var e = 0, n = t.length; e < n; e++) {this._pushMarkerTo(t[e]);}this._createClusters();}}, d.prototype._pushMarkerTo = function (t) {-1 === p(t, this._markers) && (t.isInCluster = !1, this._markers.push(t));}, d.prototype.addMarker = function (t) {this._pushMarkerTo(t), this._createClusters();}, d.prototype._createClusters = function () {var t = this._map.getBounds();if (t.getCenter()) for (var e, n = l(this._map, t, this._gridSize), i = 0; e = this._markers[i]; i++) {!e.isInCluster && n.containsPoint(e.getPosition()) && this._addToClosestCluster(e);}}, d.prototype._addToClosestCluster = function (e) {for (var n, i = 4e6, o = null, a = (e.getPosition(), 0); n = this._clusters[a]; a++) {var r = n.getCenter();if (r) {var s = this._map.getDistance(r, e.getPosition());s < i && (i = s, o = n);}}if (o && o.isMarkerInClusterBounds(e)) o.addMarker(e);else {var n = new t(this);n.addMarker(e), this._clusters.push(n);}}, d.prototype._clearLastClusters = function () {for (var t, e = 0; t = this._clusters[e]; e++) {t.remove();}this._clusters = [], this._removeMarkersFromCluster();}, d.prototype._removeMarkersFromCluster = function () {for (var t, e = 0; t = this._markers[e]; e++) {t.isInCluster = !1;}}, d.prototype._removeMarkersFromMap = function () {for (var t, e = 0; t = this._markers[e]; e++) {t.isInCluster = !1;var n = t.getLabel();this._map.removeOverlay(t), t.setLabel(n);}}, d.prototype._removeMarker = function (t) {var e = p(t, this._markers);return -1 !== e && (this._map.removeOverlay(t), this._markers.splice(e, 1), !0);}, d.prototype.removeMarker = function (t) {var e = this._removeMarker(t);return e && (this._clearLastClusters(), this._createClusters()), e;}, d.prototype.removeMarkers = function (t) {for (var e = !1, n = 0; n < t.length; n++) {var i = this._removeMarker(t[n]);e = e || i;}return e && (this._clearLastClusters(), this._createClusters()), e;}, d.prototype.clearMarkers = function () {this._clearLastClusters(), this._removeMarkersFromMap(), this._markers = [];}, d.prototype._redraw = function () {this._clearLastClusters(), this._createClusters();}, d.prototype.getGridSize = function () {return this._gridSize;}, d.prototype.setGridSize = function (t) {this._gridSize = t, this._redraw();}, d.prototype.getMaxZoom = function () {return this._maxZoom;}, d.prototype.setMaxZoom = function (t) {this._maxZoom = t, this._redraw();}, d.prototype.getStyles = function () {return this._styles;}, d.prototype.setStyles = function (t) {this._styles = t, this._redraw();}, d.prototype.getMinClusterSize = function () {return this._minClusterSize;}, d.prototype.setMinClusterSize = function (t) {this._minClusterSize = t, this._redraw();}, d.prototype.isAverageCenter = function () {return this._isAverageCenter;}, d.prototype.getMap = function () {return this._map;}, d.prototype.getMarkers = function () {return this._markers;}, d.prototype.getClustersCount = function () {for (var t, e = 0, n = 0; t = this._clusters[n]; n++) {t.isReal() && e++;}return e;}, t.prototype.addMarker = function (t) {if (this.isMarkerInCluster(t)) return !1;if (this._center) {if (this._isAverageCenter) {var e = this._markers.length + 1,n = (this._center.lat * (e - 1) + t.getPosition().lat) / e,i = (this._center.lng * (e - 1) + t.getPosition().lng) / e;this._center = new BMap.Point(i, n), this.updateGridBounds();}} else this._center = t.getPosition(), this.updateGridBounds();t.isInCluster = !0, this._markers.push(t);var o = this._markers.length;if (o < this._minClusterSize) return this._map.addOverlay(t), !0;if (o === this._minClusterSize) for (var a = 0; a < o; a++) {var r = this._markers[a].getLabel();this._markers[a].getMap() && this._map.removeOverlay(this._markers[a]), this._markers[a].setLabel(r);}return this._map.addOverlay(this._clusterMarker), this._isReal = !0, this.updateClusterMarker(), !0;}, t.prototype.isMarkerInCluster = function (t) {if (this._markers.indexOf) return -1 != this._markers.indexOf(t);for (var e, n = 0; e = this._markers[n]; n++) {if (e === t) return !0;}return !1;}, t.prototype.isMarkerInClusterBounds = function (t) {return this._gridBounds.containsPoint(t.getPosition());}, t.prototype.isReal = function (t) {return this._isReal;}, t.prototype.updateGridBounds = function () {var t = new BMap.Bounds(this._center, this._center);this._gridBounds = l(this._map, t, this._markerClusterer.getGridSize());}, t.prototype.updateClusterMarker = function () {if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {this._clusterMarker && this._map.removeOverlay(this._clusterMarker);for (var t, e = 0; t = this._markers[e]; e++) {this._map.addOverlay(t);}} else {if (this._markers.length < this._minClusterSize) return void this._clusterMarker.hide();this._clusterMarker.setPosition(this._center), this._clusterMarker.setText(this._markers.length), this._clusterMarker.addEventListener && !this._clusterMarker._hasClickEvent && this._clusterMarker.addEventListener("click", function (t) {this._clusterMarker._hasClickEvent = !0, this._markers && this._map.setViewport(this.getBounds());}.bind(this));}}, t.prototype.remove = function () {for (var t = 0; this._markers[t]; t++) {var e = this._markers[t].getLabel();this._markers[t].getMap() && this._map.removeOverlay(this._markers[t]), this._markers[t].setLabel(e);}this._map.removeOverlay(this._clusterMarker), this._markers.length = 0, delete this._markers;}, t.prototype.getBounds = function () {for (var t, e = new BMap.Bounds(this._center, this._center), n = 0; t = this._markers[n]; n++) {e.extend(t.getPosition());}return e;}, t.prototype.getCenter = function () {return this._center;}, d;});}).call(e, n(3));}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div");}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", { directives: [{ name: "show", rawName: "v-show", value: t.show, expression: "show" }] }, [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", { directives: [{ name: "show", rawName: "v-show", value: t.panel, expression: "panel" }] }, [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement,n = t._self._c || e;return t.paths.length ? n("div", t._l(t.paths, function (e, i) {return n("bm-polygon", { key: i, attrs: { path: e, "stroke-color": t.strokeColor, "stroke-weight": t.strokeWeight, "stroke-opacity": t.strokeOpacity, "stroke-style": t.strokeStyle, "fill-opacity": t.fillOpacity, "fill-color": t.fillColor, "mass-clear": t.massClear, clicking: t.clicking }, on: { click: function click(e) {t.$emit("click", e);}, dblclick: function dblclick(e) {t.$emit("dblclick", e);}, mousedown: function mousedown(e) {t.$emit("mousedown", e);}, mouseup: function mouseup(e) {t.$emit("mouseup", e);}, mouseout: function mouseout(e) {t.$emit("mouseout", e);}, mouseover: function mouseover(e) {t.$emit("mouseover", e);}, remove: function remove(e) {t.$emit("remove", e);} } });})) : t._e();}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", { directives: [{ name: "show", rawName: "v-show", value: t.panel, expression: "panel" }] }, [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("span", [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("span", [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", { directives: [{ name: "show", rawName: "v-show", value: t.panel, expression: "panel" }] });}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", { directives: [{ name: "show", rawName: "v-show", value: t.panel, expression: "panel" }] }, [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", { directives: [{ name: "show", rawName: "v-show", value: t.panel, expression: "panel" }] }, [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement,n = t._self._c || e;return n("span", [t._t("default", [n("input")])], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement;return (t._self._c || e)("div", [t._t("default")], 2);}, staticRenderFns: [] };}, function (t, e) {t.exports = { render: function render() {var t = this,e = t.$createElement,n = t._self._c || e;return n("div", [t.hasBmView ? t._e() : n("div", { ref: "view", staticStyle: { width: "100%", height: "100%" } }), t._v(" "), t._t("default")], 2);}, staticRenderFns: [] };}]);});

/***/ }),

/***/ 190:
/*!*********************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/static/js/myDeviceMore.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /**
                                                                                                                                                                                                                                                                                                                * @name 封装下拉
                                                                                                                                                                                                                                                                                                                * @params getList 刷新数据的函数
                                                                                                                                                                                                                                                                                                                * @params listData 存放数据的变量名
                                                                                                                                                                                                                                                                                                                * @params page 页数变量名
                                                                                                                                                                                                                                                                                                                */var _default =
function _default(_ref) {var _ref$getList = _ref.getList,getList = _ref$getList === void 0 ? "getList" : _ref$getList,_ref$listData = _ref.listData,listData = _ref$listData === void 0 ? "listData" : _ref$listData,_ref$page = _ref.page,page = _ref$page === void 0 ? "page" : _ref$page,_ref$initIndex = _ref.initIndex,initIndex = _ref$initIndex === void 0 ? "initIndex" : _ref$initIndex,_ref$modelData = _ref.modelData,modelData = _ref$modelData === void 0 ? "modelData" : _ref$modelData;
  var startPoint = {};
  var endPoint = {};
  return {
    data: function data() {var _ref2;
      return _ref2 = {}, _defineProperty(_ref2,
      listData, []), _defineProperty(_ref2,
      page, 1), _defineProperty(_ref2,
      initIndex, 0), _defineProperty(_ref2,
      modelData, [
      { label: "告警记录", backgroud: "color:#FF0000" },
      { label: "报修记录", backgroud: "color:#FF0000" }]), _ref2;


    },
    onPullDownRefresh: function onPullDownRefresh() {
      this.refresh();
    },
    onReachBottom: function onReachBottom() {
      this[getList].call(this, this[page], this.__pulldone);
    },
    methods: {
      refresh: function refresh() {
        this[page] = 1;
        this[getList].call(this, this[page], this.__pulldone);
      },
      __pulldone: function __pulldone(data) {
        var db = data || [];
        if (this[page] == 1) {
          this[listData] = db;
        } else {
          this[listData] = (this[listData] || []).concat(db);
        }
        uni.stopPullDownRefresh();
        this[page]++;
      },

      /**
          * @name 动态开启或关闭pulldown
          * @params {boolean} isOpen
          */
      setPullDown: function setPullDown(isOpen) {











      } } };



};exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 205:
/*!*********************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/static/js/myDevicePull.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;





var _request = _interopRequireDefault(__webpack_require__(/*! ../../api/request.js */ 30));
var _global = _interopRequireDefault(__webpack_require__(/*! ../../static/js/global.js */ 26));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var _default =
function _default(_ref) {var _ref$getList = _ref.getList,getList = _ref$getList === void 0 ? "getList" : _ref$getList,_ref$listData = _ref.listData,listData = _ref$listData === void 0 ? "listData" : _ref$listData,_ref$page = _ref.page,page = _ref$page === void 0 ? "page" : _ref$page,_ref$initIndex = _ref.initIndex,initIndex = _ref$initIndex === void 0 ? "initIndex" : _ref$initIndex,_ref$modelData = _ref.modelData,modelData = _ref$modelData === void 0 ? "modelData" : _ref$modelData;
  var startPoint = {};
  var endPoint = {};
  return {
    data: function data() {var _ref2;
      return _ref2 = {}, _defineProperty(_ref2,
      listData, []), _defineProperty(_ref2,
      page, 1), _defineProperty(_ref2,
      initIndex, 0), _defineProperty(_ref2,
      modelData, []), _ref2;



    },
    onPullDownRefresh: function onPullDownRefresh() {
      this.refreshes();
    },
    onReachBottom: function onReachBottom() {
      this[getList].call(this, this[page], this.__pulldone);
    },
    methods: {
      refreshes: function refreshes() {
        this[page] = 1;
        this[getList].call(this, this[page], this.__pulldone);
      },
      __pulldone: function __pulldone(data) {
        var db = data || [];
        if (this[page] == 1) {
          this[listData] = db;
        } else {
          this[listData] = (this[listData] || []).concat(db);
        }
        uni.stopPullDownRefresh();
        this[page]++;
      },

      /**
          * @name 动态开启或关闭pulldown
          * @params {boolean} isOpen
          */
      setPullDown: function setPullDown(isOpen) {











      },

      /**
          * @name 开始滑动
          */
      touchstart: function touchstart(e) {
        startPoint = {
          pageX: e.pageX || e.changedTouches[0].pageX,
          pageY: e.pageY || e.changedTouches[0].pageY };

      },

      /**
          * @name 滑动结束
          */
      touchend: function touchend(e) {
        endPoint = {
          pageX: e.mp.changedTouches[0].pageX,
          pageY: e.mp.changedTouches[0].pageY

          // 判断是左滑动还是右滑动 当横向位移大于10，纵向位移大于100，则判定为滑动事件
        };var disX = endPoint.pageX - startPoint.pageX; //计算移动的位移差
        var disY = endPoint.pageY - startPoint.pageY;
        if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
          if (Math.abs(disX) > Math.abs(disY)) {//判断是横向滑动还是纵向滑动
            if (disX > 10) {
              this.swiperight(); //右滑
            };
            if (disX < -10) {
              this.swipeleft(); //左滑
            };
          }
        }
      },

      /**
          * @name 向左滑动
          */
      swipeleft: function swipeleft() {
        if (this[initIndex] < this[modelData].length - 1) this[initIndex]++;
        console.log("左滑");
      },

      /**
          * @name 监听右滑
          */
      swiperight: function swiperight() {
        if (this[initIndex] > 0) this[initIndex]--;
        console.log("右滑");
      },
      getDeviceType: function getDeviceType() {
        var that = this;
        _global.default.showLoading();
        var param = {
          openId: 'wx123456789' };

        _request.default.apiGet('/toc/deviceType/list', param).then(function (res) {
          if (res.code == '0') {
            res.data.forEach(function (item, index) {
              that[modelData].push({
                label: item.typeName,
                background: 'FF0000',
                typeId: item.typeId });

            });
            _global.default.hideLoading();
          } else {
            _global.default.hideLoading();
            _global.default.showToast(res.msg);
          }
        }).catch(function (reason) {
          _global.default.hideLoading();
          _global.default.showToast(reason);
        });
      } },

    mounted: function mounted() {
      this.getDeviceType();
    } };

};exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 213:
/*!**********************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/static/js/myWarnHistroy.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /**
                                                                                                                                                                                                                                                                                                                * @name 封装下拉
                                                                                                                                                                                                                                                                                                                * @params getList 刷新数据的函数
                                                                                                                                                                                                                                                                                                                * @params listData 存放数据的变量名
                                                                                                                                                                                                                                                                                                                * @params page 页数变量名
                                                                                                                                                                                                                                                                                                                */var _default =
function _default(_ref) {var _ref$getList = _ref.getList,getList = _ref$getList === void 0 ? "getList" : _ref$getList,_ref$listData = _ref.listData,listData = _ref$listData === void 0 ? "listData" : _ref$listData,_ref$page = _ref.page,page = _ref$page === void 0 ? "page" : _ref$page,_ref$initIndex = _ref.initIndex,initIndex = _ref$initIndex === void 0 ? "initIndex" : _ref$initIndex,_ref$modelData = _ref.modelData,modelData = _ref$modelData === void 0 ? "modelData" : _ref$modelData;
  var startPoint = {};
  var endPoint = {};
  return {
    data: function data() {var _ref2;
      return _ref2 = {}, _defineProperty(_ref2,
      listData, []), _defineProperty(_ref2,
      page, 1), _defineProperty(_ref2,
      initIndex, 0), _defineProperty(_ref2,
      modelData, [
      // {label:"全部",backgroud:"color:#000000"},
      { label: "告警", backgroud: "color:#FF0000" }]), _ref2;




    },
    onPullDownRefresh: function onPullDownRefresh() {
      this.refreshes();
    },
    onReachBottom: function onReachBottom() {
      this[getList].call(this, this[page], this.__pulldone);
    },
    methods: {
      refreshes: function refreshes() {
        this[page] = 1;
        this[getList].call(this, this[page], this.__pulldone);
      },
      __pulldone: function __pulldone(data) {
        var db = data || [];
        if (this[page] == 1) {
          this[listData] = db;
        } else {
          this[listData] = (this[listData] || []).concat(db);
        }
        uni.stopPullDownRefresh();
        this[page]++;
      },

      /**
          * @name 动态开启或关闭pulldown
          * @params {boolean} isOpen
          */
      setPullDown: function setPullDown(isOpen) {











      },

      /**
          * @name 开始滑动
          */
      touchstart: function touchstart(e) {
        startPoint = {
          pageX: e.pageX || e.changedTouches[0].pageX,
          pageY: e.pageY || e.changedTouches[0].pageY };

      },

      /**
          * @name 滑动结束
          */
      touchend: function touchend(e) {
        endPoint = {
          pageX: e.mp.changedTouches[0].pageX,
          pageY: e.mp.changedTouches[0].pageY

          // 判断是左滑动还是右滑动 当横向位移大于10，纵向位移大于100，则判定为滑动事件
        };var disX = endPoint.pageX - startPoint.pageX; //计算移动的位移差
        var disY = endPoint.pageY - startPoint.pageY;
        if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
          if (Math.abs(disX) > Math.abs(disY)) {//判断是横向滑动还是纵向滑动
            if (disX > 10) {
              this.swiperight(); //右滑
            };
            if (disX < -10) {
              this.swipeleft(); //左滑
            };
          }
        }
      },

      /**
          * @name 向左滑动
          */
      swipeleft: function swipeleft() {
        if (this[initIndex] < this[modelData].length - 1) this[initIndex]++;
        console.log("左滑");
      },

      /**
          * @name 监听右滑
          */
      swiperight: function swiperight() {
        if (this[initIndex] > 0) this[initIndex]--;
        console.log("右滑");
      } } };


};exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 25:
/*!************************************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/node_modules/jweixin-module/out/index.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}!function (e, n) { true ? module.exports = n(e) : undefined;}(window, function (o, e) {function c(n, e, i) {o.WeixinJSBridge ? WeixinJSBridge.invoke(n, r(e), function (e) {a(n, e, i);}) : d(n, i);}function i(n, i, t) {o.WeixinJSBridge ? WeixinJSBridge.on(n, function (e) {t && t.trigger && t.trigger(e), a(n, e, i);}) : d(n, t || i);}function r(e) {return (e = e || {}).appId = M.appId, e.verifyAppId = M.appId, e.verifySignType = "sha1", e.verifyTimestamp = M.timestamp + "", e.verifyNonceStr = M.nonceStr, e.verifySignature = M.signature, e;}function n(e) {return { timeStamp: e.timestamp + "", nonceStr: e.nonceStr, package: e.package, paySign: e.paySign, signType: e.signType || "SHA1" };}function a(e, n, i) {"openEnterpriseChat" == e && (n.errCode = n.err_code), delete n.err_code, delete n.err_desc, delete n.err_detail;var t = n.errMsg;t || (t = n.err_msg, delete n.err_msg, t = function (e, n) {var i = e,t = f[i];t && (i = t);var o = "ok";if (n) {var r = n.indexOf(":");"confirm" == (o = n.substring(r + 1)) && (o = "ok"), "failed" == o && (o = "fail"), -1 != o.indexOf("failed_") && (o = o.substring(7)), -1 != o.indexOf("fail_") && (o = o.substring(5)), "access denied" != (o = (o = o.replace(/_/g, " ")).toLowerCase()) && "no permission to execute" != o || (o = "permission denied"), "config" == i && "function not exist" == o && (o = "ok"), "" == o && (o = "fail");}return n = i + ":" + o;}(e, t), n.errMsg = t), (i = i || {})._complete && (i._complete(n), delete i._complete), t = n.errMsg || "", M.debug && !i.isInnerInvoke && alert(JSON.stringify(n));var o = t.indexOf(":");switch (t.substring(o + 1)) {case "ok":i.success && i.success(n);break;case "cancel":i.cancel && i.cancel(n);break;default:i.fail && i.fail(n);}i.complete && i.complete(n);}function s(e) {if (e) {for (var n = 0, i = e.length; n < i; ++n) {var t = e[n],o = p[t];o && (e[n] = o);}return e;}}function d(e, n) {if (!(!M.debug || n && n.isInnerInvoke)) {var i = f[e];i && (e = i), n && n._complete && delete n._complete, console.log('"' + e + '",', n || "");}}function l() {return new Date().getTime();}function u(e) {I && (o.WeixinJSBridge ? e() : t.addEventListener && t.addEventListener("WeixinJSBridgeReady", e, !1));}if (!o.jWeixin) {var _C;var p = { config: "preVerifyJSAPI", onMenuShareTimeline: "menu:share:timeline", onMenuShareAppMessage: "menu:share:appmessage", onMenuShareQQ: "menu:share:qq", onMenuShareWeibo: "menu:share:weiboApp", onMenuShareQZone: "menu:share:QZone", previewImage: "imagePreview", getLocation: "geoLocation", openProductSpecificView: "openProductViewWithPid", addCard: "batchAddCard", openCard: "batchViewCard", chooseWXPay: "getBrandWCPayRequest", openEnterpriseRedPacket: "getRecevieBizHongBaoRequest", startSearchBeacons: "startMonitoringBeacons", stopSearchBeacons: "stopMonitoringBeacons", onSearchBeacons: "onBeaconsInRange", consumeAndShareCard: "consumedShareCard", openAddress: "editAddress" },f = function () {var e = {};for (var n in p) {e[p[n]] = n;}return e;}(),t = o.document,m = t.title,g = navigator.userAgent.toLowerCase(),h = navigator.platform.toLowerCase(),v = !(!h.match("mac") && !h.match("win")),S = -1 != g.indexOf("wxdebugger"),I = -1 != g.indexOf("micromessenger"),y = -1 != g.indexOf("android"),_ = -1 != g.indexOf("iphone") || -1 != g.indexOf("ipad"),w = (O = g.match(/micromessenger\/(\d+\.\d+\.\d+)/) || g.match(/micromessenger\/(\d+\.\d+)/)) ? O[1] : "",k = { initStartTime: l(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0 },T = { version: 1, appId: "", initTime: 0, preVerifyTime: 0, networkType: "", isPreVerifyOk: 1, systemType: _ ? 1 : y ? 2 : -1, clientVersion: w, url: encodeURIComponent(location.href) },M = {},P = { _completes: [] },x = { state: 0, data: {} };u(function () {k.initEndTime = l();});var A = !1,V = [],C = (_C = { config: function config(e) {d("config", M = e);var t = !1 !== M.check;u(function () {if (t) c(p.config, { verifyJsApiList: s(M.jsApiList) }, function () {P._complete = function (e) {k.preVerifyEndTime = l(), x.state = 1, x.data = e;}, P.success = function (e) {T.isPreVerifyOk = 0;}, P.fail = function (e) {P._fail ? P._fail(e) : x.state = -1;};var t = P._completes;return t.push(function () {!function (e) {if (!(v || S || M.debug || w < "6.0.2" || T.systemType < 0)) {var i = new Image();T.appId = M.appId, T.initTime = k.initEndTime - k.initStartTime, T.preVerifyTime = k.preVerifyEndTime - k.preVerifyStartTime, C.getNetworkType({ isInnerInvoke: !0, success: function success(e) {T.networkType = e.networkType;var n = "https://open.weixin.qq.com/sdk/report?v=" + T.version + "&o=" + T.isPreVerifyOk + "&s=" + T.systemType + "&c=" + T.clientVersion + "&a=" + T.appId + "&n=" + T.networkType + "&i=" + T.initTime + "&p=" + T.preVerifyTime + "&u=" + T.url;i.src = n;} });}}();}), P.complete = function (e) {for (var n = 0, i = t.length; n < i; ++n) {t[n]();}P._completes = [];}, P;}()), k.preVerifyStartTime = l();else {x.state = 1;for (var e = P._completes, n = 0, i = e.length; n < i; ++n) {e[n]();}P._completes = [];}}), C.invoke || (C.invoke = function (e, n, i) {o.WeixinJSBridge && WeixinJSBridge.invoke(e, r(n), i);}, C.on = function (e, n) {o.WeixinJSBridge && WeixinJSBridge.on(e, n);});}, ready: function ready(e) {0 != x.state ? e() : (P._completes.push(e), !I && M.debug && e());}, error: function error(e) {w < "6.0.2" || (-1 == x.state ? e(x.data) : P._fail = e);}, checkJsApi: function checkJsApi(e) {c("checkJsApi", { jsApiList: s(e.jsApiList) }, (e._complete = function (e) {if (y) {var n = e.checkResult;n && (e.checkResult = JSON.parse(n));}e = function (e) {var n = e.checkResult;for (var i in n) {var t = f[i];t && (n[t] = n[i], delete n[i]);}return e;}(e);}, e));}, onMenuShareTimeline: function onMenuShareTimeline(e) {i(p.onMenuShareTimeline, { complete: function complete() {c("shareTimeline", { title: e.title || m, desc: e.title || m, img_url: e.imgUrl || "", link: e.link || location.href, type: e.type || "link", data_url: e.dataUrl || "" }, e);} }, e);}, onMenuShareAppMessage: function onMenuShareAppMessage(n) {i(p.onMenuShareAppMessage, { complete: function complete(e) {"favorite" === e.scene ? c("sendAppMessage", { title: n.title || m, desc: n.desc || "", link: n.link || location.href, img_url: n.imgUrl || "", type: n.type || "link", data_url: n.dataUrl || "" }) : c("sendAppMessage", { title: n.title || m, desc: n.desc || "", link: n.link || location.href, img_url: n.imgUrl || "", type: n.type || "link", data_url: n.dataUrl || "" }, n);} }, n);}, onMenuShareQQ: function onMenuShareQQ(e) {i(p.onMenuShareQQ, { complete: function complete() {c("shareQQ", { title: e.title || m, desc: e.desc || "", img_url: e.imgUrl || "", link: e.link || location.href }, e);} }, e);}, onMenuShareWeibo: function onMenuShareWeibo(e) {i(p.onMenuShareWeibo, { complete: function complete() {c("shareWeiboApp", { title: e.title || m, desc: e.desc || "", img_url: e.imgUrl || "", link: e.link || location.href }, e);} }, e);}, onMenuShareQZone: function onMenuShareQZone(e) {i(p.onMenuShareQZone, { complete: function complete() {c("shareQZone", { title: e.title || m, desc: e.desc || "", img_url: e.imgUrl || "", link: e.link || location.href }, e);} }, e);}, updateTimelineShareData: function updateTimelineShareData(e) {c("updateTimelineShareData", { title: e.title, link: e.link, imgUrl: e.imgUrl }, e);}, updateAppMessageShareData: function updateAppMessageShareData(e) {c("updateAppMessageShareData", { title: e.title, desc: e.desc, link: e.link, imgUrl: e.imgUrl }, e);}, startRecord: function startRecord(e) {c("startRecord", {}, e);}, stopRecord: function stopRecord(e) {c("stopRecord", {}, e);}, onVoiceRecordEnd: function onVoiceRecordEnd(e) {i("onVoiceRecordEnd", e);}, playVoice: function playVoice(e) {c("playVoice", { localId: e.localId }, e);}, pauseVoice: function pauseVoice(e) {c("pauseVoice", { localId: e.localId }, e);}, stopVoice: function stopVoice(e) {c("stopVoice", { localId: e.localId }, e);}, onVoicePlayEnd: function onVoicePlayEnd(e) {i("onVoicePlayEnd", e);}, uploadVoice: function uploadVoice(e) {c("uploadVoice", { localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);}, downloadVoice: function downloadVoice(e) {c("downloadVoice", { serverId: e.serverId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);}, translateVoice: function translateVoice(e) {c("translateVoice", { localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);}, chooseImage: function chooseImage(e) {c("chooseImage", { scene: "1|2", count: e.count || 9, sizeType: e.sizeType || ["original", "compressed"], sourceType: e.sourceType || ["album", "camera"] }, (e._complete = function (e) {if (y) {var n = e.localIds;try {n && (e.localIds = JSON.parse(n));} catch (e) {}}}, e));}, getLocation: function getLocation(e) {}, previewImage: function previewImage(e) {c(p.previewImage, { current: e.current, urls: e.urls }, e);}, uploadImage: function uploadImage(e) {c("uploadImage", { localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);}, downloadImage: function downloadImage(e) {c("downloadImage", { serverId: e.serverId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);}, getLocalImgData: function getLocalImgData(e) {!1 === A ? (A = !0, c("getLocalImgData", { localId: e.localId }, (e._complete = function (e) {if (A = !1, 0 < V.length) {var n = V.shift();wx.getLocalImgData(n);}}, e))) : V.push(e);}, getNetworkType: function getNetworkType(e) {c("getNetworkType", {}, (e._complete = function (e) {e = function (e) {var n = e.errMsg;e.errMsg = "getNetworkType:ok";var i = e.subtype;if (delete e.subtype, i) e.networkType = i;else {var t = n.indexOf(":"),o = n.substring(t + 1);switch (o) {case "wifi":case "edge":case "wwan":e.networkType = o;break;default:e.errMsg = "getNetworkType:fail";}}return e;}(e);}, e));}, openLocation: function openLocation(e) {c("openLocation", { latitude: e.latitude, longitude: e.longitude, name: e.name || "", address: e.address || "", scale: e.scale || 28, infoUrl: e.infoUrl || "" }, e);} }, _defineProperty(_C, "getLocation", function getLocation(e) {c(p.getLocation, { type: (e = e || {}).type || "wgs84" }, (e._complete = function (e) {delete e.type;}, e));}), _defineProperty(_C, "hideOptionMenu", function hideOptionMenu(e) {c("hideOptionMenu", {}, e);}), _defineProperty(_C, "showOptionMenu", function showOptionMenu(e) {c("showOptionMenu", {}, e);}), _defineProperty(_C, "closeWindow", function closeWindow(e) {c("closeWindow", {}, e = e || {});}), _defineProperty(_C, "hideMenuItems", function hideMenuItems(e) {c("hideMenuItems", { menuList: e.menuList }, e);}), _defineProperty(_C, "showMenuItems", function showMenuItems(e) {c("showMenuItems", { menuList: e.menuList }, e);}), _defineProperty(_C, "hideAllNonBaseMenuItem", function hideAllNonBaseMenuItem(e) {c("hideAllNonBaseMenuItem", {}, e);}), _defineProperty(_C, "showAllNonBaseMenuItem", function showAllNonBaseMenuItem(e) {c("showAllNonBaseMenuItem", {}, e);}), _defineProperty(_C, "scanQRCode", function scanQRCode(e) {c("scanQRCode", { needResult: (e = e || {}).needResult || 0, scanType: e.scanType || ["qrCode", "barCode"] }, (e._complete = function (e) {if (_) {var n = e.resultStr;if (n) {var i = JSON.parse(n);e.resultStr = i && i.scan_code && i.scan_code.scan_result;}}}, e));}), _defineProperty(_C, "openAddress", function openAddress(e) {c(p.openAddress, {}, (e._complete = function (e) {var n;(n = e).postalCode = n.addressPostalCode, delete n.addressPostalCode, n.provinceName = n.proviceFirstStageName, delete n.proviceFirstStageName, n.cityName = n.addressCitySecondStageName, delete n.addressCitySecondStageName, n.countryName = n.addressCountiesThirdStageName, delete n.addressCountiesThirdStageName, n.detailInfo = n.addressDetailInfo, delete n.addressDetailInfo, e = n;}, e));}), _defineProperty(_C, "openProductSpecificView", function openProductSpecificView(e) {c(p.openProductSpecificView, { pid: e.productId, view_type: e.viewType || 0, ext_info: e.extInfo }, e);}), _defineProperty(_C, "addCard", function addCard(e) {for (var n = e.cardList, i = [], t = 0, o = n.length; t < o; ++t) {var r = n[t],a = { card_id: r.cardId, card_ext: r.cardExt };i.push(a);}c(p.addCard, { card_list: i }, (e._complete = function (e) {var n = e.card_list;if (n) {for (var i = 0, t = (n = JSON.parse(n)).length; i < t; ++i) {var o = n[i];o.cardId = o.card_id, o.cardExt = o.card_ext, o.isSuccess = !!o.is_succ, delete o.card_id, delete o.card_ext, delete o.is_succ;}e.cardList = n, delete e.card_list;}}, e));}), _defineProperty(_C, "chooseCard", function chooseCard(e) {c("chooseCard", { app_id: M.appId, location_id: e.shopId || "", sign_type: e.signType || "SHA1", card_id: e.cardId || "", card_type: e.cardType || "", card_sign: e.cardSign, time_stamp: e.timestamp + "", nonce_str: e.nonceStr }, (e._complete = function (e) {e.cardList = e.choose_card_info, delete e.choose_card_info;}, e));}), _defineProperty(_C, "openCard", function openCard(e) {for (var n = e.cardList, i = [], t = 0, o = n.length; t < o; ++t) {var r = n[t],a = { card_id: r.cardId, code: r.code };i.push(a);}c(p.openCard, { card_list: i }, e);}), _defineProperty(_C, "consumeAndShareCard", function consumeAndShareCard(e) {c(p.consumeAndShareCard, { consumedCardId: e.cardId, consumedCode: e.code }, e);}), _defineProperty(_C, "chooseWXPay", function chooseWXPay(e) {c(p.chooseWXPay, n(e), e);}), _defineProperty(_C, "openEnterpriseRedPacket", function openEnterpriseRedPacket(e) {c(p.openEnterpriseRedPacket, n(e), e);}), _defineProperty(_C, "startSearchBeacons", function startSearchBeacons(e) {c(p.startSearchBeacons, { ticket: e.ticket }, e);}), _defineProperty(_C, "stopSearchBeacons", function stopSearchBeacons(e) {c(p.stopSearchBeacons, {}, e);}), _defineProperty(_C, "onSearchBeacons", function onSearchBeacons(e) {i(p.onSearchBeacons, e);}), _defineProperty(_C, "openEnterpriseChat", function openEnterpriseChat(e) {c("openEnterpriseChat", { useridlist: e.userIds, chatname: e.groupName }, e);}), _defineProperty(_C, "launchMiniProgram", function launchMiniProgram(e) {c("launchMiniProgram", { targetAppId: e.targetAppId, path: function (e) {if ("string" == typeof e && 0 < e.length) {var n = e.split("?")[0],i = e.split("?")[1];return n += ".html", void 0 !== i ? n + "?" + i : n;}}(e.path), envVersion: e.envVersion }, e);}), _defineProperty(_C, "miniProgram", { navigateBack: function navigateBack(e) {e = e || {}, u(function () {c("invokeMiniProgramAPI", { name: "navigateBack", arg: { delta: e.delta || 1 } }, e);});}, navigateTo: function navigateTo(e) {u(function () {c("invokeMiniProgramAPI", { name: "navigateTo", arg: { url: e.url } }, e);});}, redirectTo: function redirectTo(e) {u(function () {c("invokeMiniProgramAPI", { name: "redirectTo", arg: { url: e.url } }, e);});}, switchTab: function switchTab(e) {u(function () {c("invokeMiniProgramAPI", { name: "switchTab", arg: { url: e.url } }, e);});}, reLaunch: function reLaunch(e) {u(function () {c("invokeMiniProgramAPI", { name: "reLaunch", arg: { url: e.url } }, e);});}, postMessage: function postMessage(e) {u(function () {c("invokeMiniProgramAPI", { name: "postMessage", arg: e.data || {} }, e);});}, getEnv: function getEnv(e) {u(function () {e({ miniprogram: "miniprogram" === o.__wxjs_environment });});} }), _C),L = 1,B = {};return t.addEventListener("error", function (e) {if (!y) {var n = e.target,i = n.tagName,t = n.src;if (("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) && -1 != t.indexOf("wxlocalresource://")) {e.preventDefault(), e.stopPropagation();var o = n["wx-id"];if (o || (o = L++, n["wx-id"] = o), B[o]) return;B[o] = !0, wx.ready(function () {wx.getLocalImgData({ localId: t, success: function success(e) {n.src = e.localData;} });});}}}, !0), t.addEventListener("load", function (e) {if (!y) {var n = e.target,i = n.tagName;if (n.src, "IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) {var t = n["wx-id"];t && (B[t] = !1);}}}, !0), e && (o.wx = o.jWeixin = C), C;}var O;});

/***/ }),

/***/ 26:
/*!***************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/static/js/global.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _regenerator = _interopRequireDefault(__webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ 27));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};} // 常量
if (!globalThis) var globalThis = {};
globalThis.PATH = 'http://47.103.152.26/api';
// globalThis.PATH="/geomantic/"
function


showLoading() {return _showLoading.apply(this, arguments);}function _showLoading() {_showLoading = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee() {return _regenerator.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            uni.showLoading({
              title: "请等待",
              mask: true });case 1:case "end":return _context.stop();}}}, _callee, this);}));return _showLoading.apply(this, arguments);}function



hideLoading() {return _hideLoading.apply(this, arguments);}



/**
                                                             * @name 显示toast
                                                             * @param res {status:"0",(msg||data):""}
                                                             */function _hideLoading() {_hideLoading = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee2() {return _regenerator.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:uni.hideLoading();case 1:case "end":return _context2.stop();}}}, _callee2, this);}));return _hideLoading.apply(this, arguments);}function
showToast(_x) {return _showToast.apply(this, arguments);}function _showToast() {_showToast = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee3(res) {return _regenerator.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            uni.showToast({
              title: res || res.msg,
              mask: true,
              icon: res.status == 0 ? "success" : "",
              duration: 1500 });case 1:case "end":return _context3.stop();}}}, _callee3, this);}));return _showToast.apply(this, arguments);}var _default =



{
  showLoading: showLoading,
  hideLoading: hideLoading,
  showToast: showToast };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 27:
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 28);


/***/ }),

/***/ 28:
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 29);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 29:
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 30:
/*!**********************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/api/request.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _regenerator = _interopRequireDefault(__webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ 27));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
var baseURL = 'http://47.103.152.26/api';
// 参数： url:请求地址  param：请求参数  way：请求方式 res：回调函数
/**
 *  @name 请求
 */function
apiPost(_x, _x2) {return _apiPost.apply(this, arguments);}function _apiPost() {_apiPost = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee(url, params) {return _regenerator.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            if (!params) console.warn("没有传入参数params");_context.next = 3;return (
              new Promise(function (resolve, reject) {
                uni.request({
                  url: baseURL + url,
                  method: "POST",
                  header: {
                    // 'Token': token,
                    'Accept': 'application/json',
                    "content-type": "application/x-www-form-urlencoded" },

                  data: params,
                  success: function success(res) {
                    resolve(res.data);
                  },
                  fail: function fail(err) {
                    reject(err);
                  } });

              }));case 3:return _context.abrupt("return", _context.sent);case 4:case "end":return _context.stop();}}}, _callee, this);}));return _apiPost.apply(this, arguments);}function


apiGet(_x3, _x4) {return _apiGet.apply(this, arguments);}























// 登录
function _apiGet() {_apiGet = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee2(url, params) {return _regenerator.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!params) console.warn("没有传入参数params");_context2.next = 3;return new Promise(function (resolve, reject) {uni.request({ url: baseURL + url, method: "GET", header: { 'Accept': 'application/json', "content-type": "application/x-www-form-urlencoded" }, timeout: 6000, data: params, success: function success(res) {resolve(res.data);}, fail: function fail(err) {reject(err);} });});case 3:return _context2.abrupt("return", _context2.sent);case 4:case "end":return _context2.stop();}}}, _callee2, this);}));return _apiGet.apply(this, arguments);}function login(_x5) {return _login.apply(this, arguments);}function _login() {_login = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee3(params) {return _regenerator.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
              new Promise(function (resolve, reject) {
                uni.request({
                  url: baseURL + '/login',
                  method: "GET",
                  header: {
                    // 'Token': token,
                    'Accept': 'application/json',
                    "content-type": "application/x-www-form-urlencoded" },

                  data: params,
                  success: function success(res) {
                    resolve(res.data);
                  },
                  fail: function fail(err) {
                    reject(err);
                  } });

              }));case 2:return _context3.abrupt("return", _context3.sent);case 3:case "end":return _context3.stop();}}}, _callee3, this);}));return _login.apply(this, arguments);}var _default =


{
  baseURL: baseURL,
  apiPost: apiPost,
  apiGet: apiGet,
  login: login };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 4:
/*!******************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/pages.json ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),

/***/ 63:
/*!*****************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/pages/repair/index.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.handleSignClick = handleSignClick;exports.setSignInfo = setSignInfo;exports.addSignInfo = addSignInfo;exports.getSignInfo = getSignInfo;exports.delSignInfo = delSignInfo;exports.getInfo = getInfo;exports.key = void 0;function handleSignClick() {
  console.log(1);
}
// 本地存储打卡信息
function setSignInfo(info) {
  var signInfo = { main: [info] };
  uni.setStorageSync("signInfo", JSON.stringify(signInfo));
}
// 本地添加打卡信息
function addSignInfo(info, sign) {
  sign.main.push(info);
  uni.setStorageSync("signInfo", JSON.stringify(sign));
}
// 本地获取打卡信息
function getSignInfo() {
  var sign = uni.getStorageSync("signInfo");
  if (!sign) {
    return;
  }
  return JSON.parse(sign);
}
// 本地打卡信息清理
function delSignInfo() {
  uni.removeStorage({
    key: 'signInfo',
    success: function success() {
      uni.showToast({ title: "重置成功" });
    } });

}
// 打卡信息
function getInfo(signInfo) {
  var nowT = new Date();
  var info = { mode: signInfo.mode, nowT: nowT, address: signInfo.address, time: signInfo.time, latitude: signInfo.latitude, longitude: signInfo.longitude, remarks: signInfo.remarks };
  return info;
}

// 腾讯位置服务key 值
var key = "VEEBZ-HJL34-U3LUY-XUBOX-NSUF7-E4BRF";exports.key = key;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 7:
/*!***********************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/pages.json?{"type":"style"} ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/login/login": { "usingComponents": { "chun-lei-modal": "/components/modal/modal" }, "usingAutoImportComponents": {} }, "pages/login/loginDW": { "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/message/message": { "navigationBarTitleText": "消息提醒", "usingComponents": { "my-tabs": "/components/myTabs/myTabs", "my-pull": "/static/js/myPull", "my-loading": "/components/myLoading/myLoading", "min-action-sheet": "/components/comselect/comselect" }, "usingAutoImportComponents": {} }, "pages/repair/repairList": { "navigationBarTitleText": "报修列表", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/repair/repairEdit": { "navigationBarTitleText": "设备报修", "usingComponents": { "dy-date-picker": "/components/dy-Date/dy-Date" }, "usingAutoImportComponents": {} }, "pages/adddevice/adddevice": { "navigationBarTitleText": "新增设备", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/chooseLocation/chooseLocation": { "navigationBarTitleText": "选择地点", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/adddevice/devicedetail": { "navigationBarTitleText": "设备详情", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/adddevice/devicemore": { "navigationBarTitleText": "更多", "usingComponents": { "my-tabs": "/components/myTabs/myDeviceMore", "my-pull": "/static/js/myDeviceMore", "fa-icon": "/components/fa-icon/fa-icon" }, "usingAutoImportComponents": {} }, "pages/personCenter/personCenter": { "navigationBarTitleText": "个人中心", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/personCenter/mydevice": { "navigationBarTitleText": "我的设备", "usingComponents": { "my-tabs": "/components/myTabs/myDeviceType", "my-pull": "/static/js/myDevicePull", "min-action-sheet": "/components/comselect/comselect", "fa-icon": "/components/fa-icon/fa-icon" }, "usingAutoImportComponents": {} }, "pages/personCenter/warnhistroy": { "navigationBarTitleText": "历史告警", "usingComponents": { "my-tabs": "/components/myTabs/myWarnHistroy", "my-pull": "/static/js/myWarnHistroy", "min-action-sheet": "/components/comselect/comselect" }, "usingAutoImportComponents": {} }, "pages/login/registration": { "navigationBarTitleText": "注册", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/login/forget-password": { "navigationBarTitleText": "忘记密码", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/index/index": { "usingComponents": { "zy-grid": "/components/zy-grid/zy-grid", "hch-position": "/components/hch-position/hch-position", "min-action-sheet": "/components/comselect/comselect" }, "usingAutoImportComponents": {} } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "智能消防", "navigationBarBackgroundColor": "#FFFFFF", "backgroundColor": "#f8f8f8" } };exports.default = _default;

/***/ }),

/***/ 72:
/*!********************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/pages/adddevice/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.handleSignClick = handleSignClick;exports.setSignInfo = setSignInfo;exports.addSignInfo = addSignInfo;exports.getSignInfo = getSignInfo;exports.delSignInfo = delSignInfo;exports.getInfo = getInfo;exports.key = void 0;function handleSignClick() {
  console.log(1);
}
// 本地存储打卡信息
function setSignInfo(info) {
  var signInfo = { main: [info] };
  uni.setStorageSync("signInfo", JSON.stringify(signInfo));
}
// 本地添加打卡信息
function addSignInfo(info, sign) {
  sign.main.push(info);
  uni.setStorageSync("signInfo", JSON.stringify(sign));
}
// 本地获取打卡信息
function getSignInfo() {
  var sign = uni.getStorageSync("signInfo");
  if (!sign) {
    return;
  }
  return JSON.parse(sign);
}
// 本地打卡信息清理
function delSignInfo() {
  uni.removeStorage({
    key: 'signInfo',
    success: function success() {
      uni.showToast({ title: "重置成功" });
    } });

}
// 打卡信息
function getInfo(signInfo) {
  var nowT = new Date();
  var info = { mode: signInfo.mode, nowT: nowT, address: signInfo.address, time: signInfo.time, latitude: signInfo.latitude, longitude: signInfo.longitude, remarks: signInfo.remarks };
  return info;
}

// 腾讯位置服务key 值
var key = "VEEBZ-HJL34-U3LUY-XUBOX-NSUF7-E4BRF";exports.key = key;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 8:
/*!**********************************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/pages.json?{"type":"stat"} ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__143E42D" };exports.default = _default;

/***/ }),

/***/ 9:
/*!**********************************************************!*\
  !*** C:/Users/a/Desktop/toCWechat/uniapp/store/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 10));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    hasLogin: false,
    usertype: '',
    userInfo: {} },

  mutations: _defineProperty({
    login: function login(state, provider) {

      state.hasLogin = true;
      state.userInfo = provider;
      uni.setStorage({ //缓存用户登陆状态
        key: 'userInfo',
        data: provider });

      console.log(state.userInfo);
    },
    logout: function logout(state) {
      state.hasLogin = false;
      state.userInfo = {};
      uni.removeStorage({
        key: 'userInfo' });

    },
    usertype: function usertype(state, provider) {
      state.usertype = provider;
    } }, "usertype", function usertype(
  state, _usertype) {
    state.usertype = _usertype;
  }),

  actions: {
    usertype: function usertype(ctx, _usertype2) {
      ctx.commit('usertype', _usertype2);
    } } });var _default =



store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
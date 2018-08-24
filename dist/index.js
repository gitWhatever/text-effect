(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TextEffect = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

function text(el) {
  var supportTC = typeof el.textContent === 'string';
  return supportTC ? el.textContent : el.innerText;
}

function attr(el, key, value) {
  if (value === void 0) {
    return el.getAttribute(key);
  }
  el.setAttribute(key, value);
}

function isValidNodeList(el) {
  if (!el) {
    return false;
  }

  var isNodeList = (el instanceof HTMLCollection || el instanceof NodeList || el instanceof Array) && el.length > 0;
  return isNodeList;
}

function isHtmlElement() {
  var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var type = el.nodeType;
  var isElementType = type === 1 || type === 9 || type === 11;
  return el && isElementType;
}

function toggleShow(el, isShow) {
  el.style.display = isShow ? '' : 'none';
}

function css(obj, attrK, value) {
  switch (arguments.length) {
    case 2:
      if (_typeof(arguments[1]) === 'object') {
        // 批量设置属性
        Object.keys(attrK).forEach(function (k) {
          obj.style[k] = attrK[k];
        });
      } else {
        return obj.currentStyle ? obj.currentStyle[attrK] : getComputedStyle(obj, null)[attrK];
      }
      break;
    case 3:
      obj.style[attrK] = value;
      break;
    default:
      return '';
  }
}

function elementChildren(elem) {
  if (elem.children) {
    return elem.children;
  }
  var children = [];

  for (var i = elem.childNodes.length; i--;) {
    if (elem.childNodes[i].nodeType !== 8) {
      children.unshift(elem.childNodes[i]);
    }
  }
  return children;
}

var classApi = {
  hasClass: function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },
  addClass: function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += ' ' + cls;
  },
  removeClass: function removeClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }
};

function one(ele, event, callback) {
  var eventList = event.split(/\s+/);
  eventList.forEach(function (e) {
    ele.addEventListener(e, function inner() {
      callback.call(this);
      this.removeEventListener(e, inner);
    });
  });
}

var dataApi = {
  uid: 0,
  dataCache: {},
  internalKey: 'ben_' + Math.random().toString(36).substring(2),
  set: function set$$1(ele, key, data) {
    if (!isHtmlElement(ele)) {
      console.warn('wrong first parameter');
      return;
    }
    var self = this || dataApi;
    var internalKey = self.internalKey,
        dataCache = self.dataCache;

    var curUid = ele[internalKey] = ele[internalKey] || ++self.uid;
    var curEleDataCache = dataCache[curUid] = dataCache[curUid] || {};
    curEleDataCache[key] = data;
  },
  get: function get$$1(ele, key) {
    if (!isHtmlElement(ele)) {
      console.warn('wrong first parameter');
      return;
    }
    var self = this || dataApi;
    var internalKey = self.internalKey,
        dataCache = self.dataCache;

    var curUid = ele[internalKey];
    if (!curUid) {
      return null;
    }
    var curEleDataCache = dataCache[curUid] = dataCache[curUid] || {};
    return curEleDataCache[key];
  }
};

function stringToBoolean(str) {
  if (str !== 'true' && str !== 'false') return str;
  return str === 'true';
}

function getDataOpt() {
  var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var attrs = node.attributes || [];
  var attrLength = attrs.length;
  var data = {};

  if (!attrLength) return data;

  for (var i = 0; i < attrLength; i++) {
    var attrV = attrs[i];
    var nodeName = attrV.nodeName.replace(/delayscale/, 'delayScale');
    var dataInReg = /^data-in-(.*)/;
    var dataOutReg = /^data-out-(.*)/;
    var dataReg = /^data-(.*)/;

    if (dataInReg.test(nodeName)) {
      data.in = data.in || {};
      data.in[RegExp.$1] = stringToBoolean(attrV.nodeValue);
    } else if (dataOutReg.test(nodeName)) {
      data.out = data.out || {};
      data.out[RegExp.$1] = stringToBoolean(attrV.nodeValue);
    } else if (dataReg.test(nodeName)) {
      data[RegExp.$1] = stringToBoolean(attrV.nodeValue);
    }
  }
  return data;
}

function textToDom(textStr) {
  var wrapEle = document.createElement('div');
  wrapEle.innerHTML = textStr;
  return wrapEle.childNodes[0];
}

function html(el, content) {
  if (isHtmlElement(content)) {
    el.innerHTML = '';
    el.appendChild(content);
  } else if (typeof content === 'string') {
    el.innerHTML = content;
  } else if (content === void 0) {
    return el.innerHTML;
  }
}

var jDom = {
  css: css,
  one: one,
  text: text,
  attr: attr,
  html: html,
  textToDom: textToDom,
  elementChildren: elementChildren,
  isValidNodeList: isValidNodeList,
  isHtmlElement: isHtmlElement,
  toggleShow: toggleShow,
  classApi: classApi,
  dataApi: dataApi,
  getDataOpt: getDataOpt
};

/* eslint import/prefer-default-export:"off" */
var arrayEach = Array.prototype.forEach;

var injector = function injector(t, splitter, klass, after) {
  var text = jDom.text(t).trim();
  var splitList = text.split(splitter);
  var inject = '';
  if (splitList.length) {
    inject = splitList.map(function (item, i) {
      return '<span class="' + klass + (i + 1) + '" aria-hidden="true">' + item + '</span>';
    }).join(after);
    jDom.attr(t, 'aria-label', text);
    t.innerHTML = inject;
  }
};

var methods = {
  init: function init(elList) {
    arrayEach.call(elList, function (el) {
      injector(el, '', 'char', '');
    });
  },
  word: function word(elList) {
    arrayEach.call(elList, function (el) {
      injector(el, /\b(?=\s+)/, 'word', '');
    });
  },
  lines: function lines(elList) {
    arrayEach.call(elList, function (el) {
      injector(el, /(\r\n)+/, 'line', '');
    });
  }
};

function lettering(outerEles, method) {
  if (!jDom.isValidNodeList(outerEles)) {
    console.warn('lettering has no effective dom element');
    return this;
  }
  if (method === 'letters' || !method || !methods[method]) {
    method = 'init';
  }

  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  methods[method].apply(methods, [outerEles].concat(rest));
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		Object.keys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	Object.keys(source).forEach(function(key) {
		if (!options.isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		} else {
			destination[key] = deepmerge(target[key], source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var EVENT_START = 'effectStart';
var EVENT_FINISH = 'effectFinish';
var EVENT_IN_ANI_BEGIN = 'inAnimationBegin';
var EVENT_IN_ANI_END = 'inAnimationEnd';
var EVENT_OUT_ANI_BEGIN = 'outAnimationBegin';
var EVENT_OUT_ANI_END = 'outAnimationEnd';

var INNER_IN_END = '$$' + EVENT_IN_ANI_END;
var INNER_OUT_END = '$$' + EVENT_OUT_ANI_END;
var INNER_TIMER_INIT = '$$timerInit';

/* eslint no-use-before-define: "off" */
function isInEffect(effect) {
  return (/In/.test(effect) || MTextillate.defaultConfig.inEffects.indexOf(effect) >= 0
  );
}

/* eslint no-use-before-define: "off" */
function isOutEffect(effect) {
  return (/Out/.test(effect) || MTextillate.defaultConfig.outEffects.indexOf(effect) >= 0
  );
}

/* eslint-disable */
function shuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
  return o;
}

function reverse(tokenEles) {
  var len = tokenEles.length;
  for (var i = len - 1; i >= ~~(len / 2); i--) {
    var temp = null;
    temp = tokenEles[i];
    tokenEles[i] = tokenEles[len - 1 - i];
    tokenEles[len - 1 - i] = temp;
  }
  return tokenEles;
}

function animateTokens(tokenEles, options, cb) {
  var count = tokenEles.length;

  if (count < 1) {
    // 保持cb的回调一定是异步的
    setTimeout(function () {
      cb && cb();
    });
    return;
  }

  tokenEles = [].slice.call(tokenEles);
  if (options.shuffle) tokenEles = shuffle(tokenEles);
  if (options.reverse) tokenEles = reverse(tokenEles);

  arrayEach.call(tokenEles, function (el, index) {
    var delay = options.sync ? options.delay : options.delay * index * options.delayScale;
    var complete = function complete(el) {
      if (isInEffect(options.effect)) {
        jDom.css(el, 'visibility', 'visible');
      } else if (isOutEffect(options.effect)) {
        jDom.css(el, 'visibility', 'hidden');
      }

      if (! --count && cb) {
        cb();
      }
    };

    setTimeout(function () {
      addAnimate(el, options.effect, complete);
    }, delay);
  });
}

function addAnimate(el, effectClass, complete) {
  var classApi = jDom.classApi,
      css = jDom.css,
      one = jDom.one;

  var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  var animateClass = effectClass + ' animated';

  classApi.addClass(el, animateClass);
  css(el, 'visibility', 'visible');
  one(el, animationEnd, function endHandle() {
    classApi.removeClass(this, animateClass);
    complete && complete(this);
  });
}

var MTextillate = function () {
  function MTextillate(element, options, teffectInstance) {
    var _privateEvents;

    classCallCheck(this, MTextillate);

    // 文字效果根元素
    this.baseEle = element;
    // 效果定义的元素，开始效果时将被隐藏
    this.textEle = null;
    // 真正用于动画效果的元素
    this.currentEle = null;
    this.options = options;
    this.timeoutRunTask = null;
    this.teffectInstance = teffectInstance;
    // 内部事件存储器
    this.privateEvents = (_privateEvents = {}, _privateEvents[INNER_IN_END] = null, _privateEvents[INNER_OUT_END] = null, _privateEvents[INNER_TIMER_INIT] = null, _privateEvents);

    this.init();
  }

  MTextillate.prototype.setOptions = function setOptions(inferent) {
    this.options = deepmerge_1.all([this.options, inferent]);
  };

  MTextillate.prototype.init = function init() {
    var baseEle = this.baseEle,
        options = this.options;
    var html = jDom.html,
        textToDom = jDom.textToDom,
        toggleShow = jDom.toggleShow;

    var currentEle = this.currentEle = document.createElement('span');
    var textEle = this.textEle = baseEle.querySelector(options.selector);

    if (!textEle) {
      var ulHtml = '<ul class="texts"><li>' + html(baseEle) + '</li></ul>';
      textEle = this.textEle = textToDom(ulHtml);
      html(baseEle, textEle);
    }

    toggleShow(textEle, 0);
    baseEle.insertBefore(currentEle, textEle);
    options.autoStart && this.start();
  };

  MTextillate.prototype.start = function start() {
    var self = this;
    var options = self.options,
        textEle = self.textEle;

    var _jDom$elementChildren = jDom.elementChildren(textEle),
        length = _jDom$elementChildren.length;

    var index = 0;

    self.off(INNER_TIMER_INIT);

    setTimeout(function () {
      self.triggerEvent(EVENT_START);
      /* eslint no-unused-expressions: "off" */
      !function run(runIndex) {
        self.in(runIndex);

        self.on(INNER_IN_END, function () {
          runIndex++;
          if (!self.options.loop && runIndex >= length) {
            if (options.callback) options.callback();
            self.triggerEvent(EVENT_FINISH);
          } else {
            runIndex %= length;

            self.timeoutRunTask = setTimeout(function () {
              self.out();
            }, options.minDisplayTime);

            self.on(INNER_OUT_END, function () {
              run(runIndex);
            });

            self.triggerEvent('timerInit');
          }
        });
      }(index);
    }, options.initialDelay);
  };

  MTextillate.prototype.stop = function stop() {
    var self = this;
    self.on(INNER_TIMER_INIT, function () {
      if (!self.timeoutRunTask) {
        return;
      }
      clearTimeout(self.timeoutRunTask);
      self.timeoutRunTask = null;
      self.triggerEvent(EVENT_FINISH);
    });
  };

  MTextillate.prototype.in = function _in() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var self = this;
    var currentEle = self.currentEle,
        baseEle = self.baseEle,
        textEle = self.textEle,
        options = self.options;
    var elementChildren = jDom.elementChildren,
        getDataOpt = jDom.getDataOpt,
        dataApi = jDom.dataApi,
        attr = jDom.attr,
        html = jDom.html,
        text = jDom.text,
        css = jDom.css;

    var children = elementChildren(textEle);
    var nextReferEle = children[index];
    var thisOptions = deepmerge_1.all([options, getDataOpt(nextReferEle)]);
    var isInEffectV = isInEffect(thisOptions.in.effect);
    var isOutEffectV = isOutEffect(thisOptions.out.effect);

    dataApi.set(nextReferEle, 'bindOptions', thisOptions);
    attr(baseEle, 'data-active', index);
    html(currentEle, text(nextReferEle));

    if (thisOptions.type === 'char') {
      lettering([currentEle]);
    } else if (thisOptions.type === 'word') {
      lettering([currentEle], 'word');
    }

    self.currentIndex = index;
    self.triggerEvent(EVENT_IN_ANI_BEGIN);

    var tokenEles = elementChildren(currentEle);
    arrayEach.call(tokenEles, function (el) {
      css(el, {
        display: 'inline-block',
        '-webkit-transform': 'translate3d(0,0,0)',
        '-moz-transform': 'translate3d(0,0,0)',
        '-o-transform': 'translate3d(0,0,0)',
        'transform': 'translate3d(0,0,0)',
        'white-space': 'pre'
      });
      if (isInEffectV) {
        css(el, 'visibility', 'hidden');
      } else if (isOutEffectV) {
        css(el, 'visibility', 'visible');
      }
    });
    if (!isInEffectV) {
      setTimeout(function () {
        self.triggerEvent(EVENT_IN_ANI_END);
      });
    } else {
      animateTokens(tokenEles, thisOptions.in, function () {
        self.triggerEvent(EVENT_IN_ANI_END);
        if (thisOptions.in.callback) thisOptions.in.callback();
      });
    }
  };

  MTextillate.prototype.out = function out() {
    var self = this;
    var currentEle = self.currentEle,
        textEle = self.textEle;
    var elementChildren = jDom.elementChildren,
        dataApi = jDom.dataApi;

    var tokenEles = elementChildren(currentEle);
    var nextReferEle = elementChildren(textEle)[self.currentIndex];
    var thisOptions = dataApi.get(nextReferEle, 'bindOptions');
    var isOutEffectV = isOutEffect(thisOptions.out.effect);

    self.triggerEvent(EVENT_OUT_ANI_BEGIN);

    if (!isOutEffectV) {
      setTimeout(function () {
        self.triggerEvent(EVENT_OUT_ANI_END);
      });
    } else {
      animateTokens(tokenEles, thisOptions.out, function () {
        self.triggerEvent(EVENT_OUT_ANI_END);
        if (thisOptions.out.callback) thisOptions.out.callback();
      });
    }
  };

  /**
     * 内部事件订阅器，仅用于触发内部回调
     * 用于解耦回调嵌套
     * @param {*} event cb
     */


  MTextillate.prototype.on = function on(event, cb) {
    var whiteList = [INNER_IN_END, INNER_OUT_END, INNER_TIMER_INIT];
    if (whiteList.indexOf(event) < 0) {
      return;
    }
    this.privateEvents[event] = cb;
  };

  /**
     * 内部事件订阅取消
     * @param {*} event
     */


  MTextillate.prototype.off = function off(event) {
    var whiteList = [INNER_IN_END, INNER_OUT_END, INNER_TIMER_INIT];
    if (whiteList.indexOf(event) < 0) {
      return;
    }
    this.privateEvents[event] = null;
  };

  /**
     * 事件发布器，同时分发项目内部与外部的事件
     * @param {*} name
     */


  MTextillate.prototype.triggerEvent = function triggerEvent(name) {
    var self = this;
    var eventCollections = self.teffectInstance.eventCollections,
        privateEvents = self.privateEvents;

    var eventList = eventCollections[name] || [];
    var privateEventCb = privateEvents['$$' + name];

    eventList.forEach(function (cb) {
      if (typeof cb !== 'function') {
        return;
      }
      cb && cb(self.baseEle);
    });

    // 内部事件只执行最新的
    privateEventCb && privateEventCb();
  };

  return MTextillate;
}();


MTextillate.defaultConfig = {
  selector: '.texts',
  loop: false,
  minDisplayTime: 2000,
  initialDelay: 0,
  in: {
    effect: 'fadeInLeftBig',
    delayScale: 1.5,
    delay: 50,
    sync: false,
    reverse: false,
    shuffle: false,
    callback: function callback() {}
  },
  out: {
    effect: 'hinge',
    delayScale: 1.5,
    delay: 50,
    sync: false,
    reverse: false,
    shuffle: false,
    callback: function callback() {}
  },
  autoStart: true,
  inEffects: [],
  outEffects: ['hinge'],
  callback: function callback() {},

  type: 'char'
};

var _textillate = {
  entry: function entry(settings) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var teffectInstance = this;
    var dataApi = jDom.dataApi,
        getDataOpt = jDom.getDataOpt;

    var outerEles = teffectInstance.els;
    var involkeWhiteList = ['start', 'stop', 'setOptions', 'init'];

    arrayEach.call(outerEles, function (el) {
      var options = deepmerge_1.all([MTextillate.defaultConfig, getDataOpt(el), (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) === 'object' && settings]);
      var mInstance = dataApi.get(el, 'mTextillate');

      if (!mInstance) {
        dataApi.set(el, 'mTextillate', mInstance = new MTextillate(el, options, teffectInstance));
      } else if (typeof settings === 'string') {
        var _mInstance;

        if (involkeWhiteList.indexOf(settings) < 0) {
          return;
        }
        (_mInstance = mInstance)[settings].apply(_mInstance, args);
      } else {
        mInstance.setOptions(options);
      }
    });
  },

  name: 'textillate'
};

var formateElToList = function formateElToList(el) {
  if (jDom.isHtmlElement(el)) {
    return [el];
  } else if (typeof el === 'string') {
    el = document.querySelectorAll(el);
  }
  return el;
};

var TextEffect = function () {
  function TextEffect(el) {
    classCallCheck(this, TextEffect);

    this.els = formateElToList(el);
    this.eventCollections = {};
  }

  TextEffect.lettering = function lettering$$1(outerEles, method) {
    for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    lettering.apply(undefined, [formateElToList(outerEles), method].concat(rest));
  };

  TextEffect.prototype.textillate = function textillate() {
    _textillate.entry.apply(this, arguments);
    return this;
  };

  TextEffect.prototype.on = function on(event, cb) {
    var _this = this;

    var eventList = this.eventCollections[event];
    eventList = eventList || (this.eventCollections[event] = []);
    eventList.push(function (baseEle) {
      cb.call(_this, baseEle);
    });
  };

  return TextEffect;
}();

return TextEffect;

})));

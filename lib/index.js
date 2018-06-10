'use strict';

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
    var supportTC = typeof el.textContent === "string";
    return supportTC ? el.textContent : el.innerText;
}

function attr(el, key, value) {
    if (value === void 0) {
        return el.getAttribute(key);
    } else {
        el.setAttribute(key, value);
    }
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
    if (isShow) {
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

function css(obj, attr, value) {
    switch (arguments.length) {
        case 2:
            if (_typeof(arguments[1]) == "object") {
                //批量设置属性
                for (var i in attr) {
                    obj.style[i] = attr[i];
                }
            } else {
                // 读取属性值
                return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
            }
            break;
        case 3:
            //设置属性
            obj.style[attr] = value;
            break;
        default:
            return "";
    }
}
function elementChildren(elem) {
    if (elem.children) {

        return elem.children;
    } else {

        var children = [];

        for (var i = elem.childNodes.length; i--;) {

            if (elem.childNodes[i].nodeType != 8) children.unshift(elem.childNodes[i]);
        }
        return children;
    }
}

var classApi = {
    hasClass: function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function addClass(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
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
    eventList.forEach(function (event) {
        ele.addEventListener(event, function inner() {
            callback.call(this);
            this.removeEventListener(event, inner);
        });
    });
}
var dataApi = {
    uid: 0,
    dataCache: {},
    internalKey: 'ben_' + Math.random(),
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
function getDataOpt() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var attrs = node.attributes || [];
    var data = {};
    var attrLength = attrs.length;

    if (!attrLength) return data;

    for (var i = 0; i < attrLength; i++) {
        var _attr = attrs[i];
        var nodeName = _attr.nodeName.replace(/delayscale/, 'delayScale');
        var dataInReg = /^data-in-(.*)/;
        var dataOutReg = /^data-out-(.*)/;

        if (dataInReg.test(nodeName)) {
            data.in = data.in || {};
            data.in[RegExp.$1] = stringToBoolean(_attr.nodeValue);
        } else if (dataOutReg.test(nodeName)) {
            data.out = data.out || {};
            data.out[RegExp.$1] = stringToBoolean(_attr.nodeValue);
        } else if (/^data-*/.test(nodeName)) {
            data[RegExp.$1] = stringToBoolean(_attr.nodeValue);
        }
    }
    return data;
}

function stringToBoolean(str) {
    if (str !== "true" && str !== "false") return str;
    return str === "true";
}
function textToDom(text) {
    var wrapEle = document.createElement('div');
    wrapEle.innerHTML = text;
    return wrapEle.childNodes[0];
}

function html(el, content) {
    if (isHtmlElement(content)) {
        el.innerHTML = '';
        el.appendChild(content);
    } else if (typeof content === 'string') {
        el.innerHTML = content;
    } else if (content == void 0) {
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

window.arrayEach = Array.prototype.forEach;

function lettering(outerEles, method) {
    console.log(outerEles);
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

var methods = {
    init: function init(elList) {
        arrayEach.call(elList, function (el) {
            injector(el, '', 'char', '');
        });
    },
    word: function word(elList) {
        arrayEach.call(elList, function (el) {
            injector(el, /\s+/, 'word', '');
        });
    },
    lines: function lines(elList) {
        arrayEach.call(elList, function (el) {
            injector(el, /(\r\n)+/, 'line', '');
        });
    }
};

var injector = function injector(t, splitter, klass, after) {
    var text = jDom.text(t);
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

var MTextillate = function () {
    function MTextillate(element, options) {
        classCallCheck(this, MTextillate);

        this.baseEle = element;
        this.options = options;
        this.timeoutRunTask = null;
        this.init();
    }

    MTextillate.prototype.setOptions = function setOptions(options) {
        this.options = options;
    };

    MTextillate.prototype.init = function init() {
        var baseEle = this.baseEle;
        var options = this.options;
        var textEle = this.textEle = baseEle.querySelector(options.selector);
        var currentEle = this.currentEle = document.createElement('span');
        if (!textEle) {
            var ulHtml = '<ul class="texts"><li>' + jDom.html(baseEle) + '</li></ul>';
            textEle = this.textEle = jDom.textToDom(ulHtml);
            jDom.html(baseEle, this.textEle);
        }
        jDom.toggleShow(textEle, 0);

        // const firstChildOfTextEle = jDom.elementChildren(textEle)[0];
        // currentEle.innerHTML = jDom.text(firstChildOfTextEle);
        baseEle.insertBefore(currentEle, textEle);

        // if (isInEffect(options.in.effect)) {
        //     jDom.css(currentEle, 'visibility', 'hidden');
        // } else if (isOutEffect(options.out.effect)) {
        //     jDom.css(currentEle, 'visibility', 'visible');
        // }

        options.autoStart && this.start();
    };

    MTextillate.prototype.start = function start() {
        var self = this;
        var options = self.options,
            textEle = self.textEle;

        var length = jDom.elementChildren(textEle).length;
        var index = 0;

        setTimeout(function () {
            self.triggerEvent('start');
            !function run(index) {
                self.in(index, function () {
                    index++;

                    if (!options.loop && index >= length) {
                        if (options.callback) options.callback();
                        self.triggerEvent('end');
                    } else {
                        index = index % length;

                        self.timeoutRunTask = setTimeout(function () {
                            self.out(function () {
                                run(index);
                            });
                        }, options.minDisplayTime);
                    }
                });
            }(index);
        }, options.initialDelay);
    };

    MTextillate.prototype.stop = function stop() {
        var timeoutRunTask = this.timeoutRunTask;
        if (timeoutRunTask) {
            clearInterval(timeoutRunTask);
            timeoutRunTask = null;
        }
    };

    MTextillate.prototype.in = function _in() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var cb = arguments[1];

        var self = this;
        var children = jDom.elementChildren(self.textEle);
        var nextReferEle = children[index];
        var currentEle = self.currentEle,
            baseEle = self.baseEle,
            options = self.options;

        var thisOptions = deepmerge_1({}, options, jDom.getDataOpt(nextReferEle));
        var isInEffectV = isInEffect(thisOptions.in.effect);
        var isOutEffectV = isOutEffect(thisOptions.out.effect);

        jDom.dataApi.set(nextReferEle, 'bindOptions', thisOptions);
        jDom.attr(baseEle, 'data-active', index);
        jDom.html(currentEle, jDom.text(nextReferEle));

        if (thisOptions.type === 'char') {
            lettering([currentEle]);
        } else if (thisOptions.type === 'word') {
            lettering([currentEle], 'word');
        }

        self.currentIndex = index;
        self.triggerEvent('inAnimationBegin');

        var tokenEles = jDom.elementChildren(currentEle);
        arrayEach.call(tokenEles, function (el, index) {
            jDom.css(el, {
                'display': 'inline-block',
                // fix for poor ios performance
                '-webkit-transform': 'translate3d(0,0,0)',
                '-moz-transform': 'translate3d(0,0,0)',
                '-o-transform': 'translate3d(0,0,0)',
                'transform': 'translate3d(0,0,0)',
                'white-space': 'pre'
            });
            if (isInEffectV) {
                jDom.css(el, 'visibility', 'hidden');
            } else if (isOutEffectV) {
                jDom.css(el, 'visibility', 'visible');
            }
        });
        if (!isInEffectV) {
            self.triggerEvent('inAnimationEnd');
            cb && cb();
        } else {
            animateTokens(tokenEles, thisOptions.in, function () {
                self.triggerEvent('inAnimationEnd');
                if (thisOptions.in.callback) thisOptions.in.callback();
                cb && cb();
            });
        }
    };

    MTextillate.prototype.out = function out(cb) {
        var self = this;
        var currentEle = self.currentEle,
            textEle = self.textEle,
            options = self.options;

        var tokenEles = jDom.elementChildren(currentEle);
        var childrenOfTextEle = jDom.elementChildren(self.textEle);
        var nextReferEle = childrenOfTextEle[self.currentIndex];
        var thisOptions = jDom.dataApi.set(nextReferEle, 'bindOptions');
        var isOutEffectV = isOutEffect(thisOptions.out.effect);
        self.triggerEvent('outAnimationBegin');

        if (!isOutEffectV) {
            self.triggerEvent('outAnimationEnd');
            cb && cb();
        } else {
            animateTokens(tokenEles, thisOptions.out, function () {
                self.triggerEvent('outAnimationEnd');
                if (thisOptions.out.callback) thisOptions.out.callback();
                cb && cb();
            });
        }
    };

    MTextillate.prototype.triggerEvent = function triggerEvent() {
        // self.triggerEvent('inAnimationBegin');
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

function isInEffect(effect) {
    return (/In/.test(effect) || MTextillate.defaultConfig.inEffects.indexOf(effect) >= 0
    );
}
function isOutEffect(effect) {
    return (/Out/.test(effect) || MTextillate.defaultConfig.outEffects.indexOf(effect) >= 0
    );
}
function animateTokens(tokenEles, options, cb) {
    var count = tokenEles.length;
    if (count < 1) {
        cb && cb();
        return;
    }

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
            count--;
            if (!count && cb) cb();
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
    one(el, animationEnd, function () {
        classApi.removeClass(this, animateClass);
        complete && complete(this);
    });
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {}
    return o;
}

function reverse(tokenEles) {
    var len = tokenEles.length;
    debugger;
    for (var i = len - 1; i >= ~~(len / 2); i--) {
        var temp = null;
        temp = tokenEles[i];
        tokenEles[i] = tokenEles[len - 1 - i];
        tokenEles[len - 1 - i] = temp;
    }
}

var _textillate = {
    entry: function entry(settings) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var dataApi = jDom.dataApi,
            getDataOpt = jDom.getDataOpt;

        var outerEles = this.els;
        var involkeWhiteList = ['start', 'stop', 'setOptions', 'init'];

        arrayEach.call(outerEles, function (el, index) {
            var options = deepmerge_1({}, MTextillate.defaultConfig, getDataOpt(el), (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) === 'object' && settings);
            var mInstance = dataApi.get(el, 'mTextillate');
            if (!mInstance) {
                dataApi.get(el, 'mTextillate', mInstance = new MTextillate(el, options));
            } else if (typeof settings == 'string') {
                if (involkeWhiteList.indexOf(settings) > -1) {
                    var _mInstance;

                    (_mInstance = mInstance)[settings].apply(_mInstance, args);
                }
            } else {
                mInstance.setOptions(options);
            }
        });
    },

    name: 'textillate'
};

var TextEffect = function () {
    function TextEffect(el) {
        classCallCheck(this, TextEffect);

        this.els = formateElToList(el);
    }

    TextEffect.lettering = function lettering$$1(outerEles, method) {
        for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rest[_key - 2] = arguments[_key];
        }

        lettering.apply(undefined, [formateElToList(outerEles), method].concat(rest));
    };

    TextEffect.prototype.textillate = function textillate() {
        _textillate.entry.apply(this, arguments);
    };

    return TextEffect;
}();

var formateElToList = function formateElToList(el) {
    if (jDom.isHtmlElement(el)) {
        return [el];
    }
    return el;
};

module.exports = TextEffect;

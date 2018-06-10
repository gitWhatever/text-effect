'use strict';

var _this = undefined;

var arrayEach = Array.prototype.forEach;

var lettering = function lettering(method) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
    }

    var outerEle = _this.el;
    if (outerEle.length < 1) {
        console.warn('lettering has no effective dom element');
        return _this;
    }
    if (method === 'letters' || !method || !methods[method]) {
        method = 'init';
    }
    methods[method].apply(methods, [outerEle].concat(rest));
};

var methods = {
    init: function init(el) {
        arrayEach.call(el, function () {});
    }
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextEffect = function () {
    function TextEffect(el) {
        _classCallCheck(this, TextEffect);

        this.el = el;
    }

    TextEffect.prototype.lettering = function lettering$$1() {
        lettering.apply(this, arguments);
    };

    return TextEffect;
}();

module.exports = TextEffect;

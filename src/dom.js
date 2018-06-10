function text(el) {
    const supportTC = typeof el.textContent === "string";
    return supportTC ? el.textContent : el.innerText;
}

function attr(el, key, value) {
    if(value === void 0) {
        return el.getAttribute(key);
    } else {
        el.setAttribute(key, value);
    }
}

function isValidNodeList(el) {
    if(!el) {
        return false;
    }
    
    const isNodeList = (el instanceof HTMLCollection || el instanceof NodeList || el instanceof Array) && el.length > 0;
    return isNodeList;
}

function isHtmlElement(el = {}) {
    const type = el.nodeType;
    const isElementType = type === 1 || type === 9 || type === 11;
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
            if (typeof arguments[1] == "object") { //批量设置属性
                for (var i in attr) obj.style[i] = attr[i]
            } else { // 读取属性值
                return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
            }
            break;
        case 3:
            //设置属性
            obj.style[attr] = value;
            break;
        default:
            return "";
    }
};

function elementChildren(elem) {
    if (elem.children) {

        return elem.children;
    } else {

        var children = [];

        for (var i = elem.childNodes.length; i--;) {

            if (elem.childNodes[i].nodeType != 8)

                children.unshift(elem.childNodes[i]);

        }
        return children;
    }
}

const classApi = {
    hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')); 
    },

    addClass(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    },

    removeClass(obj, cls) {
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }
}

function one(ele, event, callback) {
    const eventList = event.split(/\s+/);
    eventList.forEach(event => {
        ele.addEventListener(event, function inner() {
            callback.call(this);
            this.removeEventListener(event, inner);
        });
    });
};

const dataApi = {
    uid: 0,
    dataCache: {},
    internalKey: 'ben_' + Math.random(),
    set(ele, key, data) {
        if (!isHtmlElement(ele)){
            console.warn('wrong first parameter');
            return;
        }
        const self = this || dataApi;
        const { internalKey, dataCache } = self;
        const curUid = ele[internalKey] = ele[internalKey] || (++self.uid);
        const curEleDataCache = dataCache[curUid] = dataCache[curUid] || {};
        curEleDataCache[key] = data;
    },
    get(ele, key) {
        if (!isHtmlElement(ele)) {
            console.warn('wrong first parameter');
            return;
        }
        const self = this || dataApi;
        const { internalKey, dataCache } = self;
        const curUid = ele[internalKey];
        if (!curUid) {
            return null;
        }
        const curEleDataCache = dataCache[curUid] = dataCache[curUid] || {};
        return curEleDataCache[key]

    }
}
function getDataOpt(node = {}) {
    const attrs = node.attributes || [];
    const data = {};
    const attrLength = attrs.length;

    if (!attrLength) return data;

    for (let i = 0; i < attrLength; i++) {
        const attr = attrs[i];
        let nodeName = attr.nodeName.replace(/delayscale/, 'delayScale');
        const dataInReg = /^data-in-(.*)/;
        const dataOutReg = /^data-out-(.*)/;
        const dataReg = /^data-(.*)/;

        if (dataInReg.test(nodeName)) {
            data.in = data.in || {};
            data.in[RegExp.$1] = stringToBoolean(attr.nodeValue);
        } else if (dataOutReg.test(nodeName)) {
            data.out = data.out || {};
            data.out[RegExp.$1] = stringToBoolean(attr.nodeValue);
        } else if (/^data-*/.test(nodeName)) {
            data[RegExp.$1] = stringToBoolean(attr.nodeValue);
        }
    }
    return data;
}

function stringToBoolean(str) {
    if (str !== "true" && str !== "false") return str;
    return (str === "true");
};

function textToDom(text) {
    const wrapEle = document.createElement('div');
    wrapEle.innerHTML = text;
    return wrapEle.childNodes[0];
}

function html(el, content) {
    if (isHtmlElement(content)) {
        el.innerHTML =  '';
        el.appendChild(content);
    }else if (typeof content === 'string'){
        el.innerHTML = content;
    } else if (content == void 0) {
        return el.innerHTML;
    }
}

export default {
    css,
    one,
    text,
    attr,
    html,
    textToDom,
    elementChildren,
    isValidNodeList,
    isHtmlElement,
    toggleShow,
    classApi,
    dataApi,
    getDataOpt
}
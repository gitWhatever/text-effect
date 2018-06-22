function text(el) {
  const supportTC = typeof el.textContent === 'string';
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

  const isNodeList =
  (el instanceof HTMLCollection || el instanceof NodeList || el instanceof Array) && el.length > 0;
  return isNodeList;
}

function isHtmlElement(el = {}) {
  const type = el.nodeType;
  const isElementType = type === 1 || type === 9 || type === 11;
  return el && isElementType;
}

function toggleShow(el, isShow) {
  el.style.display = isShow ? '' : 'none';
}

function css(obj, attrK, value) {
  switch (arguments.length) {
  case 2:
    if (typeof arguments[1] === 'object') { // 批量设置属性
      Object.keys(attrK).forEach((k) => {
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
  const children = [];

  for (let i = elem.childNodes.length; i--;) {
    if (elem.childNodes[i].nodeType !== 8) { children.unshift(elem.childNodes[i]); }
  }
  return children;
}

const classApi = {
  hasClass(obj, cls) {
    return obj.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
  },

  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += ` ${cls}`;
  },

  removeClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
      obj.className = obj.className.replace(reg, ' ');
    }
  },
};

function one(ele, event, callback) {
  const eventList = event.split(/\s+/);
  eventList.forEach((e) => {
    ele.addEventListener(e, function inner() {
      callback.call(this);
      this.removeEventListener(e, inner);
    });
  });
}

const dataApi = {
  uid: 0,
  dataCache: {},
  internalKey: `ben_${Math.random().toString(36).substring(2)}`,
  set(ele, key, data) {
    if (!isHtmlElement(ele)) {
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
    return curEleDataCache[key];
  },
};

function stringToBoolean(str) {
  if (str !== 'true' && str !== 'false') return str;
  return (str === 'true');
}

function getDataOpt(node = {}) {
  const attrs = node.attributes || [];
  const attrLength = attrs.length;
  const data = {};

  if (!attrLength) return data;

  for (let i = 0; i < attrLength; i++) {
    const attrV = attrs[i];
    const nodeName = attrV.nodeName.replace(/delayscale/, 'delayScale');
    const dataInReg = /^data-in-(.*)/;
    const dataOutReg = /^data-out-(.*)/;
    const dataReg = /^data-(.*)/;

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
  const wrapEle = document.createElement('div');
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
  getDataOpt,
};

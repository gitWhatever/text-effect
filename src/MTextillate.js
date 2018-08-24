import merge from 'deepmerge';
import jDom from './dom';
import lettering from './lettering';
import { arrayEach } from './benStorage';

const EVENT_START = 'effectStart';
const EVENT_FINISH = 'effectFinish';
const EVENT_IN_ANI_BEGIN = 'inAnimationBegin';
const EVENT_IN_ANI_END = 'inAnimationEnd';
const EVENT_OUT_ANI_BEGIN = 'outAnimationBegin';
const EVENT_OUT_ANI_END = 'outAnimationEnd';

const INNER_IN_END = `$$${EVENT_IN_ANI_END}`;
const INNER_OUT_END = `$$${EVENT_OUT_ANI_END}`;
const INNER_TIMER_INIT = '$$timerInit';

/* eslint no-use-before-define: "off" */
function isInEffect(effect) {
  return /In/.test(effect) || MTextillate.defaultConfig.inEffects.indexOf(effect) >= 0;
}

/* eslint no-use-before-define: "off" */
function isOutEffect(effect) {
  return /Out/.test(effect) || MTextillate.defaultConfig.outEffects.indexOf(effect) >= 0;
}

/* eslint-disable */
function shuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function reverse(tokenEles) {
  const len = tokenEles.length;
  for (let i = len - 1; i >= (~~(len / 2)); i--) {
    let temp = null;
    temp = tokenEles[i];
    tokenEles[i] = tokenEles[len - 1 - i];
    tokenEles[len - 1 - i] = temp;
  }
  return tokenEles;
}

function animateTokens(tokenEles, options, cb) {
  let count = tokenEles.length;
  
  if (count < 1) {
    // 保持cb的回调一定是异步的
    setTimeout(() => {
      cb && cb();
    });
    return;
  }

  tokenEles = [].slice.call(tokenEles);
  if (options.shuffle) tokenEles = shuffle(tokenEles);
  if (options.reverse) tokenEles = reverse(tokenEles);

  arrayEach.call(tokenEles, (el, index) => {
    const delay = options.sync ? options.delay : options.delay * index * options.delayScale;
    const complete = (el) => {
      if (isInEffect(options.effect)) {
        jDom.css(el, 'visibility', 'visible');
      } else if (isOutEffect(options.effect)) {
        jDom.css(el, 'visibility', 'hidden');
      }

      if (!(--count) && cb) {
        cb();
      }
    };

    setTimeout(() => {
      addAnimate(el, options.effect, complete);
    }, delay);
  });
}

function addAnimate(el, effectClass, complete) {
  const { classApi, css, one } = jDom;
  const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  const animateClass = `${effectClass} animated`;

  classApi.addClass(el, animateClass);
  css(el, 'visibility', 'visible');
  one(el, animationEnd, function endHandle() {
    classApi.removeClass(this, animateClass);
    complete && complete(this);
  });
}

export default class MTextillate {
  constructor(element, options, teffectInstance) {
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
    this.privateEvents = {
      [INNER_IN_END]: null,
      [INNER_OUT_END]: null,
      [INNER_TIMER_INIT]: null,
    };

    this.init();
  }

  setOptions(inferent) {
    this.options = merge.all([this.options, inferent]);
  }

  init() {
    const { baseEle, options } = this;
    const { html, textToDom, toggleShow } = jDom;
    const currentEle = this.currentEle = document.createElement('span');
    let textEle = this.textEle = baseEle.querySelector(options.selector);

    if (!textEle) {
      const ulHtml = `<ul class="texts"><li>${html(baseEle)}</li></ul>`;
      textEle = this.textEle = textToDom(ulHtml);
      html(baseEle, textEle);
    }

    toggleShow(textEle, 0);
    baseEle.insertBefore(currentEle, textEle);
    options.autoStart && this.start();
  }

  start() {
    const self = this;
    const { options, textEle } = self;
    const { length } = jDom.elementChildren(textEle);
    const index = 0;

    self.off(INNER_TIMER_INIT);

    setTimeout(() => {
      self.triggerEvent(EVENT_START);
      /* eslint no-unused-expressions: "off" */
      !(function run(runIndex) {
        self.in(runIndex);

        self.on(INNER_IN_END, () => {
          runIndex++;
          if (!self.options.loop && runIndex >= length) {
            if (options.callback) options.callback();
            self.triggerEvent(EVENT_FINISH);
          } else {
            runIndex %= length;

            self.timeoutRunTask = setTimeout(() => {
              self.out();
            }, options.minDisplayTime);

            self.on(INNER_OUT_END, () => {
              run(runIndex);
            });

            self.triggerEvent('timerInit');
          }
        });
      }(index));
    }, options.initialDelay);
  }

  stop() {
    const self = this;
    self.on(INNER_TIMER_INIT, () => {
      if (!self.timeoutRunTask) {
        return;
      }
      clearTimeout(self.timeoutRunTask);
      self.timeoutRunTask = null;
      self.triggerEvent(EVENT_FINISH);
    });
  }

  in(index = 0) {
    const self = this;
    const {
      currentEle, baseEle, textEle, options,
    } = self;
    const {
      elementChildren, getDataOpt, dataApi, attr, html, text, css,
    } = jDom;
    const children = elementChildren(textEle);
    const nextReferEle = children[index];
    const thisOptions = merge.all([options, getDataOpt(nextReferEle)]);
    const isInEffectV = isInEffect(thisOptions.in.effect);
    const isOutEffectV = isOutEffect(thisOptions.out.effect);

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

    const tokenEles = elementChildren(currentEle);
    arrayEach.call(tokenEles, (el) => {
      css(el, {
        display: 'inline-block',
        '-webkit-transform': 'translate3d(0,0,0)',
        '-moz-transform': 'translate3d(0,0,0)',
        '-o-transform': 'translate3d(0,0,0)',
        'transform': 'translate3d(0,0,0)',
        'white-space': 'pre',
      });
      if (isInEffectV) {
        css(el, 'visibility', 'hidden');
      } else if (isOutEffectV) {
        css(el, 'visibility', 'visible');
      }
    });
    if (!isInEffectV) {
      setTimeout(() => {
        self.triggerEvent(EVENT_IN_ANI_END);
      });
    } else {
      animateTokens(tokenEles, thisOptions.in, () => {
        self.triggerEvent(EVENT_IN_ANI_END);
        if (thisOptions.in.callback) thisOptions.in.callback();
      });
    }
  }

  out() {
    const self = this;
    const { currentEle, textEle } = self;
    const { elementChildren, dataApi } = jDom;
    const tokenEles = elementChildren(currentEle);
    const nextReferEle = elementChildren(textEle)[self.currentIndex];
    const thisOptions = dataApi.get(nextReferEle, 'bindOptions');
    const isOutEffectV = isOutEffect(thisOptions.out.effect);

    self.triggerEvent(EVENT_OUT_ANI_BEGIN);

    if (!isOutEffectV) {
      setTimeout(() => {
        self.triggerEvent(EVENT_OUT_ANI_END);
      });
    } else {
      animateTokens(tokenEles, thisOptions.out, () => {
        self.triggerEvent(EVENT_OUT_ANI_END);
        if (thisOptions.out.callback) thisOptions.out.callback();
      });
    }
  }

  /**
     * 内部事件订阅器，仅用于触发内部回调
     * 用于解耦回调嵌套
     * @param {*} event cb
     */
  on(event, cb) {
    const whiteList = [INNER_IN_END, INNER_OUT_END, INNER_TIMER_INIT];
    if (whiteList.indexOf(event) < 0) {
      return;
    }
    this.privateEvents[event] = cb;
  }

  /**
     * 内部事件订阅取消
     * @param {*} event
     */
  off(event) {
    const whiteList = [INNER_IN_END, INNER_OUT_END, INNER_TIMER_INIT];
    if (whiteList.indexOf(event) < 0) {
      return;
    }
    this.privateEvents[event] = null;
  }

  /**
     * 事件发布器，同时分发项目内部与外部的事件
     * @param {*} name
     */
  triggerEvent(name) {
    const self = this;
    const { teffectInstance: { eventCollections }, privateEvents } = self;
    const eventList = eventCollections[name] || [];
    const privateEventCb = privateEvents[`$$${name}`];

    eventList.forEach((cb) => {
      if (typeof cb !== 'function') {
        return;
      }
      cb && cb(self.baseEle);
    });

    // 内部事件只执行最新的
    privateEventCb && privateEventCb();
  }
}

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
    callback() {},
  },
  out: {
    effect: 'hinge',
    delayScale: 1.5,
    delay: 50,
    sync: false,
    reverse: false,
    shuffle: false,
    callback() {},
  },
  autoStart: true,
  inEffects: [],
  outEffects: ['hinge'],
  callback() {},
  type: 'char',
};
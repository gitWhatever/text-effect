import merge from 'deepmerge'
import jDom from './dom';
import lettering from './lettering';
import { arrayEach } from './benStorage';

export default class MTextillate{
    constructor(element, options) {
        this.baseEle = element;
        this.options = options;
        this.timeoutRunTask = null;
        this.init();
    }

    setOptions(options) {
        this.options = options;
    }

    init() {
        const baseEle = this.baseEle;
        const options = this.options;
        let textEle = this.textEle = baseEle.querySelector(options.selector);
        const currentEle = this.currentEle = document.createElement('span');
        if (!textEle) {
            const ulHtml = '<ul class="texts"><li>' + jDom.html(baseEle) + '</li></ul>'
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
    }

    start() {
        const self = this;
        const { options, textEle } = self;
        var length = jDom.elementChildren(textEle).length;
        let index = 0;

        setTimeout(() => {
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
                                run(index)
                            });
                        }, options.minDisplayTime);
                    }
                });
            }(index);
        }, options.initialDelay);
    }

    stop() {
        let timeoutRunTask = this.timeoutRunTask;
        if (timeoutRunTask) {
            clearInterval(timeoutRunTask);
            timeoutRunTask = null;
        }
    }

    in(index = 0, cb) {
        const self = this;
        const children = jDom.elementChildren(self.textEle);
        const nextReferEle = children[index];
        const { currentEle, baseEle, options } = self;
        const thisOptions = merge.all([options, jDom.getDataOpt(nextReferEle)]);
        const isInEffectV = isInEffect(thisOptions.in.effect);
        const isOutEffectV = isOutEffect(thisOptions.out.effect);
        
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
        
        const tokenEles = jDom.elementChildren(currentEle);
        arrayEach.call(tokenEles, function (el, index) {
            jDom.css(el, {
                'display': 'inline-block',
                // fix for poor ios performance
                '-webkit-transform': 'translate3d(0,0,0)',
                '-moz-transform': 'translate3d(0,0,0)',
                '-o-transform': 'translate3d(0,0,0)',
                'transform': 'translate3d(0,0,0)',
                'white-space': 'pre',
            });
            if (isInEffectV) {
                jDom.css(el, 'visibility', 'hidden');
            } else if (isOutEffectV) {
                jDom.css(el, 'visibility', 'visible');
            }
        })
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
    }

    out(cb) {
        const self = this;
        const { currentEle, textEle, options } = self;
        const tokenEles = jDom.elementChildren(currentEle);
        const childrenOfTextEle = jDom.elementChildren(self.textEle);
        const nextReferEle = childrenOfTextEle[self.currentIndex];
        const thisOptions = jDom.dataApi.get(nextReferEle, 'bindOptions');
        const isOutEffectV = isOutEffect(thisOptions.out.effect);
        self.triggerEvent('outAnimationBegin');
        
        if (!isOutEffectV) {
            self.triggerEvent('outAnimationEnd');
            cb && cb();
        }else{
            animateTokens(tokenEles, thisOptions.out, function () {
                self.triggerEvent('outAnimationEnd');
                if (thisOptions.out.callback) thisOptions.out.callback();
                cb && cb();
            });
        }
    }

    triggerEvent() {
        const self = this;
        // self.triggerEvent('inAnimationBegin');
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
        callback: function () { }
    },
    out: {
        effect: 'hinge',
        delayScale: 1.5,
        delay: 50,
        sync: false,
        reverse: false,
        shuffle: false,
        callback: function () { }
    },
    autoStart: true,
    inEffects: [],
    outEffects: ['hinge'],
    callback: function () { },
    type: 'char'
};

function isInEffect(effect) {
    return /In/.test(effect) || MTextillate.defaultConfig.inEffects.indexOf(effect) >= 0;
};

function isOutEffect(effect) {
    return /Out/.test(effect) || MTextillate.defaultConfig.outEffects.indexOf(effect) >= 0;
};

function animateTokens(tokenEles, options, cb) {
    let count = tokenEles.length;
    if (count < 1) {
        cb && cb();
        return;
    }

    if (options.shuffle) tokenEles = shuffle(tokenEles);
    if (options.reverse) tokenEles = reverse(tokenEles);

    arrayEach.call(tokenEles, function(el, index) {
        const delay = options.sync ? options.delay : options.delay * index * options.delayScale;
        const complete = (el) => {
            if (isInEffect(options.effect)) {
                jDom.css(el, 'visibility', 'visible');
            } else if (isOutEffect(options.effect)) {
                jDom.css(el, 'visibility', 'hidden');
            }
            count--;
            if (!count && cb) cb();
        }

        setTimeout(function() {
            addAnimate(el, options.effect, complete);
        }, delay);
    })
}

function addAnimate(el, effectClass, complete) {
    const { classApi, css, one } = jDom;
    const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    const animateClass = effectClass + ' animated'

    classApi.addClass(el, animateClass);
    css(el, 'visibility', 'visible');
    one(el, animationEnd, function() {
        classApi.removeClass(this, animateClass);
        complete && complete(this);
    })
}

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
}
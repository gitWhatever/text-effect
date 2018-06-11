import jDom from './dom';
import { arrayEach } from './benStorage';

export default function lettering(outerEles, method, ...rest) {
    console.log(outerEles);
    if (!jDom.isValidNodeList(outerEles)) {
        console.warn('lettering has no effective dom element');
        return this;
    }
    if (method === 'letters' || !method || !methods[method]) {
        method = 'init';
    }
    methods[method](outerEles, ...rest);
}

const methods = {
    init(elList) {    
        arrayEach.call(elList, (el) => {
            injector(el, '', 'char', '');
        })
    },
    word(elList) {
        arrayEach.call(elList, (el) => {
            injector(el, /\s+/, 'word', '');
        })
    },
    lines(elList) {
        arrayEach.call(elList, (el) => {
            injector(el, /(\r\n)+/, 'line', '');
        })

    }
}

const injector = (t, splitter, klass, after) => {
    const text = jDom.text(t);
    const splitList = text.split(splitter)
    let inject = '';
    if (splitList.length) {
        inject = splitList.map((item, i) => {
            return '<span class="' + klass + (i + 1) + '" aria-hidden="true">' + item + '</span>';
        }).join(after);
        jDom.attr(t, 'aria-label', text);
        t.innerHTML = inject;
    }
}


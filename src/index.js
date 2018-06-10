import lettering from './lettering';
import textillate from './textillate';
import jDom from './dom';

export default class TextEffect {
    constructor(el) {
        this.els = formateElToList(el);
    }

    static lettering(outerEles, method, ...rest) {
        lettering(formateElToList(outerEles), method, ...rest);
    };

    textillate() {
        textillate.entry.apply(this, arguments);
    }
};

const formateElToList = (el) => {
    if (jDom.isHtmlElement(el)) {
        return [el];
    }
    return el;
}


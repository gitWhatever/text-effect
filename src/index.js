import lettering from './lettering';
import textillate from './textillate';
import jDom from './dom';

const formateElToList = (el) => {
  if (jDom.isHtmlElement(el)) {
    return [el];
  } else if (typeof el === 'string') {
    el = document.querySelectorAll(el);
  }
  return el;
};

export default class TextEffect {
  constructor(el) {
    this.els = formateElToList(el);
    this.eventCollections = {};
  }

  static lettering(outerEles, method, ...rest) {
    lettering(formateElToList(outerEles), method, ...rest);
  }

  textillate() {
    textillate.entry.apply(this, arguments);
    return this;
  }

  on(event, cb) {
    let eventList = this.eventCollections[event];
    eventList = eventList || (this.eventCollections[event] = []);
    eventList.push((baseEle) => {
      cb.call(this, baseEle);
    });
  }
}

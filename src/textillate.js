import merge from 'deepmerge';
import jDom from './dom';
import MTextillate from './MTextillate';
import { arrayEach } from './benStorage';


export default {
  entry(settings, ...args) {
    const teffectInstance = this;
    const { dataApi, getDataOpt } = jDom;
    const outerEles = teffectInstance.els;
    const involkeWhiteList = ['start', 'stop', 'setOptions', 'init'];

    arrayEach.call(outerEles, (el) => {
      const options = merge.all([MTextillate.defaultConfig, getDataOpt(el), typeof settings === 'object' && settings]);
      let mInstance = dataApi.get(el, 'mTextillate');

      if (!mInstance) {
        dataApi.set(el, 'mTextillate', (mInstance = new MTextillate(el, options, teffectInstance)));
      } else if (typeof settings === 'string') {
        if (involkeWhiteList.indexOf(settings) < 0) {
          return;
        }
        mInstance[settings](...args);
      } else {
        mInstance.setOptions(options);
      }
    });
  },
  name: 'textillate',
};

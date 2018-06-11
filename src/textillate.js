import merge from 'deepmerge'
import jDom from './dom';
import MTextillate from './MTextillate'
import { arrayEach } from './benStorage';


export default {
    entry(settings, ...args) {
        const { dataApi, getDataOpt } = jDom;
        const outerEles = this.els;
        const involkeWhiteList = ['start', 'stop', 'setOptions', 'init'];
        
        arrayEach.call(outerEles, (el, index) => {
            const options = merge.all([MTextillate.defaultConfig, jDom.getDataOpt(el), typeof settings === 'object' && settings]);
            let mInstance = dataApi.get(el, 'mTextillate');
            if (!mInstance){
                dataApi.get(el, 'mTextillate', (mInstance = new MTextillate(el, options)));
            } else if (typeof settings == 'string'){
                if (involkeWhiteList.indexOf(settings) > -1) {
                    mInstance[settings]( ...args);
                }
            } else {
                mInstance.setOptions(options);
            }
        });
    },
    name: 'textillate',
}



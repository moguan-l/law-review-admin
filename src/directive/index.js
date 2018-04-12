/**
 * Created by Rubick.Li on 2018/4/12.
 */
import Vue from 'vue';
import store from '../store';

Vue.directive('auth', {
    bind(el, binding) {
        let resources = store.getters.resources,
            {value: code, modifiers} = binding;
        let hasAuth = resources.some(item => item.code == code);
        if (modifiers.renewable) {
            el.style.visibility = hasAuth ? 'visible' : 'hidden'
        } else {
            hasAuth || el.parentNode.removeChild(el)
        }
    },
    update(el, binding) {
        let {value: code, modifiers} = binding;
        if (modifiers.renewable) {
            let resources = store.getters.resources,
                hasAuth = resources.some(item => item.code == code);
            el.style.visibility = hasAuth ? 'visible' : 'hidden'
        }
    }
});
import 'babel-polyfill';
import Vue from 'vue';
import store from './store';
import router from './router';
import './filter';
import './directive';
import './assets/js/init';
import App from './App';

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});

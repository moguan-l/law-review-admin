import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
import {name} from '../config';
import {title} from '../assets/js/util';
import '../theme/index.less';

Vue.use(Router);
Vue.use(iView);

const router =  new Router({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: [
        {
            path: '/',
            redirect: '/index',
            component: resolve => require(['../components/layout'], resolve),
            children: [
                {
                    path: '/index',
                    meta: {title: `欢迎-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/index'], resolve)
                }
            ]
        },
        {
            path: '/login',
            meta: {title: `登录-${name}`},
            component: resolve => require(['../pages/login'], resolve)
        },
        {
            path: '/401',
            meta: {title: `无权限-${name}`},
            component: resolve => require(['../pages/401'], resolve)
        },
        {
            path: '/404',
            meta: {title: `找不到页面-${name}`},
            component: resolve => require(['../pages/404'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    title(to.meta.title);
    next()
});

router.afterEach(() => {
    iView.LoadingBar.finish();
});

export default router
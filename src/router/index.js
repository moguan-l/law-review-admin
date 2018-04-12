import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
import {name} from '../config';
import auth from '../assets/js/auth';
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
                },
                {
                    path: '/illegal/audit',
                    meta: {title: `违规信息-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/illegal/audit'], resolve)
                },
                {
                    path: '/illegal/archive',
                    meta: {title: `提报档案-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/illegal/archive'], resolve)
                },
                {
                    path: '/duty/index',
                    meta: {title: `任务发布-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/duty/index'], resolve)
                },
                {
                    path: '/user/index',
                    meta: {title: `用户管理-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/user/index'], resolve)
                },
                {
                    path: '/credit/index',
                    meta: {title: `积分管理-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/credit/index'], resolve)
                },
                {
                    path: '/template/index',
                    meta: {title: `模板管理-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/template/index'], resolve)
                },
                {
                    path: '/city/index',
                    meta: {title: `城市管理-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/city/index'], resolve)
                },
                {
                    path: '/setting/user',
                    meta: {title: `用户管理-${name}`, requireAuth: true},
                    component: resolve => require(['../pages/setting/user'], resolve)
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
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (!auth.loggedIn()) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        } else {
            next()
        }
    } else {
        next()
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
});

export default router
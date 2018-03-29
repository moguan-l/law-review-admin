import Vue from 'vue';

/**
 * 日期格式化
 * value - 时间戳
 * type - 日期格式
 */
Vue.filter('formatDate', (value, type) => {
    return new Date(value).format(type)
});
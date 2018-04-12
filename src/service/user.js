/**
 * Created by Rubick.Li on 2018/4/12.
 */
import request from '../assets/js/request';

export const queryUser = data => {
    return request({method: 'post', url: '/admin/api/user/auditing/queryUser', data})
};

export const auditingUser = data => {
    return request({method: 'post', url: '/admin/api/user/auditing/auditingUser', data})
};
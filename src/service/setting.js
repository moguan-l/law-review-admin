/**
 * Created by LQJ on 2018/4/6.
 */
import request from '../assets/js/request';
import crypto from 'crypto-js';

export const getResources = data => {
    return request({method: 'post', url: '/admin/api/resource/getResourcesByUidAndType', data})
};

export const queryAdminUser = data => {
    return request({method: 'post', url: '/admin/api/user/auditing/queryUser', data: {isAdmin: 1, ...data}})
};

export const addAdminUser = data => {
    let {username, addUsername, nickname, password} = data;
    return request({method: 'post', url: '/admin/api/user/auditing/addAdminUser', data: {username, addUsername, nickname, password: crypto.MD5(password).toString()}})
};
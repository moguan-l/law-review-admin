/**
 * Created by LQJ on 2018/4/5.
 */
import crypto from 'crypto-js';
import request from '../assets/js/request';
import auth from '../assets/js/auth';

export const login = ({username, password}) => {
    return request({method: 'post', url: '/api/user/manage/login', data: {loginType: 3, username, password: crypto.MD5(password).toString()}})
        .then(res => {
            if (res.ret) {
                auth.login(res.data)
            }
            return res
        })
};
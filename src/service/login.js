/**
 * Created by LQJ on 2018/4/5.
 */
import request from '../assets/js/request';
import auth from '../assets/js/auth';

export const login = data => {
    return request({method: 'post', url: '/api/user/manage/login', data: {loginType: 3, ...data}})
        .then(res => {
            if (res.ret) {
                auth.login(res.data)
            }
            return res
        })
};
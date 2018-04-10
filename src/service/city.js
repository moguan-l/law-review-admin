/**
 * Created by LQJ on 2018/4/7.
 */
import request from '../assets/js/request';

export const getCityList = data => {
    return request({method: 'post', url: '/api/user/base/getCityList', data})
};

export const updateCity = data => {
    return request({method: 'post', url: '/api/user/base/updateCity', data})
};
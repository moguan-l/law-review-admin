/**
 * Created by LQJ on 2018/4/7.
 */
import request from '../assets/js/request';

export const getCityList = data => {
    return request({method: 'post', url: '/api/base/getCityList', data})
};
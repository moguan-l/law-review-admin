/**
 * Created by LQJ on 2018/4/7.
 */
import request from '../assets/js/request';

export const queryPointChannelInfo = () => {
    return request({method: 'post', url: '/admin/api/user/point/queryPointChannelInfo'})
};

export const savePointChannelInfo = params => {
    let {type, ...data} = params;
    return type === 1 ?
        request({method: 'post', url: '/admin/api/user/point/addPointChannelInfo', data}) :
        request({method: 'post', url: '/admin/api/user/point/updatePointChannelInfo', data})
};
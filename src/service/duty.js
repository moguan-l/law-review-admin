/**
 * Created by Rubick.Li on 2018/4/8.
 */
import request from '../assets/js/request';

export const queryNotify = data => {
    return request({method: 'post', url: '/api/user/event/queryNotify', data})
};

export const saveOrUpdateNotice = data => {
    return request({method: 'post', url: '/admin/api/message/saveOrUpdateNotice', data})
};
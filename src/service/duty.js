/**
 * Created by Rubick.Li on 2018/4/8.
 */
import request from '../assets/js/request';

export const queryNoticeList = data => {
    return request({method: 'post', url: '/admin/api/message/queryNoticeList', data})
};

export const saveOrUpdateNotice = data => {
    return request({method: 'post', url: '/admin/api/message/saveOrUpdateNotice', data})
};
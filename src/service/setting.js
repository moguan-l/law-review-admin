/**
 * Created by LQJ on 2018/4/6.
 */
import request from '../assets/js/request';

export const getResources = data => {
    return request({method: 'post', url: '/admin/api/resource/getResourcesByUidAndType', data})
};
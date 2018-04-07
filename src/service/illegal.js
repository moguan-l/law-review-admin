/**
 * Created by LQJ on 2018/4/7.
 */
import request from '../assets/js/request';

export const queryAuditList = data => {
    return request({method: 'post', url: '/admin/api/audit/queryAuditList', data})
};

export const executeAudit = data => {
    return request({method: 'post', url: '/admin/api/audit/executeAudit', data})
};

export const batchStock = data => {
    return request({method: 'post', url: '/admin/api/audit/batchStock', data})
};
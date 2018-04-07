/**
 * Created by LQJ on 2018/4/7.
 */
import request from '../assets/js/request';

export const selectTemplate = data => {
    return request({method: 'post', url: '/admin/api/template/selectTemplate', data})
};

export const getTemplateType = () => {
    return request({method: 'post', url: '/admin/api/template/getTemplateType'})
};

export const saveTemplate = data => {
    let {templateId, types, content} = data;
    return !!templateId ?
        request({method: 'post', url: '/admin/api/template/addTemplate', data: {templateId, templateType: types[0], subType: types[1], content}}) :
        request({method: 'post', url: '/admin/api/template/addTemplate', data: {templateType: types[0], subType: types[1], content}})
};
import axios from 'axios';
import iView from 'iview';
import {baseURL} from '../../config';

axios.defaults.timeout = 30000;
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
    config => config,
    error => {
        iView.Message.error('网络异常');
        return Promise.reject(error)
    });

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        }
        iView.Message.error(response.statusText);
        return Promise.reject(response)
    },
    error => {
        iView.Message.error('服务器异常');
        return Promise.reject(error)
    });

export default option => axios(option)
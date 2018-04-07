import axios from 'axios';
import {baseURL} from '../../config';

axios.defaults.timeout = 30000;
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(config => config);

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        }
        return Promise.reject(response)
    });

export default option => axios(option)
// api.js
import axios from 'axios';

// 设置基础URL
let BASE_URL = 'http://localhost:5000';
//获取后端服务器地址
const update_background_server_url = (background_url)=>{
    BASE_URL = background_url
}
// GET请求封装
const request_get = (url, params = {}, callback, errorCallback) => {
    axios.get(`${BASE_URL}/${url}`, { params })
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            if (errorCallback) {
                errorCallback(`GET request failed: ${error.message}`);
            }
        });
};

// POST请求封装
const request_post = (url, data = {}, callback, errorCallback) => {
    axios.post(`${BASE_URL}/${url}`, data)
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            if (errorCallback) {
                errorCallback(`POST request failed: ${error.message}`);
            }
        });
};

export { request_get, request_post,update_background_server_url };
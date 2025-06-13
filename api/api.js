import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.56.1:5000/api',
  timeout: 10000 // 10 seconds timeout for requests
});

console.log('API baseURL:', api.defaults.baseURL);

export default api;

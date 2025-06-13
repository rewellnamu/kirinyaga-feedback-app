import axios from 'axios';

const api = axios.create({
  baseURL: 'http://<YOUR-IP>:5000/api'
});

export default api;

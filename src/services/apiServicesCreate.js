import axios from 'axios';

const apiClient = axios.create({
    baseURL: '', 
    headers: {
      'Content-Type': 'application/json',
    },
});
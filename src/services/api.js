import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7275/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getReferrals() {
    return api.get('/Referral/Referidos');
  },
};

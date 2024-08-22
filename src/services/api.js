import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7275/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async getReferrals() {
    try {
      const response = await api.get('/Referral/Referidos');
      return { success: true, data: response.data.data || [] };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { 
          success: true, 
          data: [], 
          message: error.response.data.message 
        };
      } else if (error.message === 'Network Error' || !error.response) {
        return { success: false, error: "Error de conexión" };
      } else {
        return { success: false, error: error.message || "Error desconocido" };
      }
    }
  },
};
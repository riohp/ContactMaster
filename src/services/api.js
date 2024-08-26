import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7275/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async getReferrals(page = 1, pageSize = 10) {
    try {
      const response = await api.get('/Referral/Referidos', {
        params: { page, pageSize }
      });
      return { 
        success: true, 
        data: response.data.data || [], 
        totalCount: response.data.totalCount,
        page: response.data.page,
        pageSize: response.data.pageSize
      };
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
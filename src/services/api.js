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

  async getReferral(id) {
    try {
      const response = await api.get(`/Referral/Referido/${id}`);
      if (response.data && response.data.statusCode === 200) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Respuesta inesperada del servidor"
        };
      }
    } catch (error) {
      console.error('Error en getReferral:', error);
      if (error.response && error.response.status === 404) {
        return { 
          success: false, 
          error: error.response.data.message || "No se encontró el referido"
        };
      } else if (error.message === 'Network Error' || !error.response) {
        return { success: false, error: "Error de conexión" };
      } else {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error al obtener el referido'
        };
      }
    }
  },

  async updateReferral(id, updateData) {
    try {
      const response = await api.put(`/Referral/ActualizarReferido/${id}`, updateData);
      if (response.data && response.data.statusCode === 201) {
        return {
            success: true,
            data: response.data.data
        };
      } else {
        return {
          success: false,
          error: 'La actualización no fue exitosa',
          details: response.data
        };
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response && error.response.status === 404) {
        return { 
          success: false, 
          error: error.response.data.messageError
        };
      }else if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        return { 
          success: false, 
          error: error.response.data.Message,
          details: error.response.data
        };
      } else if (error.request) {
        return { 
          success: false, 
          error: "No se recibió respuesta del servidor" 
        };
      } else {
        return { 
          success: false, 
          error: error.message || 'Error al actualizar el referido'
        };
      }
    }
  }
};
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7275/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default {
    // Función de login
    async login(credentials) {
      try {
        const response = await axios.post(
          `${api.defaults.baseURL}login?username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`,
          '', 
          {
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          return {
            success: true,
            data: response.data
          };
        } else {
          return {
            success: false,
            error: 'Token no recibido'
          };
        }
      } catch (error) {
        console.error('Error en login:', error);
        return {
          success: false,
          error: error.response?.data?.message || 'Error al iniciar sesión'
        };
      }
    },
  
    // Función de logout
    async logout() {
      try {
        localStorage.removeItem('token');
        return {
          success: true
        };
      } catch (error) {
        console.error('Error en logout:', error);
        return {
          success: false,
          error: 'Error al cerrar sesión'
        };
      }
    },
  
    // Función para refrescar el token si es necesario
    async refreshToken() {
      try {
        const response = await api.post('/refresh-token');
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          return {
            success: true,
            data: response.data
          };
        } else {
          return {
            success: false,
            error: 'Nuevo token no recibido'
          };
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        return {
          success: false,
          error: 'Error al refrescar el token'
        };
      }
    },

  async getReferrals(page = 1, pageSize = 10) {
    try {
      const response = await api.get('api/Referral/Referidos', {
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
      const response = await api.get(`api/Referral/Referido/${id}`);
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
      const response = await api.put(`api/Referral/ActualizarReferido/${id}`, updateData);
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
  },

  async createReferral(createDto) {
    try {
      const response = await api.post('api/Referral/CrearReferido', createDto);
      if (response.status === 201) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || "Referido creado exitosamente."
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Error al crear el referido."
        };
      }
    } catch (error) {
      console.error('Error en createReferral:', error);
      if (error.response) {
        return { 
          success: false, 
          error: error.response.data.message || "Error desconocido",
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
          error: error.message || 'Error al crear el referido'
        };
      }
    }
  },

  async searchReferrals(searchTerm, page = 1, pageSize = 10) {
    try {
      const response = await api.get('api/Referral/BuscarReferidos', {
        params: { searchTerm, page, pageSize }
      });
      if (response.data && response.data.statusCode === 200) {
        return {
          success: true,
          data: response.data.data || [],
          totalCount: response.data.totalCount,
          page: response.data.page,
          pageSize: response.data.pageSize,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: response.data.message || "Respuesta inesperada del servidor"
        };
      }
    } catch (error) {
      console.error('Error en searchReferrals:', error);
      if (error.response && error.response.status === 404) {
        return { 
          success: false, 
          error: error.response.data.message || "No se encontraron referidos que coincidan con la búsqueda."
        };
      } else if (error.message === 'Network Error' || !error.response) {
        return { success: false, error: "Error de conexión" };
      } else {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Error al buscar referidos'
        };
      }
    }
  },
};

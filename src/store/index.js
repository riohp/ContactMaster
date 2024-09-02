import { createStore } from "vuex";
import api from '@/services/api.js';
export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: "bg-default",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    // Nuevos estados para la autenticación
    isAuthenticated: false,
    token: null,
    user: null
  },
  mutations: {
    toggleSidebarColor(state, payload) {
      state.sidebarType = payload;
    },
    // Nuevas mutaciones para la autenticación
    setAuth(state, { token, user }) {
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    }
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("toggleSidebarColor", payload);
    },
    // Nuevas acciones para la autenticación
    async login({ commit }, credentials) {
      try {

        const response = await api.login(credentials);
        if (response.success) {
          commit('setAuth', {
            token: response.data.token,
            user: response.data.user
          });
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch (error) {
        console.error('Error en acción de login:', error);
        return { success: false, error: 'Error al iniciar sesión' };
      }
    },
    logout({ commit }) {
      commit('clearAuth');
      // Eliminar el token del almacenamiento local
      localStorage.removeItem('token');
    }
  },
  getters: {
    // Nuevos getters para la autenticación
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user
  },
});
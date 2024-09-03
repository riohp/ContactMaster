import { createStore } from "vuex";
import api from '@/services/api.js';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

console.log('jwtDecode:', jwtDecode);

const TOKEN_COOKIE_NAME = 'token_cookie_name';
console.log('Token guardado en la cookie:', Cookies.get(TOKEN_COOKIE_NAME));
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
    setAuth(state, { token, user }) {
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 1/3 }); // 8 hours of token
      console.log('Token guardado en la cookie:', Cookies.get(TOKEN_COOKIE_NAME));
    },
    
    clearAuth(state) {
      state.isAuthenticated = false;  
      state.token = null;             
      state.user = null;              
      Cookies.remove(TOKEN_COOKIE_NAME);
      console.log('Cookie eliminada:', !Cookies.get(TOKEN_COOKIE_NAME)); 
    }
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("toggleSidebarColor", payload);
    },
    // Nuevas acciones para la autenticación
    async login({ commit, dispatch }, credentials) {
      try {
        const response = await api.login(credentials);
        if (response.success) {
          commit('setAuth', {
            token: response.data.token,
            user: response.data.user
          });
          dispatch('setupTokenExpiration', response.data.token);
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
    },
    initAuth({ commit, dispatch }) {
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const now = Date.now();
          if (decodedToken.exp * 1000 > now) {
            const user = {
              id: decodedToken.sub,
              name: decodedToken.name,
              email: decodedToken.email,
            };
            commit('setAuth', { token, user });
            dispatch('setupTokenExpiration', token);
          } else {
            console.log('Token ha expirado');
            commit('clearAuth');
          }
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          commit('clearAuth');
        }
      } else {
        commit('clearAuth');
      }
    },
    setupTokenExpiration({ dispatch }, token) {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; 
      const now = Date.now();
      const timeUntilExpiration = expirationTime - now;

      if (timeUntilExpiration > 0) {
        setTimeout(() => {
          dispatch('logout');
        }, timeUntilExpiration);
      } else {
        dispatch('logout');
      }
    }
  },
  getters: {
    // Nuevos getters para la autenticación
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user
  },
});
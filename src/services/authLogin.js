import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import api from '@/services/api';

export function useAuth() {
  const router = useRouter();
  const store = useStore();

  const handleLogout = async () => {
    try {
      await api.logout();
      store.commit('clearAuth');
      router.push('/signin');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const obtenerRuta = () => {
    return router.currentRoute.value.name;
  };

  return {
    handleLogout,
    obtenerRuta
  };
}
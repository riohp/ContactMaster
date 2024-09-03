import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';
import { getStatusBadgeClass } from "@/assets/js/bg-status.js";

export function useReferralsTable() {
  const referrals = ref([]);
  const loading = ref(true);
  const noReferralsMessage = ref('No se encontraron referidos');
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const searchTerm = ref('');

  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

  const displayedPages = computed(() => {
    const delta = 1; 
    let range = [];
    
    for (let i = Math.max(1, currentPage.value - delta); i <= Math.min(totalPages.value, currentPage.value + delta); i++) {
      range.push(i);
    }
      
    // Always include first and last page
    if (range[0] > 1) {
      range.unshift(1);
    }
    if (range[range.length - 1] < totalPages.value) {
      range.push(totalPages.value);
    }
    
    return range;
  });

  const fetchReferrals = async () => {
    loading.value = true;
    let result;
    
    if (searchTerm.value) {
      result = await api.searchReferrals(searchTerm.value, currentPage.value, pageSize.value);
    } else {
      result = await api.getReferrals(currentPage.value, pageSize.value);
    }
    
    if (result.success) {
      referrals.value = result.data;
      totalCount.value = result.totalCount;
      console.log('Datos recibidos del servidor:', result.data); // Para depuración
        referrals.value = result.data.map(referral => ({
          ...referral,
          formattedDateTime: formatDateTime(referral.callDate)
        }));
        totalCount.value = result.totalCount;
      if (result.message) {
        noReferralsMessage.value = result.message;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.error === "Error de conexión" 
          ? 'No se pudo establecer conexión con el servidor. Por favor, verifique su conexión a internet y vuelva a intentarlo.'
          : 'Error al cargar los referidos. Por favor, inténtelo más tarde.',
      });
    }
    
    loading.value = false;
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      fetchReferrals();
    }
  };

  const truncateNotes = (notes) => {
    return notes.length > 20 ? notes.substring(0, 20) + '...' : notes;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) {
      console.log('Fecha y hora no disponibles:', dateTimeString);
      return 'Fecha y hora no disponibles';
    }
    
    try {
      const dateObj = new Date(dateTimeString);
      
      if (isNaN(dateObj.getTime())) {
        console.log('Fecha y hora inválidas:', dateTimeString);
        return 'Fecha y hora inválidas';
      }
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true
      };
      
      return dateObj.toLocaleString('es-ES', options);
    } catch (error) {
      console.error('Error al formatear la fecha y hora:', error);
      return 'Error en fecha y hora';
    }
  };


  const debounceSearch = (() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        currentPage.value = 1; 
      }, 300); // Debounce for 300ms
    };
  })();

  onMounted(() => {
    fetchReferrals();
  });

  return {
    referrals,
    loading,
    noReferralsMessage,
    currentPage,
    pageSize,
    totalCount,
    searchTerm,
    totalPages,
    displayedPages,
    fetchReferrals,
    changePage,
    truncateNotes,
    formatDateTime,
    debounceSearch,
    getStatusBadgeClass
  };
}
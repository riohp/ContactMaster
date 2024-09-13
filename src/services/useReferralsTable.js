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
    try {
      let result;
      if (searchTerm.value) {
        result = await api.searchReferrals(searchTerm.value, currentPage.value, pageSize.value);
      } else {
        result = await api.getReferrals(currentPage.value, pageSize.value);
      }

      if (result.success) {
        referrals.value = result.data.map(referral => ({
          ...referral,
          formattedDateTime: formatDateTime(referral.callDate)
        }));
        totalCount.value = result.totalCount;
        
        if (result.message) {
          noReferralsMessage.value = 'No se encontraron referidos';
        }
      } else {
        throw new Error(result.error || 'Error al obtener los referidos');
      }
    } catch (error) {
      if (error.message === 'Error de conexión') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo establecer conexión con el servidor. Por favor, verifique su conexión a internet y vuelva a intentarlo.',
        });
      } 
      referrals.value = [];
      totalCount.value = 0;
    } finally {
      loading.value = false;
    }
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
      return 'Fecha y hora no disponibles';
    }
    
    try {
      const dateObj = new Date(dateTimeString);
      
      if (isNaN(dateObj.getTime())) {
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
      return 'Error en fecha y hora';
    }
  };


  const debounceSearch = (() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        currentPage.value = 1;
        fetchReferrals(); 
      }, 800); 
    };
  })();

  const maskedPhoneNumber = (number) => {
    if (typeof number !== 'string') {
      number = String(number);
    }
    if (number.length <= 6) {
      return 'x'.repeat(number.length);
    }
    return 'x'.repeat(number.length - 4) + number.slice(-4);
  };

  const showFullNumber = (event) => {
    event.target.textContent = event.target.dataset.fullNumber;
  };

  const hideFullNumber = (event) => {
    event.target.textContent = maskedPhoneNumber(event.target.dataset.fullNumber);
  };

  const copyNumber = (event) => {
    const fullNumber = event.target.dataset.fullNumber;
    navigator.clipboard.writeText(fullNumber).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Copiado',
        text: 'El número de teléfono ha sido copiado al portapapeles',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el número de teléfono',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    });
  };


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
    getStatusBadgeClass,
    maskedPhoneNumber,
    showFullNumber,
    hideFullNumber,
    copyNumber
  };
}
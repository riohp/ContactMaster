import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';
import { getStatusBadgeClass } from "@/assets/js/bg-status.js";
import { usePagination } from '@/assets/js/pagination.js';

export function useAgendizedTables() {
  const referrals = ref([]);
  const noReferralsMessage = ref('No se encontraron referidos');
  const showEditModal = ref(false);
  const selectedReferralId = ref(null);
  const searchTerm = ref('');

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
        console.log('Datos recibidos del servidor:', result.data); // Para depuración
        referrals.value = result.data.map(referral => ({
          ...referral,
          formattedDateTime: formatDateTime(referral.callDate)
        }));
        totalCount.value = result.totalCount;
        
        if (filteredReferrals.value.length === 0) {
          noReferralsMessage.value = 'No se encontraron referidos agendados o en proceso';
        }
      } else {
        throw new Error(result.error || 'Error al obtener los referidos');
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
      let errorMessage = 'Error al cargar los referidos. ';
      if (error.message === 'Error de conexión') {
        errorMessage += 'No se pudo establecer conexión con el servidor. Por favor, verifique su conexión a internet y vuelva a intentarlo.';
      } else {
        errorMessage += error.message || 'Por favor, inténtelo más tarde.';
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
      referrals.value = [];
      totalCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const { currentPage, totalCount, loading, totalPages, pageSize, changePage } = usePagination(fetchReferrals);

  const filteredReferrals = computed(() => {
    return referrals.value.filter(referral => 
      (referral.status === 'agendado' || referral.status === 'en proceso')
    );
  });

  const debounceSearch = (() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        currentPage.value = 1; // Reset to first page on new search
        fetchReferrals();
      }, 800); 
    };
  })();

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


  const editReferral = (referralId) => {
    if (referralId) {
      selectedReferralId.value = referralId;
      showEditModal.value = true;
    } else {
      console.error('ID de referido no válido');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo editar el referido: ID no válido'
      });
    }
  };

  const closeEditModal = () => {
    showEditModal.value = false;
    selectedReferralId.value = null;
  };

  const onReferralUpdated = (updatedReferral) => {
    const index = referrals.value.findIndex(r => r.referralId === updatedReferral.referralId);
    if (index !== -1) {
      referrals.value[index] = updatedReferral;
    }
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'El referido ha sido actualizado correctamente.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return {
    noReferralsMessage,
    showEditModal,
    selectedReferralId,
    fetchReferrals,
    currentPage,
    totalCount,
    loading,
    totalPages,
    pageSize,
    changePage,
    filteredReferrals,
    truncateNotes,
    formatDateTime,
    editReferral,
    closeEditModal,
    onReferralUpdated,
    getStatusBadgeClass,
    searchTerm,
    debounceSearch
  };
}
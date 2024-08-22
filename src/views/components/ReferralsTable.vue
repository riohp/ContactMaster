<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Tabla De Referidos</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div v-if="!loading && referrals.length === 0" class="text-center py-5">
        <i class="fas fa-users fa-3x text-secondary mb-3"></i>
        <h5 class="text-secondary">{{ noReferralsMessage }}</h5>
        <p class="text-muted">Cuando tengas referidos, aparecerán aquí.</p>
      </div>

      <!-- Spinner de carga -->
      <div v-else-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Tabla de referidos -->
      <div v-else class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <!-- ... (el resto del código de la tabla permanece igual) ... -->
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';

const referrals = ref([]);
const loading = ref(true);
const noReferralsMessage = ref('No se encontraron referidos');

const fetchReferrals = async () => {
  loading.value = true;
  const result = await api.getReferrals();
  
  if (result.success) {
    referrals.value = result.data;
    if (result.message) {
      noReferralsMessage.value = result.message;
    }
  } else {
    console.error('Error fetching referrals:', result.error);
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

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Marcar formatDate como usado
/* eslint-disable-next-line no-unused-vars */
const _unused = formatDate;

onMounted(() => {
  fetchReferrals();
});
</script>
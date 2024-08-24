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
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">ID</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Nombre</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Teléfono</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha de Llamada</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in referrals" :key="referral.referralId">
              <td>
                <p class="text-xs font-weight-bold mb-0 px-2">{{ truncateId(referral.referralId) }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ referral.name }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ referral.phoneNumber }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{ formatDate(referral.callDate) }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="badge" :class="getStatusBadgeClass(referral.status)">{{ referral.status }}</span>
              </td>
              <td class="align-middle text-center">
                <p class="text-xs text-secondary mb-0">{{ truncateNotes(referral.notes) }}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Paginación -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mt-4 px-3">
          <div class="text-sm text-secondary mb-2 mb-md-0">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} de {{ totalCount }} resultados
          </div>
          <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm flex-wrap justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" v-if="currentPage > 2">
                <a class="page-link" href="#" @click.prevent="changePage(1)">1</a>
              </li>
              <li class="page-item disabled" v-if="currentPage > 3">
                <span class="page-link">...</span>
              </li>
              <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item disabled" v-if="currentPage < totalPages - 2">
                <span class="page-link">...</span>
              </li>
              <li class="page-item" v-if="currentPage < totalPages - 1">
                <a class="page-link" href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';

const referrals = ref([]);
const loading = ref(true);
const noReferralsMessage = ref('No se encontraron referidos');
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const visiblePages = computed(() => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = Math.max(2, currentPage.value - delta); i <= Math.min(totalPages.value - 1, currentPage.value + delta); i++) {
    range.push(i);
  }

  if (range[0] > 2) {
    range.unshift(1);
  }

  if (range[range.length - 1] < totalPages.value - 1) {
    range.push(totalPages.value);
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});

const fetchReferrals = async () => {
  loading.value = true;
  const result = await api.getReferrals(currentPage.value, pageSize.value);
  
  if (result.success) {
    referrals.value = result.data;
    totalCount.value = result.totalCount;
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

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchReferrals();
  }
};

const truncateId = (id) => {
  return id.substring(0, 8) + '...';
};

const truncateNotes = (notes) => {
  return notes.length > 20 ? notes.substring(0, 20) + '...' : notes;
};

const getStatusBadgeClass = (status) => {
  switch (status.toLowerCase()) {
    case 'agendado':
      return 'bg-info';
    case 'completado':
      return 'bg-success';
    case 'pendiente':
      return 'bg-warning';
    default:
      return 'bg-secondary';
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchReferrals();
});
</script>

<style scoped>
.pagination {
  gap: 5px;
}
.page-link {
  padding: 0.25rem 0.5rem;
}
.badge {
  font-size: 0.75em;
  padding: 0.35em 0.65em;
}
</style>
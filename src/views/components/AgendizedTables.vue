<template>
  <div class="card">
    <div class="card-header">
      <h6>Tabla De Agendados y En Proceso</h6>
    </div>
    <div class="card-body">
      <div v-if="!loading && filteredReferrals.length === 0" class="text-center py-5">
        <i class="fas fa-users fa-3x text-secondary mb-3"></i>
        <h5 class="text-secondary">{{ noReferralsMessage }}</h5>
        <p class="text-muted">Cuando tengas referidos, aparecerán aquí.</p>
      </div>
      <!-- Spinner of loading -->
      <div v-else-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <!-- Table of referral -->
      <div v-else class="table-responsive p-0">
        <table class="table align-items-center text-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Teléfono</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Notas</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in filteredReferrals" :key="referral.referralId" :data-full-id="referral.referralId">
              <td class="text-xs">
                <span class="text-secondary">{{ referral.name }}</span>
              </td>
              <td class="text-xs">
                <span class="text-secondary">{{ referral.phoneNumber }}</span>
              </td>
              <td class="text-xs">
                <span class="text-secondary">{{ formatDate(referral.callDate) }}</span>
              </td>
              <td class="text-xs">
                <span class="badge" :class="getStatusBadgeClass(referral.status)">{{ referral.status }}</span>
              </td>
              <td class="text-xs">
                <span class="text-secondary">{{ truncateNotes(referral.notes) }}</span>
              </td>  
              <td class="text-xs">
                <button class="btn px-4 btn-primary" @click="editReferral(referral.referralId)">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- pagination -->
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
              <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
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

  <!-- Modal of edit -->
  <ReferralEditModal 
    v-if="showEditModal"
    :referral-id="selectedReferralId"
    :is-visible="showEditModal"
    @close="closeEditModal"
    @updated="onReferralUpdated"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';
import ReferralEditModal from './ReferralEditModal.vue';
import { getStatusBadgeClass } from "@/assets/js/bg-status.js";

const referrals = ref([]);
const loading = ref(true);
const noReferralsMessage = ref('No se encontraron referidos');
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const showEditModal = ref(false);
const selectedReferralId = ref(null);

const filteredReferrals = computed(() => {
  return referrals.value.filter(referral => 
    referral.status === 'agendado' || referral.status === 'en proceso'
  );
});

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const visiblePages = computed(() => {
  const delta = 2;
  let range = [];
  for (let i = Math.max(1, currentPage.value - delta); i <= Math.min(totalPages.value, currentPage.value + delta); i++) {
    range.push(i);
  }
  return range;
});

const fetchReferrals = async () => {
  loading.value = true;
  try {
    const result = await api.getReferrals(currentPage.value, pageSize.value);
    console.log('API Response:', result); // Mantener para depuración

    if (result.success) {
      referrals.value = result.data;
      totalCount.value = result.totalCount;
      currentPage.value = result.page;
      pageSize.value = result.pageSize;

      if (filteredReferrals.value.length === 0) {
        noReferralsMessage.value = 'No se encontraron referidos agendados o en proceso';
      }
    } else {
      throw new Error(result.message || 'Error al obtener los referidos');
    }
  } catch (error) {
    console.error('Error fetching referrals:', error);
    let errorMessage = 'Error al cargar los referidos. ';
    if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Por favor, inténtelo más tarde.';
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

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchReferrals();
  }
};

const truncateNotes = (notes) => {
  return notes.length > 20 ? notes.substring(0, 20) + '...' : notes;
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
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

onMounted(() => {
  fetchReferrals();
});

watch(currentPage, () => {
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
<template>
  <div class="card">
    <div class="card-header text-center">
      <h6 class="container fs-3 fw-bold text-primary-emphasis">Tabla De Agendados y En Proceso</h6>
    </div>
    <div class="container d-flex justify-content-end">
      <div class="input-group w-25">
        <input
          type="text"
          class="form-control"
          placeholder="Buscar referido..."
          v-model="searchTerm"
          @input="debounceSearch"  
        >
      </div>
    </div>
    <div class="card-body">
      <div v-if="!loading && filteredReferrals.length === 0" class="text-center py-5">
        <i class="fas fa-users fa-3x text-secondary mb-3"></i>
        <h5 class="text-secondary">{{ noReferralsMessage }}</h5>
        <p class="text-muted">Cuando tengas referidos, aparecerán aquí.</p>
      </div>
      
      <div v-else-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table align-items-center text-center table table-striped  table-hover">
          <thead>
            <tr>
              <th class="text-uppercase text-dark text-sm fw-bold">Nombre</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Teléfono</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Fecha</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Estado</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in filteredReferrals" :key="referral.referralId" :data-full-id="referral.referralId">
              <td class="text-sm">
                <span class="text-dark">{{ referral.name }}</span>
              </td>
              <td class="text-sm">
                <span class="text-dark">{{ referral.phoneNumber }}</span>
              </td>
              <td class="text-sm">
              <span class="text-dark">
                {{ formatDateTime(referral.callDate) }}
              </span>
            </td>
              <td class="text-sm">
                <span class="badge" :class="getStatusBadgeClass(referral.status)">{{ referral.status }}</span>
              </td>
              <td class="text-sm pt-2">
                <button class="btn px-3  btn-success badgebutton" @click="editReferral(referral.referralId)">
                  <i class="fas fa-exclamation-circle"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
     
        <div class="d-flex flex-wrap justify-content-between align-items-center mt-4 px-3">
          <div class="text-sm text-dark fw-normal mb-2 mb-md-0">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} de {{ totalCount }} resultados
          </div>
          <PaginatorAgendized
            :current-page="currentPage"
            :total-pages="totalPages"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>
  </div>

  <ReferralEditModal 
    v-if="showEditModal"
    :referral-id="selectedReferralId"
    :is-visible="showEditModal"
    @close="closeEditModal"
    @updated="onReferralUpdated"
  />
</template>

<script setup>
import { onMounted, watch } from 'vue';
import ReferralEditModal from './ReferralEditModal.vue';
import PaginatorAgendized from './PaginatorAgendized.vue';
import { useAgendizedTables } from '@/services/useAgendizedTables.js';

const {
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
  formatDateTime,
  editReferral,
  closeEditModal,
  onReferralUpdated,
  getStatusBadgeClass,  
  searchTerm,
  debounceSearch  
} = useAgendizedTables();

onMounted(() => {
  fetchReferrals();
});

watch(currentPage, () => {
  fetchReferrals();
});
</script>

<style scoped>
.badge {
  font-size: 0.90em;
  padding: 0.35em 0.65em;
}

.badgebutton{
  padding: 0.35em 0.65em;
}
</style>

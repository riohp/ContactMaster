<template>
  <div class="card">
    <div class="card-header ">
      <h6 class="container">Tabla De Agendados y En Proceso</h6>
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
              <span class="text-secondary">
                {{ formatDateTime(referral.callDate) }}
              </span>
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
     
        <div class="d-flex flex-wrap justify-content-between align-items-center mt-4 px-3">
          <div class="text-sm text-secondary mb-2 mb-md-0">
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
  truncateNotes,
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
  font-size: 0.75em;
  padding: 0.35em 0.65em;
}
</style>

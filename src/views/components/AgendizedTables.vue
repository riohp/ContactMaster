<template>
  <div class="card">
    <div class="card-header text-center">
      <h6 class="container fs-3 fw-bold text-primary-emphasis">Tabla De Agendados y En Proceso</h6>
    </div>
    <div class="container d-flex justify-content-end">
      <div class="row">
        <div class="input-group w-50">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar referido..."
            v-model="searchTerm"
            @input="debounceSearch"
          >
        </div>
        <div class="input-group w-50">
          <input
            type="date"
            class="form-control"
            v-model="searchTerm"
            @input="debounceSearch"
          >
        </div>
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

      <div v-else class="table-container">
        <div class="table-responsive">
          <table class="table align-items-center text-center table-striped table-hover">
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
                  <span 
                    class="text-dark phone-number" 
                    @mouseover="showFullNumber"
                    @mouseout="hideFullNumber"
                    @contextmenu.prevent="copyNumber"
                    :data-full-number="referral.phoneNumber"
                  >
                    {{ maskedPhoneNumber(referral.phoneNumber) }}
                  </span>
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
                  <button class="btn px-3 btn-success badgebutton" @click="editReferral(referral.referralId)">
                    <i class="fas fa-exclamation-circle"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="d-flex flex-wrap justify-content-between align-items-center px-3">
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
import { maskedPhoneNumber, showFullNumber, hideFullNumber, copyNumber } from '@/assets/js/numberUtils';
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
.card-body {
  padding: 0;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.table-responsive {
  margin-bottom: 0;
}

.table {
  margin-bottom: 0;
}

thead {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

.badge {
  font-size: 0.90em;
  padding: 0.35em 0.65em;
}

.table-container::-webkit-scrollbar {
  width: 2px; 
}

.table-container::-webkit-scrollbar-track {
  background: transparent;  /* Fondo transparente para un aspecto más limpio */
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(136, 136, 136, 0.5);  /* Color semi-transparente para mayor elegancia */
  border-radius: 4px;  /* Bordes redondeados para suavizar la apariencia */
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 85, 85, 0.8);  /* Ligeramente más oscuro y opaco al pasar el mouse */
}

.table-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(136, 136, 136, 0.5) transparent;
}

.table-container::-webkit-scrollbar {
  display: none;  
}

.table-container:hover {
  scrollbar-width: thin;  /* Para Firefox */
}

.table-container:hover::-webkit-scrollbar {
  display: block;  
}
</style>
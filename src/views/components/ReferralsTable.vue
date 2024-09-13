<template>
  <div class="card">
    <div class="card-header text-center py-3">
      <h6 class="container fs-3 fw-bold text-primary-emphasis">Tabla General</h6>
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
      <div v-else class="table-responsive">
        <table class="table align-items-center text-center table-striped table-hover">
          <thead>
            <tr>
              <th class="text-uppercase text-dark text-sm fw-bold">Nombre</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Teléfono</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Fecha</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Estado</th>
              <th class="text-uppercase text-dark text-sm fw-bold">Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in referrals" :key="referral.referralId" :data-full-id="referral.referralId">
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
              <td class="text-sm">
                <span class="text-dark">{{ truncateNotes(referral.notes) }}</span>
              </td>  
            </tr>
          </tbody>
        </table>
        <!-- Paginación -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mt-4 px-3">
          <div class="text-sm text-dark fw-normal mb-2 mb-md-0">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalCount) }} de {{ totalCount }} resultados
          </div>
          <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm flex-wrap justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" v-for="page in displayedPages" :key="page" :class="{ active: currentPage === page }">
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
</template>

<script setup>
import { useReferralsTable } from '@/services/useReferralsTable';

const {
  referrals,
  loading,
  noReferralsMessage,
  currentPage,
  pageSize,
  totalCount,
  searchTerm,
  totalPages,
  displayedPages,
  changePage,
  truncateNotes,
  formatDateTime,
  debounceSearch,
  getStatusBadgeClass,
  maskedPhoneNumber,
  showFullNumber,
  hideFullNumber,
  copyNumber
} = useReferralsTable();
</script>

<style scoped>
  
.badge {
  font-size: 0.95em;
  padding: 0.35em 0.65em;
}
.d-none {
  display: none;
}
.table {
  font-size: 0.80em;
}
.phone-number {
  cursor: pointer;
}
</style>
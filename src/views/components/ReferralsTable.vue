<template>
  <div class="card">
    <div class="card-header">
      <h6 class="container">Tabla De Referidos</h6>
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
      <div v-else class="table-responsive p-0">
        <table class="table align-items-center text-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Nombre</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Teléfono</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Fecha</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Estado</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in referrals" :key="referral.referralId" :data-full-id="referral.referralId">
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
  getStatusBadgeClass
} = useReferralsTable();
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
.d-none {
  display: none;
}
</style>
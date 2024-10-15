<template>
  <div class="card">
    <div class="card-header text-center py-3">
      <h6 class="container fs-3 fw-bold text-primary-emphasis">Tabla General</h6>
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
      <div v-else class="table-container">
        <div class="table-responsive">
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
                  @mouseover="(event) => { showFullNumber(event); initializePopover(event); }"
                  @mouseout="hideFullNumber"
                  @contextmenu.prevent="copyNumber"
                  data-bs-toggle="popover" 
                  data-bs-content="Click derecho para copiar número"
                  data-bs-placement="left"
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
                  <button 
                    type="button" 
                    class="btn btn-sm btn-dark"
                    data-bs-toggle="popover" 
                    :data-bs-content="referral.notes ? referral.notes : 'No hay información que mostrar'"
                    data-bs-placement="left"
                    ref="popoverBtn"
                    @mouseover="initializePopover"
                  >
                    Ver notas
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Paginación -->
    <div class="card-footer">
      <div class="d-flex flex-wrap justify-content-between align-items-center px-3">
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
</template>

<script setup>
import { useReferralsTable } from '@/services/useReferralsTable';
import { maskedPhoneNumber, showFullNumber, hideFullNumber, copyNumber } from '@/assets/js/numberUtils';
import { usePopover } from '@/assets/js/usePopover';

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
  formatDateTime,
  debounceSearch,
  getStatusBadgeClass
} = useReferralsTable();

const {
  initializePopover
} = usePopover();

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
  font-size: 0.80em;
}

thead {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

.badge {
  font-size: 0.95em;
  padding: 0.35em 0.65em;
}

.phone-number {
  cursor: pointer;
}

.table-container::-webkit-scrollbar {
  width: 4px;
}

.table-container::-webkit-scrollbar-track {
  background: transparent;
}

.table-container::-webkit-scrollbar-thumb {
  background: rgba(136, 136, 136, 0.5);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 85, 85, 0.8);
}

.table-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(136, 136, 136, 0.5) transparent;
}

.table-container::-webkit-scrollbar {
  display: none;
}


.table-container:hover::-webkit-scrollbar {
  display: block;
}
</style>
<template>
  <div v-if="isVisible">
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Referido</h5>
            <button type="button" class="btn btn-danger close" @click="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
            <form v-else @submit.prevent="validateAndSubmit" novalidate>
              <div :class="['form-group', validationClass(referral.name)]">
                <label for="name">Nombre</label>
                <input type="text" class="form-control" id="name" v-model="referral.name" required>
                <div class="invalid-feedback">
                  Por favor, ingrese un nombre.
                </div>
              </div>
              <div :class="['form-group', validationClass(referral.phoneNumber)]">
                <label for="phoneNumber">Teléfono</label>
                <input type="tel" class="form-control" id="phoneNumber" v-model="referral.phoneNumber" @input="validatePhoneNumber" required pattern="[0-9]{10}" maxlength="10">
                <div class="invalid-feedback">
                  Por favor, ingrese un número de teléfono válido.
                </div>
              </div>
              <div :class="['form-group', validationClass(referral.status)]">
                <label for="status">Estado</label>
                <select class="form-control" id="status" v-model="referral.status" required> 
                    <option value="" disabled>Seleccione...</option>
                    <option value="agendado">Agendado</option>
                    <option value="en proceso">En Proceso</option>
                    <option value="exitoso">Exitoso</option>
                    <option value="no exitoso">No Exitoso</option>
                </select>
                <div class="invalid-feedback">
                  Por favor, seleccione un estado.
                </div>
              </div>
              <div class="form-group">
                <label for="notes">Notas</label>
                <textarea class="form-control" id="notes" v-model="referral.notes"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">Cerrar</button>
            <button type="submit" class="btn btn-primary" @click="validateAndSubmit" :disabled="loading">Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, watch } from 'vue';
import useReferralEditModal from '@/composables/useReferralEditModal';

const props = defineProps({
  referralId: String,
  isVisible: Boolean
});

const emit = defineEmits(['close', 'updated']);

const {
  referral,
  loading,
  validationClass,
  validatePhoneNumber,
  validateAndSubmit,
  close,
  fetchReferral
} = useReferralEditModal(props, emit);

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    fetchReferral();
  }
});

onMounted(() => {
  if (props.isVisible) {
    fetchReferral();
  }
});
</script>

<style scoped>
.is-invalid .form-control {
  border-color: #dc3545;
}
.is-valid .form-control {
  border-color: #28a745;
}
.invalid-feedback {
  display: none;
}

.is-invalid .invalid-feedback {
  display: block;
}
</style>

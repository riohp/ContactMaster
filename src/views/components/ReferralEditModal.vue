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
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';

const validatePhoneNumber = (event) => {
  referral.value.phoneNumber = event.target.value.replace(/\D/g, '');
};

const props = defineProps({
  referralId: String,
  isVisible: Boolean
});

const emit = defineEmits(['close', 'updated']);

const referral = ref({
  name: '',
  phoneNumber: '',
  status: '',
  notes: ''
});
const loading = ref(true);
const formValidated = ref(false);

const fetchReferral = async () => {
  loading.value = true;
  try {
    const result = await api.getReferral(props.referralId);
    if (result.success && result.data) {
      referral.value = result.data;
    } else {
      throw new Error(result.error || 'No se pudo obtener la información del referido');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo obtener la información del referido'
    });
    emit('close');
  } finally {
    loading.value = false;
  }
};

const validationClass = (field) => {
  if (!formValidated.value) return '';
  return field ? 'is-valid' : 'is-invalid';
};

const validateAndSubmit = async () => {
  formValidated.value = true;
  if (referral.value.name && referral.value.phoneNumber && referral.value.status) {
    loading.value = true;
    try {
      const result = await api.updateReferral(props.referralId, referral.value);
      if (result && result.success) {
        emit('updated', result.data);
        close();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Referido actualizado correctamente'
        });
      } else {
        throw new Error(result.error || 'Error desconocido al actualizar el referido');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al actualizar el referido'
      });
    } finally {
      loading.value = false;
    }
  }
};

const close = () => {
  emit('close');
};

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

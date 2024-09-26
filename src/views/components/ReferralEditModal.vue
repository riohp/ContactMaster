<template>
  <div v-if="isVisible">
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Información del Referido</h5>
            <button type="button" class="btn btn-sm btn-success" @click="toggleEdit">
              <i v-if="!isEditing" class="fas fa-edit"></i>
              <i v-else class="fas fa-check"></i>
            </button>
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
              <div class="row">
                <div class="col-md-6">
                  <div v-for="field in evenFields" :key="field.id" class="mb-3">
                    <label :for="field.id">{{ field.label }}</label>
                    <input v-if="field.type === 'datetime-local'"
                           type="datetime-local"
                           :class="['form-control', validationClass(referral[field.id])]"
                           :id="field.id"
                           v-model="referral[field.id]"
                           :disabled="!isEditing"
                           :required="field.required">
                    <input v-else-if="field.type !== 'select' && field.type !== 'textarea'"
                           :type="field.type"
                           :class="['form-control', validationClass(referral[field.id])]"
                           :id="field.id"
                           v-model="referral[field.id]"
                           :disabled="!isEditing"
                           :required="field.required"
                           :pattern="field.pattern"
                           :maxlength="field.maxlength"
                           @input="field.id === 'phoneNumber' ? validatePhoneNumber() : null">
                    <select v-else-if="field.type === 'select'"
                            :class="['form-control', validationClass(referral[field.id])]"
                            :id="field.id"
                            v-model="referral[field.id]"
                            :disabled="!isEditing"
                            :required="field.required">
                      <option value="" disabled>Seleccione...</option>
                      <option v-for="option in field.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      {{ field.invalidFeedback }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div v-for="field in oddFields" :key="field.id" class="mb-3">
                    <label :for="field.id">{{ field.label }}</label>
                    <input v-if="field.type === 'datetime-local'"
                           type="datetime-local"
                           :class="['form-control', validationClass(referral[field.id])]"
                           :id="field.id"
                           v-model="referral[field.id]"
                           :disabled="!isEditing"
                           :required="field.required">
                    <input v-else-if="field.type !== 'select' && field.type !== 'textarea'"
                           :type="field.type"
                           :class="['form-control', validationClass(referral[field.id])]"
                           :id="field.id"
                           v-model="referral[field.id]"
                           :disabled="!isEditing"
                           :required="field.required"
                           :pattern="field.pattern"
                           :maxlength="field.maxlength"
                           @input="field.id === 'phoneNumber' ? validatePhoneNumber() : null">
                    <select v-else-if="field.type === 'select'"
                            :class="['form-control', validationClass(referral[field.id])]">
                      <option value="" disabled>Seleccione...</option>
                      <option v-for="option in field.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="mb-1">
                <textarea id="notes"
                          class="form-control"
                          v-model="referral.notes"
                          :disabled="!isEditing"
                          rows="5">
                </textarea>
                <div class="invalid-feedback">
                  Por favor, ingrese notas si es necesario.
                </div>
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
import { ref, onMounted, watch, computed } from 'vue';
import useReferralEditModal from '@/services/useReferralEditModal';

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

const isEditing = ref(false);

const fields = [
  { id: 'name', label: 'Nombre', type: 'text', required: true, invalidFeedback: 'Por favor, ingrese un nombre.' },
  { id: 'phoneNumber', label: 'Teléfono', type: 'tel', required: true, pattern: '[0-9]{10}', maxlength: '10', invalidFeedback: 'Por favor, ingrese un número de teléfono válido.' },
  { id: 'status', label: 'Estado', type: 'select', required: true, options: [
    { value: 'agendado', label: 'Agendado' },
    { value: 'en proceso', label: 'En Proceso' },
    { value: 'exitoso', label: 'Exitoso' },
    { value: 'no exitoso', label: 'No Exitoso' }
  ], invalidFeedback: 'Por favor, seleccione un estado.' },
  { id: 'callDate', label: 'Fecha y Hora de Llamada', type: 'datetime-local', required: true, invalidFeedback: 'Por favor, seleccione una fecha y hora.' },
  { id: 'notes', label: 'Notas', type: 'textarea', required: false }
];

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    fetchReferral();
    isEditing.value = false; // Reset to non-editing mode when the modal opens
  }
});

onMounted(() => {
  if (props.isVisible) {
    fetchReferral();
  }
});

// Computed properties for filtered fields
const evenFields = computed(() => fields.filter((_, index) => index % 2 === 0));
const oddFields = computed(() => fields.filter((_, index) => index % 2 !== 0));
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

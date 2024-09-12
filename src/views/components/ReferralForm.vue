<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h5>Crear Nuevo Referido</h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <form v-else @submit.prevent="validateAndSubmit" novalidate>
          <div :class="['form-group', validationClass('name')]">
            <label for="name">Nombre</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="referral.name"
              @blur="touchField('name')"
              :class="{'is-valid': referral.name && touchedFields.name, 'is-invalid': !referral.name && touchedFields.name}"
              required
            />
            <div class="invalid-feedback">Por favor, ingrese un nombre.</div>
          </div>

          <div :class="['form-group', validationClass('phoneNumber')]">
            <label for="phoneNumber">Teléfono</label>
            <input
              type="tel"
              class="form-control"
              id="phoneNumber"
              v-model="referral.phoneNumber"
              @input="validatePhoneNumber"
              @blur="touchField('phoneNumber')"
              :class="{'is-valid': referral.phoneNumber && touchedFields.phoneNumber, 'is-invalid': !referral.phoneNumber && touchedFields.phoneNumber}"
              required
              pattern="[0-9]{10}"
              maxlength="10"
            />
            <div class="invalid-feedback">
              Por favor, ingrese un número de teléfono válido.
            </div>
          </div>

          <div :class="['form-group', validationClass('callDate')]">
            <label for="callDate">Fecha de la llamada</label>
            <input
              type="date"
              class="form-control"
              id="callDate"
              v-model="referral.callDate"
              @blur="validateCallDate"
              :min="minDate"
              :class="{'is-valid': isCallDateValid && touchedFields.callDate, 'is-invalid': !isCallDateValid && touchedFields.callDate}"
              required
            />
            <div class="invalid-feedback">
              Por favor, ingrese una fecha válida (hoy o una fecha futura).
            </div>
          </div>

          <div :class="['form-group', validationClass('callTime')]">
            <label for="callTime">Hora de la llamada</label>
            <input
              type="time"
              class="form-control"
              id="callTime"
              v-model="referral.callTime"
              @blur="touchField('callTime')"
              :class="{'is-valid': referral.callTime && touchedFields.callTime, 'is-invalid': !referral.callTime && touchedFields.callTime}"
              required
            />
            <div class="invalid-feedback">
              Por favor, ingrese una hora válida.
            </div>
          </div>

          <div class="form-group">
            <label for="notes">Notas</label>
            <textarea
              class="form-control"
              id="notes"
              v-model="referral.notes"
              @blur="touchField('notes')"
            ></textarea>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary" :disabled="loading">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const referral = ref({
  name: '',
  phoneNumber: '',
  callDate: '',
  callTime: '',
  notes: ''
});

const touchedFields = ref({
  name: false,
  phoneNumber: false,
  callDate: false,
  callTime: false,
  notes: false
});

const loading = ref(false);
const isCallDateValid = ref(true);

const touchField = (field) => {
  touchedFields.value[field] = true;
};

const validationClass = (field) => {
  const value = referral.value[field];
  const touched = touchedFields.value[field];
  if (field === 'callDate') {
    return touched ? (isCallDateValid.value ? 'is-valid' : 'is-invalid') : '';
  }
  if (touched && value === '') {
    return 'is-invalid';
  } else if (touched && value !== '') {
    return 'is-valid';
  } else {
    return '';
  }
};

const validateCallDate = () => {
  touchField('callDate');
  if (!referral.value.callDate) {
    isCallDateValid.value = false;
    return;
  }
  const selectedDate = new Date(referral.value.callDate + 'T00:00:00Z');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  isCallDateValid.value = selectedDate >= today;
  
  console.log("Fecha seleccionada (UTC):", selectedDate.toUTCString());
  console.log("Fecha actual (UTC):", today.toUTCString());
  console.log("Es válida:", isCallDateValid.value);
};

const validatePhoneNumber = () => {
  referral.value.phoneNumber = referral.value.phoneNumber.replace(/[^0-9]/g, '');
};

const resetForm = () => {
  referral.value = {
    name: '',
    phoneNumber: '',
    callDate: '',
    callTime: '',
    notes: ''
  };
  touchedFields.value = {
    name: false,
    phoneNumber: false,
    callDate: false,
    callTime: false,
    notes: false
  };
  isCallDateValid.value = true;
};

const validateAndSubmit = async () => {
  validateCallDate();
  console.log("Iniciando validación y envío:", JSON.parse(JSON.stringify(referral.value)));

  if (referral.value.name && referral.value.phoneNumber && referral.value.callDate && referral.value.callTime && isCallDateValid.value) {
    const [year, month, day] = referral.value.callDate.split('-');
    const [hours, minutes] = referral.value.callTime.split(':');
    const combinedDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    
    console.log("Fecha y hora combinada (UTC):", combinedDateTime.toUTCString());
    
    const referralData = {
      ...referral.value,
      callDate: combinedDateTime.toISOString(),
      phoneNumber: parseInt(referral.value.phoneNumber, 10)
    };

    delete referralData.callTime; 

    loading.value = true;
    try {
      console.log("Enviando datos al servidor:", referralData);
      const result = await api.createReferral(referralData);
      console.log("Respuesta completa del servidor:", JSON.stringify(result, null, 2));

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: result.message || 'Referido creado exitosamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          resetForm();
        });
      } else {
        throw new Error(result.message || result.error || 'Error desconocido al crear el referido');
      }
    } catch (error) {
      console.error("Error detallado:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo crear el referido. Por favor, intenta de nuevo.',
      });
    } finally {
      loading.value = false;
    }
  } else {
    let errorMessage = 'Por favor, complete todos los campos obligatorios correctamente.';
    if (!isCallDateValid.value) {
      errorMessage += ' La fecha de llamada debe ser igual o posterior a la fecha actual.';
    }
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: errorMessage,
    });
  }
};
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
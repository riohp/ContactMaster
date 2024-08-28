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
            Por favor, ingrese una fecha válida que no sea anterior a hoy.
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
import { ref } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';

const minDate = new Date().toISOString().split("T")[0];

const referral = ref({
  name: '',
  phoneNumber: '',
  userId: '', 
  callDate: '',
  notes: ''
});

const touchedFields = ref({
  name: false,
  phoneNumber: false,
  userid: false,
  callDate: false,
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
  const selectedDate = new Date(referral.value.callDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  isCallDateValid.value = selectedDate >= today;
};

const validatePhoneNumber = () => {
  referral.value.phoneNumber = referral.value.phoneNumber.replace(/[^0-9]/g, '');
};

const resetForm = () => {
  referral.value = {
    name: '',
    phoneNumber: '',
    callDate: '',
    notes: ''
  };
  touchedFields.value = {
    name: false,
    phoneNumber: false,
    userid: false,
    callDate: false,
    notes: false
  };
  isCallDateValid.value = true;
};

const validateAndSubmit = async () => {
  validateCallDate();
  if (referral.value.name && referral.value.phoneNumber && referral.value.callDate && isCallDateValid.value) {
    referral.value.callDate = referral.value.callDate.split('T')[0];

    loading.value = true;
    try {
      const result = await api.createReferral(referral.value);
      loading.value = false;

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: result.message,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          resetForm();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.error,
        });
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el referido. Por favor, intenta de nuevo.',
      });
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos obligatorios correctamente.',
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
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
import useReferralForm from '@/services/useReferralForm';

const {
  minDate,
  referral,
  touchedFields,
  loading,
  isCallDateValid,
  touchField,
  validationClass,
  validateCallDate,
  validatePhoneNumber,
  validateAndSubmit
} = useReferralForm();
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
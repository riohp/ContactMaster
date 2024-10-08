import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api.js';

export default function useReferralForm() {
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

    if (referral.value.name && referral.value.phoneNumber && referral.value.callDate && referral.value.callTime && isCallDateValid.value) {
      const [year, month, day] = referral.value.callDate.split('-');
      const [hours, minutes] = referral.value.callTime.split(':');
      const combinedDateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      
      const referralData = {
        ...referral.value,
        callDate: combinedDateTime.toISOString(),
        phoneNumber: parseInt(referral.value.phoneNumber, 10)
      };

      delete referralData.callTime; 

      loading.value = true;
      try {
        const result = await api.createReferral(referralData);

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

  return {
    minDate,
    referral,
    touchedFields,
    loading,
    isCallDateValid,
    touchField,
    validationClass,
    validateCallDate,
    validatePhoneNumber,
    resetForm,
    validateAndSubmit
  };
}
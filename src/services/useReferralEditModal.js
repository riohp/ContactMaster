import { ref, computed } from 'vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';

export default function useReferralEditModal(props, emit) {
  const referral = ref({
    name: '',
    phoneNumber: '',
    status: '',
    notes: '',
    callDate: ''
  });
  const loading = ref(true);
  const formValidated = ref(false);

  const currentDateTime = computed(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  const initializeCallDate = () => {
    if (!referral.value.callDate) {
      referral.value.callDate = currentDateTime.value;
    }
  };

  const fetchReferral = async () => {
    loading.value = true;
    try {
      const result = await api.getReferral(props.referralId);
      if (result.success && result.data) {
        referral.value = result.data;
        // Asegurarse de que la fecha de llamada sea futura si existe
        if (referral.value.callDate && new Date(referral.value.callDate) < new Date()) {
          initializeCallDate();
        }
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

  const validatePhoneNumber = (event) => {
    if (event && event.target) {
      const numericValue = event.target.value.replace(/\D/g, '').slice(0, 10);
      event.target.value = numericValue;
      referral.value.phoneNumber = numericValue;
    }
  };

  const validateCallDate = () => {
    if (!referral.value.callDate) return false;
    const callDate = new Date(referral.value.callDate);
    const now = new Date();
    return callDate > now;
  };

  const validateAndSubmit = async () => {
    formValidated.value = true;
    if (referral.value.name && referral.value.phoneNumber && referral.value.status && validateCallDate()) {
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
          icon: 'warning',
          title: 'Error',
          text: error.message || 'Error al actualizar el referido'
        });
      } finally {
        loading.value = false;
      }
    } else if (!validateCallDate()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La fecha de llamada debe ser en el futuro'
      });
    }
  };

  const close = () => {
    emit('close');
  };

  return {
    referral,
    loading,
    currentDateTime,
    validationClass,
    validatePhoneNumber,
    validateAndSubmit,
    close,
    fetchReferral,
    initializeCallDate
  };
}
import { ref } from 'vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';

export default function useReferralEditModal(props, emit) {
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

  const validatePhoneNumber = (event) => {
    referral.value.phoneNumber = event.target.value.replace(/\D/g, '');
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

  return {
    referral,
    loading,
    validationClass,
    validatePhoneNumber,
    validateAndSubmit,
    close,
    fetchReferral
  };
}
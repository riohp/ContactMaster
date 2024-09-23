import Swal from 'sweetalert2';

export const maskedPhoneNumber = (number) => {
  if (typeof number !== 'string') {
    number = String(number);
  }
  if (number.length <= 10) {
    return '*'.repeat(number.length);
  }
};

export const showFullNumber = (event) => {
  event.target.textContent = event.target.dataset.fullNumber;
};

export const hideFullNumber = (event) => {
  event.target.textContent = maskedPhoneNumber(event.target.dataset.fullNumber);
};

export const copyNumber = (event) => {
  const fullNumber = event.target.dataset.fullNumber;
  navigator.clipboard.writeText(fullNumber).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Copiado',
      text: 'El número de teléfono ha sido copiado al portapapeles',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }).catch(() => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo copiar el número de teléfono',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  });
};
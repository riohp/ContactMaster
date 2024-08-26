<!-- src/components/FormComponent.vue -->
<template>
  <div class="container mt-5">
    <h2>Formulario de Contacto</h2>
    <form @submit.prevent="handleSubmit" class="row g-3">
      
      <div class="col-md-4">
        <label for="name" class="form-label">Nombre:</label>
        <input
          type="text"
          id="name"
          class="form-control"
          v-model="form.name"
          :class="{ 'is-invalid': errors.name, 'is-valid': !errors.name && form.name }"
          required
        />
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name }}
        </div>
      </div>

      <div class="col-md-4">
        <label for="email" class="form-label">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          class="form-control"
          v-model="form.email"
          :class="{ 'is-invalid': errors.email, 'is-valid': !errors.email && form.email }"
          required
        />
        <div v-if="errors.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <div class="col-md-4">
        <label for="message" class="form-label">Mensaje:</label>
        <textarea
          id="message"
          class="form-control"
          v-model="form.message"
          :class="{ 'is-invalid': errors.message, 'is-valid': !errors.message && form.message }"
          required
        ></textarea>
        <div v-if="errors.message" class="invalid-feedback">
          {{ errors.message }}
        </div>
      </div>

      <div class="col-md-6">
        <label for="city" class="form-label">Ciudad:</label>
        <input
          type="text"
          id="city"
          class="form-control"
          v-model="form.city"
          :class="{ 'is-invalid': errors.city, 'is-valid': !errors.city && form.city }"
          required
        />
        <div v-if="errors.city" class="invalid-feedback">
          {{ errors.city }}
        </div>
      </div>

      <div class="col-md-3">
        <label for="state" class="form-label">Estado:</label>
        <select
          id="state"
          class="form-select"
          v-model="form.state"
          :class="{ 'is-invalid': errors.state, 'is-valid': !errors.state && form.state }"
          required
        >
          <option value="" disabled>Elige...</option>
          <option value="state1">Estado 1</option>
          <option value="state2">Estado 2</option>
          <!-- Agrega más opciones según sea necesario -->
        </select>
        <div v-if="errors.state" class="invalid-feedback">
          {{ errors.state }}
        </div>
      </div>

      <div class="col-md-3">
        <label for="zip" class="form-label">Código Postal:</label>
        <input
          type="text"
          id="zip"
          class="form-control"
          v-model="form.zip"
          :class="{ 'is-invalid': errors.zip, 'is-valid': !errors.zip && form.zip }"
          required
        />
        <div v-if="errors.zip" class="invalid-feedback">
          {{ errors.zip }}
        </div>
      </div>

      <div class="col-12">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="agree"
            v-model="form.agree"
            :class="{ 'is-invalid': errors.agree }"
            required
          />
          <label class="form-check-label" for="agree">
            Aceptar términos y condiciones
          </label>
          <div v-if="errors.agree" class="invalid-feedback">
            Debes aceptar antes de enviar.
          </div>
        </div>
      </div>

      <div class="col-12">
        <button class="btn btn-primary" type="submit">Enviar formulario</button>
      </div>
    </form>

    <div v-if="submitted" class="mt-4">
      <h3>Datos Enviados:</h3>
      <p><strong>Nombre:</strong> {{ form.name }}</p>
      <p><strong>Correo Electrónico:</strong> {{ form.email }}</p>
      <p><strong>Mensaje:</strong> {{ form.message }}</p>
      <p><strong>Ciudad:</strong> {{ form.city }}</p>
      <p><strong>Estado:</strong> {{ form.state }}</p>
      <p><strong>Código Postal:</strong> {{ form.zip }}</p>
      <p><strong>Aceptación:</strong> {{ form.agree ? 'Aceptado' : 'No Aceptado' }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
        city: '',
        state: '',
        zip: '',
        agree: false,
      },
      errors: {
        name: '',
        email: '',
        message: '',
        city: '',
        state: '',
        zip: '',
        agree: '',
      },
      submitted: false,
    };
  },
  methods: {
    validateForm() {
      this.errors.name = this.form.name ? '' : 'El nombre es obligatorio.';
      this.errors.email = this.form.email && /\S+@\S+\.\S+/.test(this.form.email)
        ? ''
        : 'El correo electrónico es inválido.';
      this.errors.message = this.form.message ? '' : 'El mensaje es obligatorio.';
      this.errors.city = this.form.city ? '' : 'La ciudad es obligatoria.';
      this.errors.state = this.form.state ? '' : 'Debes seleccionar un estado.';
      this.errors.zip = this.form.zip ? '' : 'El código postal es obligatorio.';
      this.errors.agree = this.form.agree ? '' : 'Debes aceptar los términos y condiciones.';
      return !this.errors.name && !this.errors.email && !this.errors.message &&
             !this.errors.city && !this.errors.state && !this.errors.zip && !this.errors.agree;
    },
    handleSubmit() {
      if (this.validateForm()) {
        this.submitted = true;
        // Aquí podrías enviar los datos a un servidor o hacer alguna otra acción
        console.log('Formulario enviado:', this.form);
      }
    },
  },
};
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
</style>

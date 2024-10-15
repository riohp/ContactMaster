<template>
  <main class="mt-0 main-content no-text-select">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- Bloque de imagen a la izquierda -->
            <div class="col-lg-6 d-flex justify-content-center flex-column">
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden background-image"
              >
                <span class="mask bg-gradient-dark opacity-6"></span>
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  Control de Agenda ABAI
                </h4>
                <p class="text-white position-relative">
                  Sistema diseñado para el registro y control de sus referidos.
                </p>
              </div>
            </div>
            <div class="col-lg-6 d-flex align-items-center">
              <div class="card card-plain w-100">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Inicio de Sesión</h4>
                  <p class="mb-0">Ingrese su usuario y contraseña</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="handleLogin">
                    <div class="mb-3">
                      <argon-input
                        v-model="userName"
                        id="userName"
                        type="text"
                        placeholder="Usuario"
                        name="userName"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3 position-relative password-container">
                      <argon-input
                        v-model="password"
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Contraseña"
                        name="password"
                        size="lg"
                      />
                      <div class="password-toggle" @click.stop="togglePassword">
                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </div>
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger text-white" role="alert">
                      {{ errorMessage }}
                    </div>
                    <div class="text-center">
                      <argon-button
                        type="submit"
                        class="mt-4"
                        variant="gradient"
                        color="dark"
                        fullWidth
                        size="lg"
                        :disabled="isLoading"
                      >
                        {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
                      </argon-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import api from '@/services/api.js';

const store = useStore();
const router = useRouter();
const userName = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const body = document.getElementsByTagName("body")[0];

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const response = await api.login({ userName: userName.value, password: password.value });
    if (response.success) {
      store.commit('setAuth', {
        token: response.data.token,
        user: response.data.user
      });
      router.push('/agendizedtables');
    } else {
      errorMessage.value = response.error || 'Error de inicio de sesión. Por favor, intente de nuevo.';
    }
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    if (error.response) {
      errorMessage.value = error.response.data.message || 'Error del servidor. Por favor, intente de nuevo más tarde.';
    } else if (error.request) {
      errorMessage.value = 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.';
    } else {
      errorMessage.value = 'Error inesperado. Por favor, intente de nuevo.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.background-image {
  background-image: url('@/assets/img/test.jpg');
  background-size: cover;
  background-position: center;
  min-height: 500px;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.password-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #adb5bd;
  z-index: 10;
  padding: 5px;
}

.password-toggle:hover {
  color: #6c757d;
}

.no-text-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.no-text-select * {
  cursor: default;
}

.no-text-select input,
.no-text-select textarea,
.no-text-select [contenteditable] {
  cursor: text;
  user-select: text;
}

.no-text-select .password-toggle,
.no-text-select button {
  cursor: pointer;
}
</style>
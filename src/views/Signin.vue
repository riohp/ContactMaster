<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Inicio de Sesión</h4>
                  <p class="mb-0">Ingrese su usuario y contraseña</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="handleLogin">
                    <div class="mb-3">
                      <argon-input
                        v-model="username"
                        id="username"
                        type="text"
                        placeholder="Usuario"
                        name="username"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        v-model="password"
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        size="lg"
                      />
                    </div>
                    <div v-if="errorMessage" class="text-center text-danger mb-3">
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
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                "
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
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

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

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const response = await api.login({ username: username.value, password: password.value });
    if (response.success) {
      store.commit('setAuth', {
        token: response.data.token,
        user: response.data.user
      });
      router.push('/dashboard-default');
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
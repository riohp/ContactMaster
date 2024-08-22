<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";
// Eliminar importación de SidenavCard.vue si ya no lo necesitas
// import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const esRTL = computed(() => store.state.isRTL);

const obtenerRuta = () => {
  const ruta = useRoute();
  const rutaArr = ruta.path.split("/");
  return rutaArr[1];
};
</script>

<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="obtenerRuta() === 'dashboard-default' ? 'active' : ''"
          navText="Panel de Control"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="obtenerRuta() === 'tables' ? 'active' : ''"
          navText="Tablas"
        >
          <template v-slot:icon>
            <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>


      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="esRTL ? 'me-4' : 'ms-2'"
        >
          PÁGINAS DE CUENTA
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="obtenerRuta() === 'signin' ? 'active' : ''"
          navText="Iniciar Sesión"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="obtenerRuta() === 'signup' ? 'active' : ''"
          navText="Registrarse"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: '¿Necesitas ayuda?',
        description: 'Por favor, consulta nuestra documentación',
        links: [
          {
            label: 'Documentación',
            route: 'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Comprar ahora',
            route: 'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    />
  </div>
</template>

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
          navText="Control de Agendamiento"
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
          navText="Tabla General"
        >
          <template v-slot:icon>
            <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/agendizedtables"
          :class="obtenerRuta() === 'agendizedtables' ? 'active' : ''"
          navText="Tabla Agendados"
        >
          <template v-slot:icon>
            <i class="ni ni-calendar-grid-58 text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/create-referral"
          :class="obtenerRuta() === 'createreferral' ? 'active' : ''"
          navText="Agregar Referido"
        >
          <template v-slot:icon>
            <i class="fa fa-user-plus text-success pb-1 text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>


      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 tex-center font-weight-bolder opacity-6"
          :class="esRTL ? 'me-4' : 'ms-2'"
        >
          Opcion
        </h6>
      </li>
  
      <li class="nav-item divider">
        <sidenav-item
          to="/signin"
          :class="obtenerRuta() === 'signin' ? 'active' : ''"
          navText="Cerrar Sesión"
        >
          <template v-slot:icon>
            <i class="fa fa-power-off pb-1 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>

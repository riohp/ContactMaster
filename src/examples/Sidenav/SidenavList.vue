<script setup>
import { useRoute } from "vue-router";
import { useAuth } from '@/services/authLogin';
import SidenavItem from "./SidenavItem.vue";

const { handleLogout } = useAuth();

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
    <ul class="navbar-nav d-flex flex-column justify-content-between h-100">
      <div>
        <li class="nav-item">
          <sidenav-item
            to="/agendizedtables"
            :class="obtenerRuta() === 'agendizedtables' ? 'active' : ''"
            navText="Tabla Agendados"
          >
            <template #icon>
              <i class="ni ni-calendar-grid-58 text-info text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>
        
        <li class="nav-item">
          <sidenav-item
            to="/tables"
            :class="obtenerRuta() === 'tables' ? 'active' : ''"
            navText="Tabla General"
          >
            <template #icon>
              <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>
        
        <li class="nav-item">
          <sidenav-item
            to="/create-referral"
            :class="obtenerRuta() === 'createreferral' ? 'active' : ''"
            navText="Agregar Referido"
          >
            <template #icon>
              <i class="fa fa-user-plus text-success pb-1 text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>
      </div>
      
      <li class="nav-item mt-auto">
        <a
          href="#"
          @click.prevent="handleLogout"
          :class="{ 'active': obtenerRuta() === 'signin' }"
          class="nav-link"
        >
          <div class="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
            <i class="fa fa-power-off pb-1 text-danger text-sm opacity-10"></i>
          </div>
          <span class="nav-link-text ms-1">Cerrar Sesión</span>
        </a>
      </li>
    </ul>
  </div>
</template>
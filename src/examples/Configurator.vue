<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
// estado
const esRTL = computed(() => store.state.isRTL);
const tipoSidebar = computed(() => store.state.sidebarType);
const alternarConfigurador = () => store.commit("toggleConfigurator");

// mutaciones
const establecerTipoSidebar = (tipo) => store.commit("sidebarType", tipo);

const colorSidebar = (color = "success") => {
  document.querySelector("#sidenav-main").setAttribute("data-color", color);
};

</script>

<template>
  <div class="fixed-plugin">
    <a
      class="px-3 py-2 fixed-plugin-button text-dark position-fixed"
      @click="alternarConfigurador"
    >
      <i class="py-2 fa fa-cog"></i>
    </a>
    <div class="shadow-lg card">
      <div class="pt-3 pb-0 bg-transparent card-header">
        <div class="" :class="esRTL ? 'float-end' : 'float-start'">
          <h5 class="mt-3 mb-0">Paleta de Colores</h5>
          <p>opciones de panel.</p>
        </div>
        <div
          class="mt-4"
          @click="alternarConfigurador"
          :class="esRTL ? 'float-start' : 'float-end'"
        >
          <button class="p-0 btn btn-link text-dark fixed-plugin-close-button">
            <i class="fa fa-close"></i>
          </button>
        </div>
        <!-- Fin Botón de Alternar -->
      </div>
      <hr class="my-1 horizontal dark" />
      <div class="pt-0 card-body pt-sm-3">
        <!-- Colores de la Barra Lateral -->
        <div>
          <h6 class="mb-0">Colores de la Barra Lateral</h6>
        </div>
        <a href="#" class="switch-trigger background-color">
          <div
            class="my-2 badge-colors"
            :class="esRTL ? 'text-end' : ' text-start'"
          >
            <span
              class="badge filter bg-gradient-primary active"
              data-color="primary"
              @click="colorSidebar('primary')"
            ></span>
            <span
              class="badge filter bg-gradient-dark"
              data-color="dark"
              @click="colorSidebar('dark')"
            ></span>
            <span
              class="badge filter bg-gradient-info"
              data-color="info"
              @click="colorSidebar('info')"
            ></span>
            <span
              class="badge filter bg-gradient-success"
              data-color="success"
              @click="colorSidebar('success')"
            ></span>
            <span
              class="badge filter bg-gradient-warning"
              data-color="warning"
              @click="colorSidebar('warning')"
            ></span>
            <span
              class="badge filter bg-gradient-danger"
              data-color="danger"
              @click="colorSidebar('danger')"
            ></span>
          </div>
        </a>
        <!-- Tipo de Barra Lateral -->
        <div class="mt-3">
          <h6 class="mb-0">Tipo de Barra Lateral</h6>
          <p class="text-sm">Elige entre 2 tipos diferentes de barra lateral.</p>
        </div>
        <div class="d-flex gap-2">
          <button
            id="btn-white"
            class="btn w-100 px-3 mb-2"
            :class="
              tipoSidebar === 'bg-white'
                ? 'bg-gradient-success'
                : 'btn-outline-success'
            "
            @click="establecerTipoSidebar('bg-white')"
          >
            Blanco
          </button>
          <button
            id="btn-dark"
            class="btn w-100 px-3 mb-2"
            :class="
              tipoSidebar === 'bg-default'
                ? 'bg-gradient-success'
                : 'btn-outline-success'
            "
            @click="establecerTipoSidebar('bg-default')"
          >
            Oscuro
          </button>
        </div>
        <p class="mt-2 text-sm d-xl-none d-block">
          Puedes cambiar el tipo de barra lateral solo en vista de escritorio.
        </p>
      
        <hr class="horizontal dark my-4" />
        <button
          class="btn bg-gradient-dark w-100"
          >Cerrar</button>
      </div>
    </div>
  </div>
</template>

<template>
    <div class="wrapper">
      <side-bar>
        <sidebar-link to="/admin/table-list">
          <i class="nc-icon nc-notes"></i>
          <p>Lista de agentes</p>
        </sidebar-link>
        <sidebar-link to="/admin/table-list">
          <i class="nc-icon nc-notes"></i>
          <p>Lista cancelados</p>
        </sidebar-link>
      </side-bar>
     
    </div>
  </template>
  <style lang="scss">
  
  </style>
  <script>
    import DashboardContent from './content.vue'
    export default {
      components: {
          DashboardContent,
      },
      methods: {
        toggleSidebar () {
          if (this.$sidebar.showSidebar) {
            this.$sidebar.displaySidebar(false)
          }
        }
      }
    }
  
  </script>
  
<template>
  <div>
    <h1>Update Item</h1>
    <ItemForm :item="item" @submit="updateItem" />
  </div>
</template>

<script>
import ItemForm from '@/components/ItemForm.vue';
import axios from 'axios'; // Si estás usando axios para realizar solicitudes HTTP

export default {
  components: { ItemForm },
  data() {
    return {
      item: {
        name: '',
        phonenumber: '',
        userId: '',
        calldate: '',
        notes: ''
      }
    };
  },
  mounted() {
    // Aquí puedes hacer la solicitud para obtener el item desde la API
    const itemId = this.$route.params.id; // Asumiendo que el ID del item está en la URL
    axios.get(`/api/items/${itemId}`)
      .then(response => {
        this.item = response.data;
      })
      .catch(error => {
        console.error("Error al cargar el item:", error);
      });
  },
  methods: {
    updateItem() {
      // Aquí haces la solicitud para actualizar el item
      axios.put(`/api/items/${this.item.userId}`, this.item)
        .then(response => {
          console.log("Item actualizado:", response.data);
          // Aquí puedes redirigir o mostrar un mensaje de éxito
        })
        .catch(error => {
          console.error("Error al actualizar el item:", error);
        });
    }
  }
};
</script>

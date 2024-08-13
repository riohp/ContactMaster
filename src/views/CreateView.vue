<template>
  <div>
    <h1>Create New Item</h1>
    <ItemForm :item="item" @submit="createItem" />
  </div>
</template>

<script>
import ItemForm from '@/components/ItemForm.vue';
import axios from 'axios';

export default {
  components: { ItemForm },
  data() {
    return {
      item: {
        name: '',
        phonenumber: '',
        userId: '', // Este campo podría generarse automáticamente en la API si no lo necesitas definir aquí
        calldate: '',
        notes: ''
      }
    };
  },
  methods: {
    createItem() {
      axios.post('/api/items', this.item)
        .then(response => {
          console.log("Item creado:", response.data);
          // Puedes redirigir o mostrar un mensaje de éxito aquí
        })
        .catch(error => {
          console.error("Error al crear el item:", error);
        });
    }
  }
};
</script>

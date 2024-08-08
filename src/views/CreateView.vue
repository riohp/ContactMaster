<template>
    <div>
      <h1>Create Item</h1>
      <ItemForm :item="item" @submit="createItem" />
    </div>
  </template>
  
  <script>
  import ItemForm from '@/components/ItemForm.vue';
  
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
    methods: {
      createItem(item) {
        // Ejemplo: axios.post('/api/items', item)
      }
    }
  };
  </script>
  
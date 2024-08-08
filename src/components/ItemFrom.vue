<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="item.name" placeholder="Name" required />
    <input v-model="item.phonenumber" placeholder="Phone Number" required />
    <input v-model="item.userId" placeholder="User ID" required />
    <input v-model="item.calldate" type="date" placeholder="Call Date" required />
    <textarea v-model="item.notes" placeholder="Notes"></textarea>
    <button type="submit">Save</button>
  </form>
</template>

<script>
export default {
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
      // obtencion de api
      console.log(item);
    },

    updateItem(item){
      console.log(item);
    }
  }
};
</script>


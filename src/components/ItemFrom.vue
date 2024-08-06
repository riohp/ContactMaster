<template>
    <form @submit.prevent="handleSubmit">
      <input v-model="item.name" placeholder="Name" />
      <textarea v-model="item.description" placeholder="Description"></textarea>
      <button type="submit">Save</button>
    </form>
  </template>
  
  <script>
  export default {
    props: ['item'],
    methods: {
      handleSubmit() {
        this.$emit('submit', this.item);
      }
    }
  };
  </script>
  
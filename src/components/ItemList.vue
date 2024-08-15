<template>
  <table class="table">
    <thead>
      <slot name="columns">
        <tr>
          <th v-for="column in columns" :key="column">{{column}}</th>
        </tr>
      </slot>
    </thead>
    <tbody>
      <tr v-for="(item, index) in filteredData" :key="index">
        <slot :row="item">
          <td v-for="column in columns" :key="column">{{ itemValue(item, column) }}</td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'l-table',
  props: {
    columns: Array,
    data: Array
  },
  computed: {
    filteredData() {
      return this.data.filter(item => {
        return this.columns.some(column => this.hasValue(item, column));
      });
    }
  },
  methods: {
    hasValue(item, column) {
      return typeof item[column.toLowerCase()] !== 'undefined';
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    }
  }
};
</script>

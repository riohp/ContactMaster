<template>
  <nav aria-label="Page navigation">
    <ul class="pagination pagination-sm flex-wrap justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['change-page']);

const visiblePages = computed(() => {
  const delta = 2;
  let range = [];
  for (let i = Math.max(1, props.currentPage - delta); i <= Math.min(props.totalPages, props.currentPage + delta); i++) {
    range.push(i);
  }
  return range;
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('change-page', page);
  }
};
</script>

<style scoped>
.pagination {
  gap: 5px;
}
.page-link {
  padding: 0.25rem 0.5rem;
}
</style>
import { ref, computed } from 'vue';

export function usePagination(fetchData, pageSize = 10) {
  const currentPage = ref(1);
  const totalCount = ref(0);
  const loading = ref(false);

  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));

  const changePage = async (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      await fetchData();
    }
  };

  return {
    currentPage,
    totalCount,
    loading,
    totalPages,
    pageSize,
    changePage
  };
}
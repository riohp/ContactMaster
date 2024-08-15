import { createRouter, createWebHistory } from 'vue-router';
import ListView from '@/views/ListView.vue';
import CreateView from '@/views/CreateView.vue';
import EditView from '@/views/EditView.vue';

const routes = [
  { path: '/', name: 'ItemList', component: ListView },
  { path: '/create', name: 'ItemCreate', component: CreateView },
  { path: '/edit/:id', name: 'ItemEdit', component: EditView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

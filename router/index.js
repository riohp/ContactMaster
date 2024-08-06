import { createRouter, createWebHistory } from 'vue-router';
import ListView from '@/views/ListView.vue';
import CreateView from '@/views/CreateView.vue';

const routes = [
    { path: '/', name: 'itemList', component: ListView },
    { path: '/create', name: 'itemCreate', component: CreateView },
    { path: '/edit/:id', name: 'itemEdit', component: EditView },
  ];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
  
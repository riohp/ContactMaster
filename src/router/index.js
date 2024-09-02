import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";
import Tables from "../views/Tables.vue";
import Signin from "../views/Signin.vue";
import AgendizedTables from "../views/AgendizedTables.vue";
import CreateReferral from "../views/CreateReferral.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
    meta: { requiresAuth: true }
  },
  {
    path: "/agendizedtables",
    name: "AgendizedTables",
    component: AgendizedTables,
    meta: { requiresAuth: true }
  },
  {
    path: "/create-referral",
    name: "CreateReferral",
    component: CreateReferral,
    meta: { requiresAuth: true }
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.getters.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next('/signin');
  } else if (to.path === '/signin' && isAuthenticated) {
    next('/agendizedtables');
  } else {
    next();
  }
});

export default router;
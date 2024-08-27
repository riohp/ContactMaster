import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
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
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/agendizedtables",
    name: "AgendizedTables",
    component: AgendizedTables,
  },
  {
    path: "/create-referral",
    name: "CreateReferral",
    component: CreateReferral,
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

export default router;

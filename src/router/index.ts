import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from "@/views/index.vue";
import HomeView from "@/views/home/index.vue";
import Error from "../views/Error.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:   [
    {
      path: '/',
      redirect: `/home`,
      component:HomeLayout,
      children: [
        {
          path: "home",
          name: 'home',
          component:HomeView,
        },
      ]
    },
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: Error},
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from "@/views/index.vue";
import HomeView from "@/views/home/index.vue";
import Error from "../views/Error.vue";
import Login from "@/views/auth/Login.vue"; // Import your login component
import { useAuthStore } from '@/stores/auth'; // Import your Pinia store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: `/home`,
      component: HomeLayout,
      children: [
        {
          path: "home",
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true } // Add this meta field to protected routes
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false } // Explicitly mark as public
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: Error },
  ],
})

// Navigation guard to check auth status
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    // Check if user has a token
    if (authStore.getToken()) {
      // User is authenticated, proceed to route
      next();
    } else {
      // User not authenticated, redirect to login with return URL
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // Route doesn't require authentication, proceed
    next();
  }
});

export default router
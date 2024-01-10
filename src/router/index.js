import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/kantin',
      name: 'kantin',
      component: () => import('../views/KantinListView.vue')
    },
    {
      path: '/kantin/show/:id',
      name: 'kantin-show',
      component: () => import('../views/KantinDetailView.vue')
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: () => import('../views/KategoriView.vue')
    },
    {
      path: '/keranjang',
      name: 'keranjang',
      component: () => import('../views/KeranjangView.vue')
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: () => import('../views/KategoriView.vue')
    },
    {
      path: '/kategori/:id',
      name: 'kategori-detail',
      component: () => import('../views/KategoriDetailView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        authPage: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: {
        authPage: true
      }
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('../views/UnauthorizedView.vue'),
      meta: {
        authPage: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '',
          name: 'store-management',
          component: () => import('../views/dashboard/penjual-dashboard/StoreManagementView.vue'),
          meta: {
            requirePenjual: true
          }
        },
        {
          path: 'user-management',
          name: 'user-management',
          component: () => import('../views/dashboard/admin-dashboard/UserManagementView.vue'),
          meta: {
            requireAdmin: true
          }
        },
        {
          path: 'kategori-management',
          name: 'kategori-management',
          component: () => import('../views/dashboard/admin-dashboard/KategoriManagementView.vue'),
          meta: {
            requireAdmin: true
          }
        },
        {
          path: 'role-management',
          name: 'role-management',
          component: () => import('../views/dashboard/admin-dashboard/RoleManagementView.vue'),
          meta: {
            requireAdmin: true
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    // Redirect to login if authentication is required but the user is not authenticated
    next('/login')
  } else if (to.meta.requireAdmin && authStore.getUserRole !== 'admin') {
    // Redirect to unauthorized page if the user is not an admin
    next('/unauthorized')
  } else if (
    to.meta.requirePenjual &&
    authStore.getUserRole !== 'penjual' &&
    authStore.getUserRole !== 'admin'
  ) {
    // Redirect to unauthorized page if the user is not a penjual or admin
    next('/unauthorized')
  } else {
    // Continue to the route
    next()
  }
})

export default router

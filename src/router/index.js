import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      
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
      path: '/kantin',
      name: 'kantin',
      component: () => import('../views/KantinListView.vue'),
    },
    {
      path: '/kantin/show/:id',
      name: 'kantin-show',
      component: () => import('../views/KantinDetailView.vue'),
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: () => import('../views/KategoriView.vue'),
    },
    {
      path: '/kategori/:id',
      name: 'kategori-detail',
      component: () => import('../views/KategoriDetailView.vue'),
    },
    {
      path: '/tujuan',
      name: 'tujuan',
      component: () => import('../views/TujuanView.vue'),
      meta: {
        requireAuth: true,
        requirePelanggan: true
      }
    },
    {
      path: '/keranjang',
      name: 'keranjang',
      component: () => import('../views/KeranjangView.vue'),
      meta: {
        requireAuth: true,
        requirePelanggan: true
      }
    },
    {
      path: '/pesanan',
      name: 'pesanan',
      component: () => import('../views/pesanan/PesananView.vue'),
      meta: {
        requireAuth: true,
        requirePelanggan: true
      },
      children: [
        {
          path: '',
          name: 'pesanan-belum-dibayar',
          component: () => import('../views/pesanan/PesananBelumDibayarView.vue'),
          
        },
        {
          path: 'berlangsung',
          name: 'pesanan-berlangsung',
          component: () => import('../views/pesanan/PesananBerlangsungView.vue')
        },
        {
          path: 'selesai',
          name: 'pesanan-selesai',
          component: () => import('../views/pesanan/PesananSelesaiView.vue')
        }
      ]
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
          path: 'pesanan',
          name: 'pesanan-proses',
          component: () => import('../views/dashboard/penjual-dashboard/PesananProsesView.vue'),
          meta: {
            requirePenjual: true
          }
        },
        {
          path: 'pesanan/selesai',
          name: 'dashboard-pesanan-selesai',
          component: () => import('../views/dashboard/penjual-dashboard/PesananSelesaiView.vue'),
          meta: {
            requirePenjual: true
          }
        },
        {
          path: 'pesanan/gagal',
          name: 'dashboard-pesanan-gagal',
          component: () => import('../views/dashboard/penjual-dashboard/PesananGagalView.vue'),
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
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('../views/UnauthorizedView.vue'),
      meta: {
        authPage: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requireAdmin && authStore.getUserRole !== 'admin') {
    next('/unauthorized')
  } else if (to.meta.requirePenjual && (authStore.getUserRole !== 'penjual' && authStore.getUserRole !== 'admin')) {
    next('/unauthorized')
  } else if (to.meta.requirePelanggan && (authStore.getUserRole !== 'user' && authStore.getUserRole !== 'admin')) {
    next('/unauthorized')
  } else {
    // Continue to the route
    next()
  }
})

export default router

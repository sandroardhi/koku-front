// authStore.js
import { defineStore } from 'pinia'
import { useAuthRepository } from '@/composables/useAuthRepository'

const auth_repository = useAuthRepository()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    role: ''
  }),
  getters: {
    isAuthenticated: (state) => state.authenticated,
    getUserRole: (state) => state.role
  },
  actions: {
    async login(credentials) {
      const { data } = await auth_repository.login(credentials)

      if (data) {
        this.authenticated = true
        this.role = data.role

        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('role', data.role)
      }
    },
    async register(credentials) {
      await auth_repository.register(credentials)
    },
    async logout() {
      await auth_repository.logout()
      this.authenticated = false
      this.role = ''
    },
    async getUser() {
      const { data } = await auth_repository.getUser()
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    checkAuthenticationOnReload() {
      const storedToken = localStorage.getItem('access_token')
      const storedUser = localStorage.getItem('user')
      const storedRole = localStorage.getItem('role')

      if (storedToken && storedUser) {
        this.authenticated = true
        this.role = storedRole
      }
    },
    async csrf() {
      await auth_repository.csrf()
    }
  }
})

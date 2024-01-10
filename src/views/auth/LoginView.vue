<script setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

const credentials = reactive({
  email: '',
  password: '',
  device_name: 'browser'
})
const isLoading = ref(false)

const error = ref('')

const clearError = () => {
  error.value = ''
}

const onSubmit = async () => {
  isLoading.value = true
  axios.defaults.withCredentials = true
  axios.defaults.baseURL = 'http://localhost:8000'
  axios.defaults.headers = {
    'X-Requested-With': 'XMLHttpRequest'
  }
  await axios.get('/sanctum/csrf-cookie')
  try {
    await authStore.login(credentials)
    router.replace({ name: 'home' })
  } catch (e) {
    if (e.response && e.response.status === 422) {
      const validationErrors = e.response.data.errors

      if (validationErrors && validationErrors.email) {
        error.value = validationErrors.email[0]
      }
    }
  }
  isLoading.value = false
}
</script>

<template>
  <main class="grid grid-cols-12 gap-4">
    <section class="col-span-6 bg-white min-h-screen shadow-lg">
      <form
        :action="route.path"
        method="post"
        class="mt-36 p-4 lg:mt-0 lg:p-40"
        @submit.prevent="onSubmit"
      >
        <div class="mb-4">
          <label for="email" class="block mb-2">Email</label>
          <input
            type="text"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="someone@example.com"
            v-model="credentials.email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2">Password</label>
          <input
            type="password"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            v-model="credentials.password"
            placeholder="password"
            required
          />
        </div>
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
          v-if="error"
          @click="clearError"
        >
          <span class="block sm:inline font-bold">{{ error }}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              class="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              />
            </svg>
          </span>
        </div>
        <button
          type="submit"
          class="border p-3 text-white active:bg-blue-600 hover:bg-blue-500 w-full rounded bg-blue-400 transition-colors"
        >
          <p v-if="isLoading">Loading...</p>
          <p v-else>Masuk</p>
        </button>
        <!-- <p class="text-center mt-5 font-semibold">Create An Account ? <router-link class="text-blue-600 hover:text-blue-700 hover:text-xl duration-300" to="/register" >Register</router-link></p> -->
        <p class="text-center mt-5 font-semibold">
          Belum punya akun?
          <router-link
            class="text-blue-600 hover:text-blue-700 duration-300"
            to="/register"
            >Register</router-link
          >
        </p>
      </form>
    </section>
  </main>
</template>

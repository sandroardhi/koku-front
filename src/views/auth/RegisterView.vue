<script setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()


const route = useRoute()
const router = useRouter()

const credentials = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  tipe_user: 'user',
  status: 'active',
  device_name: 'browser',
  role_id: '1'
})

const error = ref('')

const clearError = () => {
  error.value = ''
}

const isLoading = ref(false)
const onSubmit = async () => {
  isLoading.value = true
  try {
    await authStore.register(credentials)

    router.push({ name: 'login' })
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
  <main class="grid grid-cols-12 gap-4 overflow-hidden">
    <section class="col-span-6 bg-white min-h-screen shadow-lg">
      <form
        :action="route.path"
        method="post"
        class="w-[50%] mx-auto mt-20"
        @submit.prevent="onSubmit"
      >
        <div class="mb-4">
          <label for="name" class="block mb-2">Name</label>
          <input
            type="text"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="Sandro Ardhi Saputra"
            v-model="credentials.name"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block mb-2">Email</label>
          <input
            type="email"
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
            placeholder="*******"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password_confirmation" class="block mb-2">Confirm Password</label>
          <input
            type="password"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            v-model="credentials.password_confirmation"
            placeholder="*******"
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
          <p v-else>Daftar</p>
        </button>
        <p class="text-center mt-5 font-semibold">
          Udah punya akun?
          <router-link
            class="text-blue-600 hover:text-blue-700 duration-300"
            to="/login"
            >Login</router-link
          >
        </p>
      </form>
    </section>
  </main>
</template>

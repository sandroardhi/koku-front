<script setup>
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

const credentials = reactive({
  password: '',
  password_confirmation: ''
})


const submitForm = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/resetpassword', {
      email: atob(route.params.email),
      token: route.params.token,
      password: credentials.password,
      password_confirmation: credentials.password_confirmation
    })
    if (response.status === 200) {
      // Password reset was successful, redirect to a success page
      router.push({ name: 'login' })
    } else {
      // Password reset failed, redirect to a failure page
      router.push({ name: 'forgot-password' })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <main class="grid grid-cols-12">
    <section class="col-span-12 bg-[#f7f2f2] min-h-screen shadow-lg relative">
      <p class="absolute top-4 left-3">
        <span class="text-3xl text-black font-bold">KoKu!</span>
      </p>
      <div method="post" class="mt-36 p-4 lg:mt-0 lg:p-40">
        <p class="text-2xl mb-3">Forgot Password</p>
        <div class="mb-4">
          <label for="password" class="block mb-2">Password Baru</label>
          <input
            type="password"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            v-model="credentials.password"
            placeholder="*******"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password_confirmation" class="block mb-2">Konfirmasi Password Baru</label>
          <input
            type="password"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            v-model="credentials.password_confirmation"
            placeholder="*******"
            required
          />
        </div>
        <button
          type="submit"
          @click="submitForm"
          class="border p-3 text-white active:bg-yellow-400 hover:bg-yellow-200 w-full rounded bg-yellow-300 transition-colors duration-300"
        >
          <p v-if="isLoading">Loading...</p>
          <p v-else>Kirim email</p>
        </button>
      </div>
    </section>
  </main>
</template>

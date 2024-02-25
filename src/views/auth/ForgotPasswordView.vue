<script setup>
import axios from 'axios'
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)

const submitForm = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/forgotpassword', {
      email: email.value
    })
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <main class="grid grid-cols-12">
    <section class="col-span-6 bg-[#f7f2f2] min-h-screen shadow-lg relative">
      <router-link to="/" class="absolute top-4 left-3">
        <span class="text-3xl text-black font-bold">KoKu!</span>
      </router-link>
      <div method="post" class="mt-36 p-4 lg:mt-0 lg:p-40">
        <p class="text-2xl mb-3">Forgot Password</p>
        <div class="mb-4">
          <label for="email" class="block mb-2">Email</label>
          <input
            type="text"
            class="border p-2 w-full bg-gray-50 rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="someone@example.com"
            v-model="email"
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
        <!-- <p class="text-center mt-5 font-semibold">Create An Account ? <router-link class="text-yellow-600 hover:text-yellow-700 hover:text-xl duration-300" to="/register" >Register</router-link></p> -->
        <p class="text-center mt-5 font-semibold">
          Coba login lagi?
          <router-link class="text-yellow-300 hover:text-yellow-200 duration-300" to="/login"
            >Click disini</router-link
          >
        </p>
      </div>
    </section>
    <section class="col-span-6 bg-white min-h-screen shadow-lg relative">
      <div class="w-full mx-auto flex flex-col justify-center items-center mt-10">
        <p class="text-[20px] font-semibold">Awali Langkahmu Dengan Login!</p>
        <p class="text-[55px] -mt-2 font-bold border-b">
          KoKu
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--emojione-monotone inline -ml-8 -mt-3 w-[50px] h-[50px]"
            preserveAspectRatio="xMidYMid meet"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M36.989 42.439H27.01L23 2h18z" fill="#000000"></path>
              <ellipse cx="31.999" cy="54.354" rx="7.663" ry="7.646" fill="#F9A826"></ellipse>
            </g>
          </svg>
        </p>
        <p class="text-[15px] font-semibold">Kantin Online Ku!</p>
      </div>
      <div class="w-[470px] h-[470px] absolute left-1/2 transform -translate-x-1/2 -mt-10 ml-3">
        <img
          src="../../../public/images/undraw_eating_together_re_ux62.svg"
          class="w-full h-full object-contain bg-transparent"
          alt=""
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref} from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from '../../components/common/Navbar.vue'


const isLoading = ref(false)
const route = useRoute()

</script>

<template>
  <Navbar />
  <div class="w-[80%] mx-auto p-4 mb-10">
    <div role="status" v-if="isLoading" class="mx-auto w-full flex justify-center items-center">
      <svg
        aria-hidden="true"
        class="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else>
      <div class="w-full mx-auto relative ">
        <router-link to="/">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-[50px] h-[50px] absolute top-0 -left-20 transition-all duration-150 hover:-translate-x-3"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M4 12H20M4 12L8 8M4 12L8 16"
                stroke="#000"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </router-link>
        <p class="text-5xl mb-3ml-5">Pesanan saya</p>
      </div>
      <div class="w-full mx-auto mt-6">
        <router-link
          to="/pesanan"
          class="border-x-[3px] font-semibold ease duration-150 hover:border-yellow-300 hover:text-yellow-300 mt-3 ml-1 px-4"
          :class="
            route.path === '/pesanan'
              ? 'border-yellow-300 text-yellow-300'
              : 'border-black text-black'
          "
        >
          Belum dibayar
        </router-link>
        <router-link
          to="/pesanan/berlangsung"
          class="border-x-[3px] font-semibold ease duration-150 hover:border-yellow-300 hover:text-yellow-300 mt-3 ml-4 px-4"
          :class="
            route.path === '/pesanan/berlangsung'
              ? 'border-yellow-300 text-yellow-300'
              : 'border-black text-black'
          "
        >
          Sedang berlangsung
        </router-link>
        <router-link
          to="/pesanan/selesai"
          class="border-x-[3px] font-semibold ease duration-150 hover:border-yellow-300 hover:text-yellow-300 mt-3 ml-4 px-4"
          :class="
            route.path === '/pesanan/selesai'
              ? 'border-yellow-300 text-yellow-300'
              : 'border-black text-black'
          "
        >
          Selesai
        </router-link>
      </div>
      <div class="w-full mx-auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>

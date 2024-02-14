<script setup>
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Navbar from '../components/common/Navbar.vue'

const authStore = useAuthStore()
const role = localStorage.getItem('role')

onMounted(() => {
  authStore.getUserRole
})
</script>

<template>
  <Navbar v-if="role == 'user'" />
  <div class="w-full h-[calc(100vh-7rem)] flex justify-center items-center flex-col">
    <div class="w-full h-full flex flex-col justify-around items-center">
      <div class="w-full text-center">
        <p class="text-9xl font-semibold">403</p>
        <p class="text-lg font-bold">Forbidden</p>
      </div>
    </div>
    <div class="w-full h-[80%] flex justify-center items-start">
      <router-link
        to="/"
        class="flex items-center transition-all duration-150 hover:-ml-5"
        v-if="role == 'user'"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[80px]">
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
        <p class="text-2xl font-semibold">Kembali</p>
      </router-link>
      <router-link
        to="/dashboard"
        class="flex items-center transition-all duration-150 hover:-ml-5"
        v-else
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[80px]">
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
        <p class="text-2xl font-semibold">Kembali</p>
      </router-link>
    </div>
  </div>
</template>

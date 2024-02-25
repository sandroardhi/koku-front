<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import Navbar from '../components/common/Navbar.vue'
import { useAuthRepository } from '@/composables/useAuthRepository'

const auth_repository = useAuthRepository()
const tujuans = ref({})
const tujuan = ref('')
const isLoading = ref(false)
const isLoadingSubmit = ref(false)
const router = useRouter()
const user = JSON.parse(localStorage.getItem('user'))

const fetchTujuans = async () => {
  isLoading.value = true
  try {
    const { data } = await auth_repository.tujuan()
    tujuans.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  const data = {
    tujuan: tujuan.value
  }
  try {
    isLoadingSubmit.value = true
    await auth_repository.create_tujuan(data)
  } catch (error) {
    console.log(error)
  } finally {
    isLoadingSubmit.value = false
    router.go()
  }
}

onMounted(() => {
  fetchTujuans()
})
</script>

<template>
  <Navbar />
  <div class="w-full h-[calc(120vh-7rem)] flex justify-start mt-3 items-center flex-col">
    <div class="w-[80%] mx-auto relative">
      <router-link to="/">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-[50px] h-[50px] absolute -left-20 transition-all duration-150 hover:-translate-x-3"
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
      <p class="text-5xl mb-3">Profil</p>
    </div>
    <div class="bg-white w-[80%] mx-auto shadow overflow-hidden sm:rounded-lg">
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Full name</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.name }}</dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Email address</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user.email }}</dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Channel</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.channel || '-' }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">No Rekening</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.no_rek || '-' }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

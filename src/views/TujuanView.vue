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
      <p class="text-5xl mb-3">Tujuan</p>
    </div>
    <form class="w-[50%] mx-auto mt-10 pb-5" @submit.prevent="submit">
      <p class="text-xl mb-5">Buat tujuan</p>
      <div class="relative z-0 w-full mb-5 group">
        <input
          type="string"
          name="floating_email"
          v-model="tujuan"
          id="floating_email"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Tujuan</label
        >
      </div>
      <button
        type="submit"
        class="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full mt-2 sm:w-auto px-5 py-2.5 text-center"
      >
        <p v-if="isLoadingSubmit">Loading...</p>
        <p v-else>Submit</p>
      </button>
    </form>
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
    <div class="w-[50%] mx-auto" v-else>
      <p class="text-xl mt-3">Tujuanmu yang tersimpan :</p>
      <p class="text-lg mt-3" v-for="(tujuan, index) in tujuans" :key="tujuan.id">
        {{ index + 1 + '. ' + tujuan.tujuan }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/common/Navbar.vue'
import { useKategoriRepository } from '@/composables/useKategoriRepository'

const kategori_repository = useKategoriRepository()

const isLoading = ref(false)
const kategoris = ref()

const fetchKategori = async () => {
  isLoading.value = true
  const { data } = await kategori_repository.index()
  kategoris.value = data
  isLoading.value = false
}

onMounted(() => {
  fetchKategori()
})
</script>

<template>
  <Navbar />
  <div class="w-[80%] mx-auto text-center">
    <p class="text-5xl mb-3">Kategori</p>
  </div>
  <div class="w-[80%] mx-auto p-4 mb-10 flex justify-center min-h-screen">
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
    <div class="w-[700px] h-[500px] flex justify-around p-3 flex-wrap" v-else>
      <div v-for="kategori in kategoris" :key="kategori.id" class="mb-2">
        <router-link
          :to="`kategori/${kategori.id}`"
          class="relative flex flex-col group items-center bg-white border h-[180px] w-[180px] border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          :style="{
            backgroundImage: `url(${
              kategori.foto === 'default.jpg'
                ? 'images/default.jpg'
                : `http://localhost:8000/storage/${kategori.foto}`
            })`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }"
        >
          <!-- Your image element goes here, but it will be the background of the router-link -->
          <div
            class="object-cover w-full h-[150px] to-transparent rounded-t-lg md:w-48 md:rounded-none md:rounded-l-lg"
          ></div>

          <!-- Overlay with transparent black background -->
          <div
            class="absolute inset-0 bg-black opacity-40 group-hover:opacity-75 transition-all ease duration-200 rounded-lg"
          ></div>

          <!-- Kategori name in the middle -->
          <div
            class="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold"
          >
            {{ kategori.nama }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import Navbar from '../components/common/Navbar.vue'
import { useKantinRepository } from '@/composables/useKantinRepository'
import { RouterLink } from 'vue-router'
import { useKeranjangStore } from '@/stores/keranjang'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

const keranjangStore = useKeranjangStore()
const user = JSON.parse(localStorage.getItem('user'))
const kantin_repository = useKantinRepository()

const pictures = [
  { src: 'images/carousel-1.jpg', alt: 'Image 1' },
  { src: 'images/carousel-2.jpg', alt: 'Image 2' },
  { src: 'images/carousel-3.jpg', alt: 'Image 3' }
]

const kantins = ref([])
const isLoading = ref(false)

const fetchKantin = async () => {
  isLoading.value = true
  try {
    const { data } = await kantin_repository.index()
    kantins.value = data
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const randomKantins = ref([])

// Watch for changes in kantins and update randomKantins accordingly
watchEffect(() => {
  const shuffledKantins = [...kantins.value]
  shuffledKantins.sort(() => Math.random() - 0.5)
  randomKantins.value = shuffledKantins.slice(0, 4)
})

const excerpt = (text, maxLength = 10, indicator = '...') => {
  let textCopy = text

  if (textCopy.length > maxLength) {
    textCopy = textCopy.substring(0, maxLength) + indicator
  }
  return textCopy
}

onMounted(async () => {
  if(user){
    await keranjangStore.getCartData()
  }
  fetchKantin()
})
</script>

<template>
  <Navbar />
  <div class="w-[80%] mx-auto">
    <vueper-slides
      class="no-shadow"
      arrows-outside
      bullets-outside
      transition-speed="500"
      :pause-on-hover="true"
      autoplay
      lazy
      lazy-load-on-drag
    >
      <vueper-slide v-for="(picture, i) in pictures" :key="i" :image="picture.src">
        <template #loader>
          <span>Loading...</span>
        </template>
      </vueper-slide>
    </vueper-slides>
  </div>
  <div class="w-[80%] mx-auto p-4 mb-10 -mt-8">
    <div class="p-1 mb-3">
      <p class="text-3xl md:text-5xl mb-2 font-bold" v-if="user">Halo, {{ user.name }}<span class="wave">👋</span>.</p>
      <p class="text-xl md:text-2xl mb-2 font-[550]">Mau jajan apa hari ini?</p>
    </div>

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
    <div class="grid grid-cols-4 gap-4 mb-10" v-else>
      <div v-for="kantin in randomKantins" :key="kantin.id" class="col-span-4 md:col-span-2">
        <router-link
          :to="`/kantin/show/${kantin.id}`"
          class="flex items-center bg-white border max-h-[150px] border-gray-200 rounded-lg shadow flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img
            v-if="kantin.foto == 'default.jpg'"
            class="object-cover w-32 h-[150px] to-transparent md:w-48 rounded-l-lg"
            src="images/default.jpg"
            alt="Foto Kantin.."
          />
          <img
            v-else
            :src="`http://localhost:8000/storage/${kantin.foto}`"
            class="object-cover w-32 h-[150px] to-transparent md:w-48 rounded-l-lg"
            alt="Foto Kantin.."
          />
          <div class="flex flex-col justify-around ml-2 md:p-4">
            <h5
              class="mb-2 text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {{ excerpt(kantin.nama, 30) }}
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {{ excerpt(kantin.deskripsi, 70) }}
            </p>
          </div>
        </router-link>
      </div>
      <router-link
        to="/kantin"
        class="hover:bg-[#FFB000] hover:text-white rounded-lg col-span-4 text-center p-3 text-xl transition-all duration-150 ease-in"
      >
        <p>Lihat semua kantin</p>
      </router-link>
    </div>
  </div>
</template>

<style>
.wave {
  animation-name: wave-animation; /* Refers to the name of your @keyframes element below */
  animation-duration: 2.5s; /* Change to speed up or slow down */
  animation-iteration-count: infinite; /* Never stop waving :) */
  transform-origin: 70% 70%; /* Pivot around the bottom-left palm */
  display: inline-block;
}

@keyframes wave-animation {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(14deg);
  } /* The following five values can be played with to make the waving more or less extreme */
  20% {
    transform: rotate(-8deg);
  }
  30% {
    transform: rotate(14deg);
  }
  40% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(0deg);
  } /* Reset for the last half to pause */
  100% {
    transform: rotate(0deg);
  }
}
</style>

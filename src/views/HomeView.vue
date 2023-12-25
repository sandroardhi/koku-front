<script setup>
import { useRouter, useRoute } from 'vue-router'
import { FwbCarousel } from 'flowbite-vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/common/Navbar.vue'
import { useKantinRepository } from '@/composables/useKantinRepository'

const kantin_repository = useKantinRepository()

const router = useRouter()
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  },
  baseURL: 'http://localhost:8000'
}
const pictures = [
  {src: 'images/carousel-1.jpg', alt: 'Image 1'},
  {src: 'images/carousel-2.jpg', alt: 'Image 2'},
  {src: 'images/carousel-3.jpg', alt: 'Image 3'},
]

const kantins = ref([])

const fetchKantin = async () => {
  const { data } = await kantin_repository.index()
  kantins.value = data
}
const excerpt = (text, maxLength = 10, indicator = '...') => {
  let textCopy = text

  if (textCopy.length > maxLength) {
    textCopy = textCopy.substring(0, maxLength) + indicator
  }
  return textCopy
}

onMounted(() => {
  fetchKantin()
})
</script>

<template>
  <Navbar />
  <div class="w-[80%] mx-auto p-4">
    <fwb-carousel slide slide-interval="4000" class="z-0" :pictures="pictures" />
    <div class="p-1">
      <p class="text-6xl mb-2">Lorem ipsum dolor sit amet.</p>
      <p class="text-3xl">Today's pick</p>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-3">
      <div v-for="kantin in kantins" :key="kantin.id" class="col-span-2">
        <router-link
          to="#"
          class="flex flex-col items-center bg-white border max-h-[150px] border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <img
            v-if="kantin.foto == 'default.jpg'"
            class="object-cover w-full h-[150px] to-transparent rounded-t-lg md:w-48 md:rounded-none md:rounded-l-lg"
            src="images/default.jpg"
            alt="Foto Kantin.."
          />
          <img
            v-else
            :src="`http://localhost:8000/storage/${kantin.foto}`"
            class="object-cover w-full h-[150px] to-transparent rounded-t-lg md:w-48 md:rounded-none md:rounded-l-lg"
            alt="Foto Kantin.."
          />
          <div class="flex flex-col justify-around p-4 leading-normal">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ excerpt(kantin.nama, 30) }}
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {{ excerpt(kantin.deskripsi, 70) }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

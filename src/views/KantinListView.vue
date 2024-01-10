<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/common/Navbar.vue'
import { useKantinRepository } from '@/composables/useKantinRepository'
const kantin_repository = useKantinRepository()

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

const excerpt = (text, maxLength = 10, indicator = '...') => {
  let textCopy = text

  if (textCopy.length > maxLength) {
    textCopy = textCopy.substring(0, maxLength) + indicator
  }
  return textCopy
}

// search function

const searchQuery = ref('')
const filteredKantins = computed(() => {
  return kantins.value.filter(
    (kantin) =>
      typeof kantin.nama === 'string' &&
      kantin.nama.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
// end of search function

onMounted(async () => {
  await fetchKantin()
})
</script>

<template>
  <Navbar />
  <div class="w-[80%] mx-auto p-4 mb-10">
    <form class="flex items-center w-[50%] mb-8">
      <label for="simple-search" class="sr-only">Search</label>
      <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.87617 3.75H19.1238L21 8.86683V10.5C21 11.2516 20.7177 11.9465 20.25 12.4667V21H3.75V12.4667C3.28234 11.9465 3 11.2516 3 10.5V8.86683L4.87617 3.75ZM18.1875 13.3929C18.3807 13.3929 18.5688 13.3731 18.75 13.3355V19.5H15V15H9L9 19.5H5.25V13.3355C5.43122 13.3731 5.61926 13.3929 5.8125 13.3929C6.63629 13.3929 7.36559 13.0334 7.875 12.4667C8.38441 13.0334 9.11371 13.3929 9.9375 13.3929C10.7613 13.3929 11.4906 13.0334 12 12.4667C12.5094 13.0334 13.2387 13.3929 14.0625 13.3929C14.8863 13.3929 15.6156 13.0334 16.125 12.4667C16.6344 13.0334 17.3637 13.3929 18.1875 13.3929ZM10.5 19.5H13.5V16.5H10.5L10.5 19.5ZM19.5 9.75V10.5C19.5 11.2965 18.8856 11.8929 18.1875 11.8929C17.4894 11.8929 16.875 11.2965 16.875 10.5V9.75H19.5ZM19.1762 8.25L18.0762 5.25H5.92383L4.82383 8.25H19.1762ZM4.5 9.75V10.5C4.5 11.2965 5.11439 11.8929 5.8125 11.8929C6.51061 11.8929 7.125 11.2965 7.125 10.5V9.75H4.5ZM8.625 9.75V10.5C8.625 11.2965 9.23939 11.8929 9.9375 11.8929C10.6356 11.8929 11.25 11.2965 11.25 10.5V9.75H8.625ZM12.75 9.75V10.5C12.75 11.2965 13.3644 11.8929 14.0625 11.8929C14.7606 11.8929 15.375 11.2965 15.375 10.5V9.75H12.75Z"
                fill="#6B7280"
              ></path>
            </g>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          v-model="searchQuery"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#FFB000] focus:border-[#FFB000] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Cari kantin..."
          required
        />
      </div>
      <button
        type="button"
        class="p-2.5 ms-2 text-sm font-medium text-white bg-[#FFB000] rounded-lg border border-[#FFB000] hover:bg-[#ffae00c4] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span class="sr-only">Search</span>
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
    <div class="grid grid-cols-4 gap-4 mb-3" v-else>
      <div v-for="kantin in filteredKantins" :key="kantin.id" class="col-span-2">
        <router-link
          :to="`/kantin/show/${kantin.id}`"
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
      <div class="item error" v-if="searchQuery && filteredKantins.length === 0">
        <p>Kantin ga ada!</p>
      </div>
    </div>
  </div>
</template>

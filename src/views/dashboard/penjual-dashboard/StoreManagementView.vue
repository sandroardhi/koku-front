<script setup>
import Container from '../../../components/dashboard/Container.vue'
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const user = JSON.parse(localStorage.getItem('user'))
const kantin = ref()

const modal = ref(false)
const modalToggle = () => {
  modal.value = !modal.value
}

const kantin_data = reactive({
  nama_kantin: '',
  foto_kantin: '',
  deskripsi: '',
  penjual_id: user.id
})

const onFileChange = (e) => {
  kantin_data.foto_kantin = e.target.files[0]
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  },
  baseURL: 'http://localhost:8000'
}

const onSubmit = async () => {
  isLoading.value = true
  let formdata = new FormData()
  formdata.append('nama_kantin', kantin_data.nama_kantin)
  formdata.append('deskripsi', kantin_data.deskripsi)
  formdata.append('foto_kantin', kantin_data.foto_kantin)

  axios({
    method: 'post',
    url: 'api/kantin',
    data: formdata,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    },
    baseURL: 'http://localhost:8000'
  })
    .then(function (response) {
      //handle success
      console.log(response)
    })
    .catch(function (response) {
      //handle error
      console.log(response)
    })
  // router.go()
  // isLoading.value = false
}

const fetchProfileKantin = async () => {
  isLoading.value = true
  const { data } = await axios.get(`/api/kantin/profile/${user.id}`, config)
  if (data.length == 0) {
    kantin.value = null
    isLoading.value = false
  } else {
    kantin.value = data
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProfileKantin()
})
</script>

<template>
  <Container title="Store Management">
    <!-- ada kantin -->
    <!-- v-if="kantin == null" -->
    <div class="min-h-screen min-w-full flex justify-center items-center">
      <div class="mt-[-53px] flex flex-col justify-center items-center">
        <p class="mb-3 text-2xl">Kamu belum punya kantin nih..</p>

        <!-- Modal toggle -->
        <button
          @click="modalToggle"
          class="w-[80%] text-white bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-2 focus:outline-none focus:ring-[#ffae00bd] font-medium rounded-lg px-5 py-2.5 text-center"
          type="button"
        >
          Buat kantinmu terlebih dahulu
        </button>

        <!-- Main modal -->
        <div
          @wheel.prevent
          @touchmove.prevent
          @scroll.prevent
          :class="modal ? 'block bg-[rgba(0,0,0,0.5)] h-screen' : 'hidden'"
          class="overflow-y-auto bg-overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div class="relative p-4 w-full max-w-md max-h-full mx-auto mt-5">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <!-- Modal header -->
              <div
                class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
              >
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Buat Kantinmu</h3>
                <button
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  @click="modalToggle"
                >
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <!-- Modal body -->
              <form
                class="p-4 md:p-5"
                enctype="multipart/form-data"
                :action="route.path"
                @submit.prevent="onSubmit"
              >
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <div class="col-span-2">
                    <label
                      for="nama_kantin"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Nama Kantinmu</label
                    >
                    <input
                      type="text"
                      v-model="kantin_data.nama_kantin"
                      autocomplete="off"
                      id="name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Kantin Slamet Rasyidah"
                      required
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="foto_kantin"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Foto Kantin</label
                    >
                    <input
                      type="file"
                      @change="onFileChange"
                      id="price"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder=""
                      required
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="deskripsi"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Deskripsikan Kantinmu</label
                    >
                    <textarea
                      id="deskripsi"
                      rows="4"
                      v-model="kantin_data.deskripsi"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Kantin ini adalah kantin terenak sedunia"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    class="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Buat kantinmu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- v-else -->
    <div>
      {{ kantin }}
    </div>
  </Container>
</template>

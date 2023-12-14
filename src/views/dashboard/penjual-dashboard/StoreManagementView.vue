<script setup>
import { onMounted, ref, reactive, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Container from '../../../components/dashboard/Container.vue'
import Modal from '../../../components/common/Modal.vue'
import Table from '../../../components/common/Table.vue'
import Alert from '../../../components/common/Alert.vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const user = JSON.parse(localStorage.getItem('user'))
const kantin = ref()
const kantin_update_data = ref()
const kantin_id = ref()

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  },
  baseURL: 'http://localhost:8000'
}

// KANTIN
// fetch kantin
const fetchProfileKantin = async () => {
  isLoading.value = true
  const { data } = await axios.get(`/api/kantin/profile/${user.id}`, config)
  if (data.length == 0) {
    kantin.value = null
    isLoading.value = false
  } else {
    kantin.value = data
    kantin_id.value = data[0].id
    kantin_update_data.value = JSON.parse(JSON.stringify(data)) // Deep copy
    isLoading.value = false
  }
}
// end of fetch kantin
// create kantin
const kantin_data = reactive({
  nama: '',
  foto: '',
  deskripsi: ''
})

const onFileChangeKantin = (e) => {
  kantin_data.foto = e.target.files[0]
}

const onSubmitKantin = async () => {
  isLoading.value = true
  const formdata = new FormData()
  formdata.append('nama', kantin_data.nama)
  formdata.append('deskripsi', kantin_data.deskripsi)
  formdata.append('foto', kantin_data.foto)
  try {
    await axios.post('api/kantin', formdata, config)

    router.go()
  } catch (e) {
    console.error(e)
  }
  isLoading.value = false
}
// end of create kantin

// edit kantin
const onFileChangeUpdateKantin = (e) => {
  kantin_update_data.value[0].foto = e.target.files[0]
}

const onSubmitUpdateKantin = async () => {
  isLoading.value = true
  const formdata = new FormData()
  formdata.append('_method', 'put')
  formdata.append('nama', kantin_update_data.value[0].nama)
  formdata.append('deskripsi', kantin_update_data.value[0].deskripsi)
  formdata.append('foto', kantin_update_data.value[0].foto)
  try {
    await axios.post(`api/kantin/${kantin_id.value}`, formdata, config)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
// end of kantin edit
// END OF KANTIN

// PRODUK
const produk = ref([])
const produk_data = reactive({
  nama: '',
  harga: null,
  kuantitas: null,
  foto: ''
})
const produk_array = reactive([])
const fotoInputRef = ref(null) // iki gae clear input file image tok btw
const item = ref(null);

// fetch produk
const fetchProduct = async () => {
  isLoading.value = true
  const { data } = await axios.get(`/api/produk/${kantin_id.value}`, config)
  if (data.length == 0) {
    produk.value = null
    isLoading.value = false
  } else {
    produk.value = data
    isLoading.value = false
  }
}
// end of fetch produk

// create produk
const pushProduct = () => {
  if (produk_data.harga <= 0 || produk_data.kuantitas <= 0) {
    console.log('waduh')
    return
  }
  // Clone the produk_data object to avoid reactivity issues
  const clonedProdukData = { ...produk_data }

  // Push the cloned object into the produk_array
  produk_array.push(clonedProdukData)

  // Clear the form fields
  produk_data.nama = ''
  produk_data.harga = null
  produk_data.kuantitas = null
  // Reset the file input using the ref
  fotoInputRef.value.value = '' // Clear the value
}
const onFileChangeProduk = (e) => {
  const file = e.target.files[0]
  produk_data.foto = file
}
const onSubmitProduk = async () => {
  isLoading.value = true

  const formdata = new FormData()

  // Loop produk_array
  produk_array.forEach((product, index) => {
    // Append setiap produk properti nak formdata mbek unique key (index loop e), btw products nak kene sembarang yo iku jeneng
    // btw products nak kene sembarang yo iku jeneng, jeneng e bakal digae nak backend engkok . products soale lek produks elek wkakak
    formdata.append(`products[${index}][nama]`, product.nama)
    formdata.append(`products[${index}][harga]`, product.harga)
    formdata.append(`products[${index}][kuantitas]`, product.kuantitas)
    formdata.append(`products[${index}][foto]`, product.foto)
  })

  try {
    console.log([...formdata.entries()])

    await axios.post(`/api/produk/${kantin_id.value}`, formdata, config)

    // iki gae clear produk_array ne
    produk_array.splice(0, produk_array.length)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
// end of create produk

// edit produk

const selectedItem = ref({})
const toggleModal = (item) => {
  // Your logic to toggle the modal, and you have access to 'item'
  console.log('Toggling modal for item:', item);
  selectedItem.value = {}; // Clear previous value
  watchEffect(() => {
    selectedItem.value = {...item};
    console.log('Selected item:', selectedItem.value);
  });
};
const onFileChangeProdukUpdate = (e) => {
  selectedItem.value.foto = e.target.files[0]
}

const onSubmitProdukUpdate = async () => {
  isLoading.value = true
  // console.log(selectedItem)
  const formdata = new FormData()
  formdata.append('_method', 'put')
  formdata.append('nama', selectedItem.value.nama)
  formdata.append('harga', selectedItem.value.harga)
  formdata.append('kuantitas', selectedItem.value.kuantitas)
  formdata.append('foto', selectedItem.value.foto)
//   for (let entry of formdata.entries()) {
//   const [key, value] = entry;
//   console.log(`${key}: ${value}`);
// }
  
  try {
    await axios.post(`api/produk/${selectedItem.value.id}`, formdata, config)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
// end of edit produk

const labels = [
  { text: 'Foto Produk', field: 'foto' },
  { text: 'Nama Produk', field: 'nama' },
  { text: 'Harga Produk', field: 'harga' },
  { text: 'Kuantitas Produk', field: 'kuantitas' }
]

// END OF PRODUK

// lifecycle
onMounted(async () => {
  await fetchProfileKantin()
  fetchProduct()
})
</script>

<template>
  <Container title="Store Management">
    <!-- g ada kantin -->
    <div v-if="kantin == null" class="min-h-[200px] min-w-full flex justify-center items-center">
      <div class="mt-[-53px] flex flex-col justify-center items-center">
        <p class="mb-3 text-2xl">Kamu belum punya kantin nih..</p>

        <Modal buttonText="Buat kantinmu dulu" modalTitle="Tambah Kantin" buttonWidth="80">
          <template #modalBody>
            <form
              class="p-4 md:p-5"
              enctype="multipart/form-data"
              :action="route.path"
              @submit.prevent="onSubmitKantin"
            >
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    for="nama"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Nama Kantinmu</label
                  >
                  <input
                    type="text"
                    v-model="kantin_data.nama"
                    autocomplete="off"
                    id="nama"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Kantin Slamet Rasyidah"
                    required
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="foto"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Foto Kantin</label
                  >
                  <input
                    type="file"
                    @change="onFileChangeKantin"
                    id="foto"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
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
                Tambah kantinmu
              </button>
            </form>
          </template>
        </Modal>
      </div>
    </div>

    <!-- ada kakntin -->
    <div v-else class="w-full px-10 py-5 min-h-[200px]">
      <div class="w-full bg-white shadow-xl rounded-lg p-5 mb-10">
        <!-- kantin detail head -->
        <div class="w-full h-10 flex justify-between">
          <p class="text-xl font-semibold">Detail Kantin</p>
          <!-- edit kantin -->
          <Modal buttonText="Edit Kantinmu" modalTitle="Edit Kantin" buttonWidth="20">
            <template #modalBody>
              <form
                class="p-4 md:p-5"
                enctype="multipart/form-data"
                :action="route.path"
                @submit.prevent="onSubmitUpdateKantin"
              >
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <div class="col-span-2">
                    <label
                      for="nama"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Nama Kantinmu</label
                    >
                    <input
                      type="text"
                      v-model="kantin_update_data[0].nama"
                      autocomplete="off"
                      id="nama"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Kantin Slamet Rasyidah"
                      required
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="foto"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Foto Kantin</label
                    >
                    <input
                      type="file"
                      @change="onFileChangeUpdateKantin"
                      id="foto"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder=""
                    />
                    <img
                        v-if="kantin_update_data[0].foto"
                        :src="`http://localhost:8000/storage/${kantin_update_data[0].foto}`"
                        class="object-cover max-h-32 mx-auto mt-2 rounded-lg"
                        alt=""
                      />
                      <p class="text-center overflow-auto">{{ kantin_update_data[0].foto }}</p>
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
                      v-model="kantin_update_data[0].deskripsi"
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
                  Edit kantinmu
                </button>
              </form>
            </template>
          </Modal>
          <!-- end of modal kantin update -->
        </div>
        <div class="w-full h-72 flex justify-between space-x-3">
          <!-- foto kantin -->
          <img
            v-if="kantin[0].foto == 'default.jpg'"
            src="images/default.jpg"
            class="object-contain bg-[rgb(209,211,212)] w-[70%] rounded-lg"
            alt=""
          />
          <img
            v-else
            :src="`http://localhost:8000/storage/${kantin[0].foto}`"
            class="object-cover bg-[rgb(209,211,212)] w-[70%] rounded-lg"
            alt=""
          />

          <!-- detail kantin -->
          <div class="w-full flex flex-col">
            <div class="w-full h-[40%] p-4">
              <p class="text-xl">Nama Kantin</p>
              <p class="text-3xl font-bold mt-5">{{ kantin[0].nama }}</p>
            </div>
            <div class="w-full h-[40%] p-4">
              <p class="text-xl">Deskripsi</p>
              <p class="text-3xl font-bold mt-5">{{ kantin[0].deskripsi }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- product data -->
      <!-- belum ada produk -->
      <div class="w-full bg-white shadow-xl rounded-lg p-5 min-h-[100px]" v-if="produk == null">
        <p class="text-xl font-semibold">Produk kantinmu</p>
        <div class="w-full flex flex-col justify-center items-center mt-2">
          <p class="font-semibold text-lg mb-2">Kantinmu belum punya produk..</p>
          <Modal buttonText="Tambah produk" modalTitle="Tambah produk">
            <template #modalBody>
              <form
                class="p-4 md:p-5"
                enctype="multipart/form-data"
                :action="route.path"
                @submit.prevent="onSubmitProduk"
              >
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <div class="col-span-2">
                    <label
                      for="nama"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Nama produkmu</label
                    >
                    <input
                      type="text"
                      v-model="produk_data.nama"
                      autocomplete="off"
                      id="nama"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Nasi goreng pedas gila"
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="foto"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Foto produkmu</label
                    >
                    <input
                      type="file"
                      @change="onFileChangeProduk"
                      ref="fotoInputRef"
                      id="foto"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder=""
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="kuantitas"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Kuantitas produkmu</label
                    >
                    <input
                      id="kuantitas"
                      type="number"
                      min="1"
                      v-model="produk_data.kuantitas"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="10"
                    />
                    <Alert
                      v-if="produk_data.kuantitas !== null && produk_data.kuantitas <= 0"
                      type="danger"
                      message="Kuantitas tidak boleh negatif atau desimal."
                    />
                  </div>
                  <div class="col-span-2">
                    <label
                      for="harga"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Harga produkmu</label
                    >
                    <input
                      id="harga"
                      type="number"
                      step="1000"
                      min="1"
                      v-model="produk_data.harga"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="10000"
                    />
                    <Alert
                      v-if="produk_data.harga !== null && produk_data.harga <= 0"
                      type="danger"
                      message="Harga tidak boleh negatif atau desimal."
                    />
                  </div>
                </div>
                <div class="col-span-2">
                  <button
                    type="button"
                    @click="pushProduct"
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
                    Tambah produk
                  </button>
                  <div v-if="!produk_array.length == 0" class="flex flex-col">
                    <div v-for="produk in produk_array" :key="produk.id">
                      {{ produk }}
                    </div>
                    <div>
                      <button
                        type="submit"
                        class="text-white inline-flex items-center bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                        Buat produk
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </template>
          </Modal>
        </div>
      </div>
      <!-- end of belum ada produk -->

      <!-- ada produk -->
      <div class="w-full bg-white shadow-xl rounded-lg p-5 min-h-[100px]" v-else>
        <Modal buttonText="Tambah produk" modalTitle="Tambah produk">
          <template #modalBody>
            <form
              class="p-4 md:p-5"
              enctype="multipart/form-data"
              :action="route.path"
              @submit.prevent="onSubmitProduk"
            >
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    for="nama"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Nama produkmu</label
                  >
                  <input
                    type="text"
                    v-model="produk_data.nama"
                    autocomplete="off"
                    id="nama"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Nasi goreng pedas gila"
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="foto"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Foto produkmu</label
                  >
                  <input
                    type="file"
                    ref="fotoInputRef"
                    @change="onFileChangeProduk"
                    id="foto"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder=""
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="kuantitas"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Kuantitas produkmu</label
                  >
                  <input
                    id="kuantitas"
                    type="number"
                    min="1"
                    v-model="produk_data.kuantitas"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="10"
                  />
                  <Alert
                    v-if="produk_data.kuantitas !== null && produk_data.kuantitas <= 0"
                    type="danger"
                    message="Kuantitas tidak boleh negatif atau desimal."
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="harga"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Harga produkmu</label
                  >
                  <input
                    id="harga"
                    type="number"
                    step="1000"
                    min="1"
                    v-model="produk_data.harga"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="10000"
                  />
                  <Alert
                    v-if="produk_data.harga !== null && produk_data.harga <= 0"
                    type="danger"
                    message="Harga tidak boleh negatif atau desimal."
                  />
                </div>
              </div>
              <div class="col-span-2">
                <button
                  type="button"
                  @click="pushProduct"
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
                  Tambah produk
                </button>
                <div v-if="!produk_array.length == 0" class="flex flex-col">
                  <div v-for="produk in produk_array" :key="produk.id">
                    {{ produk.nama }} - {{ produk.harga }} - {{ produk.kuantitas }}
                    <button @click="removeProduct(index)" class="text-red-600 ml-2">Remove</button>
                  </div>
                  <div>
                    <button
                      type="submit"
                      class="text-white inline-flex items-center bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                      Buat produk
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </template>
        </Modal>
        <Table :labels="labels" :data="produk" :actionButtons="[{ text: 'Lihat', type: 'blue' }]">
          <!-- edit produk modal -->
          <template #customButton="{ item }">
            <Modal buttonText="Edit" modalTitle="Edit Produk" :toggleModal="() => toggleModal(item)">
              <template #modalBody>
                <form
                  class="p-4 md:p-5"
                  enctype="multipart/form-data"
                  :action="route.path"
                  @submit.prevent="onSubmitProdukUpdate"
                >
                  <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                      <label
                        for="nama"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Nama</label
                      >
                      <input
                        type="text"
                        v-model="selectedItem.nama"
                        autocomplete="off"
                        id="nama"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Nasi goreng pedas gila"
                      />
                    </div>
                    <div class="col-span-2">
                      <label
                        for="foto"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Foto produkmu</label
                      >
                      <input
                        type="file"
                        ref="fotoInputRef"
                        @change="onFileChangeProdukUpdate"
                        id="foto"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder=""
                      />
                      <img
                        v-if="selectedItem.foto"
                        :src="`http://localhost:8000/storage/${selectedItem.foto}`"
                        class="object-cover max-h-32 mx-auto mt-2 rounded-lg"
                        alt=""
                      />
                      <p class="text-center overflow-auto">{{ selectedItem.foto }}</p>
                    </div>
                    <div class="col-span-2">
                      <label
                        for="kuantitas"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Kuantitas produkmu</label
                      >
                      <input
                        id="kuantitas"
                        type="number"
                        min="1"
                        v-model="selectedItem.kuantitas"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="10"
                      />
                      <Alert
                        v-if="selectedItem.kuantitas !== null && selectedItem.kuantitas <= 0"
                        type="danger"
                        message="Kuantitas tidak boleh negatif atau desimal."
                      />
                    </div>
                    <div class="col-span-2">
                      <label
                        for="harga"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Harga produkmu</label
                      >
                      <input
                        id="harga"
                        type="number"
                        min="1"
                        v-model="selectedItem.harga"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="10000"
                      />
                      <Alert
                        v-if="selectedItem.harga !== null && selectedItem.harga <= 0"
                        type="danger"
                        message="Harga tidak boleh negatif atau desimal."
                      />
                    </div>
                  </div>
                  <div class="col-span-2">
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
                      Edit produk
                    </button>
                  </div>
                </form>
              </template>
            </Modal>
          </template>
        </Table>
      </div>
      <!-- end of ada produk -->
    </div>
  </Container>
</template>

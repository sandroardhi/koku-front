<script setup>
import { onMounted, ref, reactive, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../../components/dashboard/Container.vue'
import Modal from '../../../components/common/Modal.vue'
import Table from '../../../components/common/Table.vue'
import Alert from '../../../components/common/Alert.vue'
import Excerpt from '../../../components/common/Excerpt.vue'
import { useProdukRepository } from '@/composables/useProdukRepository'
import { useKantinRepository } from '@/composables/useKantinRepository'
import { useKategoriRepository } from '@/composables/useKategoriRepository'

const kategori_repository = useKategoriRepository()
const produk_repository = useProdukRepository()
const kantin_repository = useKantinRepository()

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const user = JSON.parse(localStorage.getItem('user'))
const kantin = ref()
const kantin_update_data = ref()
const kantin_id = ref()

// KANTIN
// fetch kantin
const fetchProfileKantin = async () => {
  isLoading.value = true
  const { data } = await kantin_repository.show_profile_kantin(user.id)
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
    await kantin_repository.store(formdata)

    router.go()
  } catch (e) {
    console.error(e.response.data)
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
    await kantin_repository.update(kantin_id.value, formdata)

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
  stok: null,
  deskripsi: '',
  kategori_id: '',
  foto: ''
})
const produk_data_alert = ref('')
const produk_array = reactive([])
const fotoInputRef = ref(null) // iki gae clear input file image tok btw

// fetch produk
const fetchProduct = async () => {
  isLoading.value = true
  const { data } = await produk_repository.show_produk(kantin_id.value)
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
  if (
    produk_data.harga <= 0 ||
    produk_data.stok <= 0 ||
    produk_data.nama == '' ||
    produk_data.deskripsi == '' ||
    produk_data.kategori_id == ''
  ) {
    produk_data_alert.value = 'Ada kolom yang belum diisi'
    return
  }
  // Clone the produk_data object to avoid reactivity issues
  const clonedProdukData = { ...produk_data }

  // Push the cloned object into the produk_array
  produk_array.push(clonedProdukData)

  // Clear the form fields
  produk_data.nama = ''
  produk_data.harga = null
  produk_data.stok = null
  ;(produk_data.deskripsi = ''),
    (produk_data.kategori_id = ''),
    // Reset the file input using the ref
    (fotoInputRef.value.value = '') // Clear the value
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
    formdata.append(`products[${index}][stok]`, product.stok)
    formdata.append(`products[${index}][deskripsi]`, product.deskripsi)
    formdata.append(`products[${index}][kategori_id]`, product.kategori_id)
    formdata.append(`products[${index}][foto]`, product.foto)
  })

  try {
    console.log([...formdata.entries()])

    await produk_repository.store(formdata, kantin_id.value)
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
  console.log('Toggling modal for item:', item)
  selectedItem.value = {} // Clear previous value
  watchEffect(() => {
    selectedItem.value = { ...item }
    console.log('Selected item:', selectedItem.value)
  })
}
const onFileChangeProdukUpdate = (e) => {
  selectedItem.value.foto = e.target.files[0]
}

const onSubmitProdukUpdate = async () => {
  isLoading.value = true
  // console.log(selectedItem)
  const formdata = new FormData()
  formdata.append('_method', 'put')
  formdata.append('nama', selectedItem.value.nama)
  formdata.append('deskripsi', selectedItem.value.deskripsi)
  formdata.append('kategori_id', selectedItem.value.kategori_id)
  formdata.append('harga', selectedItem.value.harga)
  formdata.append('stok', selectedItem.value.stok)
  formdata.append('foto', selectedItem.value.foto)
  //   for (let entry of formdata.entries()) {
  //   const [key, value] = entry;
  //   console.log(`${key}: ${value}`);
  // }

  try {
    await produk_repository.update(selectedItem.value.id, formdata)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
// end of edit produk

// hapus produk
const hapusProduk = async (id) => {
  if (confirm('yakin mau hapus produkmu?'))
    try {
      await produk_repository.destroy(id)

      router.go()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
}
const removeProduk = (index) => {
  produk_array.splice(index, 1)
}
// end of hapus produk

// fetch kategori
const kategori = ref()
const fetchKategori = async () => {
  isLoading.value = true
  const { data } = await kategori_repository.index()
  kategori.value = data
  isLoading.value = false
}

const labels = [
  { id: 1, text: 'Foto', field: 'foto' },
  { id: 2, text: 'Nama', field: 'nama' },
  { id: 3, text: 'Deskripsi', field: 'deskripsi' },
  { id: 4, text: 'Kategori', field: 'kategori' },
  { id: 5, text: 'Harga', field: 'harga' },
  { id: 6, text: 'Stok', field: 'stok' }
]

const getProdukKategori = (kategoriArray, kategori_id) => {
  const kategori = kategoriArray.find((k) => k.id === kategori_id)
  return kategori ? kategori.nama : '-'
}
const computedGetProdukKategori = computed(() => {
  return (kategori_id) => getProdukKategori(kategori.value, kategori_id)
})
// END OF PRODUK

const excerpt = (text, maxLength = 10, indicator = '...') => {
  let textCopy = text

  if (textCopy.length > maxLength) {
    textCopy = textCopy.substring(0, maxLength) + indicator
  }
  return textCopy
}
const alertToggle = () => {
  produk_data_alert.value = ''
}
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
// lifecycle
onMounted(async () => {
  await fetchProfileKantin()
  fetchKategori()
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
                <p v-if="isLoading">Loading...</p>
                <p v-else>Tambah kantinmu</p>
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
                    <p class="text-center overflow-auto">
                      {{
                        kantin_update_data[0].foto
                          ? kantin_update_data[0].foto.name
                          : 'No file selected'
                      }}
                    </p>
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
                  <p v-if="isLoading">Loading...</p>
                  <p v-else>Edit kantinmu</p>
                </button>
              </form>
            </template>
          </Modal>
          <!-- end of modal kantin update -->
        </div>
        <div class="w-full flex justify-between items-center space-x-3">
          <!-- foto kantin -->
          <img
            v-if="kantin[0].foto == 'default.jpg'"
            src="images/default.jpg"
            class="object-contain bg-[rgb(209,211,212)] h-72 rounded-lg"
            alt=""
          />
          <img
            v-else
            :src="`http://localhost:8000/storage/${kantin[0].foto}`"
            class="object-cover bg-[rgb(209,211,212)] h-72 rounded-lg"
            alt=""
          />

          <!-- detail kantin -->
          <div class="w-full flex flex-col">
            <div class="w-full min-h-[40%] p-4">
              <p class="text-xl">Nama</p>
              <span class="text-3xl font-bold mt-5 break-all"
                ><Excerpt :parentText="kantin[0].nama" :maxLength="30"
              /></span>
            </div>
            <div class="w-full min-h-[40%] p-4">
              <p class="text-xl">Deskripsi</p>
              <span class="text-3xl font-bold mt-5 break-all"
                ><Excerpt :parentText="kantin[0].deskripsi" :maxLength="50"
              /></span>
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
                      for="deskripsi"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Deskripsi produkmu</label
                    >
                    <textarea
                      id="deskripsi"
                      rows="4"
                      v-model="produk_data.deskripsi"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Nasi goreng jawa enak"
                    ></textarea>
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
                      for="kategori"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Kategori produkmu</label
                    >
                    <select
                      id="kategori"
                      name="kategori"
                      v-model="produk_data.kategori_id"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option disabled value="">Pilih kategori</option>
                      <option v-for="kategori in kategori" :key="kategori.id" :value="kategori.id">
                        {{ kategori.nama }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label
                      for="stok"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Stok produkmu</label
                    >
                    <input
                      id="stok"
                      type="number"
                      min="1"
                      v-model="produk_data.stok"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="10"
                    />
                    <Alert
                      v-if="produk_data.stok !== null && produk_data.stok <= 0"
                      type="danger"
                      message="Stok tidak boleh negatif atau desimal."
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
                  <Alert
                    v-if="!produk_data_alert == ''"
                    type="danger"
                    :message="produk_data_alert"
                    :alertToggle="() => alertToggle()"
                    dismissable
                  />
                  <button
                    type="button"
                    @click="pushProduct"
                    class="mt-2 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                    <div v-for="(produk, index) in produk_array" :key="produk.id">
                      <div
                        id="alert-1"
                        class="flex mt-4 items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                        role="alert"
                      >
                        <div class="ms-3 text-sm font-medium">
                          <p>Nama: {{ excerpt(produk.nama, 30) }}</p>
                          <p>Deskripsi: {{ excerpt(produk.deskripsi, 30) }}</p>
                          <p>Kategori: {{ computedGetProdukKategori(produk.kategori_id) }}</p>
                          <p>Harga: {{ formatter.format(produk.harga) }}</p>
                          <p>Stok: {{ produk.stok }}</p>
                          <p>Foto: {{ produk.foto ? produk.foto.name : 'No file selected' }}</p>
                        </div>
                        <button
                          type="button"
                          @click="removeProduk(index)"
                          class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                          data-dismiss-target="#alert-1"
                          aria-label="Close"
                        >
                          <span class="sr-only">Close</span>
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
                        </button>
                      </div>
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
                        <p v-if="isLoading">Loading...</p>
                        <p v-else>Buat produk</p>
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
      <div class="w-full bg-white shadow-xl rounded-lg p-5 min-h-[100px] overflow-x-auto" v-else>
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
                    for="deskripsi"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Deskripsi produkmu</label
                  >
                  <textarea
                    id="deskripsi"
                    rows="4"
                    v-model="produk_data.deskripsi"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nasi goreng jawa enak"
                  ></textarea>
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
                    for="kategori"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Kategori produkmu</label
                  >
                  <select
                    id="kategori"
                    name="kategori"
                    v-model="produk_data.kategori_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option disabled value="">Pilih kategori</option>
                    <option v-for="kategori in kategori" :key="kategori.id" :value="kategori.id">
                      {{ kategori.nama }}
                    </option>
                  </select>
                </div>
                <div class="col-span-2">
                  <label
                    for="stok"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Stok produkmu</label
                  >
                  <input
                    id="stok"
                    type="number"
                    min="1"
                    v-model="produk_data.stok"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="10"
                  />
                  <Alert
                    v-if="produk_data.stok !== null && produk_data.stok <= 0"
                    type="danger"
                    message="Stok tidak boleh negatif atau desimal."
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
                <Alert
                  v-if="!produk_data_alert == ''"
                  type="danger"
                  :message="produk_data_alert"
                  :alertToggle="() => alertToggle()"
                  dismissable
                />
                <button
                  type="button"
                  @click="pushProduct"
                  class="mt-2 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                  <div v-for="(produk, index) in produk_array" :key="produk.id">
                    <div
                      id="alert-1"
                      class="flex mt-4 items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                      role="alert"
                    >
                      <div class="ms-3 text-sm font-medium">
                        <p>Nama: {{ excerpt(produk.nama, 30) }}</p>
                        <p>Deskripsi: {{ excerpt(produk.deskripsi, 30) }}</p>
                        <p>Kategori: {{ computedGetProdukKategori(produk.kategori_id) }}</p>
                        <p>Harga: {{ formatter.format(produk.harga) }}</p>
                        <p>Stok: {{ produk.stok }}</p>
                        <p>Foto: {{ produk.foto ? produk.foto.name : 'No file selected' }}</p>
                      </div>
                      <button
                        type="button"
                        @click="removeProduk(index)"
                        class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                        data-dismiss-target="#alert-1"
                        aria-label="Close"
                      >
                        <span class="sr-only">Close</span>
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
                      </button>
                    </div>
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
                      <p v-if="isLoading">Loading...</p>
                      <p v-else>Buat produk</p>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </template>
        </Modal>
        <Table
          :labels="labels"
          :data="produk"
          :kategori="kategori"
          :actionButtons="[{ id: 1, text: 'Hapus', type: 'red', handleClick: hapusProduk }]"
        >
          <!-- edit produk modal -->
          <template #customButton="{ item }">
            <Modal
              buttonText="Edit"
              modalTitle="Edit Produk"
              :toggleModal="() => toggleModal(item)"
            >
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
                        for="deskripsi"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Deskripsi produkmu</label
                      >
                      <textarea
                        id="deskripsi"
                        rows="4"
                        v-model="selectedItem.deskripsi"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Nasi goreng jawa enak"
                      ></textarea>
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
                      <p class="text-center overflow-auto">
                        {{ selectedItem.foto ? selectedItem.foto.name : 'Tidak ada foto' }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <label
                        for="kategori"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Kategori produkmu</label
                      >
                      <select
                        id="kategori"
                        name="kategori"
                        v-model="selectedItem.kategori_id"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option disabled value="">Pilih kategori</option>
                        <option
                          v-for="kategori in kategori"
                          :key="kategori.id"
                          :value="kategori.id"
                        >
                          {{ kategori.nama }}
                        </option>
                      </select>
                    </div>
                    <div class="col-span-2">
                      <label
                        for="stok"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Stok produkmu</label
                      >
                      <input
                        id="stok"
                        type="number"
                        min="1"
                        v-model="selectedItem.stok"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="10"
                      />
                      <Alert
                        v-if="selectedItem.stok !== null && selectedItem.stok <= 0"
                        type="danger"
                        message="Stok tidak boleh negatif atau desimal."
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
                      <p v-if="isLoading">Loading...</p>
                      <p v-else>Edit produk</p>
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

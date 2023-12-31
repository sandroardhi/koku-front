<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../../components/dashboard/Container.vue'
import Modal from '../../../components/common/Modal.vue'
import Table from '../../../components/common/Table.vue'
import { useKategoriRepository } from '@/composables/useKategoriRepository'

const kategori_repository = useKategoriRepository()

const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const kategori = ref()
const selectedKategori = ref({})

const labels = [
  { text: 'Foto', field: 'foto' },
  { text: 'Nama', field: 'nama' }
]

// fetch kategori
const fetchKategori = async () => {
  isLoading.value = true
  const { data } = await kategori_repository.index()
  kategori.value = data
  isLoading.value = false
}
// end of fetch kategori

// create kategori
const kategori_data = reactive({
  nama: '',
  foto: ''
})

const onFileChangeKategori = (e) => {
  kategori_data.foto = e.target.files[0]
}

const onSubmitKategori = async () => {
  isLoading.value = true
  const formdata = new FormData()
  formdata.append('nama', kategori_data.nama)
  formdata.append('foto', kategori_data.foto)
  try {
    await kategori_repository.store(formdata)

    router.go()
  } catch (e) {
    console.error(e)
  }
  isLoading.value = false
}
// end of create kategori

// edit kategori
const onFileChangeKategoriUpdate = (e) => {
  selectedKategori.value.foto = e.target.files[0]
}
const onSubmitKategoriUpdate = async () => {
  isLoading.value = true
  const formdata = new FormData()
  formdata.append('_method', 'put')
  formdata.append('nama', selectedKategori.value.nama)
  formdata.append('foto', selectedKategori.value.foto)

  try {
    await kategori_repository.update(selectedKategori.value.id, formdata)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
// end of edit kategori

// hapus kategori
const hapusKategori = async (id) => {
  isLoading.value = true
  if (confirm('yakin mau hapus kategori ini?'))
    try {
      await kategori_repository.destroy(id)

      router.go()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  isLoading.value = false
}
// end of hapus kategori

const toggleModal = (item) => {
  selectedKategori.value = {}

  selectedKategori.value = { ...item }
}

onMounted(() => {
  fetchKategori()
})
</script>

<template>
  <Container title="Kategori Management">
    <div class="w-full px-10 py-5 min-h-[200px]">
      <div class="w-full bg-white shadow-xl rounded-lg p-5">
        <div class="w-full flex flex-col justify-between">
          <p class="text-xl font-semibold ">Buat Kategori</p>
          <form
            class="p-4 md:p-5"
            enctype="multipart/form-data"
            :action="route.path"
            @submit.prevent="onSubmitKategori"
          >
            <div class="">
              <label for="nama" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Nama</label
              >
              <input
                type="text"
                v-model="kategori_data.nama"
                autocomplete="off"
                id="nama"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div class="mt-2">
              <label for="foto" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Foto</label
              >
              <input
                type="file"
                ref="fotoInputRef"
                @change="onFileChangeKategori"
                id="foto"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder=""
              />
            </div>
            <div class="mt-5">
              <button
                type="submit"
                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tambah kategori
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="w-full px-10 py-5 min-h-[200px]">
      <div class="w-full bg-white shadow-xl rounded-lg p-5 min-h-[100px]">
        <Table
          :labels="labels"
          :data="kategori"
          :excerptLenght="20"
          :actionButtons="[{ text: 'Hapus', type: 'red', handleClick: hapusKategori }]"
        >
          <template #customButton="{ item }">
            <Modal
              buttonText="Edit"
              modalTitle="Edit Kategori"
              :toggleModal="
                () => {
                  toggleModal(item)
                }
              "
            >
              <template #modalBody>
                <form
                  class="p-4 md:p-5"
                  enctype="multipart/form-data"
                  :action="route.path"
                  @submit.prevent="onSubmitKategoriUpdate"
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
                        v-model="selectedKategori.nama"
                        autocomplete="off"
                        id="nama"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      />
                    </div>
                    <div class="col-span-2">
                      <label
                        for="foto"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Foto</label
                      >
                      <input
                        type="file"
                        ref="fotoInputRef"
                        @change="onFileChangeKategoriUpdate"
                        id="foto"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder=""
                      />
                      <img
                        v-if="selectedKategori.foto == 'default.jpg'"
                        class="object-cover max-h-32 mx-auto mt-2 rounded-lg"
                        alt="Image"
                        src="images/default.jpg"
                      />
                      <img
                        v-else-if="selectedKategori.foto"
                        :src="`http://localhost:8000/storage/${selectedKategori.foto}`"
                        class="object-cover max-h-32 mx-auto mt-2 rounded-lg"
                        alt=""
                      />
                      <p class="text-center overflow-auto">
                        {{ selectedKategori.foto ? selectedKategori.foto.name : 'Tidak ada foto' }}
                      </p>
                    </div>
                    <div class="col-span-2">
                      <button
                        type="submit"
                        class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Edit kategori
                      </button>
                    </div>
                  </div>
                </form>
              </template>
            </Modal>
          </template>
        </Table>
      </div>
    </div>
  </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Modal from '../../../../components/common/Modal.vue'
import Table from '../../../../components/common/Table.vue'
import { useDashboardRepository } from '@/composables/useDashboardRepository'
import Alert from '../../../../components/common/Alert.vue'

const dashboard_repository = useDashboardRepository()
const route = useRoute()
const router = useRouter()
const isLoading = ref()
const isLoadingSubmit = ref(false)

const orders = ref([])

const fetchUangMasuk = async () => {
  isLoading.value = true
  try {
    const { data } = await dashboard_repository.uangMasukAdminPengantar()
    orders.value = data.uang_masuk
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const error = ref(null)

const clearError = () => {
  error.value = ''
}
const selectedItem = ref({})
const toggleModal = (item) => {
  // Your logic to toggle the modal, and you have access to 'item'
  console.log('Toggling modal for item:', item)
  selectedItem.value = {} // Clear previous value
  selectedItem.value = { ...item }
  console.log('Selected item:', selectedItem.value)
}
const onFileChangeProduk = (e) => {
  selectedItem.value.foto = e.target.files[0]
}

const onSubmit = async () => {
  if (selectedItem.value.foto == null) {
    error.value = 'Tolong isi lampiran terlebih dahulu'
    return
  }
  isLoadingSubmit.value = true
  // console.log(selectedItem)
  const formdata = new FormData()
  formdata.append('_method', 'put')
  formdata.append('pengantar_id', selectedItem.value.pengantar_id)
  selectedItem.value.order_id.forEach((id) => {
    formdata.append('order_id[]', id)
  })
  formdata.append('foto', selectedItem.value.foto)
  //   for (let entry of formdata.entries()) {
  //   const [key, value] = entry;
  //   console.log(`${key}: ${value}`);
  // }

  try {
    await dashboard_repository.bayarPengantar(formdata)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoadingSubmit.value = false
}

const groupedOrders = ref([])

const groupedOrder = () => {
  const ordersMap = {}
  console.log(orders.value)
  orders.value.forEach((uang) => {
    console.log('uang belum dibayar', uang)
    const pengantarId = uang.pengantar.id
    if (!ordersMap[pengantarId]) {
      ordersMap[pengantarId] = {
        ongkir: 0,
        nama: uang.pengantar.name,
        pengantar_id: pengantarId,
        no_rek: uang.pengantar.no_rek,
        channel: uang.pengantar.channel,
        orders: [],
        order_id: []
      }
    }

    ordersMap[pengantarId].orders.push(uang)
    ordersMap[pengantarId].order_id.push(uang.id)
    ordersMap[pengantarId].ongkir += uang.ongkir
    ordersMap[pengantarId].nama = uang.pengantar.name
    ordersMap[pengantarId].no_rek = uang.pengantar.no_rek
    ordersMap[pengantarId].channel = uang.pengantar.channel
  })

  // Convert grouped orders back to array format
  groupedOrders.value = Object.values(ordersMap)
}

const addHarga = (orders) => {
  const kantinMap = {}

  orders.forEach((uang) => {
    console.log(uang)
    const pengantarId = uang.pengantar_id
    if (!kantinMap[pengantarId]) {
      kantinMap[pengantarId] = {
        ongkir: 0,
        pengantar_id: pengantarId,
        created_at: uang.created_at,
        orders: [],
        order_id: [],
      }
    }
    kantinMap[pengantarId].orders.push({
      created_at: uang.created_at,
      ongkir: uang.ongkir,
      unique_string: uang.unique_string
    })
  })

  // Convert grouped orders back to array format
  return Object.values(kantinMap)
}

const labels = [
  { id: 1, text: 'Nama Pengantar', field: 'nama' },
  { id: 2, text: 'Total pembayaran', field: 'ongkir' }
]

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})

onMounted(async () => {
  await fetchUangMasuk()
  groupedOrder()
  // addHarga()
  // console.log(addedHarga.value)
})
</script>

<template>
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
  <div v-else class="w-full">
    <div v-if="orders.length !== 0" class="w-full">
      <Table
        :labels="labels"
        :data="groupedOrders"
        :excerptLength="20"
        :actionButtons="[
          { id: 1, text: '', type: 'hidden' },
          { id: 2, text: '', type: 'hidden' }
        ]"
      >
        <template #customButton2="{ item }">
          <Modal
            buttonText="Details"
            modalTitle="Detail Order"
            :button-color="'#0000FF'"
            :button-hover="'#7575FF'"
            :button-margin-right="10"
            :max-width-modal="'xl'"
          >
            <template #modalBody>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2" v-for="item in addHarga(item.orders)" :key="item.id">
                  <table class="min-w-full divide-y divide-gray-200 mt-2 -mb-3">
                    <thead>
                      <tr>
                        <td
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID ORDER
                        </td>
                        <td
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tanggal dibuat
                        </td>
                        <td
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          total harga
                        </td>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="item in item.orders" :key="item.unique_string">
                        <td class="px-6 py-4">
                          <p>#{{ item.unique_string }}</p>
                        </td>
                        <td class="px-6 py-4">
                          <p>{{ item.created_at }}</p>
                        </td>
                        <td class="px-6 py-4">
                          <!-- <p>{{ item }}</p> -->
                          <p>{{ formatter.format(item.ongkir) }}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
          </Modal>
        </template>
        <template #customButton="{ item }">
          <Modal
            buttonText="Bayar"
            modalTitle="Bayar Penjual"
            :toggleModal="() => toggleModal(item)"
          >
            <template #modalBody>
              <form
                class="p-4 md:p-5"
                enctype="multipart/form-data"
                :action="route.path"
                @submit.prevent="onSubmit"
              >
                <div class="grid gap-4 mb-4 grid-cols-2">
                  <p class="text-lg font-medium">Data Pengantar:</p>
                  <div class="col-span-2">
                    <p class="text-md text-gray-90 font-medium">Nama:</p>
                    <p>{{ selectedItem.nama }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-md text-gray-90 font-medium">Bank:</p>
                    <p>{{ selectedItem.channel }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-md text-gray-90 font-medium">No. Rek:</p>
                    <p>{{ selectedItem.no_rek }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-md text-gray-90 font-medium">Total Pembayaran:</p>
                    <p>{{ formatter.format(selectedItem.ongkir) }}</p>
                  </div>
                  <div class="col-span-2">
                    <label
                      for="nama"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Lampiran (bukti pembayaran)</label
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
                  <Alert
                    type="danger"
                    :message="error"
                    :alertToggle="() => clearError()"
                    dismissable
                    class="col-span-2 -my-2"
                    v-if="error"
                  />
                  <div class="col-span-2 mt-2">
                    <button
                      type="submit"
                      class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <p v-if="!isLoadingSubmit">Update</p>
                      <p v-else>Loading</p>
                    </button>
                  </div>
                </div>
              </form>
            </template>
          </Modal>
        </template>
      </Table>
    </div>
    <div v-else class="w-full flex justify-center items-center">
      <p class="text-2xl font-medium">Tidak ada apapun disini...</p>
    </div>
  </div>
</template>

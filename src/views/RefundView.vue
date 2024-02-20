<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import Navbar from '../components/common/Navbar.vue'
import Alert from '../components/common/Alert.vue'
import { useAuthRepository } from '@/composables/useAuthRepository'
import { useDashboardRepository } from '@/composables/useDashboardRepository'

const dashboard_repository = useDashboardRepository()
const auth_repository = useAuthRepository()
const isLoading = ref(false)
const isLoadingSubmit = ref(false)
const router = useRouter()
const orders = ref([])

const fetchUser = async () => {
  isLoading.value = true
  try {
    const { data } = await auth_repository.getUser()
    console.log(data)
    credentials.selectedChannel = data.user.channel
    credentials.no_rek = data.user.no_rek
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
const credentials = reactive({
  selectedChannel: null,
  no_rek: null
})

const error = ref('')

const clearError = () => {
  error.value = ''
}

const submit = async () => {
  if (credentials.selectedChannel == null) {
    return (error.value = 'Isi tujuan channel rekening dulu')
  } else if (credentials.no_rek == null) {
    return (error.value = 'Isi tujuan nomor rekening dulu')
  }
  const data = {
    _method: 'put',
    channel: credentials.selectedChannel,
    no_rek: credentials.no_rek
  }
  try {
    isLoadingSubmit.value = true
    await auth_repository.updateRekening(data)
  } catch (error) {
    console.log(error)
  } finally {
    isLoadingSubmit.value = false
    fetchUser()
  }
}

const dropdownChannel = ref(false)

const toggleDropdownTipePembayaran = () => {
  dropdownChannel.value = !dropdownChannel.value
}
const selectChannel = (option) => {
  credentials.selectedChannel = option
  dropdownChannel.value = false
}

const fetchUangMasuk = async () => {
  isLoading.value = true
  try {
    const { data } = await dashboard_repository.uangRefundPembeli()
    orders.value = data.uang_masuk
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
const groupedOrders = ref([])

const groupedOrder = () => {
  const ordersMap = {}

  orders.value.forEach((uang) => {
    const uniqueString = uang.unique_string
    if (!ordersMap[uniqueString]) {
      ordersMap[uniqueString] = {
        totalHarga: 0,
        orders: []
      }
    }
    uang.order_barangs.forEach((item) => {
      ordersMap[uniqueString].totalHarga += item.harga
    })
    ordersMap[uniqueString].orders.push(uang)
  })

  // Convert grouped orders back to array format
  groupedOrders.value = Object.values(ordersMap)
}

const toggleModal = (orderId) => {
  const modal = document.getElementById(`modal_${orderId}`)

  if (modal) {
    modal.classList.toggle('hidden')
  }
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
const stringDate = (updated_at) => {
  const updatedAtDate = new Date(updated_at)

  // Format the date as desired
  const formattedDate = updatedAtDate.toLocaleString() // Adjust this according to your desired format

  return formattedDate
}

onMounted(async () => {
  fetchUser()
  await fetchUangMasuk()
  groupedOrder()
})
</script>

<template>
  <Navbar />
  <div class="w-full h-[calc(150vh-7rem)] flex justify-start mt-3 items-center flex-col">
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
      <p class="text-5xl mb-3">Refund</p>
    </div>
    <form class="w-[80%] mx-auto mt-5 pb-5" @submit.prevent="submit">
      <p class="text-xl mb-5">Atur Rekening Untuk Refund</p>
      <div class="relative z-0 w-full mb-5 group">
        <div class="mb-4">
          <label for="name" class="block mb-2">Rekening Pembayaran</label>
          <div class="relative w-full mb-2 bg-white">
            <div
              @click="toggleDropdownTipePembayaran"
              class="w-full px-3 py-2 border flex justify-between border-[#6B7280] rounded focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <p class="text-black" v-if="credentials.selectedChannel">
                {{ credentials.selectedChannel }}
              </p>
              <p class="text-[#6B7280]" v-else>Pilih Payment Channel</p>
              <svg
                fill="#6B7280"
                viewBox="-6.5 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <title>dropdown</title>
                  <path
                    d="M18.813 11.406l-7.906 9.906c-0.75 0.906-1.906 0.906-2.625 0l-7.906-9.906c-0.75-0.938-0.375-1.656 0.781-1.656h16.875c1.188 0 1.531 0.719 0.781 1.656z"
                  ></path>
                </g>
              </svg>
            </div>
            <ul
              v-if="dropdownChannel"
              class="absolute w-full mt-1 bg-white border rounded border-[#6B7280] shadow z-10"
            >
              <li class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center">
                <p class="ml-3 font-semibold">Bank</p>
              </li>
              <li
                @click="selectChannel('Bank Mandiri')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/bank-mandiri.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank Mandiri</p>
              </li>
              <li
                @click="selectChannel('Bank BRI')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/BANK_BRI_logo.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank BRI</p>
              </li>
              <li
                @click="selectChannel('Bank BNI')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/bank-negara-indonesia.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank BNI</p>
              </li>
              <li
                @click="selectChannel('Bank BCA')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/bca-bank-central-asia.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank BCA</p>
              </li>
              <li
                @click="selectChannel('Bank CIMB')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/CIMB_Niaga_logo.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank CIMB Niaga</p>
              </li>
              <li
                @click="selectChannel('Bank Permata')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/Permata Bank.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank Permata</p>
              </li>
              <li class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center">
                <p class="ml-3 font-semibold">E-Money</p>
              </li>
              <li
                @click="selectChannel('Gopay')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../public/bank_logo/Gopay_logo.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Gopay</p>
              </li>
              <li
                @click="selectChannel('Shopeepay')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../public/bank_logo/ShopeePay.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Shopeepay</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="mb-4">
          <label for="name" class="block mb-2">No Rekening</label>
          <input
            type="text"
            class="border p-2 w-full bg-white rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="1223-1234-1234-1234"
            v-model="credentials.no_rek"
          />
        </div>
      </div>
      <Alert
        type="danger"
        :message="error"
        :alertToggle="() => clearError()"
        dismissable
        class="w-full mb-2"
        v-if="error"
      />
      <button
        type="submit"
        class="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full mt-2 sm:w-auto px-5 py-2.5 text-center"
      >
        <p v-if="isLoadingSubmit">Loading...</p>
        <p v-else>Submit</p>
      </button>
    </form>
    <div class="w-[80%] mx-auto mt-5 pb-5">
      <p class="text-small text-gray-600">
        *Admin tidak akan memulai proses pengembalian dana jika nomor rekening belum diisi.
      </p>
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
    <div class="w-[80%] mx-auto" v-else>
      <p class="text-2xl">Data Refund</p>
      <div v-if="orders.length !== 0" class="w-full">
        <div
          class="w-full py-4 flex justify-between items-center text-lg border-b relative"
          v-for="order in groupedOrders"
          :key="order.orders[0].id"
        >
          <div class="flex w-1/2 justify-between">
            <p class="text-gray-600">#{{ order.orders[0].unique_string }}</p>
            <p>{{ formatter.format(order.totalHarga) }}</p>
            <p>{{ stringDate(order.orders[0].order_barangs[0].updated_at) }}</p>
          </div>
          <div class="flex w-1/2 justify-end">
            <p v-if="order.orders[0].order_barangs[0].status_uang == 'Refund'">
              Sedang diproses oleh admin
            </p>
            <div v-else-if="order.orders[0].order_barangs[0].status_uang == 'Refunded'">
              <div
                class="w-full flex justify-center"
                v-if="order.orders[0].tipe_pembayaran == 'Online'"
              >
                <p class="text-green-600 font-semibold">Sudah dibayar<span class="mx-5">|</span></p>
                <p
                  class="text-blue-600 underline cursor-pointer font-semibold"
                  @click="toggleModal(order.orders[0].id)"
                >
                  Lampiran
                </p>
                <!-- MODAL -->
                <div v-if="modal" class="fixed inset-0 bg-black opacity-50"></div>
                <div
                  :id="'modal_' + order.orders[0].id"
                  class="hidden bg-[rgba(0,0,0,0.5)] overflow-y-auto bg-overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 min-h-[calc(100%)] transition-all duration-300"
                >
                  <div class="relative p-4 w-full max-w-xl mx-auto my-5">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <div
                        class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
                      >
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                          Lampiran
                        </h3>
                        <button
                          type="button"
                          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          @click="toggleModal(order.orders[0].id)"
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
                      <div class="flex items-center flex-col justify-between px-4 py-2">
                        <div class="w-full border-b pb-3">
                          <p class="pt-2 pb-1 text-lg font-semibold">Bukti Pembayaran :</p>
                          <div class="w-full justify-center items-center">
                            <img
                              :src="`http://localhost:8000/storage/${order.orders[0].order_barangs[0].lampiran}`"
                              alt="Lampiran"
                              class="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- END OF MODAL -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

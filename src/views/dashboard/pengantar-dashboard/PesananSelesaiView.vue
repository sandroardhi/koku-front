<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../../components/dashboard/Container.vue'
import { usePengantarRepository } from '../../../composables/usePengantarRepository'
import { useAuthStore } from '../../../stores/auth'
import axios from 'axios'

const pengantar_repository = usePengantarRepository()

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const isLoading = ref()
const orders = ref([])
const user = JSON.parse(localStorage.getItem('user'))
const kantin = ref({})

const fetchKantin = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get('api/kantin/index/fetch-nama-kantin', {
      baseURL: 'http://localhost:8000',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    kantin.value = data
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const OrderSelesai = async () => {
  isLoading.value = true
  try {
    const { data } = await pengantar_repository.orderPengantarSelesai()
    orders.value = Object.values(data.assigned_orders)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const categorizedBarangs = (barangs) => {
  const categorizedBarangs = {}

  barangs.forEach((barang) => {
    const kantinId = barang.kantin_id

    if (!categorizedBarangs[kantinId]) {
      categorizedBarangs[kantinId] = {
        kantin_nama: kantin.value[kantinId],
        id: kantinId,
        produkList: []
      }
    }

    categorizedBarangs[kantinId].produkList.push(barang)
  })

  // Convert the object into an array
  return Object.values(categorizedBarangs)
}

const deadlineKonfirmasi = (created_at) => {
  const createdAt = new Date(created_at)

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000
  const newDate = new Date(createdAt.getTime() + oneDayInMilliseconds)

  // Format the new date as needed
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }
  const formattedNewDate = newDate.toLocaleDateString('en-US', options)

  return formattedNewDate
}

const updateStatusSelesai = async (order_id) => {
  const data = {
    order_id: order_id
  }

  try {
    await pengantar_repository.updateStatusSelesai(data)
    await OrderSelesai()
  } catch (error) {
    console.error(error)
  }
}

const togglePengantarActive = async () => {
  try {
    await pengantar_repository.togglePengantarActive()
    await authStore.getUser()
  } catch (error) {
    console.error(error)
  } finally {
    router.go()
  }
}

const togglePengantarNonactive = async () => {
  try {
    await pengantar_repository.togglePengantarNonactive()
    await authStore.getUser()
  } catch (error) {
    console.error(error)
  } finally {
    router.go()
  }
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
onMounted(async () => {
  await OrderSelesai()
  await fetchKantin()
  authStore.getUser()
})
</script>

<template>
  <Container title="Pesanan Berlangsung">
    <div
      role="status"
      v-if="isLoading"
      class="mx-auto w-full flex h-screen justify-center items-center"
    >
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
    <div class="w-full py-5 min-h-[200px]" v-else>
      <div
        class="w-full h-16 rounded-lg shadow-md bg-white flex justify-between px-5 items-center mb-7"
      >
        <div v-if="user.pengantarIsAvailable == 'active'">
          <p class="text-lg">
            Status Pengantar :
            <span>Aktif</span>
          </p>
        </div>
        <div v-else-if="user.pengantarIsAvailable == 'nonactive'">
          <p class="text-lg">
            Status Pengantar :
            <span>Non Aktif</span>
          </p>
        </div>
        <div v-else-if="user.pengantarIsAvailable == 'ongoing'">
          <p class="text-lg">
            Status Pengantar :
            <span>Sedang melakukan transaksi</span>
          </p>
        </div>
        <form
          :action="route.path"
          class="flex flex-col"
          v-if="user.pengantarIsAvailable == 'active'"
        >
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              class="sr-only peer"
              checked
              @change="togglePengantarNonactive"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
          </label>
        </form>
        <form
          :action="route.path"
          class="flex flex-col"
          v-else-if="user.pengantarIsAvailable == 'nonactive'"
        >
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" @change="togglePengantarActive" />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
          </label>
        </form>
        <form
          :action="route.path"
          class="flex flex-col"
          v-else-if="user.pengantarIsAvailable == 'ongoing'"
        >
          <label class="relative inline-flex items-center">
            <input type="checkbox" value="" class="sr-only peer" checked disabled />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Sedang Transaksi</span
            >
          </label>
        </form>
      </div>
      <div class="w-full grid grid-cols-6 gap-4" v-if="orders.length !== 0">
        <!-- {{ user }}
        {{ orders }} -->
        <!-- Modal content -->
        <div
          class="relative bg-white rounded-lg col-span-6 md:col-span-3 lg:col-span-2 shadow dark:bg-gray-700"
          v-for="order in orders"
          :key="order.id"
        >
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Rincian Pesanan</h3>
          </div>
          <!-- Modal body -->
          <div class="flex items-center flex-col justify-between px-4 py-2">
            <div class="w-full border-b pb-3">
              <p class="pt-2 pb-1 text-lg font-semibold">Pesanan untuk :</p>
              <p class="text-slate-700 text-xl font-semibold">
                {{
                  order.user.name + (order.user.nomor_hp == null ? '' : ' - ' + order.user.nomor_hp)
                }}
              </p>
              <p class="text-slate-700">
                {{
                  formatter.format(order.total_harga) +
                  ' - ' +
                  order.tipe_pengiriman +
                  ' - ' +
                  order.order_barangs.length +
                  ' menu'
                }}
              </p>
              <div>
                <p class="pt-2 pb-1 text-lg font-semibold">Pembayaran :</p>
                <p class="text-slate-700">
                  {{ order.tipe_pembayaran }}
                </p>
              </div>
              <div v-if="order.tipe_pengiriman == 'Antar'">
                <p class="pt-2 pb-1 text-lg font-semibold">Tujuan :</p>
                <p class="text-slate-700">
                  {{ order.tujuan }}
                </p>
              </div>
              <div>
                <p class="pt-2 pb-1 text-lg font-semibold">Catatan :</p>
                <p class="text-slate-700">
                  {{ order.catatan ? order.catatan : 'Tidak ada' }}
                </p>
              </div>
            </div>
            <div
              v-for="categorizedOrder in categorizedBarangs(order.order_barangs)"
              :key="categorizedOrder.id"
              class="w-full"
              :class="categorizedOrder.produkList[0].status == 'Canceled' ? 'text-gray-500' : ''"
            >
              <div class="w-full flex items-center justify-between">
                <router-link
                  :to="`/kantin/show/${categorizedOrder.produkList[0].kantin_id}`"
                  class="pt-3 pb-1 text-xl font-semibold"
                  >{{ categorizedOrder.kantin_nama }}</router-link
                >
              </div>
              <div
                v-for="produk in categorizedOrder.produkList"
                :key="produk.id"
                class="pt-2 pb-1 flex justify-between items-center"
              >
                <div class="flex items-center">
                  <div class="relative w-full">
                    <img
                      :src="`http://localhost:8000/storage/${produk.foto}`"
                      alt="foto produk"
                      class="w-20 h-20 object-cover"
                    />
                    <div
                      :class="
                        categorizedOrder.produkList[0].status == 'Gagal Dibuat'
                          ? 'absolute w-20 h-20 inset-0 bg-gray-500 opacity-50 transition-opacity duration-300 group-hover:opacity-75'
                          : 'hidden'
                      "
                    ></div>
                  </div>
                  <div class="ml-3 flex">
                    <p>{{ produk.kuantitas }}x</p>
                    <span class="ml-2">{{ produk.nama }}</span>
                  </div>
                </div>
                <div>
                  <p>{{ formatter.format(produk.harga * produk.kuantitas) }}</p>
                </div>
              </div>
              <div class="mt-3">
                <p
                  class="text-center text-lg font-semibold"
                  v-if="categorizedOrder.produkList[0].status == 'Dibuat'"
                >
                  Pesanan sedang dibuat
                </p>
                <div
                  class="flex flex-col items-center text-lg font-semibold"
                  v-else-if="categorizedOrder.produkList[0].status == 'Selesai'"
                >
                  <p class="text-center text-lg font-semibold">
                    Pesanan <span class="text-green-400">selesai.</span>
                  </p>
                </div>
                <div
                  v-else-if="categorizedOrder.produkList[0].status == 'Menunggu Konfirmasi'"
                  class="flex flex-col items-center"
                >
                  <p class="text-lg font-semibold">Menunggu konfirmasi penjual</p>
                </div>
                <div
                  v-else-if="categorizedOrder.produkList[0].status == 'Gagal Dibuat'"
                  class="flex flex-col items-center text-black"
                >
                  <p class="text-red-600 text-lg font-semibold text-center mt-2">
                    Pesanan gagal karena penjual tidak merespon
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full items-center justify-between mt-5 border-t pt-3">
              <p class="text-xl mb-3 font-semibold">Total pembayaranmu:</p>
              <div class="w-full flex justify-between items-center">
                <div v-if="order.tipe_pengiriman == 'Antar'" class="w-full">
                  <div class="flex w-full justify-between">
                    <p class="text-sm">Subtotal:</p>
                    <p class="text-sm">{{ formatter.format(order.total_harga - 2000) }}</p>
                  </div>
                  <div class="flex w-full justify-between">
                    <p class="text-sm">Ongkir:</p>
                    <p class="text-sm">{{ formatter.format(2000) }}</p>
                  </div>
                  <div class="w-full flex justify-between">
                    <p>Total ({{ order.order_barangs.length }} menu):</p>
                    <p class="text-xl">{{ formatter.format(order.total_harga) }}</p>
                  </div>
                </div>
                <div v-else class="w-full">
                  <div class="flex w-full justify-between">
                    <p>Total ({{ order.order_barangs.length }} menu) :</p>
                    <p class="text-xl">{{ formatter.format(order.total_harga) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <div class="w-full flex flex-col items-center mt-1">
              <form
                :action="route.path"
                @submit.prevent="updateStatusSelesai(order)"
                class="w-full"
                v-if="order.status == 'Dikirim'"
              >
                <button
                  type="submit"
                  class="hover:bg-[#FFB000] w-full hover:text-white rounded-lg text-center py-2 text-xl transition-all duration-150 ease-in"
                >
                  Selesai Kirim
                </button>
              </form>
              <div class="text-sm -mt-3" v-if="order.status == 'Konfirmasi Pembeli'">
                <p class="font-semibold text-green-500">Menunggu Konfirmasi Pembeli</p>
                <p>
                  Pesanan akan otomatis dikonfirmasi pada {{ deadlineKonfirmasi(order.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full mx-auto p-10 rounded-lg bg-white flex items-center justify-center shadow-md"
        v-else
      >
        <p class="text-2xl">Tidak ada apapun disini.</p>
      </div>
    </div>
  </Container>
</template>

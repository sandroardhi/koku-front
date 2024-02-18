<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../../components/dashboard/Container.vue'
import { useOrderRepository } from '../../../composables/useOrderRepository'

const order_repository = useOrderRepository()

const route = useRoute()
const router = useRouter()
const isLoading = ref()
const orders = ref([])

const OrderMasuk = async () => {
  isLoading.value = true
  try {
    const { data } = await order_repository.orderMasuk()
    orders.value = Object.values(data)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const tambah_harga_produk = (order) => {
  let total = 0

  if (Array.isArray(order)) {
    order.forEach((item) => {
      total += item.harga * item.kuantitas
    })
  }

  return total
}

const updateStatusDibuat = async (order) => {
  const data = {
    OrderBarang_id: []
  }
  if (Array.isArray(order)) {
    order.forEach((item) => {
      data.OrderBarang_id.push(item.id)
    })
  }
  try {
    await order_repository.updateStatusDibuat(data)
    await OrderMasuk()
  } catch (error) {
    console.error(error)
  }
}

const updateStatusSelesai = async (order) => {
  const data = {
    OrderBarang_id: []
  }
  if (Array.isArray(order)) {
    order.forEach((item) => {
      data.OrderBarang_id.push(item.id)
    })
  }
  try {
    await order_repository.updateStatusSelesai(data)
    await OrderMasuk()
  } catch (error) {
    console.error(error)
  }
}

// helper
const countdownTime = (created_at) => {
  const now = new Date()
  const createdAtDate = new Date(created_at)

  const timeDifference = createdAtDate.getTime() + 30 * 60 * 1000 - now.getTime()

  console.log(timeDifference)

  return Math.max(0, timeDifference)
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

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
onMounted(async () => {
  await OrderMasuk()
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
      <div class="w-full grid grid-cols-6 gap-4" v-if="orders.length !== 0">
        <div
          v-for="(order, index) in orders.slice().reverse()"
          :key="index"
          class="col-span-6 md:col-span-3 lg:col-span-2 p-5 bg-white rounded-lg shadow-xl"
        >
          <div
            class="w-full h-10 border-b"
            v-if="order && order[0].status == 'Menunggu Konfirmasi'"
          >
            <vue-countdown
              :time="countdownTime(order[0].created_at)"
              :interval="100"
              v-slot="{ minutes, seconds }"
            >
              <marquee behavior="" direction="" scrollamount="10"
                >Batas waktu terima pesanan: {{ minutes }} Menit, {{ seconds }} detik.</marquee
              >
            </vue-countdown>
          </div>
          <div class="w-full h-10 flex justify-between items-center">
            <p class="text-sm text-slate-500">#{{ order[0].order.unique_string }}</p>
          </div>
          <div class="w-full border-b pb-3">
            <p class="py-1 text-lg font-semibold">Pesanan untuk :</p>
            <p class="text-slate-700 text-md font-semibold">
              {{
                order[0].order.user.name +
                (order[0].order.user.nomor_hp == null ? '' : ' - ' + order[0].order.user.nomor_hp)
              }}
            </p>
            <p class="text-slate-700">
              {{
                formatter.format(tambah_harga_produk(order)) +
                ' - ' +
                order[0].order.tipe_pengiriman +
                ' - ' +
                order[0].order.tipe_pembayaran
              }}
            </p>
            <div v-if="order[0].order.tipe_pengiriman == 'Antar'">
              <p class="py-1 text-lg font-semibold">Tujuan :</p>
              <p class="text-slate-700">
                {{ order[0].order.tujuan }}
              </p>
            </div>
            <div>
              <p class="py-1 text-lg font-semibold">Catatan :</p>
              <p class="text-slate-700">
                {{ order[0].order.catatan == null ? 'Tidak ada' : order[0].order.catatan }}
              </p>
            </div>
          </div>
          <div
            v-for="produk in order"
            :key="produk.id"
            class="py-2 flex justify-between items-center"
          >
            <div class="flex items-center">
              <img
                :src="`http://localhost:8000/storage/${produk.foto}`"
                alt="foto produk"
                class="w-10 h-10 object-cover"
              />
              <p class="ml-3 text-md">
                {{ produk.kuantitas }} x <span>{{ produk.nama }}</span>
              </p>
            </div>
            <div>
              <p>{{ formatter.format(produk.harga * produk.kuantitas) }}</p>
            </div>
          </div>
          <div class="w-full border-y py-2 flex justify-between">
            <p class="text-xl">Total:</p>
            <p class="text-xl">{{ formatter.format(tambah_harga_produk(order)) }}</p>
          </div>
          <form
            :action="route.path"
            @submit.prevent="updateStatusDibuat(order)"
            class="w-full"
            v-if="order[0].status == 'Menunggu Konfirmasi'"
          >
            <button
              type="submit"
              class="hover:bg-[#FFB000] w-full hover:text-white rounded-lg text-center py-2 mt-5 text-xl transition-all duration-150 ease-in"
            >
              Terima Pesanan
            </button>
          </form>
          <form
            :action="route.path"
            @submit.prevent="updateStatusSelesai(order)"
            class="w-full"
            v-else-if="order[0].status == 'Dibuat'"
          >
            <button
              type="submit"
              class="hover:bg-[#FFB000] w-full hover:text-white rounded-lg text-center py-2 mt-5 text-xl transition-all duration-150 ease-in"
            >
              Selesai
            </button>
          </form>
          <div v-if="order[0].status == 'Gagal Dibuat'" class="w-full">
            <p class="text-center text-red-800 text-lg font-semibold mt-3">Pesanan Gagal</p>
          </div>
          <div v-if="order[0].order.status == 'Dikirim' && order[0].status !== 'Gagal Dibuat'" class="w-full">
            <p class="text-center text-green-800 text-lg font-semibold mt-3">Sedang Dikirim</p>
          </div>
          <div v-else-if="order[0].order.status == 'Konfirmasi Pembeli'" class="text-sm mt-3">
            <p class="font-semibold text-green-500">Menunggu Konfirmasi Pembeli</p>
            <p>
              Pesanan akan otomatis dikonfirmasi pada
              {{ deadlineKonfirmasi(order[0].order.created_at) }}
            </p>
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

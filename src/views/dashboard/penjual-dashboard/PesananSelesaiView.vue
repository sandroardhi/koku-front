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
    const { data } = await order_repository.orderPenjualSelesai()
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

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
onMounted(() => {
  OrderMasuk()
})
</script>

<template>
  <Container title="Pesanan Selesai">
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
    <div class="w-full px-10 py-5 min-h-[200px]" v-else>
      <div class="w-full grid grid-cols-3 gap-4" v-if="orders.length !== 0">
        <div
          v-for="(order, index) in orders.slice().reverse()"
          :key="index"
          class="col-span-1 p-5 bg-white rounded-lg"
        >
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
                formatter.format(order[0].order.total_harga) +
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
          <p class="text-green-600 text-2xl font-semibold text-center mt-2">Pesanan selesai.</p>
        </div>
      </div>
      <div class="w-full mx-auto p-10 rounded-lg bg-white flex items-center justify-center" v-else>
        <p class="text-2xl">Tidak ada apapun disini.</p>
      </div>
    </div>
  </Container>
</template>

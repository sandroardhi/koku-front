<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import _debounce from 'lodash.debounce'
import Button from '../../components/common/Button.vue'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import { useOrderRepository } from '@/composables/useOrderRepository'

defineProps({
  orders: Array
})

const emit = defineEmits(['error'])

const order_repository = useOrderRepository()

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const isLoadingPay = ref(false)
const kantin = ref({})

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

const updateStatusUserSelesai = async (order_id) => {
  const data = {
    order_id: order_id
  }
  try {
    await order_repository.updateUserStatusSelesai(data)
    router.push('/pesanan/selesai')
  } catch (error) {
    console.error(error)
  }
}

const pay = async (order) => {
  isLoadingPay.value = true
  try {
    const data = {
      order: order
    }
    await order_repository.checkPengantar(data)
    try {
      // eslint-disable-next-line no-undef
      snap.pay(order.snap_token, {
        onSuccess: function () {
          window.location.href = '/pesanan/berlangsung'
        },
        onPending: function () {
          router.push('/pesanan')
        },
        onClose: function () {
          router.push('/pesanan')
        }
      })
    } catch (error) {
      emit('error', 'Gagal membuka Midtrans Snap')
    }
  } catch (error) {
    console.log(error)
    emit('error', 'Pengantar tidak ditemukan')
  } finally {
    isLoadingPay.value = false
  }
}

const hapus = async (order_id) => {
  isLoading.value = true
  try {
    const data = {
      order_id: parseInt(order_id)
    }

    const debouncedDelete = _debounce(async () => {
      await order_repository.deleteOrder(data)
      router.go()
    }, 500)

    await debouncedDelete()
  } catch (e) {
    console.error(e)
  }
}

// helper
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
const excerpt = (text, maxLength = 30, indicator = '..') => {
  let textCopy = text

  if (textCopy == undefined) {
    textCopy = '...'
  }
  if (textCopy && textCopy.length > maxLength) {
    textCopy = textCopy.substring(0, maxLength) + indicator
  }

  return textCopy
}

const deadlineKonfirmasi = (created_at) => {
  const createdAt = new Date(created_at)

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000
  const newDate = new Date(createdAt.getTime() + oneDayInMilliseconds)

  // Format the new date as needed
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  const formattedNewDate = newDate.toLocaleDateString('en-US', options)

  return formattedNewDate
}

const toggleModal = (orderId) => {
  const modal = document.getElementById(`modal_${orderId}`)

  if (modal) {
    modal.classList.toggle('hidden')
  }
  if (modal) {
    document.body.classList.toggle('overflow-y-hidden')
  } else {
    document.body.classList.add('overflow-y-hidden')
  }
}

onMounted(async () => {
  let Script = document.createElement('script')
  Script.setAttribute('src', 'https://app.sandbox.midtrans.com/snap/snap.js')
  Script.setAttribute('data-client-key', import.meta.VUE_APP_MIDTRANS_CLIENT_KEY)
  document.head.appendChild(Script)
  await fetchKantin()
})
</script>

<template>
  <div v-for="order in orders" :key="order.id" class="col-span-2">
    <!-- card -->
    <div
      class="block pt-2 px-2 bg-white border shadow-lg border-gray-200 rounded-lg hover:bg-gray-100 relative"
      @click="toggleModal(order.id)"
    >
      <div class="w-full h-10 flex justify-between items-center">
        <p class="text-sm text-slate-500">#{{ order.unique_string }}</p>
        <p class="text-sm text-slate-500">{{ order.created_at }}</p>
      </div>
      <p
        class="text-black font-semibold"
        v-if="Object.keys(categorizedBarangs(order.order_barangs)).length >= 2"
      >
        {{
          excerpt(categorizedBarangs(order.order_barangs)[0].kantin_nama) +
          ' & ' +
          excerpt(categorizedBarangs(order.order_barangs)[1].kantin_nama)
        }}
      </p>
      <p class="text-black font-semibold" v-else>
        {{ categorizedBarangs(order.order_barangs)[0].kantin_nama }}
      </p>
      <div class="w-full flex items-center justify-between">
        <div
          class="w-[50%] ml-10 relative my-3"
          @click.stop
          :class="order.order_barangs.length == 1 ? 'ml-[-88px]' : ''"
        >
          <vueper-slides
            class="no-shadow"
            :visible-slides="2"
            :arrows="true"
            :bullets="false"
            :gap="2"
            :slide-ratio="1 / 2"
            :dragging-distance="20"
          >
            <template #arrow-left>
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                transform="rotate(180)"
                class="-mr-10"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#000000"
                    d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z"
                  ></path>
                </g>
              </svg>
            </template>

            <template #arrow-right>
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                class="-ml-10"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#000000"
                    d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0z"
                  ></path>
                </g>
              </svg>
            </template>
            <vueper-slide
              v-for="barang in order.order_barangs"
              :key="barang.id"
              :style="{
                backgroundImage: `url(http://localhost:8000/storage/${barang.foto})`
              }"
            />
          </vueper-slides>
        </div>

        <div class="mr-5">
          <div class="flex w-full flex-col items-end">
            <p>{{ formatter.format(order.total_harga) }}</p>
            <p>{{ order.order_barangs.length }} menu</p>
          </div>
        </div>
      </div>
      <div
        class="w-full border-t-2 flex justify-end items-center pt-4 pb-2 mt-1"
        v-if="order.payment_status == 'pending'"
      >
        <button
          class="focus:outline-none -mt-2 mr-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          @click.stop="hapus(order.id)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 group"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                stroke="#FFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </button>
        <Button type="yellow" :text="isLoadingPay ? 'Loading' : 'Bayar'" @click.stop="pay(order)" />
      </div>
      <div class="w-full border-t-2 py-5" v-else></div>
    </div>
    <!-- modal -->
    <div
      :id="'modal_' + order.id"
      class="hidden bg-[rgba(0,0,0,0.5)] overflow-y-auto bg-overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 min-h-[calc(100%)]"
    >
      <div class="relative p-4 w-full max-w-xl mx-auto my-5">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Rincian Pesananmu</h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              @click="toggleModal(order.id)"
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
              <p class="pt-2 pb-1 text-lg font-semibold">Pesanan untuk :</p>
              <p class="text-slate-700 text-lg font-semibold">
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
              v-for="(categorizedOrder, index) in categorizedBarangs(order.order_barangs)"
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
              <div
                v-if="categorizedOrder.produkList[0].status == 'Gagal Dibuat'"
                class="flex flex-col items-center text-black"
              >
                <p class="text-red-600 text-lg font-semibold text-center mt-2">
                  Pesanan gagal karena penjual tidak merespon
                </p>
              </div>
              <p
                class="text-center text-lg font-semibold"
                v-else-if="categorizedOrder.produkList[0].status == 'Dibuat'"
              >
                Pesananmu sedang dibuat
              </p>
              <div
                class="flex flex-col items-center text-lg font-semibold"
                v-else-if="categorizedOrder.produkList[0].status == 'Selesai'"
              >
                <p class="text-center text-lg font-semibold">
                  Pesananmu <span class="text-green-400">selesai.</span>
                </p>
                <p
                  class="text-center text-lg font-semibold"
                  v-if="order.tipe_pengiriman == 'Antar'"
                >
                  Pesanan sedang diantar ke kamu.
                </p>
                <p
                  v-else-if="order.tipe_pengiriman == 'Ambil'"
                  class="text-center text-lg font-semibold"
                >
                  Kamu udah bisa ambil sekarang.
                </p>
              </div>
              <div
                v-else-if="categorizedOrder.produkList[0].status == 'Menunggu Konfirmasi'"
                class="flex flex-col items-center"
              >
                <p class="text-lg font-semibold">Menunggu konfirmasi penjual</p>
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
            <div
              class="w-full flex justify-end items-center pt-4 pb-2 mt-1"
              v-if="order.payment_status == 'pending'"
            >
              <button
                class="focus:outline-none -mt-2 mr-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                @click="hapus(order.id)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 group"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                      stroke="#FFF"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </button>
              <Button type="yellow" text="Bayar" @click.stop="pay(order)" />
            </div>
            <div
              v-else-if="order.status == 'Konfirmasi Pembeli'"
              class="w-full flex flex-col items-center mt-1"
            >
              <form
                :action="route.path"
                @submit.prevent="updateStatusUserSelesai(order.id)"
                class="w-full"
              >
                <button
                  type="submit"
                  class="hover:bg-[#FFB000] w-full hover:text-white rounded-lg text-center py-2 text-xl transition-all duration-150 ease-in"
                >
                  Konfirmasi Pesanan
                </button>
              </form>
              <p class="text-sm mt-3">
                Pesanan akan otomatis dikonfirmasi pada {{ deadlineKonfirmasi(order.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

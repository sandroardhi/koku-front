<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/common/Navbar.vue'
import Button from '../components/common/Button.vue'
import Alert from '../components/common/Alert.vue'
import { useKeranjangStore } from '@/stores/keranjang'
import { useAuthStore } from '@/stores/auth'
import { useOrderRepository } from '@/composables/useOrderRepository'
import { useAuthRepository } from '@/composables/useAuthRepository'

const authStore = useAuthStore()
const keranjangStore = useKeranjangStore()
const auth_repository = useAuthRepository()
const order_repository = useOrderRepository()
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const isLoadingProduct = ref({})
const keranjang = ref({})
const totalHarga = ref(keranjangStore.getTotalHarga)
const kantin = ref({})
const tujuans = ref([])

const fetchKeranjangData = async () => {
  isLoading.value = true
  try {
    keranjang.value = JSON.parse(keranjangStore.getProduk)
    console.log(keranjang.value)
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const fetchKantinName = async () => {
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

const fetchTujuans = async () => {
  isLoading.value = true
  try {
    const { data } = await auth_repository.tujuan()
    tujuans.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const organizedProducts = computed(() => {
  const kantinsMap = {}

  let productsArray = []

  if (Array.isArray(keranjang.value)) {
    productsArray = keranjang.value
  } else if (typeof keranjang.value === 'object') {
    productsArray = Object.values(keranjang.value)
  }

  productsArray.forEach((product) => {
    const kantinId = product.kantin_id
    if (kantinId) {
      if (!kantinsMap[kantinId]) {
        kantinsMap[kantinId] = {
          kantin_nama: kantin.value[kantinId],
          id: kantinId,
          produkList: []
        }
      }
      kantinsMap[kantinId].produkList.push(product)
    }
  })

  // Convert the kantinsMap object into an array
  const organizedProductsArray = Object.values(kantinsMap)

  return organizedProductsArray
})

const incrementKuantitas = async (productId) => {
  isLoadingProduct.value[productId] = true
  try {
    const data = {
      produk_id: productId,
      action: 'increment'
    }
    await keranjangStore.updateKuantitas(data)
    await keranjangStore.getCartData()
  } catch (e) {
    console.log(e)
  } finally {
    isLoadingProduct.value[productId] = false
  }
}

const decrementKuantitas = async (productId) => {
  isLoadingProduct.value[productId] = true
  try {
    const data = {
      produk_id: productId,
      action: 'decrement'
    }
    await keranjangStore.updateKuantitas(data)
    await keranjangStore.getCartData()
  } catch (e) {
    console.log(e)
  } finally {
    isLoadingProduct.value[productId] = false
  }
}

function findProductById(productId) {
  const products = JSON.parse(keranjangStore.getProduk)

  if (products === null) return null
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      return products[i]
    }
  }

  return null
}

const deleteProduct = async (product_id) => {
  isLoadingProduct.value[product_id] = true
  try {
    const data = {
      produk_id: parseInt(product_id)
    }
    await keranjangStore.deleteCartProduct(data)
    await keranjangStore.getCartData()
  } catch (e) {
    console.log(e)
  } finally {
    router.go()
  }
}

// checkout logic
const selectedPengiriman = ref('')
const selectedTujuan = ref('')
const catatan = ref('')
const ongkir = ref(0)
const selectedPembayaran = ref('')
const dropdownPengiriman = ref(false)
const dropdownTujuan = ref(false)
const dropdownPembayaran = ref(false)
const kosong = ref(null)
const isLoadingPay = ref(false)

const toggleDropdownTipePembayaran = () => {
  dropdownPembayaran.value = !dropdownPembayaran.value
}
const selectPembayaran = (option) => {
  selectedPembayaran.value = option
  dropdownPembayaran.value = false
}

const toggleDropdownTipePengiriman = () => {
  dropdownPengiriman.value = !dropdownPengiriman.value
}
const selectPengiriman = (option) => {
  selectedPengiriman.value = option
  if (option == 'Antar') {
    ongkir.value = 2000
  } else {
    ongkir.value = 0
  }
  dropdownPengiriman.value = false
}

const toggleDropdownTujuan = () => {
  dropdownTujuan.value = !dropdownTujuan.value
}

const selectTujuan = (option) => {
  selectedTujuan.value = option
  dropdownTujuan.value = false
}

const alertToggle = () => {
  kosong.value = null
}

const checkout = async () => {
  if (selectedPengiriman.value == 'Antar' && selectedTujuan.value == '') {
    return (kosong.value = 'Isi tujuan pesananmu dulu')
  }
  if (selectedPembayaran.value == '' || selectedPengiriman.value == '') {
    if (selectedPembayaran.value == '') {
      return (kosong.value = 'Isi tipe pembayaran dulu')
    } else if (selectedPengiriman.value == '') {
      return (kosong.value = 'Isi tipe pengiriman dulu')
    } else {
      return (kosong.value = 'Isi tipe pengiriman dan pembayaran dulu')
    }
  }

  isLoadingPay.value = true
  await authStore.csrf()
  try {
    const data = {
      produkData: keranjang.value,
      totalHarga: totalHarga.value,
      tipePembayaran: selectedPembayaran.value,
      tipePengiriman: selectedPengiriman.value,
      tujuan: selectedTujuan.value,
      catatan: catatan.value,
      ongkir: ongkir.value,
      keranjang_id: keranjang.value[0].pivot.keranjang_id
    }
    if (selectedPembayaran.value == 'Online') {
      await order_repository
        .payAndCreateOrder(data)
        .then(async (response) => {
          localStorage.setItem('produk', [])
          localStorage.setItem('keranjang', {})

          const data = response.data
          // eslint-disable-next-line no-undef
          snap.pay(data.snap_token.snap_token, {
            onSuccess: function () {
              window.location.href = '/pesanan/berlangsung'
            },
            onPending: function () {
              window.location.href = '/pesanan'
            },
            onClose: function () {
              window.location.href = '/pesanan'
            }
          })
        })
        .catch((error) => {
          console.error('Error during Axios request:', error)
        })
    } else {
      await order_repository
        .payAndCreateOrder(data)
        .then(async () => {
          localStorage.setItem('produk', [])
          localStorage.setItem('keranjang', {})

          window.location.href = '/pesanan/berlangsung'
        })
        .catch((error) => {
          console.error('Error during Axios request:', error)
        })
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingPay.value = false
  }
}

// end of checkout logic

watch(
  () => keranjangStore.getTotalHarga,
  (newTotalHarga) => {
    totalHarga.value = newTotalHarga
  }
)

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})
function isObjectNotEmpty(obj) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return true // Object has at least one property, not empty
    }
  }
  return false // Object is empty
}

onMounted(async () => {
  let Script = document.createElement('script')
  Script.setAttribute('src', 'https://app.sandbox.midtrans.com/snap/snap.js')
  Script.setAttribute('data-client-key', import.meta.VUE_APP_MIDTRANS_CLIENT_KEY)
  document.head.appendChild(Script)
  await fetchKeranjangData()
  fetchKantinName()
  fetchTujuans()
})
</script>

<template>
  <Navbar />
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
    <p class="text-5xl mb-3">Keranjang</p>
  </div>
  <div class="w-[80%] mx-auto p-4 mb-10 flex justify-center">
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
      <div v-if="isObjectNotEmpty(keranjang)">
        <div v-for="kantin in organizedProducts" :key="kantin.id">
          <h2
            class="w-full h-10 mt-5 flex justify-start items-center text-2xl border-b font-semibold break-all"
          >
            {{ kantin.kantin_nama }}
          </h2>
          <ul>
            <li v-for="product in kantin.produkList" :key="product.id">
              <div class="w-full py-4 flex justify-between items-center text-lg border-b relative">
                <div
                  v-if="isLoadingProduct[product.id]"
                  class="w-full top-0 absolute h-[2px] overflow-hidden bg-gray-300 rounded-full mx-auto before:content-[''] before:absolute before:left-[-50%] before:bg-yellow-300 before:h-[2px] before:w-40% before:animate-lineAnim before:rounded-full"
                ></div>
                <div class="flex space-x-5">
                  <img
                    v-if="product.foto == 'default.jpg'"
                    class="object-contain rounded-lg w-20 h-20 bg-white to-transparent"
                    src="../../public/images/default.jpg"
                    alt="Foto product.."
                  />
                  <img
                    v-else
                    :src="`http://localhost:8000/storage/${product.foto}`"
                    class="object-contain rounded-lg w-20 h-20 bg-white to-transparent"
                    alt="Foto product.."
                  />
                  <div class="flex justify-around flex-col w-full">
                    <p class="text-[20px] font-semibold">{{ product.nama }}</p>
                    <p class="w-[600px]">{{ product.deskripsi }}</p>
                  </div>
                </div>
                <div class="flex justify-center items-center">
                  <div class="flex flex-col justify-center space-y-4 items-center border-r">
                    <p class="text-[20px] font-semibold">{{ formatter.format(product.harga) }}</p>
                    <div class="w-[180px] flex justify-around items-center">
                      <button
                        @click="decrementKuantitas(product.id)"
                        class="w-7 h-7 rounded-lg bg-yellow-300"
                      >
                        -
                      </button>
                      {{ findProductById(product.id).pivot.kuantitas }}
                      <button
                        @click="incrementKuantitas(product.id)"
                        class="w-7 h-7 rounded-lg bg-yellow-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div class="ml-3">
                    <button @click="deleteProduct(product.id)">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-10 h-10 group"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="group-hover:stroke-red-600 duration-100 ease"
                          ></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="w-full flex items-center justify-between mt-5">
          <div class="w-full flex items-center">
            <div>
              <div class="relative w-48 mb-2">
                <div
                  @click="toggleDropdownTipePengiriman"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {{ selectedPengiriman ? selectedPengiriman : 'Pilih tipe pengiriman' }}
                </div>
                <ul
                  v-if="dropdownPengiriman"
                  class="absolute w-full mt-1 bg-white border rounded border-gray-300 shadow z-10"
                >
                  <li
                    @click="selectPengiriman('Antar')"
                    class="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  >
                    Antar
                  </li>
                  <li
                    @click="selectPengiriman('Pick-up')"
                    class="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  >
                    Pick up (ambil)
                  </li>
                </ul>
              </div>
              <div class="relative w-48" v-if="selectedPengiriman == 'Antar'">
                <div
                  @click="toggleDropdownTujuan"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {{ selectedTujuan ? selectedTujuan : 'Pilih tujuan' }}
                </div>
                <ul
                  v-if="dropdownTujuan"
                  class="absolute w-full mt-1 bg-white border rounded border-gray-300 shadow"
                >
                  <li
                    v-for="(option, index) in tujuans"
                    :key="index"
                    @click="selectTujuan(option.tujuan)"
                    class="py-2 px-3 cursor-pointer hover:bg-gray-100"
                  >
                    {{ option.tujuan }}
                  </li>
                  <li class="py-2 px-3 flex items-center cursor-pointer">
                    <router-link to="/tujuan"> Tambah tujuan </router-link>
                    <svg
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                      fill="#000000"
                      class="w-4 h-4 ml-2 mt-1"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>plus-circle</title>
                        <desc>Created with Sketch Beta.</desc>
                        <defs></defs>
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                          sketch:type="MSPage"
                        >
                          <g
                            id="Icon-Set"
                            sketch:type="MSLayerGroup"
                            transform="translate(-464.000000, -1087.000000)"
                            fill="#000000"
                          >
                            <path
                              d="M480,1117 C472.268,1117 466,1110.73 466,1103 C466,1095.27 472.268,1089 480,1089 C487.732,1089 494,1095.27 494,1103 C494,1110.73 487.732,1117 480,1117 L480,1117 Z M480,1087 C471.163,1087 464,1094.16 464,1103 C464,1111.84 471.163,1119 480,1119 C488.837,1119 496,1111.84 496,1103 C496,1094.16 488.837,1087 480,1087 L480,1087 Z M486,1102 L481,1102 L481,1097 C481,1096.45 480.553,1096 480,1096 C479.447,1096 479,1096.45 479,1097 L479,1102 L474,1102 C473.447,1102 473,1102.45 473,1103 C473,1103.55 473.447,1104 474,1104 L479,1104 L479,1109 C479,1109.55 479.447,1110 480,1110 C480.553,1110 481,1109.55 481,1109 L481,1104 L486,1104 C486.553,1104 487,1103.55 487,1103 C487,1102.45 486.553,1102 486,1102 L486,1102 Z"
                              id="plus-circle"
                              sketch:type="MSShapeGroup"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <form :action="route.path" class="ml-5">
                <div class="relative z-0">
                  <input
                    type="text"
                    id="floating_standard"
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    autocomplete="off"
                    v-model="catatan"
                  />
                  <label
                    for="floating_standard"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                    >Catatan</label
                  >
                </div>
              </form>
            </div>
          </div>
          <div>
            <div class="relative w-48 mb-2">
              <div
                @click="toggleDropdownTipePembayaran"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {{ selectedPembayaran ? selectedPembayaran : 'Pilih tipe Pembayaran' }}
              </div>
              <ul
                v-if="dropdownPembayaran"
                class="absolute w-full mt-1 bg-white border rounded border-gray-300 shadow z-10"
              >
                <li
                  @click="selectPembayaran('Cash')"
                  class="py-2 px-3 cursor-pointer hover:bg-gray-100"
                >
                  Cash
                </li>
                <li
                  @click="selectPembayaran('Online')"
                  class="py-2 px-3 cursor-pointer hover:bg-gray-100"
                >
                  Online Payment
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="w-full flex items-center justify-between mt-5" v-if="kosong !== null">
          <Alert
            type="danger"
            :message="kosong"
            :alertToggle="() => alertToggle()"
            dismissable
            class="w-full"
          />
        </div>
        <div class="w-full flex items-center justify-between mt-5">
          <div v-if="ongkir == 2000" class="w-[200px]">
            <div class="flex w-full justify-between">
              <p class="text-sm">Ongkir:</p>
              <p class="text-sm">{{ formatter.format(ongkir) }}</p>
            </div>
            <div class="flex w-full justify-between">
              <p class="text-sm">Subtotal:</p>
              <p class="text-sm">{{ formatter.format(totalHarga) }}</p>
            </div>
            <div class="w-full flex justify-between">
              <p>Total:</p>
              <p class="text-xl">{{ formatter.format(totalHarga + ongkir) }}</p>
            </div>
          </div>
          <div v-else class="w-[200px]">
            <div class="flex w-full justify-between">
              <p>Subtotal:</p>
              <p class="text-xl">{{ formatter.format(totalHarga) }}</p>
            </div>
          </div>
          <div>
            <Button type="yellow" :text="isLoadingPay ? 'Loading..' : 'Checkout'" @click="checkout" />
          </div>
        </div>
      </div>
      <div v-else>
        <h2
          class="w-full h-10 mt-5 flex justify-center items-center text-2xl border-b py-10 font-semibold break-all"
        >
          Belum ada produk apapun dikeranjangmu!
        </h2>
      </div>
    </div>
  </div>
</template>

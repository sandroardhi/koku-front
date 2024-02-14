<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/common/Navbar.vue'
import Button from '../components/common/Button.vue'
import { useKantinRepository } from '@/composables/useKantinRepository'
import { useKeranjangStore } from '@/stores/keranjang'

const keranjangStore = useKeranjangStore()

const kantin_repository = useKantinRepository()

const isLoading = ref(false)
const isLoadingProduct = ref({})
const route = useRoute()
const kantin = ref({})

const fetchKantin = async () => {
  isLoading.value = true
  try {
    const kantinId = route.params.id
    const { data } = await kantin_repository.show(kantinId)
    kantin.value = data
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
}

const addToCart = async (productId) => {
  isLoadingProduct.value[productId] = true
  try {
    const data = {
      productId: productId
    }
    await keranjangStore.addToCart(data)
  } catch (e) {
    console.log(e)
  } finally {
    isLoadingProduct.value[productId] = false
  }
}

const incrementKuantitas = async (productId) => {
  isLoadingProduct.value[productId] = true
  try {
    const data = {
      produk_id: productId,
      action: 'increment'
    }
    await keranjangStore.updateKuantitas(data)
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

const categorizedProducts = computed(() => {
  const categoriesMap = {}

  if (kantin.value.produks) {
    kantin.value.produks.forEach((product) => {
      const kategori = product.kategori
      if (kategori) {
        const kategoriId = kategori.id
        if (!categoriesMap[kategoriId]) {
          categoriesMap[kategoriId] = {
            kategori_id: kategoriId,
            nama: kategori.nama,
            produkList: []
          }
        }
        categoriesMap[kategoriId].produkList.push(product)
      }
    })
  }

  // Convert the map to an array
  return Object.values(categoriesMap)
})

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})

onMounted(async () => {
  await fetchKantin()
})
</script>

<template>
  <Navbar />
  <div class="w-[80%] mx-auto p-4 mb-10">
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
    <div v-else>
      <p class="text-5xl mb-5">{{ kantin.nama }}</p>
      <div class="w-full h-60 flex justify-center items-center border rounded-lg">
        <img
          v-if="kantin.foto == 'default.jpg'"
          class="object-contain rounded-lg w-full h-[238px] bg-white to-transparent"
          src="../../public/images/default.jpg"
          alt="Foto Kantin.."
        />
        <img
          v-else
          :src="`http://localhost:8000/storage/${kantin.foto}`"
          class="object-contain rounded-lg w-full h-[238px] bg-white to-transparent"
          alt="Foto Kantin.."
        />
      </div>
      <p class="text-3xl mt-3">Mau makan apa hari ini?</p>
      <div v-for="category in categorizedProducts" :key="category.kategori_id">
        <h2
          class="w-full h-10 mt-5 flex justify-start items-center text-2xl border-b font-semibold"
        >
          {{ category.nama }}
        </h2>
        <ul>
          <li v-for="product in category.produkList" :key="product.id">
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
              <div
                class="flex flex-col justify-center space-y-4 items-center"
                v-if="product.stok > 0"
              >
                <p class="text-[20px] font-semibold">{{ formatter.format(product.harga) }}</p>
                <Button
                  v-if="findProductById(product.id) === null"
                  @click="addToCart(product.id)"
                  text="Tambah ke keranjang"
                  type="yellow"
                />
                <div v-else class="w-[180px] flex justify-around items-center">
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
                <p>Tersisa : {{ product.stok }}</p>
              </div>
              <div class="flex flex-col justify-center space-y-4 items-center mr-12" v-else>
                <p class="text-xl font-semibold text-red-700">Stok Habis</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

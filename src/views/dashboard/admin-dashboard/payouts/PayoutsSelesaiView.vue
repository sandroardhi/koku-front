<script setup>
import { ref, onMounted } from 'vue'
import Modal from '../../../../components/common/Modal.vue'
import Table from '../../../../components/common/Table.vue'
import { useDashboardRepository } from '@/composables/useDashboardRepository'

const dashboard_repository = useDashboardRepository()
const isLoading = ref()

const orders = ref([])

const fetchUangMasuk = async () => {
  isLoading.value = true
  try {
    const { data } = await dashboard_repository.uangMasukSelesaiAdmin()
    orders.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const groupedOrders = ref([])

const groupOrders = () => {
  const orderMap = {}

  // Iterate over the uang_selesai data
  orders.value.uang_selesai.forEach((order) => {
    order.forEach((uang) => {
      // console.log('uang_selesai', order)
      const kantinId = `${uang.kantin.id}-kantin`
      if (!orderMap[kantinId]) {
        orderMap[kantinId] = {
          harga: 0,
          unique_id: kantinId,
          nama: uang.kantin.nama,
          orders: [],
          tipe: 'Bayar Kantin'
        }
      }
      orderMap[kantinId].harga += uang.harga
      orderMap[kantinId].orders.push(uang)
    })
  })

  // Iterate over the uang_ongkir_selesai data
  orders.value.uang_ongkir_selesai.forEach((orders) => {
    orders.forEach((order) => {
      const pengantarId = `${order.pengantar_id}-pengantar`
      if (!orderMap[pengantarId]) {
        orderMap[pengantarId] = {
          harga: 0,
          nama: order.pengantar.name,
          unique_id: pengantarId,
          orders: [],
          tipe: 'Bayar Pengantar'
        }
      }
      orderMap[pengantarId].harga += order.ongkir
      orderMap[pengantarId].orders.push(order)
    })
  })

  // Iterate over the uang_refund data
  orders.value.uang_refunded.forEach((orders) => {
    orders.forEach((order) => {
      // console.log('uang_refund', order.harga)
      const userId = `${order.order.user_id}-refund`
      if (!orderMap[userId]) {
        orderMap[userId] = {
          harga: 0,
          unique_id: userId,
          nama: order.order.user.name,
          orders: [],
          tipe: 'Bayar Refund'
        }
      }
      orderMap[userId].harga += order.harga // Assuming order has a total_harga property
      orderMap[userId].orders.push(order)
    })
  })

  // Convert grouped orders back to array format
  groupedOrders.value = Object.values(orderMap)
}

const addHarga = (orders) => {
  const orderMap = {}
  // console.log(orders)
  const uniqueId = orders.unique_id // Assuming 'unique_id' is the unique identifier for each order
  const updatedAt = orders.updated_at // Assuming 'updated_at' is the timestamp for when the order was updated

  // Check if the orderMap already contains the unique identifier
  if (!orderMap[uniqueId]) {
    // If not, initialize the orderMap entry with an empty array for 'orders'
    orderMap[uniqueId] = {
      unique_id: uniqueId,
      updated_at: updatedAt,
      orders: []
    }
  }

  // Iterate over each order within the current 'orders' object
  orders.orders.forEach((individualOrder) => {
    const uniqueString = individualOrder.unique_string || individualOrder.order.unique_string
    const existingOrderIndex = orderMap[uniqueId].orders.findIndex(
      (order) => order.unique_string === uniqueString
    )

    if (existingOrderIndex !== -1) {
      // If the order already exists in the 'orders' array, update its total price
      orderMap[uniqueId].orders[existingOrderIndex].totalHarga += individualOrder.harga
    } else {
      // If the order does not exist, add it to the 'orders' array
      orderMap[uniqueId].orders.push({
        unique_string: uniqueString,
        created_at: individualOrder.created_at,
        totalHarga: individualOrder.harga || individualOrder.ongkir
      })
    }
  })

  // Convert orderMap to an array of values
  return Object.values(orderMap)
}

const labels = [
  { id: 1, text: 'Nama Kantin', field: 'nama' },
  { id: 2, text: 'Total pembayaran', field: 'harga' },
  { id: 2, text: 'Tipe', field: 'tipe' }
]

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})

onMounted(async () => {
  await fetchUangMasuk()
  groupOrders()
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
    <div v-if="groupedOrders.length !== 0" class="w-full">
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
            :button-type="'Blue'"
            :max-width-modal="'xl'"
          >
            <template #modalBody>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2" v-for="item in addHarga(item)" :key="item.id">
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
                          tanggal dibayar
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
                          <p>{{ formatter.format(item.totalHarga) }}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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

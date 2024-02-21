<script setup>
defineProps({
  orders: {
    type: Array,
    default: undefined
  }
})
</script>

<template>
  <div class="relative overflow-x-auto">
    <table class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead
        class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">ORDER ID</th>
          <th scope="col" class="px-6 py-3">TANGGAL</th>
          <th scope="col" class="px-6 py-3">TOTAL PEMBAYARAN</th>
          <th scope="col" class="px-6 py-3">STATUS</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          v-for="order in groupedOrders"
          :key="order.id"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            <p class="text-gray-600">#{{ order.orders[0].order.unique_string }}</p>
          </th>
          <td class="px-6 py-4">
            <p>{{ stringDate(order.orders[0].updated_at) }}</p>
          </td>
          <td class="px-6 py-4">
            <p>{{ formatter.format(order.totalHarga) }}</p>
          </td>
          <td class="px-6 py-4">
            <p v-if="order.orders[0].status_uang == 'Sukses'">Sedang diproses oleh admin</p>
            <div v-else-if="order.orders[0].status_uang == 'Selesai'">
              <div class="w-full flex" v-if="order.orders[0].order.tipe_pembayaran == 'Online'">
                <p class="text-green-600 font-semibold">Sudah dibayar</p>
              </div>
              <div
                class="w-full flex justify-center"
                v-else-if="order.orders[0].order.tipe_pembayaran == 'Cash'"
              >
                <p class="text-green-600 font-semibold">Order ini dibayar menggunakan cash</p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

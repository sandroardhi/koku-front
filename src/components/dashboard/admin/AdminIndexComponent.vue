<script setup>
import { ref, onMounted } from 'vue'
import Modal from '../../../components/common/Modal.vue'
import Table from '../../../components/common/Table.vue'
import { useDashboardRepository } from '@/composables/useDashboardRepository'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const dashboard_repository = useDashboardRepository()
const isLoading = ref(false)
const isLoadingDashboard = ref(false)

const orders = ref([])
const uang_dashboard = ref({})

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

const adminDashboard = async () => {
  isLoadingDashboard.value = true
  try {
    const { data } = await dashboard_repository.dashboardAdmin()
    uang_dashboard.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoadingDashboard.value = false
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

const groupUniqueString = (orders) => {
  const orderMap = []

  orders.forEach((order) => {
    console.log(order)
    Object.values(order.orders || orders).forEach((item) => {
      orderMap.push(item)
    })
  })

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

const stringDate = (updated_at) => {
  const updatedAtDate = new Date(updated_at)

  // Format the date as desired
  const formattedDate = updatedAtDate.toLocaleString() // Adjust this according to your desired format

  return formattedDate
}

const addTotalHarga = (orders) => {
  let totalHarga = 0

  Object.values(orders).forEach((order) => {
    totalHarga += order.harga
    // console.log('p', order)
  })

  return totalHarga
}

const testHtml = ref(null)

const donwloadPDF = () => {
  var doc = new jsPDF({
    orientation: 'l',
    unit: 'px',
    format: 'a4',
    precision: 2,
    hotfixes: ['px_scaling']
  })

  html2canvas(testHtml.value, {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight()
  }).then((canvas) => {
    const img = canvas.toDataURL('image/png')

    doc.addImage(
      img,
      'PNG',
      40,
      40,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    )
    doc.save('p&lstatement.pdf')
  })
}

onMounted(async () => {
  adminDashboard()
  await fetchUangMasuk()
  groupOrders()
  // addHarga()
  // console.log(addedHarga.value)
})
</script>
<template>
  <div class="w-full relative">
    <div class="w-full h-[150px] grid grid-cols-3 gap-4">
      <div class="col-span-1 bg-white rounded-lg shadow-lg relative p-5 overflow-hidden">
        <svg
          fill="#000000"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          class="w-36 h-w-36 absolute top-0 -right-14"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <title>moneybag</title>
            <path
              d="M14.017 9.302h3.934v-1.476h-3.934v1.476zM17.922 9.793h-3.905c0 0-6.425 6.333-6.425 12.542 0 6.579 6.732 7.102 6.732 7.102s2.008 0.333 3.257 0c0 0 6.826-0.8 6.826-7.070 0.001-6.272-6.485-12.574-6.485-12.574zM18.211 23.123c-0.158 0.32-0.371 0.588-0.643 0.802-0.271 0.215-0.588 0.376-0.949 0.484-0.046 0.014-0.096 0.019-0.143 0.031v1.092h-0.983v-0.964c-0.012 0.001-0.024 0.003-0.036 0.003-0.279 0-0.538-0.022-0.778-0.067s-0.45-0.101-0.634-0.164c-0.184-0.064-0.337-0.131-0.459-0.201s-0.212-0.132-0.266-0.186c-0.055-0.054-0.093-0.132-0.116-0.234-0.022-0.103-0.034-0.249-0.034-0.441 0-0.129 0.004-0.237 0.013-0.325s0.021-0.158 0.041-0.213c0.019-0.055 0.043-0.093 0.074-0.116 0.031-0.022 0.068-0.034 0.109-0.034 0.059 0 0.141 0.034 0.247 0.103s0.242 0.145 0.409 0.228c0.167 0.084 0.365 0.159 0.597 0.229 0.231 0.068 0.499 0.103 0.803 0.103 0.2 0 0.379-0.024 0.537-0.072s0.293-0.115 0.403-0.203c0.111-0.088 0.195-0.196 0.253-0.325 0.059-0.13 0.088-0.273 0.088-0.433 0-0.183-0.051-0.34-0.15-0.472-0.1-0.131-0.231-0.247-0.391-0.35-0.16-0.102-0.342-0.197-0.546-0.287s-0.415-0.185-0.631-0.284c-0.217-0.1-0.427-0.213-0.631-0.341-0.204-0.127-0.387-0.278-0.547-0.455s-0.29-0.387-0.391-0.628c-0.1-0.241-0.149-0.531-0.149-0.868 0-0.388 0.072-0.728 0.215-1.021s0.338-0.537 0.581-0.73c0.244-0.193 0.531-0.338 0.862-0.434 0.17-0.049 0.346-0.085 0.526-0.108v-1.035h0.983v1.034c0.040 0.005 0.079 0.003 0.118 0.009 0.191 0.029 0.371 0.068 0.537 0.118s0.314 0.105 0.443 0.167 0.215 0.113 0.256 0.155c0.043 0.041 0.070 0.076 0.086 0.105 0.014 0.029 0.025 0.068 0.037 0.116 0.010 0.048 0.018 0.108 0.021 0.182 0.004 0.072 0.006 0.163 0.006 0.271 0 0.121-0.004 0.224-0.010 0.308-0.006 0.083-0.016 0.152-0.031 0.206-0.014 0.055-0.035 0.094-0.062 0.119s-0.062 0.037-0.109 0.037c-0.045 0-0.119-0.028-0.219-0.086-0.1-0.059-0.223-0.121-0.367-0.189-0.146-0.068-0.314-0.13-0.506-0.187-0.193-0.056-0.403-0.083-0.631-0.083-0.18 0-0.336 0.021-0.469 0.065-0.134 0.043-0.245 0.104-0.335 0.18-0.089 0.077-0.156 0.17-0.199 0.277-0.044 0.107-0.065 0.222-0.065 0.342 0 0.18 0.049 0.335 0.146 0.466s0.229 0.248 0.394 0.35c0.164 0.103 0.351 0.198 0.56 0.287 0.208 0.090 0.42 0.185 0.637 0.284 0.217 0.101 0.428 0.214 0.637 0.341s0.395 0.279 0.557 0.456 0.293 0.385 0.393 0.624c0.1 0.24 0.15 0.521 0.15 0.847-0.001 0.422-0.081 0.794-0.239 1.115zM17.891 7.334l1.998-4.919c0 0-1.26 1.046-1.998 1.046s-1.907-1.015-1.907-1.015-1.26 1.015-1.998 1.015c-0.737 0-1.937-0.984-1.937-0.984l2.029 4.857h3.813z"
            ></path>
          </g>
        </svg>
        <p class="text-xl">Rp.</p>
        <p class="text-4xl mt-3 font-semibold" v-if="isLoadingDashboard">...</p>
        <p class="text-4xl mt-3 font-semibold" v-else>
          {{ formatter.format(uang_dashboard.bayarPenjual) }}
        </p>
        <p class="text-xl mt-3">harus dibayar ke penjual hari ini</p>
      </div>
      <div class="col-span-1 bg-white rounded-lg shadow-lg relative p-5 overflow-hidden">
        <svg
          version="1.1"
          id="_x32_"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xml:space="preserve"
          fill="#000000"
          class="w-32 h-32 absolute top-0 -right-3"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                class="st0"
                d="M447.77,33.653c-36.385-5.566-70.629,15.824-82.588,49.228h-44.038v37.899h40.902 c5.212,31.372,29.694,57.355,62.855,62.436c41.278,6.316,79.882-22.042,86.222-63.341C517.428,78.575,489.07,39.969,447.77,33.653z "
              ></path>
              <path
                class="st0"
                d="M162.615,338.222c0-6.88-5.577-12.468-12.468-12.468H96.16c-6.891,0-12.467,5.588-12.467,12.468 c0,6.868,5.576,12.467,12.467,12.467h53.988C157.038,350.689,162.615,345.091,162.615,338.222z"
              ></path>
              <path
                class="st0"
                d="M392.999,237.965L284.273,340.452l-37.966,9.398v-86.619H0v215.996h246.307v-59.454l35.547-5.732 c16.95-2.418,29.396-6.692,44.336-15.018l46.302-24.228v104.432h132.435V270.828C504.927,202.618,428.016,202.43,392.999,237.965z M215.996,448.913H30.313v-155.37h185.683v63.805l-36.419,9.01c-15.968,4.395-25.708,20.518-22.174,36.696l0.298,1.247 c3.478,15.912,18.651,26.436,34.785,24.14l23.51-3.788V448.913z"
              ></path>
            </g>
          </g>
        </svg>
        <p class="text-xl">Rp.</p>
        <p class="text-4xl mt-3 font-semibold" v-if="isLoadingDashboard">...</p>
        <p class="text-4xl mt-3 font-semibold" v-else>
          {{ formatter.format(uang_dashboard.bayarPengantar) }}
        </p>
        <p class="text-xl mt-3">harus dibayar ke pengantar hari ini</p>
      </div>
      <div class="col-span-1 bg-white rounded-lg shadow-lg relative p-5 overflow-hidden">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          class="w-32 h-32 absolute top-2 -right-10"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 0 1-6.383-2.302l-.244-.209.902-1.902a8 8 0 1 0-2.27-5.837l-.005.25h2.5l-2.706 5.716A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2zm1 4v2h2.5v2H10a.5.5 0 0 0-.09.992L10 11h4a2.5 2.5 0 1 1 0 5h-1v2h-2v-2H8.5v-2H14a.5.5 0 0 0 .09-.992L14 13h-4a2.5 2.5 0 1 1 0-5h1V6h2z"
              ></path>
            </g>
          </g>
        </svg>
        <p class="text-xl">Rp.</p>
        <p class="text-4xl mt-3 font-semibold" v-if="isLoadingDashboard">...</p>
        <p class="text-4xl mt-3 font-semibold" v-else>
          {{ formatter.format(uang_dashboard.bayarRefund) }}
        </p>
        <p class="text-xl mt-3">harus direfund ke user hari ini</p>
      </div>
    </div>
    <div class="w-full min-h-[300px] bg-white rounded-lg shadow-lg mt-7 p-5">
      <div class="w-full flex justify-between items-center mb-3">
        <p class="text-2xl">Pembayaran yang dilakukan</p>
        <div
          @click="donwloadPDF"
          v-if="!isLoading"
          class="p-2 bg-red-500 rounded-lg font-semibold text-white hover:text-red-500 flex items-center cursor-pointer group hover:bg-white border-2 border-white hover:border-red-500 transition"
        >
          <p>Download PDF</p>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6 ml-2">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V11C19 11.5523 19.4477 12 20 12C20.5523 12 21 11.5523 21 11V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM10.3078 23.5628C10.4657 23.7575 10.6952 23.9172 10.9846 23.9762C11.2556 24.0316 11.4923 23.981 11.6563 23.9212C11.9581 23.8111 12.1956 23.6035 12.3505 23.4506C12.5941 23.2105 12.8491 22.8848 13.1029 22.5169C14.2122 22.1342 15.7711 21.782 17.287 21.5602C18.1297 21.4368 18.9165 21.3603 19.5789 21.3343C19.8413 21.6432 20.08 21.9094 20.2788 22.1105C20.4032 22.2363 20.5415 22.3671 20.6768 22.4671C20.7378 22.5122 20.8519 22.592 20.999 22.6493C21.0755 22.6791 21.5781 22.871 22.0424 22.4969C22.3156 22.2768 22.5685 22.0304 22.7444 21.7525C22.9212 21.4733 23.0879 21.0471 22.9491 20.5625C22.8131 20.0881 22.4588 19.8221 22.198 19.6848C21.9319 19.5448 21.6329 19.4668 21.3586 19.4187C21.11 19.3751 20.8288 19.3478 20.5233 19.3344C19.9042 18.5615 19.1805 17.6002 18.493 16.6198C17.89 15.76 17.3278 14.904 16.891 14.1587C16.9359 13.9664 16.9734 13.7816 17.0025 13.606C17.0523 13.3052 17.0824 13.004 17.0758 12.7211C17.0695 12.4497 17.0284 12.1229 16.88 11.8177C16.7154 11.4795 16.416 11.1716 15.9682 11.051C15.5664 10.9428 15.1833 11.0239 14.8894 11.1326C14.4359 11.3004 14.1873 11.6726 14.1014 12.0361C14.0288 12.3437 14.0681 12.6407 14.1136 12.8529C14.2076 13.2915 14.4269 13.7956 14.6795 14.2893C14.702 14.3332 14.7251 14.3777 14.7487 14.4225C14.5103 15.2072 14.1578 16.1328 13.7392 17.0899C13.1256 18.4929 12.4055 19.8836 11.7853 20.878C11.3619 21.0554 10.9712 21.2584 10.6746 21.4916C10.4726 21.6505 10.2019 21.909 10.0724 22.2868C9.9132 22.7514 10.0261 23.2154 10.3078 23.5628ZM11.8757 23.0947C11.8755 23.0946 11.8775 23.0923 11.8824 23.0877C11.8783 23.0924 11.8759 23.0947 11.8757 23.0947ZM16.9974 19.5812C16.1835 19.7003 15.3445 19.8566 14.5498 20.0392C14.9041 19.3523 15.2529 18.6201 15.5716 17.8914C15.7526 17.4775 15.9269 17.0581 16.0885 16.6431C16.336 17.0175 16.5942 17.3956 16.8555 17.7681C17.2581 18.3421 17.6734 18.911 18.0759 19.4437C17.7186 19.4822 17.3567 19.5287 16.9974 19.5812ZM16.0609 12.3842C16.0608 12.3829 16.0607 12.3823 16.0606 12.3823C16.0606 12.3822 16.0607 12.3838 16.061 12.3872C16.061 12.386 16.0609 12.385 16.0609 12.3842Z"
                fill="#FFF"
                class="group-hover:fill-[rgb(240,82,82)] transition"
              ></path>
            </g>
          </svg>
        </div>
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
      <div v-else class="w-full">
        <div v-if="groupedOrders.length !== 0" class="w-full">
          <div ref="testHtml" class="w-full">
            <div class="relative overflow-x-auto">
              <table
                class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">ORDER ID</th>
                    <th scope="col" class="px-6 py-3">TANGGAL</th>
                    <th scope="col" class="px-6 py-3">STATUS</th>
                    <th scope="col" class="px-6 py-3">TOTAL PEMBAYARAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    v-for="order in groupUniqueString(groupedOrders)"
                    :key="order.id"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p class="text-gray-600">
                        #{{ order.unique_string || order.order.unique_string }}
                      </p>
                    </th>
                    <td class="px-6 py-4">
                      <p>{{ stringDate(order.updated_at) }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <p
                        v-if="
                          order.status_ongkir == 'Sukses' ||
                          order.status_uang == 'Sukses' ||
                          order.status_uang == 'Refund'
                        "
                        class="font-semibold"
                      >
                        Belum Dibayar
                      </p>
                      <div
                        v-else-if="
                          order.status_ongkir == 'Selesai' ||
                          order.status_uang == 'Selesai' ||
                          order.status_uang == 'Refunded'
                        "
                      >
                        <div
                          class="w-full flex"
                          v-if="
                            order.tipe_pembayaran == 'Online' ||
                            order.order.tipe_pembayaran == 'Online'
                          "
                        >
                          <p class="text-green-600 font-semibold">Sudah dibayar</p>
                        </div>
                        <div
                          class="w-full flex justify-center"
                          v-else-if="order.tipe_pembayaran == 'Cash'"
                        >
                          <p class="text-green-600 font-semibold">
                            Order ini dibayar menggunakan cash
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p>{{ formatter.format(order.ongkir || order.harga) }}</p>
                    </td>
                  </tr>
                  <tr class="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4">{{ formatter.format(addTotalHarga(groupedOrders)) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- <Table
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
          </Table> -->
        </div>
        <div v-else class="w-full flex justify-center items-center">
          <p class="text-2xl font-medium">Tidak ada apapun disini...</p>
        </div>
      </div>
    </div>
  </div>
</template>

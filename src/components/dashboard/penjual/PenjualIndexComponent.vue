<script setup>
import { onMounted, ref, computed } from 'vue'
import { useDashboardRepository } from '@/composables/useDashboardRepository'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

const dashboard_repository = useDashboardRepository()
const isLoading = ref(false)
const isLoadingDashboard = ref(false)
const orders = ref([])
const uang_dashboard = ref({})

const penjualDashboard = async () => {
  isLoadingDashboard.value = true
  try {
    const { data } = await dashboard_repository.dashboardPenjual()
    uang_dashboard.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoadingDashboard.value = false
  }
}

const fetchUangMasuk = async () => {
  isLoading.value = true
  try {
    const { data } = await dashboard_repository.uangMasukPenjual()
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
    console.log(uang)
    const uniqueString = uang.order.unique_string
    if (!ordersMap[uniqueString]) {
      ordersMap[uniqueString] = {
        totalHarga: 0,
        orders: [],
        status_uang: uang.status_uang
      }
    }
    ordersMap[uniqueString].totalHarga += uang.harga
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

const stringDate = (updated_at) => {
  const updatedAtDate = new Date(updated_at)

  // Format the date as desired
  const formattedDate = updatedAtDate.toLocaleString() // Adjust this according to your desired format

  return formattedDate
}

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})
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

const addTotalHarga = (orders) => {
  let totalHarga = 0

  orders.forEach((order) => {
    totalHarga += order.totalHarga
  })

  return totalHarga
}

const selectedStatus = ref('Filter PDF')
const dropdownStatus = ref(false)

const toggleDropdownStatus = () => {
  dropdownStatus.value = !dropdownStatus.value
}

const selectStatus = (option) => {
  selectedStatus.value = option
  dropdownStatus.value = false
}

const filteredOrderSelesai = computed(() => {
  return groupedOrders.value.filter((order) => order.status_uang === 'Selesai')
})

const filteredOrderBelumDibayar = computed(() => {
  return groupedOrders.value.filter((order) => order.status_uang === 'Sukses')
})

onMounted(async () => {
  penjualDashboard()
  await fetchUangMasuk()
  groupedOrder()
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
          {{ formatter.format(uang_dashboard.uangMasuk) }}
        </p>
        <p class="text-xl mt-3">didapat hari ini</p>
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
          class="w-32 h-32 absolute -top-0 -right-8"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                class="st0"
                d="M276.508,389.928H69.71c-12.684,0-22.972,8.194-22.972,18.301v0.536c0,10.107,10.284,18.293,22.972,18.293 h206.798c12.692,0,22.98-8.186,22.98-18.293v-0.536C299.487,398.122,289.199,389.928,276.508,389.928z"
              ></path>
              <path
                class="st0"
                d="M97.89,283.859c-3.644,0-6.596,2.955-6.596,6.599c0,3.651,2.952,6.606,6.596,6.606 c3.651,0,6.61-2.955,6.61-6.606C104.501,286.814,101.541,283.859,97.89,283.859z"
              ></path>
              <path
                class="st0"
                d="M147.41,283.859c-3.648,0-6.608,2.955-6.608,6.599c0,3.651,2.96,6.606,6.608,6.606 c3.643,0,6.599-2.955,6.599-6.606C154.009,286.814,151.053,283.859,147.41,283.859z"
              ></path>
              <path
                class="st0"
                d="M124.301,264.054c-3.647,0-6.599,2.948-6.599,6.599c0,3.651,2.952,6.606,6.599,6.606 c3.644,0,6.599-2.955,6.599-6.606C130.9,267.002,127.945,264.054,124.301,264.054z"
              ></path>
              <path
                class="st0"
                d="M160.611,262.406c0,3.644,2.956,6.592,6.6,6.592c3.647,0,6.603-2.948,6.603-6.592 c0-3.651-2.956-6.599-6.603-6.599C163.567,255.808,160.611,258.755,160.611,262.406z"
              ></path>
              <path
                class="st0"
                d="M191.967,298.712c3.655,0,6.607-2.955,6.607-6.606c0-3.644-2.952-6.599-6.607-6.599 c-3.643,0-6.602,2.955-6.602,6.599C185.364,295.757,188.323,298.712,191.967,298.712z"
              ></path>
              <path
                class="st0"
                d="M213.427,277.185c3.644,0,6.595-2.963,6.595-6.614c0-3.644-2.952-6.6-6.595-6.6 c-3.647,0-6.607,2.956-6.607,6.6C206.82,274.222,209.78,277.185,213.427,277.185z"
              ></path>
              <path
                class="st0"
                d="M246.434,298.712c3.644,0,6.603-2.955,6.603-6.606c0-3.644-2.959-6.599-6.603-6.599 c-3.64,0-6.603,2.955-6.603,6.599C239.831,295.757,242.794,298.712,246.434,298.712z"
              ></path>
              <path
                class="st0"
                d="M301.577,365.195c0.707-0.204,1.519-0.34,2.627-0.34c4.55,0,8.243-3.688,8.243-8.247 c0-4.558-3.693-8.254-8.247-8.254c-2.907,0-5.662,0.446-8.153,1.27c-2.177,0.725-4.142,1.73-5.843,2.864 c-2.982,1.988-5.197,4.294-7.034,6.372c-1.38,1.565-2.562,3.024-3.647,4.249c-1.61,1.86-2.99,3.144-4.222,3.885 c-0.624,0.363-1.214,0.635-1.913,0.831c-0.695,0.197-1.519,0.333-2.615,0.333c-1.274,0-2.177-0.174-2.952-0.431 c-0.676-0.219-1.274-0.521-1.916-0.944c-1.115-0.726-2.358-1.92-3.787-3.545c-1.07-1.21-2.241-2.654-3.606-4.226 c-2.045-2.314-4.551-4.96-8.092-7.106c-1.761-1.074-3.772-1.981-5.983-2.608c-2.204-0.62-4.592-0.945-7.09-0.945 c-2.906,0-5.658,0.438-8.152,1.27c-2.181,0.725-4.139,1.73-5.84,2.864c-2.993,1.988-5.2,4.294-7.034,6.372 c-1.387,1.565-2.562,3.024-3.651,4.249c-1.621,1.86-2.982,3.144-4.218,3.885c-0.627,0.363-1.217,0.635-1.912,0.831 c-0.695,0.197-1.523,0.333-2.62,0.333c-1.277,0-2.176-0.174-2.948-0.431c-0.68-0.227-1.278-0.528-1.92-0.944 c-1.107-0.726-2.347-1.92-3.779-3.545c-1.078-1.21-2.242-2.654-3.606-4.211c-2.044-2.328-4.558-4.974-8.088-7.12 c-1.765-1.074-3.772-1.981-5.986-2.608c-2.204-0.62-4.596-0.953-7.09-0.945c-2.906-0.008-5.662,0.438-8.149,1.27 c-2.176,0.717-4.138,1.723-5.846,2.864c-2.982,1.988-5.193,4.286-7.038,6.372c-1.376,1.565-2.548,3.024-3.633,4.249 c-1.621,1.86-2.997,3.144-4.225,3.885c-0.62,0.363-1.209,0.635-1.908,0.831c-0.707,0.197-1.527,0.333-2.623,0.333 c-1.278,0-2.177-0.174-2.952-0.431c-0.673-0.227-1.274-0.528-1.908-0.952c-1.116-0.718-2.352-1.913-3.788-3.537 c-1.078-1.218-2.242-2.661-3.606-4.211c-2.045-2.328-4.558-4.974-8.096-7.12c-1.754-1.074-3.768-1.981-5.972-2.608 c-2.211-0.62-4.599-0.953-7.098-0.945c-2.906-0.008-5.654,0.438-8.152,1.27c-2.177,0.717-4.131,1.723-5.836,2.857 c-2.99,1.996-5.193,4.294-7.041,6.38c-1.38,1.565-2.555,3.024-3.632,4.249c-1.622,1.86-2.993,3.144-4.226,3.885 c-0.624,0.363-1.214,0.635-1.913,0.831c-0.703,0.197-1.519,0.325-2.615,0.333c-1.281-0.008-2.177-0.174-2.956-0.431 c-0.672-0.227-1.274-0.528-1.909-0.952c-1.112-0.726-2.358-1.905-3.78-3.537c-1.077-1.218-2.249-2.661-3.613-4.219 c-2.041-2.32-4.558-4.966-8.088-7.113c-1.758-1.074-3.768-1.981-5.98-2.608c-2.203-0.62-4.596-0.953-7.098-0.945 c-4.551,0-8.247,3.696-8.247,8.254c0,4.558,3.696,8.247,8.247,8.247c1.286,0,2.185,0.182,2.952,0.431 c0.68,0.234,1.274,0.53,1.916,0.953c1.108,0.725,2.348,1.904,3.784,3.538c1.07,1.209,2.242,2.66,3.602,4.218 c2.049,2.321,4.558,4.966,8.089,7.12c1.761,1.066,3.776,1.973,5.982,2.593c2.204,0.627,4.593,0.952,7.098,0.952 c2.899,0.008,5.65-0.438,8.145-1.262c2.176-0.734,4.138-1.732,5.836-2.866c2.989-1.988,5.2-4.308,7.044-6.38 c1.376-1.564,2.555-3.016,3.636-4.256c1.622-1.851,2.986-3.137,4.222-3.878c0.623-0.362,1.209-0.634,1.916-0.831 c0.696-0.196,1.512-0.333,2.62-0.333c1.273,0,2.174,0.182,2.948,0.431c0.672,0.234,1.273,0.53,1.912,0.953 c1.116,0.725,2.355,1.904,3.784,3.538c1.07,1.209,2.241,2.66,3.606,4.218c2.049,2.321,4.558,4.966,8.092,7.12 c1.762,1.074,3.772,1.973,5.976,2.593c2.211,0.627,4.6,0.952,7.098,0.952c2.899,0.008,5.658-0.438,8.145-1.262 c2.185-0.734,4.142-1.732,5.843-2.866c2.989-1.988,5.201-4.308,7.034-6.38c1.387-1.564,2.563-3.016,3.648-4.256 c1.622-1.851,2.989-3.137,4.222-3.878c0.62-0.362,1.213-0.634,1.913-0.831c0.695-0.196,1.516-0.333,2.622-0.333 c1.274,0,2.174,0.182,2.94,0.431c0.68,0.234,1.282,0.53,1.921,0.953c1.107,0.725,2.35,1.904,3.782,3.538 c1.074,1.209,2.246,2.66,3.606,4.218c2.048,2.321,4.558,4.966,8.092,7.12c1.761,1.074,3.772,1.973,5.979,2.593 c2.212,0.627,4.596,0.952,7.098,0.952c2.899,0.008,5.654-0.438,8.142-1.262c2.184-0.734,4.142-1.732,5.847-2.866 c2.986-1.988,5.201-4.308,7.034-6.38c1.38-1.564,2.559-3.016,3.64-4.256c1.618-1.851,2.994-3.137,4.23-3.878 c0.616-0.362,1.209-0.634,1.908-0.831c0.703-0.196,1.52-0.333,2.623-0.333c1.274,0,2.17,0.182,2.948,0.431 c0.673,0.234,1.278,0.53,1.909,0.953c1.119,0.725,2.354,1.904,3.791,3.538c1.077,1.209,2.241,2.668,3.613,4.218 c2.041,2.328,4.554,4.966,8.084,7.12c1.761,1.074,3.772,1.973,5.983,2.593c2.207,0.627,4.6,0.96,7.098,0.96 c2.903,0,5.662-0.446,8.141-1.27c2.181-0.726,4.146-1.732,5.847-2.866c2.99-1.988,5.204-4.308,7.038-6.38 c1.376-1.564,2.559-3.016,3.636-4.256c1.621-1.851,2.993-3.137,4.225-3.878C300.285,365.656,300.871,365.384,301.577,365.195z"
              ></path>
              <path
                class="st0"
                d="M487.414,120.295h-73.641l15.455-71.07l54.108-31.416L472.998,0l-61.969,35.981l-18.331,84.314H227.407 l8.629,112.404c-19.544-7.416-41.616-11.709-64.997-11.709c-36.397,0.016-69.616,10.356-95.094,26.827 c-12.741,8.248-23.565,18.044-31.82,29.012c-6.388,8.489-11.218,17.711-14.082,27.409h-0.578l-1.44,8.594 c-0.042,0.265-0.075,0.423-0.094,0.507l-0.008,0.045c-0.037,0.09-0.117,0.317-0.234,0.71c-0.118,0.386-0.254,0.915-0.344,1.421 c-0.143,0.764-0.208,1.451-0.238,2.064c-0.034,0.62-0.046,1.202-0.046,1.882c0.008,3.303,0.457,6.546,1.554,9.653 c0.816,2.321,2.014,4.55,3.587,6.508c2.343,2.963,5.521,5.238,8.908,6.584c3.402,1.368,6.974,1.912,10.576,1.912h238.697 c3.205,0,6.376-0.43,9.437-1.482c2.287-0.794,4.509-1.95,6.482-3.485c2.978-2.297,5.306-5.457,6.709-8.882 c1.417-3.447,1.992-7.098,1.992-10.81c-0.004-0.96-0.015-1.724-0.098-2.668c-0.064-0.696-0.216-1.58-0.412-2.314 c-0.151-0.552-0.291-0.93-0.333-1.066l-0.011-0.037c-0.011-0.046-0.049-0.19-0.106-0.545v0.008 c-2.15-12.858-7.85-25.05-16.089-36.011c-10.084-13.372-23.955-25.028-40.498-34.22l-7.808-101.716h215.528l-23.577,307.043 H309.114c-2.351-2.615-5.348-4.838-8.784-6.289c-3.556-1.519-7.484-2.229-11.535-2.222H53.337c-4.8-0.014-9.441,0.998-13.462,3.137 c-3.013,1.588-5.613,3.772-7.654,6.252c-3.076,3.727-4.94,7.997-6.074,12.329c-1.126,4.346-1.556,8.814-1.56,13.335v2.472 c-0.004,9.645,3.942,18.474,10.269,24.786c6.308,6.327,15.137,10.273,24.783,10.266h222.797c9.645,0.008,18.47-3.938,24.782-10.266 c6.327-6.312,10.273-15.14,10.269-24.786v-2.472c0-1.996-0.087-3.984-0.272-5.95h143.453L487.414,120.295z M254.941,265.097 c10.95,7.083,19.968,15.36,26.552,24.114c6.588,8.76,10.722,17.945,12.238,27.024v0.008c0.178,1.058,0.374,1.965,0.597,2.759 c0.03,0.084,0.057,0.166,0.076,0.249c0,0.076,0.008,0.122,0.008,0.212c0,1.406-0.204,2.298-0.37,2.774 c-0.132,0.363-0.23,0.492-0.28,0.552c-0.083,0.09-0.068,0.12-0.51,0.325c-0.431,0.174-1.36,0.416-2.868,0.416H51.685 c-1.346,0-2.226-0.189-2.706-0.363c-0.367-0.121-0.507-0.219-0.575-0.272c-0.087-0.091-0.121-0.068-0.314-0.491 c-0.151-0.355-0.344-1.096-0.408-2.238l0.657-3.93c1.516-9.079,5.651-18.263,12.239-27.024 c9.864-13.138,25.255-25.164,44.338-33.774c19.076-8.625,41.776-13.863,66.123-13.856 C203.495,241.566,233.043,250.909,254.941,265.097z M296.891,476.949c-0.004,4.021-1.602,7.574-4.233,10.22 c-2.65,2.638-6.202,4.233-10.224,4.241H59.637c-4.029-0.008-7.574-1.603-10.22-4.241c-2.634-2.646-4.233-6.198-4.237-10.22v-2.472 c0-2.82,0.257-5.353,0.711-7.393c0.344-1.527,0.79-2.774,1.262-3.689c0.351-0.695,0.71-1.202,1.047-1.587 c0.521-0.582,0.96-0.9,1.663-1.209c0.703-0.303,1.758-0.574,3.473-0.582h235.458c2.048,0.008,3.118,0.378,3.825,0.748 c0.533,0.295,0.93,0.604,1.391,1.156c0.665,0.801,1.436,2.23,1.992,4.407c0.567,2.147,0.896,4.974,0.888,8.149V476.949z"
              ></path>
            </g>
          </g>
        </svg>
        <p class="text-xl">ada</p>
        <p class="text-4xl mt-3 font-semibold" v-if="isLoadingDashboard">...</p>
        <p class="text-4xl mt-3 font-semibold" v-else>{{ uang_dashboard.produkTerjual }}</p>
        <p class="text-xl mt-3">produk terjual hari ini</p>
      </div>
      <div class="col-span-1 bg-white rounded-lg shadow-lg relative p-5 overflow-hidden">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          class="icon w-32 h-32 absolute top-2 -right-10"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M182.87 146.29h585.14v292.57h73.14V73.14H109.72v877.72h402.29v-73.15H182.87z"
              fill="#0F1F3C"
            ></path>
            <path
              d="M713.14 481.52L512 582.1v88.24c0 110.29 62.31 211.11 160.95 260.43l40.19 20.09 40.19-20.09c98.64-49.32 160.95-150.14 160.95-260.43V582.1L713.14 481.52z m128 188.81c0 83.12-46.18 157.84-120.52 195.01l-7.48 3.74-7.48-3.74c-74.34-37.17-120.52-111.9-120.52-195.01V627.3l128-64 128 64v43.03z"
              fill="#0F1F3C"
            ></path>
            <path
              d="M657.87 683.21l-36.33 41.11 93.25 82.43 113.93-131.09-41.39-36L709.69 729zM256 256h438.86v73.14H256zM256 438.86h292.57V512H256zM256 621.71h146.29v73.14H256z"
              fill="#0F1F3C"
            ></path>
          </g>
        </svg>
        <p class="text-xl">ada</p>
        <p class="text-4xl mt-3 font-semibold" v-if="isLoadingDashboard">...</p>
        <p class="text-4xl mt-3 font-semibold" v-else>{{ uang_dashboard.orderMasuk }}</p>
        <p class="text-xl mt-3">transaksi masuk hari ini</p>
      </div>
    </div>
    <div class="w-full min-h-[300px] bg-white rounded-lg shadow-lg mt-7 p-5">
      <div class="w-full flex justify-between items-center mb-3">
        <p class="text-2xl">Pendapatan</p>
        <div class="flex justify-center items-center" v-if="!isLoading">
          <div class="relative w-48 mr-3">
            <div
              @click="toggleDropdownStatus"
              class="w-full px-3 py-2 border bg-blue-200 border-gray-300 rounded focus:outline-none relative focus:border-blue-500 cursor-pointer"
            >
              {{ selectedStatus ? selectedStatus : 'Pilih status' }}
            </div>
            <ul
              v-if="dropdownStatus"
              class="absolute w-full mt-1 bg-white border rounded border-gray-300 shadow z-10"
            >
              <li class="py-2 px-3 cursor-pointer hover:bg-gray-100">Filter PDF</li>
              <li
                @click="selectStatus('Sudah Dibayar')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100"
              >
                Sudah Dibayar
              </li>
              <li
                @click="selectStatus('Belum Dibayar')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100"
              >
                Belum Dibayar
              </li>
            </ul>
            <svg
              fill="#000000"
              viewBox="-6.5 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute z-10 w-8 h-8 top-1 right-1"
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
          <div
            @click="donwloadPDF"
            class="p-2 bg-red-500 rounded-lg font-semibold text-white hover:text-red-500 flex items-center cursor-pointer group hover:bg-white border-2 border-white hover:border-red-500 transition"
          >
            <p>Download PDF</p>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 ml-2"
            >
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
      </div>
      <div
        role="status"
        v-if="isLoading"
        class="mx-auto w-full flex justify-center items-center mt-10"
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
      <div v-else class="w-full">
        <div v-if="groupedOrders.length !== 0" class="w-full">
          <div ref="testHtml" class="absolute -top-[5000px] w-full">
            <div class="relative overflow-x-auto" v-if="selectedStatus == 'Sudah Dibayar'">
              <table
                class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">NO</th>
                    <th scope="col" class="px-6 py-3">PEMBELI</th>
                    <th scope="col" class="px-6 py-3">TANGGAL</th>
                    <th scope="col" class="px-6 py-3">STATUS</th>
                    <th scope="col" class="px-6 py-3">TOTAL PEMBAYARAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    v-for="(order, index) in filteredOrderSelesai"
                    :key="order.id"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p class="text-gray-600">{{ index + 1 }}</p>
                    </th>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p class="text-gray-600">{{ order.orders[0].order.user.name }}</p>
                    </th>
                    <td class="px-6 py-4">
                      <p>{{ stringDate(order.orders[0].updated_at) }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <p v-if="order.orders[0].status_uang == 'Sukses'" class="font-semibold">
                        Sedang diproses oleh admin
                      </p>
                      <div v-else-if="order.orders[0].status_uang == 'Selesai'">
                        <div
                          class="w-full flex"
                          v-if="order.orders[0].order.tipe_pembayaran == 'Online'"
                        >
                          <p class="text-green-600 font-semibold">Sudah dibayar</p>
                        </div>
                        <div
                          class="w-full flex justify-center"
                          v-else-if="order.orders[0].order.tipe_pembayaran == 'Cash'"
                        >
                          <p class="text-green-600 font-semibold">
                            Order ini dibayar menggunakan cash
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p>{{ formatter.format(order.totalHarga) }}</p>
                    </td>
                  </tr>
                  <tr class="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4">
                      {{ formatter.format(addTotalHarga(filteredOrderSelesai)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="relative overflow-x-auto" v-else-if="selectedStatus == 'Belum Dibayar'">
              <table
                class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3">NO</th>
                    <th scope="col" class="px-6 py-3">PEMBELI</th>
                    <th scope="col" class="px-6 py-3">TANGGAL</th>
                    <th scope="col" class="px-6 py-3">STATUS</th>
                    <th scope="col" class="px-6 py-3">TOTAL PEMBAYARAN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    v-for="(order, index) in filteredOrderBelumDibayar"
                    :key="order.id"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p class="text-gray-600">{{ index + 1 }}</p>
                    </th>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p class="text-gray-600">{{ order.orders[0].order.user.name }}</p>
                    </th>
                    <td class="px-6 py-4">
                      <p>{{ stringDate(order.orders[0].updated_at) }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <p v-if="order.orders[0].status_uang == 'Sukses'" class="font-semibold">
                        Sedang diproses oleh admin
                      </p>
                      <div v-else-if="order.orders[0].status_uang == 'Selesai'">
                        <div
                          class="w-full flex"
                          v-if="order.orders[0].order.tipe_pembayaran == 'Online'"
                        >
                          <p class="text-green-600 font-semibold">Sudah dibayar</p>
                        </div>
                        <div
                          class="w-full flex justify-center"
                          v-else-if="order.orders[0].order.tipe_pembayaran == 'Cash'"
                        >
                          <p class="text-green-600 font-semibold">
                            Order ini dibayar menggunakan cash
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p>{{ formatter.format(order.totalHarga) }}</p>
                    </td>
                  </tr>
                  <tr class="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4">
                      {{ formatter.format(addTotalHarga(filteredOrderBelumDibayar)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="relative overflow-x-auto">
            <table class="w-full text-md text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead
                class="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">NO</th>
                  <th scope="col" class="px-6 py-3">PEMBELI</th>
                  <th scope="col" class="px-6 py-3">TANGGAL</th>
                  <th scope="col" class="px-6 py-3">TOTAL PEMBAYARAN</th>
                  <th scope="col" class="px-6 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  v-for="(order, index) in groupedOrders"
                  :key="order.id"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <p class="text-gray-600">{{ index + 1 }}</p>
                  </th>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <p class="text-gray-600">{{ order.orders[0].order.user.name }}</p>
                  </th>
                  <td class="px-6 py-4">
                    <p>{{ stringDate(order.orders[0].updated_at) }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p>{{ formatter.format(order.totalHarga) }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p v-if="order.orders[0].status_uang == 'Sukses'">Sedang diproses oleh admin</p>
                    <div v-else-if="order.orders[0].status_uang == 'Selesai'" class="font-semibold">
                      <div
                        class="w-full flex"
                        v-if="order.orders[0].order.tipe_pembayaran == 'Online'"
                      >
                        <p class="text-green-600 font-semibold">
                          Sudah dibayar<span class="mx-5">|</span>
                        </p>
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
                                      :src="`http://localhost:8000/storage/${order.orders[0].lampiran}`"
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
                      <div
                        class="w-full flex justify-center"
                        v-else-if="order.orders[0].order.tipe_pembayaran == 'Cash'"
                      >
                        <p class="text-green-600 font-semibold">
                          Order ini dibayar menggunakan cash
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="w-full py-4 flex justify-center items-center text-lg border-b relative">
          <p class="text-center">Tidak ada apapun disini..</p>
        </div>
      </div>
    </div>
  </div>
</template>

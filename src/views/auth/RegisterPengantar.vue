<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref, reactive } from 'vue'
import Navbar from '../../components/common/Navbar.vue'
import Alert from '../../components/common/Alert.vue'
import { useAuthRepository } from '@/composables/useAuthRepository'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const auth_repository = useAuthRepository()
const isLoading = ref(false)
const isLoadingSubmit = ref(false)

const fetchUser = async () => {
  isLoading.value = true
  try {
    const { data } = await auth_repository.getUser()
    console.log(data)
    credentials.user_id = data.user.id
    credentials.selectedChannel = data.user.channel
    credentials.no_rek = data.user.no_rek
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
const credentials = reactive({
  selectedChannel: null,
  no_rek: null
})

const error = ref('')

const clearError = () => {
  error.value = ''
}

const logout = async () => {
  try {
    await authStore.logout()
  } catch (e) {
    console.error(e)
  } finally {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    localStorage.removeItem('produk')
    localStorage.removeItem('keranjang')
    window.location.href = '/login'
  }
}

const submit = async () => {
  if (credentials.selectedChannel == null) {
    return (error.value = 'Isi tujuan channel rekening dulu')
  } else if (credentials.no_rek == null) {
    return (error.value = 'Isi tujuan nomor rekening dulu')
  }
  const data = {
    _method: 'put',
    user_id: credentials.user_id,
    channel: credentials.selectedChannel,
    no_rek: credentials.no_rek
  }
  try {
    isLoadingSubmit.value = true
    await auth_repository.registerPengantar(data)
  } catch (error) {
    console.log(error)
  } finally {
    isLoadingSubmit.value = false
    logout()
  }
}

const dropdownChannel = ref(false)

const toggleDropdownTipePembayaran = () => {
  dropdownChannel.value = !dropdownChannel.value
}
const selectChannel = (option) => {
  credentials.selectedChannel = option
  dropdownChannel.value = false
}

onMounted(async () => {
  fetchUser()
})
</script>

<template>
  <Navbar />
  <div class="w-full h-[calc(150vh-7rem)] flex justify-start mt-3 items-center flex-col">
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
      <p class="text-5xl mb-3">Daftar Menjadi Pengantar</p>
    </div>
    <form class="w-[80%] mx-auto mt-5 pb-5" @submit.prevent="submit">
      <p class="text-xl mb-5">Isi data-data dibawah ini terlebih dahulu</p>
      <div class="relative z-0 w-full mb-5 group">
        <div class="mb-4">
          <label for="name" class="block mb-2">Rekening Pembayaran</label>
          <div class="relative w-full mb-2 bg-white">
            <div
              @click="toggleDropdownTipePembayaran"
              class="w-full px-3 py-2 border flex justify-between border-[#6B7280] rounded focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <p class="text-black" v-if="credentials.selectedChannel">
                {{ credentials.selectedChannel }}
              </p>
              <p class="text-[#6B7280]" v-else>Pilih Payment Channel</p>
              <svg
                fill="#6B7280"
                viewBox="-6.5 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5"
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
            <ul
              v-if="dropdownChannel"
              class="absolute w-full mt-1 bg-white border rounded border-[#6B7280] shadow z-10"
            >
              <li class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center">
                <p class="ml-3 font-semibold">Bank</p>
              </li>
              <li
                @click="selectChannel('Bank Mandiri')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/bank-mandiri.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank Mandiri</p>
              </li>
              <li
                @click="selectChannel('Bank BRI')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/BANK_BRI_logo.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank BRI</p>
              </li>
              <li
                @click="selectChannel('Bank BNI')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/bank-negara-indonesia.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank BNI</p>
              </li>
              <li
                @click="selectChannel('Bank BCA')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/bca-bank-central-asia.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank BCA</p>
              </li>
              <li
                @click="selectChannel('Bank CIMB')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/CIMB_Niaga_logo.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank CIMB Niaga</p>
              </li>
              <li
                @click="selectChannel('Bank Permata')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../../public/bank_logo/Permata Bank.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt="Bank Mandiri"
                />
                <p class="ml-3">Bank Permata</p>
              </li>
              <li class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center">
                <p class="ml-3 font-semibold">E-Money</p>
              </li>
              <li
                @click="selectChannel('Gopay')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../public/bank_logo/Gopay_logo.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt=""
                />
                <p class="ml-3">Gopay</p>
              </li>
              <li
                @click="selectChannel('Shopeepay')"
                class="py-2 px-3 cursor-pointer hover:bg-gray-100 flex items-center"
              >
                <img
                  src="../../public/bank_logo/ShopeePay.svg"
                  class="w-[60px] h-[30px] object-contain bg-transparent"
                  alt=""
                />
                <p class="ml-3">Shopeepay</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="mb-4">
          <label for="name" class="block mb-2">No Rekening</label>
          <input
            type="text"
            class="border p-2 w-full bg-white rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="1223-1234-1234-1234"
            v-model="credentials.no_rek"
          />
        </div>
      </div>
      <Alert
        type="danger"
        :message="error"
        :alertToggle="() => clearError()"
        dismissable
        class="w-full mb-2"
        v-if="error"
      />
      <button
        type="submit"
        class="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full mt-2 sm:w-auto px-5 py-2.5 text-center"
      >
        <p v-if="isLoadingSubmit">Loading...</p>
        <p v-else>Submit</p>
      </button>
    </form>
    <div class="w-[80%] mx-auto mt-5 pb-5">
      <p class="text-small text-gray-600">
        *anda akan ter-logout otomatis setelah mendaftar. Akun anda akan tidak bisa diakses semetara
        sampai disetujui oleh admin.
      </p>
    </div>
  </div>
</template>

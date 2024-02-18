<script setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

const credentials = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  tipe_user: 'user',
  status: 'active',
  device_name: 'browser',
  role_id: '1',
  selectedChannel: null,
  no_rek: null
})

const error = ref('')

const clearError = () => {
  error.value = ''
}

const dropdownChannel = ref(false)

const toggleDropdownTipePembayaran = () => {
  dropdownChannel.value = !dropdownChannel.value
}
const selectChannel = (option) => {
  credentials.selectedChannel = option
  dropdownChannel.value = false
}

const isLoading = ref(false)
const onSubmit = async () => {
  isLoading.value = true
  try {
    await authStore.registerPenjual(credentials)

    router.push({ name: 'login' })
  } catch (e) {
    if (e.response && e.response.status === 422) {
      const validationErrors = e.response.data.errors

      if (validationErrors && validationErrors.email) {
        error.value = validationErrors.email[0]
      }
    }
  }
  isLoading.value = false
}
</script>

<template>
  <main class="grid grid-cols-12 overflow-hidden">
    <section class="col-span-6 pb-10 bg-[#f7f2f2] h-screen shadow-lg relative overflow-y-scroll">
      <router-link to="/" class="sticky top-8 left-3">
        <span class="text-3xl text-black font-bold">KoKu!</span>
      </router-link>
      <form
        :action="route.path"
        method="post"
        class="w-[50%] mx-auto mt-10"
        @submit.prevent="onSubmit"
      >
        <div class="mb-4">
          <label for="name" class="block mb-2">Nama</label>
          <input
            type="text"
            class="border p-2 w-full bg-white rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="Sandro Ardhi Saputra"
            v-model="credentials.name"
            required
          />
        </div>
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
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block mb-2">Email</label>
          <input
            type="email"
            class="border p-2 w-full bg-white rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            placeholder="someone@example.com"
            v-model="credentials.email"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2">Password</label>
          <input
            type="password"
            class="border p-2 w-full bg-white rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            v-model="credentials.password"
            placeholder="*******"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password_confirmation" class="block mb-2">Confirm Password</label>
          <input
            type="password"
            class="border p-2 w-full bg-white rounded outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            v-model="credentials.password_confirmation"
            placeholder="*******"
            required
          />
        </div>
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
          v-if="error"
          @click="clearError"
        >
          <span class="block sm:inline font-bold">{{ error }}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              class="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              />
            </svg>
          </span>
        </div>
        <button
          type="submit"
          class="border p-3 text-white active:bg-yellow-400 hover:bg-yellow-200 w-full rounded bg-yellow-300 transition-colors"
        >
          <p v-if="isLoading">Loading...</p>
          <p v-else>Daftar</p>
        </button>
        <p class="text-sm flex text-[#6B7280]">
          <span>*</span>akun tidak akan langsung teraktivasi setelah mendaftar, harap menunggu
          diaktivasi oleh admin.
        </p>
        <p class="text-center mt-3 font-semibold">
          Sudah punya akun?
          <router-link class="text-yellow-300 hover:text-yellow-200 duration-300" to="/login"
            >Login</router-link
          >
        </p>
      </form>
    </section>
    <section class="col-span-6 bg-white min-h-screen shadow-lg relative">
      <div class="w-full mx-auto flex flex-col justify-center items-center mt-10">
        <p class="text-[20px] font-semibold">Daftar Menjadi Mitra!</p>
        <p class="text-[55px] -mt-2 font-bold border-b">
          KoKu
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            class="iconify iconify--emojione-monotone inline -ml-8 -mt-3 w-[50px] h-[50px]"
            preserveAspectRatio="xMidYMid meet"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M36.989 42.439H27.01L23 2h18z" fill="#000000"></path>
              <ellipse cx="31.999" cy="54.354" rx="7.663" ry="7.646" fill="#F9A826"></ellipse>
            </g>
          </svg>
        </p>
        <p class="text-[15px] font-semibold">Kantin Online Ku!</p>
      </div>
      <div class="w-[500px] h-[500px] absolute left-1/2 transform -translate-x-1/2 -mt-10">
        <img
          src="../../../public/images/undraw_tasting_re_3k5a.svg"
          class="w-full h-full object-contain bg-transparent"
          alt=""
        />
      </div>
    </section>
  </main>
</template>

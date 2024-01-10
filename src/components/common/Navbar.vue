<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()
const user = JSON.parse(localStorage.getItem('user'))
const dropdown = ref(false)

const dropdownToggle = () => {
  dropdown.value = !dropdown.value
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
    router.push({ name: 'login' })
  }
}
const excerpt = (text, maxLength = 10, indicator = '...') => {
  let textCopy = text

  if (textCopy.length > maxLength) {
    textCopy = textCopy.substring(0, maxLength) + indicator
  }
  return textCopy
}
</script>

<template>
  <nav class="bg-[#FFF] w-full p-2 z-20 top-0 left-0 sticky">
    <div class="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/">
        <span class="text-3xl text-black font-bold">KoKu!</span>
      </router-link>

      <div class="items-center justify-between hidden w-full md:flex md:w-auto" id="navbar-sticky">
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li class="flex items-center justify-center">
            <router-link
              to="/"
              class="block py-2 pl-3 pr-4 text-black rounded md:bg-transparent md:p-0 md:dark:text-blue-500"
              :class="route.path === '/' ? 'text-yellow-300' : ''"
              aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link
              to="/kantin"
              :class="route.path === '/kantin' ? 'text-yellow-300' : ''"
              class="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FFB000] duration-150 ease md:p-0"
              >Kantin</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link
              to="/kategori"
              :class="route.path === '/kategori' ? 'text-yellow-300' : ''"
              class="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FFB000] duration-150 ease md:p-0"
              >Kategori</router-link
            >
          </li>
          <li class="flex items-center justify-center" v-if="user">
            <router-link
              to="/keranjang"
              :class="route.path === '/keranjang' ? 'text-yellow-300' : ''"
              class="flex items-center py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FFB000] duration-150 ease group md:p-0"
            >
              <i
                ><svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 mr-1"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M3.86376 16.4552C3.00581 13.0234 2.57684 11.3075 3.47767 10.1538C4.3785 9 6.14721 9 9.68462 9H14.3153C17.8527 9 19.6214 9 20.5222 10.1538C21.4231 11.3075 20.9941 13.0234 20.1362 16.4552C19.5905 18.6379 19.3176 19.7292 18.5039 20.3646C17.6901 21 16.5652 21 14.3153 21H9.68462C7.43476 21 6.30983 21 5.49605 20.3646C4.68227 19.7292 4.40943 18.6379 3.86376 16.4552Z"
                      stroke="#000"
                      :class="route.path === '/keranjang' ? 'stroke-yellow-300' : ''"
                      class="group-hover:stroke-[#FFB000] duration-150 ease"
                      stroke-width="1.5"
                    ></path>
                    <path
                      d="M19.5 9.5L18.7896 6.89465C18.5157 5.89005 18.3787 5.38775 18.0978 5.00946C17.818 4.63273 17.4378 4.34234 17.0008 4.17152C16.5619 4 16.0413 4 15 4M4.5 9.5L5.2104 6.89465C5.48432 5.89005 5.62128 5.38775 5.90221 5.00946C6.18199 4.63273 6.56216 4.34234 6.99922 4.17152C7.43808 4 7.95872 4 9 4"
                      stroke="#000"
                      :class="route.path === '/keranjang' ? 'stroke-yellow-300' : ''"
                      class="group-hover:stroke-[#FFB000] duration-150 ease"
                      stroke-width="1.5"
                    ></path>
                    <path
                      d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4C15 4.55228 14.5523 5 14 5H10C9.44772 5 9 4.55228 9 4Z"
                      stroke="#000"
                      :class="route.path === '/keranjang' ? 'stroke-yellow-300' : ''"
                      class="group-hover:stroke-[#FFB000] duration-150 ease"
                      stroke-width="1.5"
                    ></path>
                    <path
                      d="M8 13V17"
                      stroke="#000"
                      class="group-hover:stroke-[#FFB000] duration-150 ease"
                      :class="route.path === '/keranjang' ? 'stroke-yellow-300' : ''"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M16 13V17"
                      stroke="#000"
                      :class="route.path === '/keranjang' ? 'stroke-yellow-300' : ''"
                      class="group-hover:stroke-[#FFB000] duration-150 ease"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M12 13V17"
                      stroke="#000"
                      class="group-hover:stroke-[#FFB000] duration-150 ease"
                      :class="route.path === '/keranjang' ? 'stroke-yellow-300' : ''"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g></svg></i
              >Keranjang</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link to="/login" v-if="!user">
              <button
                type="button"
                class="text-white bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-[#FFB000] font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-[#ffae00bd] dark:focus:ring-blue-800"
              >
                Login
              </button>
            </router-link>
            <div v-else>
              <button
                v-if="!dropdown"
                @click="dropdownToggle"
                type="button"
                class="text-white w-40 bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-[#FFB000] font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-[#ffae00bd] dark:focus:ring-blue-800"
              >
                Hello, {{ excerpt(user.name, 10) }}
              </button>
              <button
                v-else
                @click="dropdownToggle"
                type="button"
                class="text-white w-40 relative bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-[#FFB000] font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-[#ffae00bd] dark:focus:ring-blue-800"
              >
                Hello, {{ excerpt(user.name, 10) }}
                <ul class="absolute w-full left-0 top-12 border">
                  <router-link to="/dashboard" v-if="authStore.getUserRole !== 'user'">
                    <li class="p-2 bg-white text-black border-b">Dashboard</li>
                  </router-link>
                  <router-link to="/profile">
                    <li class="p-2 bg-white text-black border-b">Profile</li>
                  </router-link>
                  <li class="p-2 bg-white text-black" @click="logout">Logout</li>
                </ul>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

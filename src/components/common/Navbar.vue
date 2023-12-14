<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user'))
const dropdown = ref(false)

const dropdownToggle = () => {
  dropdown.value = !dropdown.value
}
const logout = async () => {
  try {
    await axios.get('api/auth/logout', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      baseURL: 'http://localhost:8000'
    });

    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    router.replace({ name: 'login' });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <nav class="bg-[#FFF] w-full p-2 z-20 top-0 left-0 sticky">
    <div class="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/">
        <span class="text-3xl text-black font-bold">KoKu!</span>
      </router-link>

      <div class="items-center justify-between hidden w-full md:flex md:w-auto " id="navbar-sticky">
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li class="flex items-center justify-center">
            <router-link
              to="#"
              class="block py-2 pl-3 pr-4 text-black bg-[#FFB000] rounded md:bg-transparent md:text-[#FFB000] md:p-0 md:dark:text-blue-500"
              aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link
              to="#"
              class="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FFB000] md:p-0"
              >About</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link
              to="#"
              class="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FFB000] md:p-0"
              >Services</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link
              to="#"
              class="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#FFB000] md:p-0"
              >Contact</router-link
            >
          </li>
          <li class="flex items-center justify-center">
            <router-link to="/login" v-if="!user">
              <button
                type="button"
                class="text-black bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-[#FFB000] font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-[#ffae00bd] dark:focus:ring-blue-800"
              >
                Login
              </button>
            </router-link>
            <div v-else>
              <button
                v-if="!dropdown"
                @click="dropdownToggle"
                type="button"
                class="text-white bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-[#FFB000] font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-[#ffae00bd] dark:focus:ring-blue-800"
              >
                Hello, {{ user.name }}
              </button>
              <button
                v-else
                @click="dropdownToggle"
                type="button"
                class="text-white relative bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-4 focus:outline-none focus:ring-[#FFB000] font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-[#ffae00bd] dark:focus:ring-blue-800"
              >
                Hello, {{ user.name }}
                <ul class="absolute w-full left-0 top-12 border">
                  <li class="p-2 bg-white text-black" @click="logout">Logout</li>
                  <router-link to="/dashboard">
                    <li class="p-2 bg-white text-black border-t">Dashboard</li>
                  </router-link>
                </ul>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRoute, RouterView } from 'vue-router'
import SidebarList from '../../../components/dashboard/SidebarList.vue'
import { useAuthStore } from '../../../stores/auth'

const authStore = useAuthStore()

const route = useRoute()
</script>

<template>
  <div class="grid grid-cols-12 overflow-hidden">
    <aside class="min-h-screen col-span-2 bg-[#FAF9F6] border-r-2 flex flex-col relative">
      <div class="w-full h-[50px] px-4 pt-2 mt-3">
        <span class="text-3xl text-black font-bold">KoKu!</span>
      </div>

      <ul class="w-full min-h-screen p-3">
        <!-- to dashboard index -->
        <SidebarList
          v-if="
            authStore.getUserRole == 'admin' ||
            authStore.getUserRole == 'penjual' ||
            authStore.getUserRole == 'pengantar'
          "
          :to="{ name: 'index' }"
          spanText="Dashboard"
          currentRoute="/dashboard"
        >
          <template #svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12M21 12C21 7.02944 16.9706 3 12 3M21 12H19M3 12C3 7.02944 7.02944 3 12 3M3 12H5M12 3V5M13.3229 10.5C12.9703 10.1888 12.5072 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 11.4027 13.7381 10.8665 13.3229 10.5ZM13.3229 10.5L15.8229 8"
                  stroke="#9CA3AF"
                  stroke-width="2"
                  stroke-linecap="round"
                  class="group-hover:stroke-black"
                  :class="route.path === '/dashboard' ? 'stroke-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to dashboard index -->

        <!-- to pengantar-pesanan-proses -->
        <SidebarList
          v-if="authStore.getUserRole == 'pengantar'"
          :to="{ name: 'pengantar-pesanan-proses' }"
          spanText="Pesanan"
          currentRoute="/dashboard/pengantar/pesanan"
        >
          <template #svg>
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="icon w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M731.15 585.97c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86 182.86-81.87 182.86-182.86-81.87-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71s49.22-109.71 109.71-109.71c60.5 0 109.71 49.22 109.71 109.71s-49.21 109.71-109.71 109.71z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M758.58 692.98h-54.86v87.27l69.4 68.79 38.6-38.97-53.14-52.68zM219.51 474.96h219.43v73.14H219.51z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M182.61 365.86h585.62v179.48h73.14V145.21c0-39.96-32.5-72.48-72.46-72.48h-27.36c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57h-18.16c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H375.3c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H182.4c-39.96 0-72.48 32.52-72.48 72.48v805.14h401.21v-73.14H183.04l-0.43-511.35z m25.81-222.29c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l15.86-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l16.59-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l26.68-0.66v147.5H182.54l-0.13-146.84 26.01-2.33z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to pengantar-pesanan-proses -->

        <!-- to pengantar-pesanan-selesai -->
        <SidebarList
          v-if="authStore.getUserRole == 'pengantar'"
          :to="{ name: 'pengantar-dashboard-pesanan-selesai' }"
          spanText="Pesanan Selesai"
          currentRoute="/dashboard/pengantar/pesanan/selesai"
        >
          <!-- route.path.startsWith('/dashboard/pesanan') &&  -->
          <template #svg>
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="icon w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M731.15 585.97c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86 182.86-81.87 182.86-182.86-81.87-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71s49.22-109.71 109.71-109.71c60.5 0 109.71 49.22 109.71 109.71s-49.21 109.71-109.71 109.71z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan/selesai' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M718.01 778.55l-42.56-38.12-36.6 40.86 84.02 75.26 102.98-118.46-41.4-36zM219.51 474.96h219.43v73.14H219.51z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan/selesai' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M182.61 365.86h585.62v179.48h73.14V145.21c0-39.96-32.5-72.48-72.46-72.48h-27.36c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57h-18.16c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H375.3c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H182.4c-39.96 0-72.48 32.52-72.48 72.48v805.14h401.21v-73.14H183.04l-0.43-511.35z m25.81-222.29c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l15.86-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l16.59-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l26.68-0.66v147.5H182.54l-0.13-146.84 26.01-2.33z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan/selesai' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to pengantar-pesanan-selesai -->

        <!-- to pengantar-pesanan-canceled -->
        <SidebarList
          v-if="authStore.getUserRole == 'pengantar'"
          :to="{ name: 'pengantar-dashboard-pesanan-gagal' }"
          spanText="Pesanan Gagal"
          currentRoute="/dashboard/pengantar/pesanan/gagal"
        >
          <!-- route.path.startsWith('/dashboard/pesanan') &&  -->
          <template #svg>
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="icon w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M731.15 584.74c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86 182.86-81.87 182.86-182.86-81.87-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71 0-60.5 49.22-109.71 109.71-109.71 60.5 0 109.71 49.22 109.71 109.71 0.01 60.49-49.21 109.71-109.71 109.71zM219.51 475.38h219.43v73.14H219.51z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan/gagal' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M182.61 366.27h585.62v179.48h73.14V145.62c0-39.96-32.5-72.48-72.46-72.48h-27.36c-29.2 0-55.05 16.73-65.88 42.59-5.71 13.61-27.84 13.64-33.55 0-10.86-25.88-36.71-42.59-65.89-42.59h-18.16c-29.2 0-55.05 16.73-65.88 42.59-5.71 13.61-27.84 13.64-33.55 0-10.86-25.88-36.71-42.59-65.89-42.59h-17.43c-29.2 0-55.05 16.73-65.88 42.59-5.71 13.61-27.84 13.64-33.55 0-10.86-25.88-36.71-42.59-65.89-42.59h-27.57c-39.96 0-72.48 32.52-72.48 72.48v805.12h401.21V877.6H183.04l-0.43-511.33zM208.42 144c14.27 34.07 47.32 56.09 84.23 56.09 36.89 0 69.95-22 82.66-53.8l15.86-2.29c14.27 34.07 47.32 56.09 84.23 56.09 36.89 0 69.95-22 82.66-53.8l16.59-2.29c14.27 34.07 47.32 56.09 84.23 56.09 36.89 0 69.95-22 82.66-53.8l26.68-0.66v147.5H182.54l-0.13-146.84 26.01-2.29z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan/gagal' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M704.01 676.8h54.86v114.27h-54.86zM704.01 811.61h54.86v52.7h-54.86z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pengantar/pesanan/gagal' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to pengantar-pesanan-canceled -->

        <!-- to store-management -->
        <SidebarList
          v-if="authStore.getUserRole == 'penjual'"
          :to="{ name: 'store-management' }"
          spanText="Kantin"
          currentRoute="/dashboard/store-management"
        >
          <template #svg>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.87617 3.75H19.1238L21 8.86683V10.5C21 11.2516 20.7177 11.9465 20.25 12.4667V21H3.75V12.4667C3.28234 11.9465 3 11.2516 3 10.5V8.86683L4.87617 3.75ZM18.1875 13.3929C18.3807 13.3929 18.5688 13.3731 18.75 13.3355V19.5H15V15H9L9 19.5H5.25V13.3355C5.43122 13.3731 5.61926 13.3929 5.8125 13.3929C6.63629 13.3929 7.36559 13.0334 7.875 12.4667C8.38441 13.0334 9.11371 13.3929 9.9375 13.3929C10.7613 13.3929 11.4906 13.0334 12 12.4667C12.5094 13.0334 13.2387 13.3929 14.0625 13.3929C14.8863 13.3929 15.6156 13.0334 16.125 12.4667C16.6344 13.0334 17.3637 13.3929 18.1875 13.3929ZM10.5 19.5H13.5V16.5H10.5L10.5 19.5ZM19.5 9.75V10.5C19.5 11.2965 18.8856 11.8929 18.1875 11.8929C17.4894 11.8929 16.875 11.2965 16.875 10.5V9.75H19.5ZM19.1762 8.25L18.0762 5.25H5.92383L4.82383 8.25H19.1762ZM4.5 9.75V10.5C4.5 11.2965 5.11439 11.8929 5.8125 11.8929C6.51061 11.8929 7.125 11.2965 7.125 10.5V9.75H4.5ZM8.625 9.75V10.5C8.625 11.2965 9.23939 11.8929 9.9375 11.8929C10.6356 11.8929 11.25 11.2965 11.25 10.5V9.75H8.625ZM12.75 9.75V10.5C12.75 11.2965 13.3644 11.8929 14.0625 11.8929C14.7606 11.8929 15.375 11.2965 15.375 10.5V9.75H12.75Z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/store-management' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to store-management -->

        <!-- to pesanan-proses -->
        <SidebarList
          v-if="authStore.getUserRole == 'penjual'"
          :to="{ name: 'pesanan-proses' }"
          spanText="Pesanan"
          currentRoute="/dashboard/pesanan"
        >
          <template #svg>
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="icon w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M731.15 585.97c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86 182.86-81.87 182.86-182.86-81.87-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71s49.22-109.71 109.71-109.71c60.5 0 109.71 49.22 109.71 109.71s-49.21 109.71-109.71 109.71z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M758.58 692.98h-54.86v87.27l69.4 68.79 38.6-38.97-53.14-52.68zM219.51 474.96h219.43v73.14H219.51z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M182.61 365.86h585.62v179.48h73.14V145.21c0-39.96-32.5-72.48-72.46-72.48h-27.36c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57h-18.16c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H375.3c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H182.4c-39.96 0-72.48 32.52-72.48 72.48v805.14h401.21v-73.14H183.04l-0.43-511.35z m25.81-222.29c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l15.86-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l16.59-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l26.68-0.66v147.5H182.54l-0.13-146.84 26.01-2.33z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to pesanan-proses -->

        <!-- to pesanan-selesai -->
        <SidebarList
          v-if="authStore.getUserRole == 'penjual'"
          :to="{ name: 'dashboard-pesanan-selesai' }"
          spanText="Pesanan Selesai"
          currentRoute="/dashboard/pesanan/selesai"
        >
          <!-- route.path.startsWith('/dashboard/pesanan') &&  -->
          <template #svg>
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="icon w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M731.15 585.97c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86 182.86-81.87 182.86-182.86-81.87-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71s49.22-109.71 109.71-109.71c60.5 0 109.71 49.22 109.71 109.71s-49.21 109.71-109.71 109.71z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan/selesai' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M718.01 778.55l-42.56-38.12-36.6 40.86 84.02 75.26 102.98-118.46-41.4-36zM219.51 474.96h219.43v73.14H219.51z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan/selesai' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M182.61 365.86h585.62v179.48h73.14V145.21c0-39.96-32.5-72.48-72.46-72.48h-27.36c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57h-18.16c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H375.3c-29.18 0-55.04 16.73-65.88 42.59-5.71 13.64-27.82 13.66-33.57-0.02-10.86-25.86-36.71-42.57-65.88-42.57H182.4c-39.96 0-72.48 32.52-72.48 72.48v805.14h401.21v-73.14H183.04l-0.43-511.35z m25.81-222.29c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l15.86-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l16.59-2.3c14.25 34.09 47.32 56.11 84.23 56.11 36.89 0 69.96-22.02 82.66-53.8l26.68-0.66v147.5H182.54l-0.13-146.84 26.01-2.33z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan/selesai' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to pesanan-selesai -->

        <!-- to pesanan-canceled -->
        <SidebarList
          v-if="authStore.getUserRole == 'penjual'"
          :to="{ name: 'dashboard-pesanan-gagal' }"
          spanText="Pesanan Gagal"
          currentRoute="/dashboard/pesanan/gagal"
        >
          <!-- route.path.startsWith('/dashboard/pesanan') &&  -->
          <template #svg>
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="icon w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M731.15 584.74c-100.99 0-182.86 81.87-182.86 182.86s81.87 182.86 182.86 182.86 182.86-81.87 182.86-182.86-81.87-182.86-182.86-182.86z m0 292.57c-60.5 0-109.71-49.22-109.71-109.71 0-60.5 49.22-109.71 109.71-109.71 60.5 0 109.71 49.22 109.71 109.71 0.01 60.49-49.21 109.71-109.71 109.71zM219.51 475.38h219.43v73.14H219.51z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan/gagal' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M182.61 366.27h585.62v179.48h73.14V145.62c0-39.96-32.5-72.48-72.46-72.48h-27.36c-29.2 0-55.05 16.73-65.88 42.59-5.71 13.61-27.84 13.64-33.55 0-10.86-25.88-36.71-42.59-65.89-42.59h-18.16c-29.2 0-55.05 16.73-65.88 42.59-5.71 13.61-27.84 13.64-33.55 0-10.86-25.88-36.71-42.59-65.89-42.59h-17.43c-29.2 0-55.05 16.73-65.88 42.59-5.71 13.61-27.84 13.64-33.55 0-10.86-25.88-36.71-42.59-65.89-42.59h-27.57c-39.96 0-72.48 32.52-72.48 72.48v805.12h401.21V877.6H183.04l-0.43-511.33zM208.42 144c14.27 34.07 47.32 56.09 84.23 56.09 36.89 0 69.95-22 82.66-53.8l15.86-2.29c14.27 34.07 47.32 56.09 84.23 56.09 36.89 0 69.95-22 82.66-53.8l16.59-2.29c14.27 34.07 47.32 56.09 84.23 56.09 36.89 0 69.95-22 82.66-53.8l26.68-0.66v147.5H182.54l-0.13-146.84 26.01-2.29z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan/gagal' ? 'fill-black' : ''"
                ></path>
                <path
                  d="M704.01 676.8h54.86v114.27h-54.86zM704.01 811.61h54.86v52.7h-54.86z"
                  fill="#9CA3AF"
                  class="group-hover:fill-black"
                  :class="route.path === '/dashboard/pesanan/gagal' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to pesanan-canceled -->

        <!-- to user-management -->
        <SidebarList
          v-if="authStore.getUserRole == 'admin'"
          :to="{ name: 'user-management' }"
          spanText="User Management"
          currentRoute="/dashboard/user-management"
        >
          <template #svg>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="#9CA3AF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-all duration-150 group-hover:stroke-black"
                  :class="route.path === '/dashboard/user-management' ? 'stroke-black' : ''"
                ></path>
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="#9CA3AF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-all duration-150 group-hover:stroke-black"
                  :class="route.path === '/dashboard/user-management' ? 'stroke-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to user-management -->

        <!-- to kategori-management -->
        <SidebarList
          v-if="authStore.getUserRole == 'admin'"
          :to="{ name: 'kategori-management' }"
          spanText="Kategori Management"
          currentRoute="/dashboard/kategori-management"
        >
          <template #svg>
            <svg
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9CA3AF"
              class="w-8 group-hover:fill-black"
              :class="route.path === '/dashboard/kategori-management' ? 'fill-black' : ''"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <title>category-list-solid</title>
                <g id="Layer_2" data-name="Layer 2">
                  <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none"></rect>
                  </g>
                  <g id="icons_Q2" data-name="icons Q2">
                    <path
                      d="M24,10h0a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2h0a2,2,0,0,1-2,2H26A2,2,0,0,1,24,10Z"
                    ></path>
                    <path
                      d="M24,24h0a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2h0a2,2,0,0,1-2,2H26A2,2,0,0,1,24,24Z"
                    ></path>
                    <path
                      d="M24,38h0a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2h0a2,2,0,0,1-2,2H26A2,2,0,0,1,24,38Z"
                    ></path>
                    <path
                      d="M12,2a2.1,2.1,0,0,0-1.7,1L4.2,13a2.3,2.3,0,0,0,0,2,1.9,1.9,0,0,0,1.7,1H18a2.1,2.1,0,0,0,1.7-1,1.8,1.8,0,0,0,0-2l-6-10A1.9,1.9,0,0,0,12,2Z"
                    ></path>
                    <path d="M12,30a6,6,0,1,1,6-6A6,6,0,0,1,12,30Z"></path>
                    <path
                      d="M16,44H8a2,2,0,0,1-2-2V34a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2v8A2,2,0,0,1,16,44Z"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to kategori-management -->

        <!-- to role-management -->
        <SidebarList
          v-if="authStore.getUserRole == 'admin'"
          :to="{ name: 'role-management' }"
          spanText="Role Management"
          currentRoute="/dashboard/role-management"
        >
          <template #svg>
            <svg
              fill="#9CA3AF"
              viewBox="0 0 52 52"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 group-hover:fill-black"
              :class="route.path === '/dashboard/role-management' ? 'fill-black' : ''"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M38.3,27.2A11.4,11.4,0,1,0,49.7,38.6,11.46,11.46,0,0,0,38.3,27.2Zm2,12.4a2.39,2.39,0,0,1-.9-.2l-4.3,4.3a1.39,1.39,0,0,1-.9.4,1,1,0,0,1-.9-.4,1.39,1.39,0,0,1,0-1.9l4.3-4.3a2.92,2.92,0,0,1-.2-.9,3.47,3.47,0,0,1,3.4-3.8,2.39,2.39,0,0,1,.9.2c.2,0,.2.2.1.3l-2,1.9a.28.28,0,0,0,0,.5L41.1,37a.38.38,0,0,0,.6,0l1.9-1.9c.1-.1.4-.1.4.1a3.71,3.71,0,0,1,.2.9A3.57,3.57,0,0,1,40.3,39.6Z"
                ></path>
                <circle cx="21.7" cy="14.9" r="12.9"></circle>
                <path
                  d="M25.2,49.8c2.2,0,1-1.5,1-1.5h0a15.44,15.44,0,0,1-3.4-9.7,15,15,0,0,1,1.4-6.4.77.77,0,0,1,.2-.3c.7-1.4-.7-1.5-.7-1.5h0a12.1,12.1,0,0,0-1.9-.1A19.69,19.69,0,0,0,2.4,47.1c0,1,.3,2.8,3.4,2.8H24.9C25.1,49.8,25.1,49.8,25.2,49.8Z"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to role-management -->

        <!-- to role-management -->
        <router-link
          :to="{ name: 'payouts-bayar-penjual' }"
          v-if="authStore.getUserRole == 'admin'"
        >
          <li
            class="flex relative items-center hover:bg-gray-200 p-2 rounded-md group mt-4"
            :class="
              route.path === '/dashboard/payouts' ||
              route.path === '/dashboard/payouts/selesai' ||
              route.path === '/dashboard/payouts/pengantar' ||
              route.path === '/dashboard/payouts/refund'
                ? 'bg-gray-200'
                : ''
            "
          >
            <div
              :class="
                route.path === '/dashboard/payouts' ||
                route.path === '/dashboard/payouts/selesai' ||
                route.path === '/dashboard/payouts/pengantar' ||
                route.path === '/dashboard/payouts/refund'
                  ? 'absolute w-1 h-full bg-yellow-300 -right-[0.75rem] rounded-l-2xl'
                  : ''
              "
            ></div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 group"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M3 8C3 6.34315 4.34315 5 6 5H18C19.6569 5 21 6.34315 21 8V16C21 17.6569 19.6569 19 18 19H6C4.34315 19 3 17.6569 3 16V8Z"
                  stroke="#9CA3AF"
                  stroke-width="2"
                  class="group-hover:stroke-black"
                  :class="
                    route.path === '/dashboard/payouts' ||
                    route.path === '/dashboard/payouts/selesai' ||
                    route.path === '/dashboard/payouts/pengantar' ||
                    route.path === '/dashboard/payouts/refund'
                      ? 'stroke-black'
                      : ''
                  "
                ></path>
                <path
                  d="M3 10H21"
                  stroke="#9CA3AF"
                  stroke-width="2"
                  class="group-hover:stroke-black"
                  :class="
                    route.path === '/dashboard/payouts' ||
                    route.path === '/dashboard/payouts/selesai' ||
                    route.path === '/dashboard/payouts/pengantar' ||
                    route.path === '/dashboard/payouts/refund'
                      ? 'stroke-black'
                      : ''
                  "
                ></path>
                <path
                  d="M14 15L17 15"
                  stroke="#9CA3AF"
                  stroke-width="2"
                  class="group-hover:stroke-black"
                  stroke-linecap="round"
                  :class="
                    route.path === '/dashboard/payouts' ||
                    route.path === '/dashboard/payouts/selesai' ||
                    route.path === '/dashboard/payouts/pengantar' ||
                    route.path === '/dashboard/payouts/refund'
                      ? 'stroke-black'
                      : ''
                  "
                ></path>
              </g>
            </svg>
            <span
              class="ml-2 text-md font-semibold text-[#1f2836] group-hover:text-black transition-all duration-150 font-sans"
              :class="
                route.path === '/dashboard/payouts' ||
                '/dashboard/payouts/selesai' ||
                '/dashboard/payouts/pengantar' ||
                '/dashboard/payouts/refund'
                  ? 'text-black'
                  : ''
              "
            >
              Payouts
            </span>
          </li></router-link
        >
        <!-- end of to role-management -->
      </ul>
    </aside>

    <div class="col-span-10 bg-[#F4F4F8]" v-auto-animate="{ duration: 500 }">
      <RouterView />
    </div>
  </div>
</template>

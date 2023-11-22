<script setup>
import { RouterLink, useRouter, useRoute, RouterView } from 'vue-router'
import SidebarList from '../../components/dashboard/SidebarList.vue'

const route = useRoute()
</script>

<template>
  <div class="grid grid-cols-10">
    <aside class="min-h-screen col-span-2 bg-[#004225] border-r-2 flex flex-col relative">
      <router-link to="/">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-[50px] transition-all duration-150 ml-3 hover:ml-2"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M4 12H20M4 12L8 8M4 12L8 16"
              stroke="#F5F5DC"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </router-link>
      <div class="w-full h-[2px] border"></div>
      <ul class="w-full min-h-screen p-3">
        <SidebarList
          :to="{ name: 'user-management' }"
          spanText="User Management"
          currentRoute="/dashboard"
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
                  :class="route.path === '/dashboard' ? 'stroke-black' : ''"
                ></path>
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="#9CA3AF"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-all duration-150 group-hover:stroke-black"
                  :class="route.path === '/dashboard' ? 'stroke-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <SidebarList
          :to="{ name: 'store-management' }"
          spanText="Toko"
          currentRoute="/store-management"
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
                  :class="route.path === '/store-management' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <router-link to="#">
          <li></li>
        </router-link>
      </ul>
    </aside>

    <div class="min-h-screen col-span-8 bg-[#F5F5DC]">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter, useRoute, RouterView } from 'vue-router'
import SidebarList from '../../components/dashboard/SidebarList.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const route = useRoute()
</script>

<template>
  <div class="grid grid-cols-10 overflow-hidden">
    <aside class="min-h-screen col-span-2 bg-[#004225] border-r-2 flex flex-col relative">
      <!-- back to home -->
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
      <!-- end of back to home -->
      <div class="w-full h-[2px] border"></div>

      <ul class="w-full min-h-screen p-3">
        <!-- to store-management -->
        <SidebarList
          v-if="authStore.getUserRole == 'admin' || authStore.getUserRole == 'penjual'"
          :to="{ name: 'store-management' }"
          spanText="Toko"
          currentRoute="/dashboard"
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
                  :class="route.path === '/dashboard' ? 'fill-black' : ''"
                ></path>
              </g>
            </svg>
          </template>
        </SidebarList>
        <!-- end of to store-management -->

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
      </ul>
    </aside>

    <div class="col-span-8 bg-[#F5F5DC]">
      <RouterView />
    </div>
  </div>
</template>

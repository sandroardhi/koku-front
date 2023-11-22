<script setup>
import Container from '../../../components/dashboard/Container.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'

const users = ref({})
const isLoading = ref(false)

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  },
  baseURL: 'http://localhost:8000'
}

const fetchAllUser = async () => {
  isLoading.value = true
  const { data } = await axios.get('/api/admin/users', config)
  users.value = data
  isLoading.value = false
}

onMounted(() => {
  fetchAllUser()
})
</script>

<template>
  <Container title="User Management">
    <div class="w-[90%] mx-auto my-6 bg-white shadow-lg">
      <table class="min-w-full divide-y divide-gray-200 mt-">
        <thead>
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ user.tipe_user }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >{{ user.status }}</span
              >
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                class="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out"
              >
                Edit
              </button>
              <button
                class="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Container>
</template>

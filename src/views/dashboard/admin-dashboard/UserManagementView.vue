<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../../components/dashboard/Container.vue'
import Modal from '../../../components/common/Modal.vue'
import Table from '../../../components/common/Table.vue'
import { useAdminRepository } from '@/composables/useAdminRepository'
import { useRoleRepository } from '@/composables/useRoleRepository'

const role_repository = useRoleRepository()

const admin_repository = useAdminRepository()

const route = useRoute()
const router = useRouter()
const users = ref([])
const roles = ref([])
const selectedItem = ref({})
const selectedRoleId = ref({})
const isLoading = ref(false)
const status = ['active', 'pending', 'suspended']

const fetchAllUser = async () => {
  isLoading.value = true
  const { data } = await admin_repository.users()
  users.value = data
  isLoading.value = false
}

const fetchAllRoles = async () => {
  isLoading.value = true
  const { data } = await role_repository.index()
  roles.value = data
  isLoading.value = false
}

const toggleModal = (item) => {
  selectedItem.value = {} // Clear previous value

  selectedItem.value = { ...item }
  selectedRoleId.value = item.role_id
}

const onUpdateUser = async () => {
  isLoading.value = true
  const { status } = selectedItem.value
  const role_id = selectedRoleId.value

  const data = {
    status,
    role_id
  }
  try {
    await admin_repository.update_role(selectedItem.value.id, data)

    router.go()
  } catch (e) {
    console.error(e)
  }
  isLoading.value = false
}
const labels = [
  { id: 1, text: 'Nama', field: 'name' },
  { id: 2, text: 'Email', field: 'email' },
  { id: 3, text: 'Role', field: 'role' },
  { id: 4, text: 'Status', field: 'status' }
]

onMounted(async () => {
  await fetchAllUser()
  await fetchAllRoles()
  console.log(roles.value)
})
</script>

<template>
  <Container title="User Management">
    <div role="status" v-if="isLoading" class="mx-auto w-full flex h-screen justify-center items-center">
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
    <div class="w-full py-5 min-h-[200px]" v-else>
      <div class="w-full bg-white shadow-xl rounded-lg p-5 min-h-[100px]">
        <Table
          :labels="labels"
          :data="users"
          :excerptLength="20"
          :actionButtons="[{ id: 1, text: '', type: 'hidden' }]"
        >
          <template #customButton="{ item }">
            <Modal buttonText="Edit" modalTitle="Edit User" :toggleModal="() => toggleModal(item)">
              <template #modalBody>
                <form
                  class="p-4 md:p-5"
                  enctype="multipart/form-data"
                  :action="route.path"
                  @submit.prevent="onUpdateUser"
                >
                  <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                      <label
                        for="role"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Role</label
                      >
                      <select
                        id="role"
                        name="role"
                        v-model="selectedRoleId"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option disabled value="">Choose a role</option>
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                          {{ role.name }}
                        </option>
                      </select>
                    </div>
                    <div class="col-span-2">
                      <label
                        for="status"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Status</label
                      >
                      <select
                        id="status"
                        name="status"
                        v-model="selectedItem.status"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="" selected disabled>Choose a status</option>
                        <option v-for="s in status" :key="s" :value="s">{{ s }}</option>
                      </select>
                    </div>
                    <div class="col-span-2 mt-2">
                      <button
                        type="submit"
                        class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </form>
              </template>
            </Modal>
          </template>
        </Table>
      </div>
    </div>
  </Container>
</template>

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
    <div class="w-full px-10 py-5 min-h-[200px]">
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

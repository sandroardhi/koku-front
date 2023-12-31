<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Container from '../../../components/dashboard/Container.vue'
import Modal from '../../../components/common/Modal.vue'
import Table from '../../../components/common/Table.vue'
import { useRoleRepository } from '@/composables/useRoleRepository'

const role_repository = useRoleRepository()
const route = useRoute()
const router = useRouter()
const isLoading = ref()
const roles = ref([])
const permissions = ref([])
const rolePermission = ref([])

// fetch role
const fetchRoles = async () => {
  isLoading.value = true
  const { data } = await role_repository.index()
  roles.value = data
  isLoading.value = false
}
const fetchPermissions = async () => {
  isLoading.value = true
  const { data } = await role_repository.fetch_permission()
  permissions.value = data
  isLoading.value = false
}
// end of fetch role

// create role
const role_data = reactive({
  nama: '',
  permission: []
})

const onSubmitRole = async () => {
    isLoading.value = true
  try {
    await role_repository.store(role_data)

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
// end of create role

// edit role
const selectedRole = ref({
  role: '',
  permission: []
})
const fetchSelectedRole = async (id) => {
  isLoading.value = true
  const { data } = await role_repository.fetch_edit_data(id)
  selectedRole.value.role = data.role.name
  rolePermission.value = data.rolePermissions
  isLoading.value = false
}
const isItemChecked = (value, index) => {
  if (rolePermission.value[value] === value) {
    selectedRole.value.permission[index] = value
    return true
  } else {
    selectedRole.value.permission[index] = null
    return false
  }
}

const toggleCheckbox = (index) => {
  if (selectedRole.value.permission[index] != null) {
    rolePermission.value[selectedRole.value.permission[index]] = null
    selectedRole.value.permission[index] = null
  } else {
    rolePermission.value[selectedRole.value.permission[index]] =
      selectedRole.value.permission[index]
    // eslint-disable-next-line no-self-assign
    selectedRole.value.permission[index] = selectedRole.value.permission[index]
  }
}

const onUpdateRole = async (id) => {
  isLoading.value = true
  try {
    await role_repository.update(id, {
      name: selectedRole.value.role,
      permission: selectedRole.value.permission,
      _method: 'put'
    })

    router.go()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

const toggleModal = (id) => {
  fetchSelectedRole(id)
}
// end of edit role

const labels = [{ id: 1, text: 'Nama', field: 'name' }]

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<template>
  <Container title="Role Management">
    <div class="w-full px-10 py-5 min-h-[200px]">
      <div class="w-full bg-white shadow-xl rounded-lg p-5 mb-10">
        <div class="w-full flex flex-col justify-between">
          <p class="text-xl font-semibold">Buat Role</p>
          <form
            class="p-4 md:p-5"
            enctype="multipart/form-data"
            :action="route.path"
            @submit.prevent="onSubmitRole"
          >
            <div class="">
              <label for="nama" class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                >Nama</label
              >
              <input
                type="text"
                autocomplete="off"
                id="nama"
                v-model="role_data.name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <p class="block mb-2 text-md font-medium mt-3 text-gray-900 dark:text-white">
              Permission
            </p>
            <div class="grid grid-cols-2">
              <div
                class="flex items-center mb-4 col-span-1"
                v-for="(permission, index) in permissions"
                :key="index"
              >
                <label for="" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  ><input
                    type="checkbox"
                    id="checkbox"
                    :value="permission.id"
                    v-model="role_data.permission"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {{ permission.name }}</label
                >
              </div>
            </div>
            <div class="mt-5">
              <button
                type="submit"
                class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Tambah kategori
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="w-full bg-white shadow-xl rounded-lg p-5 min-h-[100px]">
        <Table
          :labels="labels"
          :data="roles"
          :excerptLength="20"
          :actionButtons="[{ id: 1, text: '', type: 'hidden' }]"
        >
          <template #customButton="{ item }">
            <Modal
              buttonText="Edit"
              modalTitle="Edit Role"
              :toggleModal="() => toggleModal(item.id)"
            >
              <template #modalBody>
                <form
                  class="p-4 md:p-5"
                  enctype="multipart/form-data"
                  :action="route.path"
                  @submit.prevent="onUpdateRole(item.id)"
                >
                  <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-2">
                      <label
                        for="nama"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Nama</label
                      >
                      <input
                        type="text"
                        v-model="selectedRole.role"
                        autocomplete="off"
                        id="nama"
                        :placeholder="isLoading ? 'Sedang Loading' : ''"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      />
                    </div>
                    <div class="col-span-2 grid grid-cols-2">
                      <div
                        class="flex items-center mb-4 col-span-1"
                        v-for="(permission, index) in permissions"
                        :key="index"
                      >
                        <label
                          for=""
                          class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          ><input
                            type="checkbox"
                            id="checkbox"
                            :value="permission.id"
                            v-model="selectedRole.permission"
                            :checked="isItemChecked(permission.id, index)"
                            @change="toggleCheckbox(index)"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          {{ permission.name }}</label
                        >
                      </div>
                    </div>
                    <div class="col-span-2 mt-2">
                      <button
                        type="submit"
                        class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <p v-if="!isLoading">Edit</p>
                        <p v-else>Loading</p>
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

<script setup>
import Button from './Button.vue'
import Excerpt from './Excerpt.vue';
const props = defineProps({
  labels: {
    type: Array,
    default: undefined
  },
  data: {
    type: Array,
    default: undefined
  },
  actionButtons: {
    type: Array,
    default: undefined
  },
  roles: {
    type: Array,
    default: () => []
  },
  kategori: {
    type: Array,
    default: () => []
  },

})


const getUserRole = (roleId) => {
  const role = props.roles.find((r) => r.id === roleId)
  return role ? role.role : '-'
}
const getProdukKategori = (kategori_id) => {
  const kategori = props.kategori.find((k) => k.id === kategori_id)
  return kategori ? kategori.nama : '-'
}
const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200 mt-2">
    <thead>
      <tr>
        <td
          v-for="(label, labelIndex) in labels"
          :key="labelIndex"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {{ label.text }}
        </td>
        <td
          v-if="actionButtons"
          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          Aksi
        </td>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(item, itemIndex) in data" :key="itemIndex">
        <td
          v-for="(label, labelIndex) in labels"
          :key="labelIndex"
          class="px-6 py-4"
        >
          <template v-if="label.field === 'foto'">
            <img
              :src="`http://localhost:8000/storage/${item[label.field]}`"
              class="h-20"
              alt="Image"
            />
          </template>
          <template v-else-if="label.field === 'role'">
            <Excerpt :text="getUserRole(item.role_id)"/>
            <!-- Display user's role -->
            <!-- {{ excerpt(getUserRole(item.role_id)) }} -->
          </template>
          <template v-else-if="label.field === 'kategori'">
            <Excerpt :text="getProdukKategori(item.kategori_id)"/>
            <!-- Display user's role -->
            <!-- {{ excerpt(getProdukKategori(item.kategori_id)) }} -->
          </template>
          <template v-else-if="label.field === 'harga'">
            {{ formatter.format(item.harga) }}
          </template>
          <template v-else>
              <Excerpt :text="item[label.field]"/>
            <!-- {{ excerpt(item[label.field]) }} -->
          </template>
        </td>
        <td class="px-6 py-4 whitespace-nowrap" v-if="actionButtons">
          <Button
            v-for="(button, buttonIndex) in actionButtons"
            :key="buttonIndex"
            @click="() => button.handleClick(item.id)"
            :type="button.type"
            :text="button.text"
          />
          <slot name="customButton" v-bind:item="item" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

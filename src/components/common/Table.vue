<script setup>
import Button from './Button.vue'
defineProps({
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
  }
})
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
        <!-- New cell for action buttons -->
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="(item, itemIndex) in data" :key="itemIndex">
        <td
          v-for="(label, labelIndex) in labels"
          :key="labelIndex"
          class="px-6 py-4 whitespace-nowrap"
        >
          <template v-if="label.field === 'foto'">
            <img
              :src="`http://localhost:8000/storage/${item[label.field]}`"
              class="h-20"
              alt="Image"
            />
          </template>
          <template v-else>
            {{ item[label.field] }}
          </template>
        </td>
        <td class="px-6 py-4 whitespace-nowrap" v-if="actionButtons">
          <Button
            v-for="(button, buttonIndex) in actionButtons"
            :key="buttonIndex"
            @click="handleButtonClick(item, button.callback)"
            :type="button.type"
            :text="button.text"
          />
          <slot name="customButton" v-bind:item="item" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

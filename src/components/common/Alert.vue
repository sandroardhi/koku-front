<script setup>
defineProps({
  type: {
    type: String,
    default: undefined
  },
  message: {
    type: String,
    default: 'Hmm'
  }
})
</script>

<template>

<div v-if="type == 'info'" class="p-4 mt-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
  <span class="font-medium">Info!</span> {{ message }}
</div>
<div v-else-if="type == 'danger'" class="p-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
  <span class="font-medium">Waduh!</span> {{ message }}
</div>
<div v-else-if="type == 'success'" class="p-4 mt-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
  <span class="font-medium">Sukses!</span> {{ message }}
</div>
<div v-else-if="type == 'warning'" class="p-4 mt-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
  <span class="font-medium">Waduh!</span> {{ message }}
</div>


</template>

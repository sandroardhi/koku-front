<script setup>
defineProps({
  type: {
    type: String,
    default: 'blue'
  },
  text: String
})
</script>

<template>
    <button
      v-if="type == 'blue'"
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'dark'"
      type="button"
      class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'light'"
      type="button"
      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'green'"
      type="button"
      class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'red'"
      type="button"
      class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'yellow'"
      type="button"
      class="focus:outline-none text-white bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-2 focus:ring-[#ffae00bd] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'purple'"
      type="button"
      class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
    >
      {{ text }}
    </button>
    <button
      v-else-if="type == 'hidden'"
      type="button"
      class="hidden"
    >
      {{ text }}
    </button>
</template>

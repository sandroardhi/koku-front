<script setup>
import { ref } from 'vue'
defineProps({
  type: {
    type: String,
    default: undefined
  },
  message: {
    type: String,
    default: 'Hmm'
  },
  dismissable: {
    type: Boolean,
    default: false
  },
  alertToggle: {
    type: Function
  }
})

const showAlert = ref(true)

const handleClose = (alertToggle) => {
  showAlert.value = false

  if (alertToggle) {
    alertToggle()
  }
}
</script>

<template>
  <div v-if="showAlert">
    <!-- info -->
    <div
      v-if="type == 'info'"
      class="p-4 mt-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <div class="flex justify-between">
        <div><span class="font-medium">Info!</span> {{ message }}</div>
        <button
          v-if="dismissable"
          @click="handleClose(alertToggle)"
          type="button"
          class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
          data-dismiss-target="#alert-1"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- end of info -->

    <!-- danger -->
    <div
      v-else-if="type == 'danger'"
      class="p-4 mt-4 text-sm text-red-800 rounded-lg border border-red-400 bg-red-100 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <div class="flex justify-between">
        <div><span class="font-medium">Waduh!</span> {{ message }}</div>
        <button
          v-if="dismissable"
          @click="handleClose(alertToggle)"
          type="button"
          class="ms-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
          data-dismiss-target="#alert-2"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- end of danger -->

    <!-- success -->
    <div
      v-else-if="type == 'success'"
      class="p-4 mt-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      <div class="flex justify-between">
        <div><span class="font-medium">Sukses!</span> {{ message }}</div>
        <button
          v-if="dismissable"
          @click="handleClose(alertToggle)"
          type="button"
          class="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
          data-dismiss-target="#alert-3"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- end of success -->

    <!-- warning -->
    <div
      v-else-if="type == 'warning'"
      class="p-4 mt-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
      role="alert"
    >
      <div class="flex justify-between">
        <div><span class="font-medium">Waduh!</span> {{ message }}</div>
        <button
          v-if="dismissable"
          @click="handleClose(alertToggle)"
          type="button"
          class="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700"
          data-dismiss-target="#alert-4"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- end of warning -->
  </div>
</template>

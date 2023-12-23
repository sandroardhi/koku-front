<script setup>
import { ref } from 'vue'

const modal = ref(false)
const modalToggle = (toggleModal) => {
  modal.value = !modal.value

  if (modal.value) {
    document.body.classList.add('overflow-y-hidden')
  } else {
    document.body.classList.remove('overflow-y-hidden')
  }

  if (toggleModal) {
    toggleModal()
  }
}

defineProps({
  buttonText: String,
  modalTitle: String,
  buttonWidth: String,
  toggleModal: Function
})
</script>

<template>
  <!-- Modal toggle -->
  <button
    @click="modalToggle(toggleModal)"
    :class="`w-[${buttonWidth}%]  text-white bg-[#FFB000] hover:bg-[#ffae00bd] focus:ring-2 focus:outline-none focus:ring-[#ffae00bd] font-medium rounded-lg px-5 py-2.5 text-center`"
    type="button"
  >
    {{ buttonText }}
  </button>

  <!-- Main modal -->
  <div
    :class="modal ? 'block bg-[rgba(0,0,0,0.5)] h-screen' : 'hidden'"
    class="overflow-y-auto bg-overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-md max-h-full mx-auto mt-5 mb-14">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ modalTitle }}</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click="modalToggle(toggleModal)"
          >
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
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <slot name="modalBody" />
        <!-- Modal footer -->
        <div
          class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
        >

        </div>
      </div>
    </div>
  </div>
</template>

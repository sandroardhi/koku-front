<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 10
  }
})

const showFullText = computed(() => props.text.length <= props.maxLength)
const showBox = ref(false)

const excerptText = computed(() => {
  return props.text.length > props.maxLength
    ? `${props.text.substring(0, props.maxLength)}...`
    : props.text
})
</script>
<template>
  <div class="relative">
    <template v-if="showFullText">
      {{ text }}
    </template>
    <template v-else>
      <span @click="showBox = true" class="cursor-pointer">{{ excerptText }}</span>
      <div
        v-if="showBox"
        class="absolute -top-20 left-10 w-[300px] bg-white border border-gray-300 p-2 z-10"
      >
        <div class="w-full p-4 break-all">
          <div class="break-all">{{ text }}</div>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute group w-6 top-2 right-2 cursor-pointer"
          @click="showBox = false"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Menu / Close_MD">
              <path
                id="Vector"
                d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="group-hover:stroke-red-500 duration-200"
              ></path>
            </g>
          </g>
        </svg>
      </div>
    </template>
  </div>
</template>

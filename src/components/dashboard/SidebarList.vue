<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  to: {
    type: Object,
    default: undefined
  },
  currentRoute: String,
  spanText: String,
})
</script>

<template>
  <router-link :to="to">
    <li
      class="flex items-center hover:bg-gray-200 p-2 rounded-md group mt-4"
      :class="route.path === currentRoute ? 'bg-gray-200' : ''"
    >
      <slot name="svg" />
      <span
        class="ml-2 text-xl text-[#9CA3AF] group-hover:text-black transition-all duration-150 font-normal font-sans"
        :class="route.path === currentRoute ? 'text-black' : ''"
      >
        {{ spanText }}
      </span>
      </li
  ></router-link>
</template>

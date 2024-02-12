<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  to: {
    type: Object,
    default: undefined
  },
  currentRoute: String,
  spanText: String
})
</script>

<template>
  <router-link :to="to">
    <li
      class="flex relative items-center hover:bg-gray-200 p-2 rounded-md group mt-4"
      :class="route.path === currentRoute ? 'bg-gray-200' : ''"
    >
      <div :class="route.path === currentRoute ? 'absolute w-1 h-full bg-yellow-300 -right-[0.75rem] rounded-l-2xl' : ''"></div>
      <slot name="svg" />
      <span
        class="ml-2 text-md font-semibold text-[#1f2836] group-hover:text-black transition-all duration-150 font-sans"
        :class="route.path === currentRoute ? 'text-black' : ''"
      >
        {{ spanText }}
      </span>
    </li></router-link
  >
</template>

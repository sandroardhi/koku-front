<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="bg-white w-full h-[53px] py-3 px-5">
    <p class="text-lg font-medium">{{ title }}</p>
  </div>

    <slot />
</template>

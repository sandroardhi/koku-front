<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="p-5">
    <div class="bg-[#FEFEFE] w-full h-[53px] rounded-lg py-3 px-5 shadow-md">
      <p class="text-lg font-medium">{{ title }}</p>
    </div>

    <div class="">
      <slot />
    </div>
  </div>
</template>

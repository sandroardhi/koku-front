<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="box-border antialiased bg-white" v-auto-animate="{ duration: 500 }">
    <RouterView /> 
  </div>
</template>

<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import Container from '../../../../components/dashboard/Container.vue'

const route = useRoute()
</script>

<template>
  <Container title="Payouts">
    <div class="w-full">
      <div class="w-full mt-5">
        <router-link
          to="/dashboard/payouts"
          class="inline-block w-[140px] p-2 font-medium mr-1 rounded-t-lg shadow-top"
          :class="route.path == '/dashboard/payouts' ? 'bg-[#FACA15] text-white' : 'bg-white'"
          >Bayar Penjual</router-link
        >
        <router-link
          to="/dashboard/payouts/pengantar"
          class="inline-block w-[140px] p-2 font-medium mr-1 rounded-t-lg shadow-top"
          :class="
            route.path == '/dashboard/payouts/pengantar' ? 'bg-[#FACA15] text-white' : 'bg-white'
          "
          >Bayar Pengantar</router-link
        >
        <router-link
          to="/dashboard/payouts/refund"
          class="inline-block w-[140px] p-2 font-medium mr-1 rounded-t-lg shadow-top"
          :class="
            route.path == '/dashboard/payouts/refund' ? 'bg-[#FACA15] text-white' : 'bg-white'
          "
          >Bayar Refund</router-link
        >
        <router-link
          to="/dashboard/payouts/selesai"
          class="inline-block w-[180px] p-2 font-medium rounded-t-lg shadow-top"
          :class="
            route.path == '/dashboard/payouts/selesai' ? 'bg-[#FACA15] text-white' : 'bg-white'
          "
          >Riwayat Pembayaran</router-link
        >
      </div>
      <div class="w-full pb -5 min-h-[200px]">
        <div
          class="w-full bg-white shadow-xl rounded-tl-none rounded-lg p-5 min-h-[100px] mb-10 z-20"
        >
          <RouterView />
        </div>
      </div>
    </div>
  </Container>
</template>

<style scoped>
.shadow-top {
  box-shadow: 0 -10px 20px -10px rgba(115, 115, 115, 0.25);
}
</style>

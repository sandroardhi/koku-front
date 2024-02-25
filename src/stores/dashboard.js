// authStore.js
import { defineStore } from 'pinia'
// import { useOrderRepository } from '../../../composables/useOrderRepository'

// const order_repository = useOrderRepository()

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    orderPenjualCount: 0,
    orderPengantarCount: 0
  }),
  getters: {
    getOrderPenjual: (state) => state.orderPenjualCount,
    getOrderPengantar: (state) => state.orderPengantarCount
  },
  actions: {
    setOrderPenjualCount(count) {
      this.orderPenjualCount = count
    },
    setOrderPengantarCount(count) {
      this.orderPengantarCount = count
    }
  }
})

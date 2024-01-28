// keranjangStore.js
import { defineStore } from 'pinia'
import { useKeranjangRepository } from '@/composables/useKeranjangRepository'

const keranjang_repository = useKeranjangRepository()

export const useKeranjangStore = defineStore('keranjang', {
  state: () => ({
    produk: null,
    totalHarga: null
  }),
  getters: {
    getProduk: (state) => state.produk,
    getTotalHarga: (state) => state.totalHarga
  },
  actions: {
    async addToCart(data) {
      await keranjang_repository.addToCart(data)
    },
    async getCartData() {
      const { data } = await keranjang_repository.getCartData()

      if (data && data.keranjang) {
        this.produk = JSON.stringify(data.produkData)
        this.totalHarga = calculateTotalHarga(data.produkData)

        localStorage.setItem('produk', JSON.stringify(data.produkData))
        localStorage.setItem('keranjang', JSON.stringify(data.keranjang))
      } else {
        this.produk = null
        this.totalHarga = null

        localStorage.removeItem('produk')
        localStorage.removeItem('keranjang')
      }
    },
    async updateKuantitas(data) {
      await keranjang_repository.updateKuantitas(data)
    },
    async deleteCartProduct(data) {
      await keranjang_repository.deleteCartProduct(data)
    },
    checkKeranjangOnReload() {
      const storedProduk = localStorage.getItem('produk')
      const storedKeranjang = localStorage.getItem('keranjang')

      if (storedKeranjang && storedProduk) {
        this.produk = storedProduk
        this.totalHarga = calculateTotalHarga(JSON.parse(storedProduk))
      }
    }
  }
})

// Helper function to calculate totalHarga
function calculateTotalHarga(produkData) {
  if (produkData !== null) {
    return produkData.reduce((total, product) => {
      const productHarga = product.harga * product.pivot.kuantitas
      return total + productHarga
    }, 0)
  }
}

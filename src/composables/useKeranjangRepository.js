import { useHttp } from './useHttp'

export const useKeranjangRepository = () => {
  const http = useHttp()

  const addToCart = (data) => http.post('/api/keranjang/add-to-cart', data)

  const getCartData = () => http.get(`/api/keranjang/get-cart-data`)

  const updateKuantitas = (data) => http.put(`/api/keranjang/update-kuantitas`, data)

  const deleteCartProduct = (data) => http.destroy(`/api/keranjang/delete`, data);

  return {
    addToCart,
    getCartData,
    updateKuantitas,
    deleteCartProduct
  }
}

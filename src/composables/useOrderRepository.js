import { useHttp } from './useHttp'

export const useOrderRepository = () => {
  const http = useHttp()

  const payAndCreateOrder = (data) => http.post('/api/order/pay-and-create', data)

  const deleteOrder = (data) => http.post(`api/order/destroy`, data)

  const orderPending = () => http.get(`api/order/order-pending`)

  const orderProses = () => http.get(`api/order/order-proses`)

  const orderSelesai = () => http.get(`api/order/order-selesai`)

  const orderMasuk = () => http.get(`api/order/order-masuk`)
  
  const updateStatus = (data) => http.post(`api/order/order-update-status`, data)

  return {
    payAndCreateOrder,
    deleteOrder,
    orderPending,
    orderProses,
    orderSelesai,
    orderMasuk,
    updateStatus
  }
}

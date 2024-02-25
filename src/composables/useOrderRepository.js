import { useHttp } from './useHttp'

export const useOrderRepository = () => {
  const http = useHttp()

  // USER ORDER

  const payAndCreateOrder = (data) => http.post('/api/order/pay-and-create', data)

  const deleteOrder = (data) => http.post(`api/order/destroy`, data)

  const checkPengantar = (data) => http.post(`api/order/check-pengantar`, data)

  const orderPending = () => http.get(`api/order/order-pending`)

  const orderProses = () => http.get(`api/order/order-proses`)

  const orderSelesai = () => http.get(`api/order/order-selesai`)

  const updateUserStatusSelesai = (data) => http.post(`api/order/order-user-update-selesai`, data)

  // END OF USER ORDER

  // PENJUAL ORDER

  const orderMasuk = () => http.get(`api/order-penjual/order-masuk`)

  const orderPenjualCount = () => http.get(`api/order-penjual/order-count`)

  const updateStatusDibuat = (data) => http.post(`api/order-penjual/order-update-dibuat`, data)

  const updateStatusSelesai = (data) => http.post(`api/order-penjual/order-update-selesai`, data)

  const orderPenjualSelesai = () => http.get(`api/order-penjual/order-selesai`)

  const orderPenjualGagal = () => http.get(`api/order-penjual/order-cancel`)

  // END OF PENJUAL ORDER

  // PENGANTAR ORDER

  const orderPengantarCount = () => http.get(`api/order-pengantar/order-count`)

  // END OF PENGANTAR ORDER

  return {
    payAndCreateOrder,
    deleteOrder,
    checkPengantar,
    orderPending,
    orderProses,
    orderSelesai,
    updateUserStatusSelesai,
    orderMasuk,
    updateStatusDibuat,
    updateStatusSelesai,
    orderPenjualSelesai,
    orderPenjualGagal,
    orderPenjualCount,
    orderPengantarCount
  }
}

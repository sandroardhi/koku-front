import { useHttp } from './useHttp'

export const useDashboardRepository = () => {
  const http = useHttp()

  // ADMIN
  const uangMasukAdminPenjual = () => http.get('/api/admin/uang-penjual')

  const uangMasukAdminPengantar = () => http.get('/api/admin/uang-pengantar')

  const uangMasukAdminRefund = () => http.get('/api/admin/uang-refund')

  const uangMasukSelesaiAdmin = () => http.get('/api/admin/uang-selesai')

  const dashboardAdmin = () => http.get('/api/admin/dashboard')

  const bayarPenjual = (data) => http.post('/api/admin/bayar-penjual', data)

  const bayarPengantar = (data) => http.post('/api/admin/bayar-pengantar', data)

  const bayarRefund = (data) => http.post('/api/admin/bayar-refund', data)
  // END OF ADMIN

  // PEMBELI
  const uangRefundPembeli = () => http.get('/api/order/uang-refund')
  // END OF PEMBELI

  // PENJUAL
  const uangMasukPenjual = () => http.get('/api/order-penjual/uang-masuk')

  const dashboardPenjual = () => http.get('/api/order-penjual/dashboard')

  // END OF PENJUAL

  // PENGANTAR
  const uangMasukPengantar = () => http.get('/api/order-pengantar/uang-masuk')

  const dashboardPengantar = () => http.get('/api/order-pengantar/dashboard')

  // END OF PENGANTAR

  return {
    uangMasukAdminPenjual,
    uangMasukAdminPengantar,
    uangMasukSelesaiAdmin,
    uangMasukAdminRefund,
    dashboardAdmin,
    bayarPenjual,
    bayarPengantar,
    bayarRefund,
    uangRefundPembeli,
    uangMasukPenjual,
    uangMasukPengantar,
    dashboardPenjual,
    dashboardPengantar
  }
}

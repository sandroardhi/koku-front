import { useHttp } from './useHttp'

export const useDashboardRepository = () => {
  const http = useHttp()

  // ADMIN
  const uangMasukAdminPenjual = () => http.get('/api/admin/uang-penjual')

  const uangMasukAdminPengantar = () => http.get('/api/admin/uang-pengantar')

  const uangMasukSelesaiAdmin = () => http.get('/api/admin/uang-selesai')

  const bayarPenjual = (data) => http.post('/api/admin/bayar-penjual', data)

  const bayarPengantar = (data) => http.post('/api/admin/bayar-pengantar', data)
  // END OF ADMIN

  // PENJUAL
  const uangMasukPenjual = () => http.get('/api/order-penjual/uang-masuk')
  // END OF PENJUAL

  // PENGANTAR
  const uangMasukPengantar = () => http.get('/api/order-pengantar/uang-masuk')
  // END OF PENGANTAR

  return {
    uangMasukAdminPenjual,
    uangMasukAdminPengantar,
    uangMasukSelesaiAdmin,
    bayarPenjual,
    bayarPengantar,
    uangMasukPenjual,
    uangMasukPengantar
  }
}

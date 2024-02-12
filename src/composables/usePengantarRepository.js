import { useHttp } from './useHttp'

export const usePengantarRepository = () => {
  const http = useHttp()

  const orderMasuk = () => http.get(`api/order-pengantar/order-masuk`)
  
  const orderPengantarSelesai = () => http.get(`api/order-pengantar/order-selesai`)
  
  const orderPengantarGagal = () => http.get(`api/order-pengantar/order-cancel`)
  
  const updateStatusSelesai = (data) => http.post(`api/order-pengantar/order-update-selesai`, data)

  const togglePengantarActive = () => http.post(`api/order-pengantar/toggle-active`)

  const togglePengantarNonactive = () => http.post(`api/order-pengantar/toggle-nonactive`)

  return {
    orderMasuk,
    updateStatusSelesai,
    orderPengantarSelesai,
    orderPengantarGagal,
    togglePengantarActive,
    togglePengantarNonactive
  }
}

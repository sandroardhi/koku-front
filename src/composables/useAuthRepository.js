// useAuthRepository ini buatkita connect ke server kita
import { useHttp } from './useHttp'

export const useAuthRepository = () => {
  const http = useHttp()

  const login = (credentials) => {
    return http.post('api/auth/login', credentials)
  }
  const register = (credentials) => {
    return http.post('api/auth/register', credentials)
  }
  const registerPenjual = (credentials) => {
    return http.post('api/auth/register-penjual', credentials)
  }
  const registerPengantar = (credentials) => {
    return http.post('api/auth/register-pengantar', credentials)
  }
  const logout = () => {
    return http.get('api/auth/logout')
  }
  const getUser = () => {
    return http.get('api/auth/get-user')
  }
  const updateRekening = (data) => {
    return http.post('api/auth/update-rekening', data)
  }
  const csrf = () => {
    return http.get('/sanctum/csrf-cookie')
  }
  const tujuan = () => {
    return http.get('api/auth/tujuan')
  }
  const create_tujuan = (data) => {
    return http.post('api/auth/create-tujuan', data)
  }

  return {
    login,
    register,
    logout,
    getUser,
    csrf,
    tujuan,
    create_tujuan,
    registerPenjual,
    updateRekening,
    registerPengantar
  }
}

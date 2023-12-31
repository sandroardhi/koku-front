import { useHttp } from './useHttp'

export const useAdminRepository = () => {
  const http = useHttp()

  const users = () => http.get('/api/admin/users')

  const update_role = (id, data) => http.put(`/api/admin/user/${id}/update-role`, data)

  return {
    users,
    update_role
  }
}

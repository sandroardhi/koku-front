import { useHttp } from "./useHttp";

export const useRoleRepository = () => {
    const http = useHttp();

    const index = () => http.get(`/api/roles`);
    
    const show = (id) => http.get(`/api/roles/${id}`);
    
    const store = (data) => http.post(`/api/roles`, data);
    
    const update =  (id, data) => http.post(`/api/roles/${id}`, data);
    
    const destroy = (id) => http.destroy(`/api/roles/${id}`);

    const fetch_permission = () => http.get(`/api/roles/fetch/permission`);

    const fetch_edit_data = (id) => http.get(`/api/roles/fetch-edit-data/${id}`);

    return {
        index,
        show,
        store, 
        update,
        destroy,
        fetch_permission,
        fetch_edit_data
    };
}
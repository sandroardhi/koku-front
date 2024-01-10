import { useHttp } from "./useHttp";

export const useKantinRepository = () => {
    const http = useHttp();

    const index = () => http.get('/api/kantin');

    const show = (id) => http.get(`/api/kantin/${id}`);
    
    const store = (data) => http.post('/api/kantin', data);
    
    const update =  (id, data) => http.post(`/api/kantin/${id}`, data);
    
    const destroy = (id) => http.destroy(`/api/kantin/${id}`);
    
    const show_profile_kantin = (id) => http.get(`/api/kantin/profile/${id}`);

    return {
        index,
        show,
        store, 
        update,
        destroy,
        show_profile_kantin
    };
}
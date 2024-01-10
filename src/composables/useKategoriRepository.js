import { useHttp } from "./useHttp";

export const useKategoriRepository = () => {
    const http = useHttp();

    const index = () => http.get('/api/kategori/fetch-kategori');
    
    const show = (id) => http.get(`/api/kategori/fetch-kategori-detail/${id}`);
    
    const store = (data) => http.post('/api/kategori/store-kategori', data);

    const update =  (id, data) => http.post(`/api/kategori/update-kategori/${id}`, data);
    
    const destroy = (id) => http.destroy(`/api/kategori/delete-kategori/${id}`);

    return {
        index,
        show,
        store, 
        update,
        destroy
    };
}
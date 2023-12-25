import { useHttp } from "./useHttp";

export const useKategoriRepository = () => {
    const http = useHttp();

    const index = () => http.get('/api/kategori/fetch-kategori');

    const store = (data) => http.post('/api/kategori/store-kategori', data);

    const update =  (id, data) => http.post(`/api/kategori/update-kategori/${id}`, data);
    
    const destroy = (id) => http.destroy(`/api/kategori/delete-kategori/${id}`);

    return {
        index,
        store, 
        update,
        destroy
    };
}
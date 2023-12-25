import { useHttp } from "./useHttp";

export const useProdukRepository = () => {
    const http = useHttp();

    const show_produk = (id) => http.get(`/api/produk/${id}`);

    const store = (data, id) => http.post(`/api/produk/${id}`, data);

    const update =  (id, data) => http.post(`/api/produk/${id}`, data);
    
    const destroy = (id) => http.destroy(`/api/produk/${id}`);

    return {
        show_produk,
        store, 
        update,
        destroy
    };
}
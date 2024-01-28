// useAuthRepository ini buatkita connect ke server kita
import { useHttp } from "./useHttp";

export const useAuthRepository = () => {
    const http = useHttp();

    const login = (credentials) => {
        return http.post("api/auth/login", credentials)
    };
    const register = (credentials) => {
        return http.post("api/auth/register", credentials)
    };
    const logout = () => {
        return http.get("api/auth/logout")
    };
    const profile = () => {
        return http.get("api/auth/profile")
    };
    const csrf = () => {
        return http.get('/sanctum/csrf-cookie')
    };
    const tujuan = () => {
        return http.get("api/auth/tujuan")
    };
    const create_tujuan = (data) => {
        return http.post("api/auth/create-tujuan", data)
    };

    return {
        login,
        register,
        logout,
        profile,
        csrf,
        tujuan,
        create_tujuan
    }
};
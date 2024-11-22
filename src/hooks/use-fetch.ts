import axios from "axios";

export const useFetch = async (url: string, method: string, data?: any) => {
    const response = await axios({
        method,
        url: (import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_BASE_API_URL) + url,
        data,
        withCredentials: true,
    });

    return response;
};
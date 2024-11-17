import axios from "axios";

export const useFetch = async (url: string, method: string, data?: any) => {
    const response = await axios({
        method,
        url: (import.meta.env.MODE === "development" ? "http://localhost:8080/api" : import.meta.env.MODE) + url,
        data,
    });

    return response;
};
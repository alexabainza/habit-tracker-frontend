import axios, { AxiosRequestConfig } from "axios";

export const useFetch = async (url: string, method: string = "GET", data?: any, headers?: Record<string, string>) => {
    // Construct base URL dynamically based on environment
    try {
        const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : import.meta.env.VITE_BASE_API_URL;

        const config: AxiosRequestConfig = {
            method,
            url: baseURL + url,
            data,
            withCredentials: true, // To include cookies for CORS
            headers: {
                "Content-Type": "application/json", // Default to JSON content
                ...headers, // Add any custom headers
            },
        };

        const response = await axios(config);
        return response; // Return only the response data for convenience
    } catch (error) {
        console.error(error);
        throw error;
    }
};
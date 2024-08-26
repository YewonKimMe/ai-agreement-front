import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': import.meta.env.VITE_SECURITY_API_KEY,
    },
    withCredentials: true,
});
export default instance;
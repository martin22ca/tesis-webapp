import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axiosClient;
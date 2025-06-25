import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor untuk response error (misal token expired)
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect langsung
    }
    return Promise.reject(error);
  }
);


export default AxiosInstance;

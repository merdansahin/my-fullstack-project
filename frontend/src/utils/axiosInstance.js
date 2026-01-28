import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/refresh`, {
        refreshToken,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;

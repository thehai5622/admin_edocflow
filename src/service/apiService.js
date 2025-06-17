import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL,
});

// Trạng thái dùng để tránh nhiều request cùng refresh token 1 lúc
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor - Thêm Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || "";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Xử lý lỗi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(`${baseURL}v1/user/refresh-token`, {
          token: refreshToken,
          fcm_token: null,
        });

        const { access_token, refresh_token } = res.data.data;
        console.log(access_token, refresh_token);

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

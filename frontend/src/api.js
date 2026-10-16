import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 90000,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// If the free server is waking up, retry GET requests a few times
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    if (config && !err.response && config.method === "get") {
      config.retryCount = (config.retryCount || 0) + 1;
      if (config.retryCount <= 4) {
        await sleep(8000);
        return api(config);
      }
    }
    return Promise.reject(err);
  }
);

export function errorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (!err.response) return "The server is waking up. Please wait a minute and try again.";
  return "Something went wrong. Please try again.";
}

export default api;
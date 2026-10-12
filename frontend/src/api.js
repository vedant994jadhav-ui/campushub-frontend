import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 90000,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Server sleep madhun uthat asel tar GET requests parat try karto
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
  if (!err.response) return "Server jaagha hot aahe. 1 minute thamb ani parat try kar.";
  return "Kahi tari chukla. Parat try kar.";
}

export default api;
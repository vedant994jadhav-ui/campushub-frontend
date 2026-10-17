import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 90000,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// While the free server is waking up, retry requests for about a minute
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;
    const status = err.response?.status;
    const waking = !err.response || [502, 503, 504].includes(status);
    if (config && waking) {
      config.retryCount = (config.retryCount || 0) + 1;
      if (config.retryCount <= 12) {
        await sleep(6000);
        return api(config);
      }
    }
    return Promise.reject(err);
  }
);

export function errorMessage(err) {
 
  const status = err.response?.status;
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response && [502, 503, 504].includes(status))
    return "The server is waking up. Please wait a minute and try again.";
  if (err.request && !err.response)
    return `Cannot reach the server (${api.defaults.baseURL}). If it is the free server, wait a minute and try again.`;
  return "Something went wrong. Please try again.";

}

export default api;
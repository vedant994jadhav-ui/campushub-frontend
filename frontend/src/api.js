import axios from "axios";

const api = axios.create({
  baseURL: "/api", // localhost:8080 काढले आहे, Vite Proxy हे हाताळेल
});

export function errorMessage(err) {
  return err.response?.data?.message || "Backend shi connect hou shakat nahi";
}

export default api;
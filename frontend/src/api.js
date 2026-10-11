import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname ==='localhost'
  ? 'http://localhost:8080/api' 
        : 'https://YOUR_BACKEND_URL/api' // Jar backend render/railway/render var deploy kela asel tar ticha URL ithe yeil

});

export function errorMessage(err) {
  return err.response?.data?.message || "Backend shi connect hou shakat nahi";
}

export default api;
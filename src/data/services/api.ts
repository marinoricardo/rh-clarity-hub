// src/services/api.js
import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // baseURL: "http://guezirh.edm.co.mz/rh-clarity-hub-backend/public/api",
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para respostas (erros)
api.interceptors.response.use(
  (response) => response, // retorna normalmente
  (error) => {
    console.log("Error: " + error)
    console.table("Response: " + error.response)
    if (error.response && error.response.status === 401) {
      // Limpa token
      localStorage.removeItem("token");

      // Mostra alerta
      Swal.fire({
        icon: "warning",
        title: "Sessão expirada",
        text: "Você precisa fazer login novamente.",
      }).then(() => {
        // Redireciona para login
        window.location.href = "/"; 
      });
    }
    return Promise.reject(error);
  }
);

export default api;

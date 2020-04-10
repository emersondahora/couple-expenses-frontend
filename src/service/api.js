import axios from "axios";
import { toast } from "react-toastify";
import history from "./history";

const api = axios.create({
  baseURL: "http://localhost:3333"
});

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      toast.error("Sessão expirada, favor faça login novamente.");
      history.push("/loggout");
    } else if (error.response.data?.error)
      toast.error(error.response.data.error);
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const devUrl = "http://localhost:6500/api";

const apiRequest = axios.create({
  baseURL: devUrl,
  withCredentials: true,
});

export default apiRequest;

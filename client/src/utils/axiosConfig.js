import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (backendUrl) {
  axios.defaults.baseURL = backendUrl;
  console.log("[axios] baseURL set to", backendUrl);
}
export default axios;

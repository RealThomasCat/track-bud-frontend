import axios from "axios";
import { apiBaseURL } from "@/lib/api-config";

export const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true, // enable cookie-based auth
    headers: { "Content-Type": "application/json" },
});

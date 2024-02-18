import axios from "axios";

// @ts-ignore
const BASE_URL = `${import.meta.env.VITE_API_URL}`;

export const API = axios.create({
  baseURL: BASE_URL,
});

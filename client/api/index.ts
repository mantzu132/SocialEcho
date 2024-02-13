import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const url = `${BASE_URL}/posts`;

export const fetchPosts = () => axios.get(url);
// export const createPost = (newPost) => axios.post(url, newPost);
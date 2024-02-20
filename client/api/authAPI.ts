import { API } from "./utils";

export const signUp = async (formData: any) => {
  try {
    const res = await API.post("/users/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { error: null, data: res.data };
  } catch (error: any) {
    return {
      error: error.response.data.errors,
      data: null,
    };
  }
};

export const signIn = async (formData: FormData) => {
  try {
    const res = await API.post("/users/signin", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { error: null, data: res.data };
  } catch (error: any) {
    return { error: error.response?.data?.message, data: null };
  }
};

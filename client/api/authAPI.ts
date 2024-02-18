import { API } from "./utils";

export const signUp = async (formData: any) => {
  try {
    const res = await API.post("/users/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { error: null, data: res.data };
  } catch (error) {
    return {
      error: error.response.data.errors,
      data: null,
    };
  }
};

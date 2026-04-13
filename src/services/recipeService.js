import axiosClient from "../api/axiosClient";

export const getRecipes = async () => {
  return await axiosClient.get("/recipes");
};

export const createRecipe = async (data) => {
  return await axiosClient.post("/recipes", data);
};

export const updateRecipe = async (id, data) => {
  return await axiosClient.put(`/recipes/${id}`, data);
};

export const deleteRecipe = async (id) => {
  return await axiosClient.delete(`/recipes/${id}`);
};

// UPLOAD IMAGE
export const uploadImage = async (formData) =>
  axiosClient.post("/recipes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

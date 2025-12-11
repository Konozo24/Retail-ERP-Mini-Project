import API from "./axios";

export const register = async (userData) => {
  try {
    const response = await API.post("/users/auth/register", userData);
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response?.data || error);
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post("/users/auth/login", credentials);
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response?.data || error);
  }
};

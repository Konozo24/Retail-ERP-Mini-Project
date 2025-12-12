import API from "./axios";

// REGISTER
export const registerAPI = async (credentials) => {
    try {
        const response = await API.post(`/users/auth/register`, credentials);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// LOGIN
export const loginAPI = async (credentials) => {
    try {
        const response = await API.post(`/users/auth/login`, credentials);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET ALL USERS (GET /users)
export const getUsersAPI = async () => {
    try {
        const response = await API.get(`/users`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET USER BY ID (GET /users/{userId})
export const getUserByIdAPI = async (userId) => {
    try {
        const response = await API.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// UPDATE USER (PUT /users/{userId})
export const updateUserAPI = async (userId, updateData) => {
    try {
        const response = await API.put(`/users/${userId}`, updateData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// DELETE USER (DELETE /users/{userId})
export const deleteUserAPI = async (userId) => {
    try {
        const response = await API.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

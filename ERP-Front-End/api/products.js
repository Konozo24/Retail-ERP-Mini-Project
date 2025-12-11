import API from "./axios";

// CREATE PRODUCT (POST /products)
export const createProductAPI = async (productData) => {
    try {
        const response = await API.post(`/products`, productData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET ALL PRODUCTS (GET /products)
export const getProductsAPI = async () => {
    try {
        const response = await API.get(`/products`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET PRODUCT BY ID (GET /products/{productId})
export const getProductByIdAPI = async (productId) => {
    try {
        const response = await API.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// UPDATE PRODUCT (PUT /products/{productId})
export const updateProductAPI = async (productId, updatedData) => {
    try {
        const response = await API.put(`/products/${productId}`, updatedData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// DELETE PRODUCT (DELETE /products/{productId})
export const deleteProductAPI = async (productId) => {
    try {
        const response = await API.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

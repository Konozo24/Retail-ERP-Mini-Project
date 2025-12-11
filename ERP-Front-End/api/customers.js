import API from "./axios";

// CREATE CUSTOMER (POST /customers)
export const createCustomerAPI = async (customerData) => {
    try {
        const response = await API.post(`/customers`, customerData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET ALL CUSTOMERS (GET /customers)
export const getCustomersAPI = async () => {
    try {
        const response = await API.get(`/customers`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET CUSTOMER BY ID (GET /customers/{customerId})
export const getCustomerByIdAPI = async (customerId) => {
    try {
        const response = await API.get(`/customers/${customerId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// UPDATE CUSTOMER (PUT /customers/{customerId})
export const updateCustomerAPI = async (customerId, updatedData) => {
    try {
        const response = await API.put(`/customers/${customerId}`, updatedData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// DELETE CUSTOMER (DELETE /customers/{customerId})
export const deleteCustomerAPI = async (customerId) => {
    try {
        const response = await API.delete(`/customers/${customerId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

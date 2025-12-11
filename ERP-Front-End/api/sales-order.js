import API from "./axios";

// CREATE SALES ORDER (POST /sales-order)
export const createSalesOrderAPI = async (salesOrderData) => {
    try {
        const response = await API.post(`/sales-order`, salesOrderData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET ALL SALES ORDERS (GET /sales-order)
export const getSalesOrdersAPI = async () => {
    try {
        const response = await API.get(`/sales-order`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET SALES ORDER BY ID (GET /sales-order/{salesOrderId})
export const getSalesOrderByIdAPI = async (salesOrderId) => {
    try {
        const response = await API.get(`/sales-order/${salesOrderId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// DELETE SALES ORDER (DELETE /sales-order/{salesOrderId})
export const deleteSalesOrderAPI = async (salesOrderId) => {
    try {
        const response = await API.delete(`/sales-order/${salesOrderId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

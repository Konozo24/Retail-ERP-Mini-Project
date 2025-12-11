import API from "./axios";

// CREATE PURCHASE ORDER (POST /purchase-order)
export const createPurchaseOrderAPI = async (purchaseOrderData) => {
    try {
        const response = await API.post(`/purchase-order`, purchaseOrderData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET ALL PURCHASE ORDERS (GET /purchase-order)
export const getPurchaseOrdersAPI = async () => {
    try {
        const response = await API.get(`/purchase-order`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET PURCHASE ORDER BY ID (GET /purchase-order/{purchaseOrderId})
export const getPurchaseOrderByIdAPI = async (purchaseOrderId) => {
    try {
        const response = await API.get(`/purchase-order/${purchaseOrderId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// UPDATE PURCHASE ORDER (PUT /purchase-order/{purchaseOrderId})
export const updatePurchaseOrderAPI = async (purchaseOrderId, updatedData) => {
    try {
        const response = await API.put(
            `/purchase-order/${purchaseOrderId}`,
            updatedData
        );
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// DELETE PURCHASE ORDER (DELETE /purchase-order/{purchaseOrderId})
export const deletePurchaseOrderAPI = async (purchaseOrderId) => {
    try {
        const response = await API.delete(`/purchase-order/${purchaseOrderId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

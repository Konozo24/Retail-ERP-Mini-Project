import API from "./axios";

// CREATE SUPPLIER (POST /suppliers)
export const createSupplierAPI = async (supplierData) => {
    try {
        const response = await API.post(`/suppliers`, supplierData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET ALL SUPPLIERS (GET /suppliers)
export const getSuppliersAPI = async () => {
    try {
        const response = await API.get(`/suppliers`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// GET SUPPLIER BY ID (GET /suppliers/{supplierId})
export const getSupplierByIdAPI = async (supplierId) => {
    try {
        const response = await API.get(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// UPDATE SUPPLIER (PUT /suppliers/{supplierId})
export const updateSupplierAPI = async (supplierId, updatedData) => {
    try {
        const response = await API.put(`/suppliers/${supplierId}`, updatedData);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

// DELETE SUPPLIER (DELETE /suppliers/{supplierId})
export const deleteSupplierAPI = async (supplierId) => {
    try {
        const response = await API.delete(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response?.data || error);
    }
};

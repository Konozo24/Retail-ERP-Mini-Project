import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const EditPurchaseOrderModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {

    const [errors, setErrors] = useState(null);

    const [formData, setFormData] = useState({
        status: "PENDING",
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                status: initialData?.status || "PENDING",
            });
            setErrors(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const hasError = (field) => Boolean(errors?.[field]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors?.[name]) {
            setErrors((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (initialData?.status === "DELIVERED") {
            return;
        }

        try {
            await onSubmit({
                purchaseOrderId: initialData.id,
                payload: {
                    status: formData.status,
                },
            });
            onClose();
        } catch (error) {
            if (error?.response?.data) {
                setErrors(error.response.data);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="po-edit-form" onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={initialData?.status === "DELIVERED"}
                                className={`${
                                    hasError("status") ? "border-red-400" : "border-gray-200"
                                } w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all disabled:bg-gray-100`}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            {hasError("status") && (
                                <p className="text-sm text-red-500">{errors.status}</p>
                            )}
                        </div>

                        {initialData?.status === "DELIVERED" && (
                            <p className="text-sm text-red-500">
                                This purchase order is delivered and cannot be updated.
                            </p>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="po-edit-form"
                        type="submit"
                        disabled={initialData?.status === "DELIVERED"}
                        className="px-6 py-2.5 rounded-lg bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white font-medium transition-colors shadow-sm disabled:opacity-60"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPurchaseOrderModal;

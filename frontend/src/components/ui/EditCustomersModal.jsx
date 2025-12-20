import React, { useState, useEffect } from "react";
import AvatarUpload from "./AvatarUpload";
import BaseEditModal from "./BaseEditModal";

const EditCustomersModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {

    const [errors, setErrors] = useState(null);

    // --- Form State ---
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatar: null,
    });

    // --- Reset/Populate Form on Open ---
    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            const nameParts = initialData.name
                ? initialData.name.split(" ")
                : [];

            setFormData({
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                avatar: initialData.avatar || null,
            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                avatar: null,
            });
        }

        setErrors(null);
    }, [isOpen, initialData]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // backend may return `name` error for full name
        if (
            errors?.name &&
            (name === "firstName" || name === "lastName")
        ) {
            setErrors((prev) => {
                const { name: _, ...rest } = prev;
                return rest;
            });
        }

        if (errors?.[name]) {
            setErrors((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, avatar: imageUrl }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`.trim(),
        };

        try {
            await onSubmit(submissionData);
            onClose();
        } catch (error) {
            if (error?.response?.data?.message) {
                showToast(error.response.data.message, "error");
            } else if (error?.response?.data) {
                setErrors(error.response.data);
            }
        }
    };

    return (
        <BaseEditModal
            isOpen={isOpen}
            title={title}
            onClose={onClose}
            onSubmit={handleSubmit}
            formId="customer-form"
        >

            {/* Image Upload Section */}
            <AvatarUpload
                value={formData.avatar}
                onChange={handleImageChange}
                onRemove={() =>
                    setFormData((prev) => ({ ...prev, avatar: null }))
                }
            />

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`${errors?.name ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
                        placeholder="Enter first name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`${errors?.name ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
                        placeholder="Enter last name"
                    />
                </div>

                {/* Name Error (shown once) */}
                {errors?.name && (
                    <div className="md:col-span-2">
                        <p className="text-sm text-red-500">{errors.name}</p>
                    </div>
                )}

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`${errors?.email ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
                        placeholder="example@email.com"
                    />
                    {errors?.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${errors?.phone ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
                        placeholder="+1 123 456 7890"
                    />
                    {errors?.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                </div>

            </div>

        </BaseEditModal>
    );
};

export default EditCustomersModal;

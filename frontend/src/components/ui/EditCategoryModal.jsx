import React, { useState, useEffect } from "react";
import BaseEditModal from "./BaseEditModal";
import AvatarUpload from "./AvatarUpload";

const EditCategoryModal = ({ isOpen, onClose, onSave, category, isEditMode = false }) => {

    const [formData, setFormData] = useState({
        name: "",
        prefix: "",
        image: null,
        imagePreview: null
    });

    const [errors, setErrors] = useState(null);

    // --- Reset/Populate Form on Open ---
    useEffect(() => {
        if (!isOpen) return;

        if (category) {
            setFormData({
                name: category.name || "",
                prefix: category.prefix || "",
                image: category.image || null,
                imagePreview: category.image || null
            });
        } else {
            setFormData({
                name: "",
                prefix: "",
                image: null,
                imagePreview: null
            });
        }

        setErrors(null);
    }, [isOpen, category]);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: name === "prefix" ? value.toUpperCase() : value }));

        if (errors?.[name]) {
            setErrors((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("Image size must be less than 5MB")
            //setToast({ show: true, message: "Image size must be less than 5MB", type: "error" });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({
                ...prev,
                image: event.target.result,
                imagePreview: event.target.result
            }));
        };
        reader.onerror = () => {
            alert("Failed to read image file")
            //setToast({ show: true, message: "Failed to read image file", type: "error" });
        };
        reader.readAsDataURL(file);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      if (error?.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

    return (
        <BaseEditModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            title={isEditMode ? "Edit Category" : "Add Category"}
            formId="category-form"
        >

            {/* Image Upload */}
            <AvatarUpload
                value={formData.imagePreview}
                onChange={handleImageChange}
                onRemove={() => setFormData((prev) => ({ ...prev, image: null, imagePreview: null }))}
            />

            {/* Category Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Category Name <span className="text-red-500">*</span>
                </label>
                <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${errors?.name ? "border-red-400" : "border-gray-200"} 
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
                    placeholder="Enter category name"
                />
                {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Category Prefix */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Category Prefix <span className="text-red-500">*</span>
                </label>
                <input
                    required
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleChange}
                    className={`${errors?.prefix ? "border-red-400" : "border-gray-200"} 
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
                    placeholder="Enter category prefix"
                />
                {errors?.prefix && <p className="text-sm text-red-500">{errors.prefix}</p>}
            </div>

        </BaseEditModal>
    );
};

export default EditCategoryModal;

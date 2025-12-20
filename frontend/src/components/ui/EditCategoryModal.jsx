import React, { useState, useEffect } from "react";
import BaseEditModal from "./BaseEditModal";
import AvatarUpload from "./AvatarUpload";

const EditCategoryModal = ({ isOpen, onClose, onSave, category, isEditMode = false }) => {

  const [formData, setFormData] = useState({
    name: "",
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
        image: category.image || null,
        imagePreview: category.image || null
      });
    } else {
      setFormData({
        name: "",
        image: null,
        imagePreview: null
      });
    }

    setErrors(null);
  }, [isOpen, category]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSave(formData);
      onClose();
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

    </BaseEditModal>
  );
};

export default EditCategoryModal;

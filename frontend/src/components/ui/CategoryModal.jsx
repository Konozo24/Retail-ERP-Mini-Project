import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CategoryModal = ({ isOpen, onClose, onSave, category, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    imagePreview: null
  });

  useEffect(() => {
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
  }, [category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && category) {
      onSave({ ...category, ...formData });
    } else {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold">{isEditMode ? "Edit Category" : "Add Category"}</h2>
          <button 
            onClick={onClose}
            className="text-white bg-destructive hover:bg-destructive/90 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name <span className="text-destructive">*</span></label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-colors relative">
              {formData.imagePreview ? (
                <div className="relative w-full">
                  <img 
                    src={formData.imagePreview} 
                    alt="Category preview" 
                    className="w-32 h-32 mx-auto object-cover rounded-md border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                    className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <label className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white rounded-md text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
            >
              {isEditMode ? "Save Changes" : "Add Category"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CategoryModal;


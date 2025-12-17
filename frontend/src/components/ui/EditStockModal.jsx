import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditStockModal = ({ isOpen, onClose, onSave, product, categories = [] }) => {
  const [formData, setFormData] = useState({
    sku: "",
    category: "",
    name: "",
    stockQty: 0,
    reorderLevel: 10
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        category: product.category || "",
        name: product.name || "",
        stockQty: product.stockQty || 0,
        reorderLevel: product.reorderLevel || 10
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...product, ...formData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-lg shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold">Edit Low Stocks</h2>
          <button 
            onClick={onClose}
            className="text-white bg-destructive hover:bg-destructive/90 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Row 1: SKU & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Category</option>
                {/* Dynamically Map Categories from Data */}
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name <span className="text-destructive">*</span></label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Row 3: Qty & Qty Alert */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Qty <span className="text-destructive">*</span></label>
              <input 
                type="number" 
                name="stockQty"
                value={formData.stockQty}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qty Alert <span className="text-destructive">*</span></label>
              <input 
                type="number" 
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
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
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
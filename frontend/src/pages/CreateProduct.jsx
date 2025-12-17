import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, RefreshCw, ChevronDown, PlusCircle } from "lucide-react";

import {
  useCreateProduct,
  useUpdateProduct,
  useGetCategories,
} from "../api/products.api";
import Toast from "../components/ui/Toast";

const CreateProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {mutateAsync: createProduct} = useCreateProduct();
    const {mutateAsync: updateProduct} = useUpdateProduct();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories();

    // 1. Check if we are in "Edit Mode" (data passed from Products table)
    const productToEdit = location.state?.productToEdit;
    const isEditMode = !!productToEdit;

    // 2. Form State
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        unitPrice: "",
        costPrice: "",
        reorderLevel: "",
        description: "",
        image: null,
        imagePreview: null
    });

    // 3. Toast State
    const [toast, setToast] = useState(null);

    // 3. Populate form if Editing
    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name || "",
                sku: productToEdit.sku || "",
                category: productToEdit.category || "",
                unitPrice: productToEdit.unitPrice ? productToEdit.unitPrice.toString().replace(/[^0-9.]/g, '') : "",
                costPrice: productToEdit.costPrice ? productToEdit.costPrice.toString().replace(/[^0-9.]/g, '') : "",
                reorderLevel: productToEdit.reorderLevel || "",
                description: "", // ERD didn't have description, keeping empty
                image: productToEdit.image || null,
                imagePreview: productToEdit.image || null
            });
        }
    }, [isEditMode, productToEdit]);

    // --- HANDLERS ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (limit to 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setToast({ message: "Image size must be less than 5MB", type: "error" });
                return;
            }

            // Convert to Base64
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    image: event.target.result, // Base64 string
                    imagePreview: event.target.result
                }));
            };
            reader.onerror = () => {
                setToast({ message: "Failed to read image file", type: "error" });
            };
            reader.readAsDataURL(file);
        }
    };

    const generateSKU = () => {
        // Generate SKU based on category
        const categoryPrefix = {
            'Smartphone': 'SMRT',
            'Tablet': 'TAB',
            'Laptop': 'LAP',
            'Desktop': 'DESK',
            'Wearable': 'WEAR',
            'Audio': 'AUD'
        };
        
        const prefix = categoryPrefix[formData.category] || 'PROD';
        const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit number
        const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
        
        const generatedSku = `${prefix}${randomNum}-${randomSuffix}`;
        setFormData(prev => ({ ...prev, sku: generatedSku }));
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setFormData(prev => ({ ...prev, category: newCategory.trim() }));
            setShowCategoryModal(false);
            setToast({ message: `Category "${newCategory}" selected`, type: "success" });
            setNewCategory("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.name || !formData.sku || !formData.category || !formData.unitPrice || !formData.costPrice || !formData.reorderLevel) {
            setToast({ message: "Please fill in all required fields", type: "error" });
            return;
        }

        const payload = {
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            category: formData.category.trim(),
            unitPrice: parseFloat(formData.unitPrice),
            costPrice: parseFloat(formData.costPrice),
            reorderLevel: Math.max(0, parseInt(formData.reorderLevel) || 0),
            image: formData.image || null, // Base64 image or null
        };
        
        try {
            console.log("Submitting Form Data:", payload);
            if (isEditMode) {
                await updateProduct({
                    productId: productToEdit.id,
                    payload: payload
                });
                setToast({ message: "Product Updated Successfully!", type: "success" });
            } else {
                await createProduct(payload);
                setToast({ message: "Product Created Successfully!", type: "success" });
            }
            setTimeout(() => navigate("/products"), 1500);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to save product';
            console.error("Error:", errorMsg);
            setToast({ message: errorMsg, type: "error" });
        }
    };

    return (
        <div className="space-y-6 pb-20"> {/* pb-20 to give space for bottom actions if needed */}

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? "Edit Product" : "Create Product"}
                    </h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">{isEditMode ? "Edit Product" : "Create Product"}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/products")}
                    className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- SECTION 1: Product Information --- */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Product Information</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Product Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* SKU */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                SKU <span className="text-destructive">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="Enter SKU"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generateSKU}
                                    className="bg-accent hover:bg-accent/90 text-white px-4 rounded-md text-xs font-medium transition-colors"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-sm font-medium leading-none flex justify-between">
                                <span className="flex items-center gap-1">
                                    Category <span className="text-destructive">*</span>
                                </span>
                                <span 
                                    onClick={() => navigate("/category")}
                                    className="text-accent text-xs cursor-pointer flex items-center gap-1 hover:underline"
                                >
                                    <PlusCircle className="w-3 h-3" /> Add New
                                </span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                                disabled={categoriesLoading}
                            >
                                <option value="">{categoriesLoading ? "Loading categories..." : "Choose Category"}</option>
                                {categoriesData?.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: Pricing & Stocks --- */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Pricing & Stocks</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Unit Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Unit Price <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="unitPrice"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                placeholder="Enter Unit Price"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Cost Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Cost Price <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                placeholder="Enter Cost Price"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Reorder Level */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Reorder Level <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="number"
                                name="reorderLevel"
                                value={formData.reorderLevel}
                                onChange={handleChange}
                                placeholder="Enter Reorder Level"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3: Images --- */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Images</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="p-6">
                        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-colors relative">

                            {formData.imagePreview ? (
                                <div className="relative group">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Preview"
                                        className="max-h-48 rounded shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, imagePreview: null, image: null }))}
                                            className="text-white bg-destructive p-2 rounded-full hover:bg-destructive/90"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                        Drag and drop a file to upload
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        SVG, PNG, JPG or GIF (max. 800x400px)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- FOOTER BUTTONS --- */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="px-6 py-2 rounded-md border border-input bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-md bg-accent hover:bg-accent/90 text-white text-sm font-medium shadow-sm transition-colors"
                    >
                        {isEditMode ? "Update Product" : "Add Product"}
                    </button>
                </div>

            </form>

            {/* Category Modal - REMOVED, use dedicated Category page instead */}
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default CreateProduct;
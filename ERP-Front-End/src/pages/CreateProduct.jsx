import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, RefreshCw, ChevronDown, PlusCircle } from "lucide-react";

const CreateProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Check if we are in "Edit Mode" (data passed from Products table)
    const productToEdit = location.state?.productToEdit;
    const isEditMode = !!productToEdit;

    // 2. Form State
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        image: null,
        imagePreview: null
    });

    // 3. Populate form if Editing
    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name || "",
                sku: productToEdit.sku || "",
                category: productToEdit.category || "",
                price: productToEdit.unit_price ? productToEdit.unit_price.toString().replace(/[^0-9.]/g, '') : "", // Remove 'RM' if present
                quantity: productToEdit.stock_qty || "",
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
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const generateSKU = () => {
        const randomSku = "APL-" + Math.floor(100 + Math.random() * 900);
        setFormData(prev => ({ ...prev, sku: randomSku }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send data to backend
        console.log("Submitting Form Data:", formData);
        alert(isEditMode ? "Product Updated Successfully!" : "Product Created Successfully!");
        navigate("/products");
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
                                <span className="text-accent text-xs cursor-pointer flex items-center gap-1 hover:underline">
                                    <PlusCircle className="w-3 h-3" /> Add New
                                </span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            >
                                <option value="">Choose Category</option>
                                <option value="Phone">Phone</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Wearable">Wearable</option>
                                <option value="Audio">Audio</option>
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
                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Quantity <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter Stock Qty"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Price <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter Unit Price"
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
        </div>
    );
};

export default CreateProduct;
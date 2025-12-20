import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, RefreshCw, ChevronDown, PlusCircle } from "lucide-react";

import { useGetCategories } from "../api/categories.api";
import { useCreateProduct, useUpdateProduct, generateSKUById } from "../api/products.api";
import Toast from "../components/ui/Toast";

const CreateProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { mutateAsync: createProduct } = useCreateProduct();
    const { mutateAsync: updateProduct } = useUpdateProduct();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories();

    const productToEdit = location.state?.productToEdit;
    const isEditMode = !!productToEdit;

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        categoryId: 0,
        unitPrice: "",
        costPrice: "",
        reorderLevel: "",
        description: "",
        image: null,
        imagePreview: null
    });

    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Populate form if editing
    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name || "",
                sku: productToEdit.sku || "",
                categoryId: productToEdit.category?.id || 0,
                unitPrice: productToEdit.unitPrice?.toString() || "",
                costPrice: productToEdit.costPrice?.toString() || "",
                reorderLevel: productToEdit.reorderLevel?.toString() || "",
                description: productToEdit.description || "",
                image: productToEdit.image || null,
                imagePreview: productToEdit.image || null
            });
        }
    }, [isEditMode, productToEdit]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value.trimStart() }));
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setToast({ show: true, message: "Image size must be less than 5MB", type: "error" });
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
            setToast({ show: true, message: "Failed to read image file", type: "error" });
        };
        reader.readAsDataURL(file);
    };

    const generateSKU = async () => {
        const SKU = await generateSKUById(formData.categoryId);
        setFormData(prev => ({ ...prev, sku: SKU }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.sku || !formData.categoryId || !formData.unitPrice || !formData.costPrice || !formData.reorderLevel) {
            setToast({ show: true, message: "Please fill in all required fields", type: "error" });
            return;
        }

        const payload = {
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            categoryId: formData.categoryId,
            unitPrice: parseFloat(formData.unitPrice),
            costPrice: parseFloat(formData.costPrice),
            reorderLevel: Math.max(0, parseInt(formData.reorderLevel) || 0),
            description: formData.description.trim(),
            image: formData.image || null
        };

        try {
            if (isEditMode) {
                await updateProduct({ productId: productToEdit.id, payload });
                setToast({ show: true, message: "Product Updated Successfully!", type: "success" });
            } else {
                await createProduct(payload);
                setToast({ show: true, message: "Product Created Successfully!", type: "success" });
            }
            setTimeout(() => navigate("/products"), 1200);
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to save product';
            setToast({ show: true, message: errorMsg, type: "error" });
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? "Edit Product" : "Create Product"}</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">{isEditMode ? "Edit Product" : "Create Product"}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/products")}
                    className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Info */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Product Information</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium">Product Name <span className="text-destructive">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>

                        <div>
                            <label className="text-sm font-medium">SKU <span className="text-destructive">*</span></label>
                            <div className="flex gap-2">
                                <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="Enter SKU" required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                                <button type="button" onClick={generateSKU} className="bg-accent hover:bg-accent/90 text-white px-4 rounded-md text-xs font-medium">Generate</button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium flex justify-between">
                                <span>Category <span className="text-destructive">*</span></span>
                                <span onClick={() => navigate("/category")} className="text-accent text-xs cursor-pointer flex items-center gap-1 hover:underline"><PlusCircle className="w-3 h-3" /> Add New</span>
                            </label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required
                                disabled={categoriesLoading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                <option value="">{categoriesLoading ? "Loading categories..." : "Choose Category"}</option>
                                {categoriesData?.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Pricing & Stocks</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium">Unit Price <span className="text-destructive">*</span></label>
                            <input type="number" step="0.01" min={0} name="unitPrice" value={formData.unitPrice} onChange={handleChange} required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Cost Price <span className="text-destructive">*</span></label>
                            <input type="number" step="0.01" min={0} name="costPrice" value={formData.costPrice} onChange={handleChange} required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Reorder Level <span className="text-destructive">*</span></label>
                            <input type="number" step={1} min={0} name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Images</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="p-6">
                        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-colors relative">
                            {formData.imagePreview ? (
                                <div className="relative group">
                                    <img src={formData.imagePreview} alt="Preview" className="max-h-48 rounded shadow-sm" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, imagePreview: null, image: null }))}
                                            className="text-white bg-destructive p-2 rounded-full hover:bg-destructive/90"><RefreshCw className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4"><Upload className="w-6 h-6 text-muted-foreground" /></div>
                                    <p className="text-sm font-medium text-foreground">Drag and drop a file to upload</p>
                                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={() => navigate("/products")}
                        className="px-6 py-2 rounded-md border border-input bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors">Cancel</button>
                    <button type="submit"
                        className="px-6 py-2 rounded-md bg-accent hover:bg-accent/90 text-white text-sm font-medium shadow-sm transition-colors">{isEditMode ? "Update Product" : "Add Product"}</button>
                </div>
            </form>

            {/* Toast */}
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, show: false }))} />}
        </div>
    );
};

export default CreateProduct;

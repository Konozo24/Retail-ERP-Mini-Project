import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, RefreshCw, ChevronDown, PlusCircle } from "lucide-react";

const CreateSupplier = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Check if we are in "Edit Mode" (data passed from Suppliers table)
    const supplierToEdit = location.state?.supplierToEdit;
    const isEditMode = !!supplierToEdit;

    // 2. Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        image: null,
        imagePreview: null
    });

    // 3. Populate form if Editing
    useEffect(() => {
        if (isEditMode && supplierToEdit) {
            setFormData({
                name: supplierToEdit.name || "",
                phone: supplierToEdit.phone || "",
                email: supplierToEdit.email || "",
                address: supplierToEdit.address || "",
                image: supplierToEdit.image || null,
                imagePreview: supplierToEdit.image || null
            });
        }
    }, [isEditMode, supplierToEdit]);

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
        alert(isEditMode ? "Supplier Updated Successfully!" : "Supplier Created Successfully!");
        navigate("/suppliers");
    };

    return (
        <div className="space-y-6 pb-20"> {/* pb-20 to give space for bottom actions if needed */}

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isEditMode ? "Edit Supplier" : "Create Supplier"}
                    </h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">{isEditMode ? "Edit Supplier" : "Create Supplier"}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/suppliers")}
                    className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Suppliers
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- SECTION 1: Supplier Information --- */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                        <h2 className="font-semibold text-foreground">Supplier Information</h2>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Supplier Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Supplier Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter supplier name"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Phone <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Address <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                        onClick={() => navigate("/suppliers")}
                        className="px-6 py-2 rounded-md border border-input bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-md bg-accent hover:bg-accent/90 text-white text-sm font-medium shadow-sm transition-colors"
                    >
                        {isEditMode ? "Update Supplier" : "Add Supplier"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreateSupplier;
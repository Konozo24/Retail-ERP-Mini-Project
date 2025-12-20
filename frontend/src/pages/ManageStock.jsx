import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import EditStockModal from "../components/ui/EditStockModal";
import DeleteModal from "../components/ui/DeleteModal";
import Toast from "../components/ui/Toast";
import { Plus, Search, Filter, Package, Upload, Download } from "lucide-react";
import { getImageUrlByProduct } from "../data/categoryImages";

import { useGetCategoriesName } from "../api/categories.api";
import { 
    useGetProductsPage,
    useUpdateProduct,
    useDeleteProduct
} from "../api/products.api";

const ManageStock = () => {
    // --- STATE ---
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- MODAL & TOAST STATE ---
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [currentStockItem, setCurrentStockItem] = useState(null);

    // --- DATA ---
    const { data: categoriesData } = useGetCategoriesName();
    const categories = categoriesData ?? [];

    const { data: productsPage, isLoading } = useGetProductsPage(
        debouncedSearchQuery, currentPage - 1, itemsPerPage, selectedCategory
    );
    const products = productsPage?.content ?? [];
    const totalPages = productsPage?.totalPages ?? 1;

    // --- DATA MUTATIONS ---
    const { mutateAsync: updateProduct } = useUpdateProduct();
    const { mutateAsync: deleteProduct } = useDeleteProduct();

    // --- HELPER: Toast ---
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    const renderStatusBadge = (stockQty, reorderLevel) => {
        let status = stockQty === 0 ? "Out of Stock" : stockQty <= reorderLevel ? "Low Stock" : "In Stock";
        let bgColor = "bg-gray-200 text-gray-800";
        if (status === "In Stock") bgColor = "bg-green-100 text-green-700";
        else if (status === "Low Stock") bgColor = "bg-yellow-100 text-yellow-700";
        else if (status === "Out of Stock") bgColor = "bg-red-100 text-red-700";
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>{status}</span>;
    };

    // --- HANDLERS ---
    const handleAddClick = () => {
        setCurrentStockItem(null);
        setIsStockModalOpen(true);
    };

    const handleEditClick = (row) => {
        setCurrentStockItem(row);
        setIsStockModalOpen(true);
    };

    const handleSaveStock = async (formData) => {
        try {
            await updateProduct({ productId: formData.id, payload: formData });
            setIsStockModalOpen(false);
            setCurrentStockItem(null);
            showToast(`Stock for ${formData.name} updated successfully!`, "success");
        } catch (err) {
            showToast("Failed to update stock.", "error");
        }
    };

    const handleDeleteClick = (row) => {
        setSelectedItem(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        try {
            await deleteProduct(selectedItem.id);
            setIsDeleteModalOpen(false);
            showToast(`Deleted stock record for ${selectedItem.name} successfully.`, "success");
        } catch (err) {
            showToast("Failed to delete stock record.", "error");
        }
    };

    const handleAddAdjustment = () => navigate("/stock/adjust");

    // --- COLUMNS ---
    const columns = [
        { header: "SKU", accessor: "sku", sortable: true },
        {
            header: "Product Name",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        <img src={getImageUrlByProduct(row)} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-foreground">{row.name}</span>
                </div>
            )
        },
        { header: "Category", accessor: "category", render: (row) => row.category?.name || "-" },
        { header: "Qty", accessor: "stockQty", sortable: true },
        { header: "Reorder Level", accessor: "reorderLevel", render: (row) => <span className="text-destructive font-medium">{row.reorderLevel}</span> },
        { header: "Status", accessor: "stockQty", sortable: true, render: (row) => renderStatusBadge(row.stockQty, row.reorderLevel) },
        { header: "Last Updated", accessor: "updatedAt", sortable: true, render: (row) => <span className="text-sm text-muted-foreground">{row.updatedAt}</span> },
    ];

    return (
        <div className="space-y-6 w-full relative">

            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary" /> Manage Stock
                    </h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Manage Stock</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-muted border border-input text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm hover:bg-muted/80" onClick={() => console.log("Import Stock Data")}>
                        <Upload className="w-4 h-4" /> Import
                    </button>
                    <button className="bg-muted border border-input text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm hover:bg-muted/80" onClick={() => console.log("Export Stock Data")}>
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm" onClick={handleAddAdjustment}>
                        <Plus className="w-4 h-4" /> Stock Adjustment
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search Name or SKU..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <div className="relative w-full sm:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Data Table */}
            <DataTable
                showNumber={false}
                columns={columns}
                data={products}
                isLoading={isLoading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Stock Item"
                message={`Are you sure you want to remove the stock record for ${selectedItem?.name}?`}
            />

            {/* Edit Modal */}
            <EditStockModal
                isOpen={isStockModalOpen}
                onClose={() => setIsStockModalOpen(false)}
                onSave={handleSaveStock}
                product={currentStockItem}
                categories={categories}
            />

        </div>
    );
};

export default ManageStock;

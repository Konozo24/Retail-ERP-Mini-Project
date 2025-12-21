import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal";
import ProductNameCell from "../components/ui/ProductNameCell";
import Toast from "../components/ui/Toast";
import { Plus, Search, Filter } from "lucide-react";

import { useGetCategoriesName } from "../api/categories.api";
import { useDeleteProduct, useGetProductsPage } from "../api/products.api";

const Products = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    const [selectedCategoryName, setSelectedCategoryName] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // --- DATA ---
    const { data: categoriesNameData } = useGetCategoriesName();
    const categoriesName = ["All", ...(categoriesNameData || [])];

    const { data: productsPage, isLoading } = useGetProductsPage(
        debouncedSearchQuery,
        currentPage - 1,
        itemsPerPage,
        selectedCategoryName
    );
    const products = productsPage?.content ?? [];

    const { mutateAsync: deleteProduct } = useDeleteProduct();

    // --- HELPERS ---
    const showToast = (message, type = "success") => setToast({ show: true, message, type });

    const handleAdd = () => navigate("/create-product");
    const handleEdit = (product) => navigate("/create-product", { state: { productToEdit: product } });
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete.id);
            showToast(`Deleted ${productToDelete.name} successfully.`, "success");
            setProductToDelete(null);
        } catch (error) {
            showToast("Failed to delete product.", "error");
        }
    };

    const totalPages = productsPage?.totalPages ?? 0;

    // --- COLUMNS ---
    const columns = [
        { header: "SKU", accessor: "sku", sortable: true },
        { header: "Product Name", accessor: "name", render: (row) => <ProductNameCell product={row} /> },
        { header: "Category", accessor: "category", render: (row) => row.category?.name || "-" },
        {
            header: "Price",
            accessor: "unitPrice",
            sortable: true,
            render: (row) => (
                <span>
                    RM {(row.unitPrice ?? 0).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                </span>
            ),
        },
        { header: "Qty", accessor: "stockQty" },
        {
            header: "Created By",
            accessor: "createdBy",
            render: (row) =>
                row.createdBy ? (
                    <div className="flex items-center gap-2">
                        <img
                            src={row.createdBy.avatar || `https://ui-avatars.com/api/?name=${row.createdBy.name}`}
                            alt={row.createdBy.name}
                            className="w-6 h-6 rounded-full object-cover border border-border"
                        />
                        <span className="text-sm font-medium text-muted-foreground">{row.createdBy.name}</span>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                ),
        },
    ];

    return (
        <div className="space-y-6 relative">
            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete ${productToDelete?.name}?`}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {" > "} <span className="text-primary">Products</span>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search Name or SKU..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="relative w-full sm:w-auto">
                    <select
                        value={selectedCategoryName}
                        onChange={(e) => {
                            setSelectedCategoryName(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
                    >
                        {categoriesName.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat === "All" ? "All Categories" : cat}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={products}
                isLoading={isLoading}
                showNumber={true}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />
        </div>
    );
};

export default Products;

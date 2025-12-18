import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal"; // Import Delete Modal
import Toast from "../components/ui/Toast"; // Import Toast
import { Plus, Search, Filter, ImageOff } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useDeleteProduct, useGetProductsPage, useGetCategories } from "../api/products.api";

// Category Placeholder Images - Professional Unsplash URLs
import {getImageUrl} from "../data/categoryImages"


const Products = () => {
    const navigate = useNavigate();

    // STATE
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Data
    // Fetch Categories dynamically
    const { data: categoriesData } = useGetCategories();
    const categories = ["All", ...(categoriesData || [])];

    // Fetch Products (Pass selectedCategory)
    const { data: productsPage, isLoading } = useGetProductsPage(
        debouncedSearchQuery,
        currentPage - 1,
        itemsPerPage,
        selectedCategory
    );
    const products = productsPage?.content ?? [];

    // Data Mutations
    const { mutateAsync: deleteProduct } = useDeleteProduct();

    // --- NEW: Modal & Toast State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [toast, setToast] = useState(null);

    // --- HANDLERS ---

    // Trigger Delete Modal (Replaces window.confirm)
    const handleDeleteClick = (row) => {
        setProductToDelete(row);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete Action (Executes deletion)
    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete.id);
                showToast(`Deleted ${productToDelete.name} successfully.`, "success");
                setProductToDelete(null);
            } catch (error) {
                showToast("Failed to delete product.", "error");
            }
        }
    };

    // Helper for Toast
    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleEdit = (row) => {
        navigate("/create-product", { state: { productToEdit: row } });
    };


    // --- PAGINATION ---
    const totalPages = productsPage?.totalPages ?? 0;

    // --- COLUMNS ---
    const columns = [
        { header: "SKU", accessor: "sku", sortable: true },
        {
            header: "Product Name",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    {/* PRODUCT IMAGE with fallback */}
                    <div className="relative w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted">
                        <img
                            src={getImageUrl(row)}
                            alt={row.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.classList.add('hidden');
                                const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback-icon');
                                if (fallback) fallback.classList.remove('hidden');
                            }}
                            onLoad={(e) => {
                                // Ensure fallback icon stays hidden when image loads (even for default placeholders)
                                const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback-icon');
                                if (fallback) fallback.classList.add('hidden');
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ImageOff className="img-fallback-icon w-5 h-5 text-muted-foreground/50 hidden" />
                        </div>
                    </div>
                    <span className="font-medium text-foreground">{row.name}</span>
                </div>
            )
        },
        { header: "Category", accessor: "category" },
        {
            header: "Price",
            accessor: "unitPrice",
            sortable: true,
            render: (row) => {
                const price = row.unitPrice || 0;
                return <span>RM {price.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>;
            }
        },

        { header: "Qty", accessor: "stockQty" },
        {
            header: "Created By",

            accessor: "createdBy",
            render: (row) => {
                if (!row.createdBy) {
                    return <span className="text-sm text-muted-foreground">-</span>;
                }

                return (
                    <div className="flex items-center gap-2">
                        <img
                            src={row.createdBy.avatar || `https://ui-avatars.com/api/?name=${row.createdBy.name}`}
                            alt="User"
                            className="w-6 h-6 rounded-full object-cover border border-border"
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                            {row.createdBy.name}
                        </span>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 relative">

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Delete Confirmation Modal */}
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
                        Dashboard {'>'} <span className="text-primary">Products</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/create-product")}
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

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
                        >
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat === "All" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={products}
                isLoading={isLoading}
                showNumber={true}
                onEdit={handleEdit}
                onDelete={handleDeleteClick} // Pass the new handler logic

                // Pagination Props
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(val) => setItemsPerPage(val)}
            />
        </div>
    );
};

export default Products;
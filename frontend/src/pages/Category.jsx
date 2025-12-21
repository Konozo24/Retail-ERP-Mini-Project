import React, { useState, useEffect } from "react";
import DataTable from "../components/ui/DataTable";
import EditCategoryModal from "../components/ui/EditCategoryModal";
import DeleteModal from "../components/ui/DeleteModal";
import Toast from "../components/ui/Toast";
import { Plus, Search, Filter } from "lucide-react";
import { getImageUrlByCategory } from "../data/categoryImages";

import { 
    useGetCategories, 
    useCreateCategory, 
    useUpdateCategory, 
    useDeleteCategory 
} from "../api/categories.api";

const Category = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal & Toast State
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [toast, setToast] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // --- DATA FETCHING ---
    const { data: categoriesData = [], isLoading } = useGetCategories();
    const { mutateAsync: createCategory } = useCreateCategory();
    const { mutateAsync: updateCategory } = useUpdateCategory();
    const { mutateAsync: deleteCategory } = useDeleteCategory();

    // --- COMPUTE FILTERED CATEGORIES ---
    const filteredCategories = categoriesData
        .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(cat => selectedCategoryFilter === "All" || cat.name === selectedCategoryFilter);

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    // --- HANDLERS ---
    const showToast = (message, type) => setToast({ message, type });

    const handleAddCategory = () => {
        setCategoryToEdit(null);
        setIsEditMode(false);
        setIsEditCategoryModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setIsEditMode(true);
        setIsEditCategoryModalOpen(true);
    };

    const handleSaveCategory = async (categoryData) => {
        const payload = {
            name: categoryData.name?.trim() || "",
            prefix: categoryData.prefix?.trim().toUpperCase() || "",
            image: categoryData.image || null,
        };
        try {
            if (isEditMode && categoryToEdit) {
                await updateCategory({ categoryId: categoryToEdit.id, payload });
                showToast(`Updated category "${payload.name}" successfully.`, "success");
            } else {
                await createCategory(payload);
                showToast(`Added category "${payload.name}" successfully.`, "success");
            }
        } catch (err) {
            showToast("Failed to save category.", "error");
        } finally {
            setIsEditCategoryModalOpen(false);
            setCategoryToEdit(null);
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.id);
            showToast(`Deleted category "${categoryToDelete.name}" successfully.`, "success");
        } catch (err) {
            showToast("Failed to delete category.", "error");
        } finally {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    // --- FILTER OPTIONS ---
    // const categoryFilterOptions = ["All", ...categoriesData.map(cat => cat.name)];

    // --- COLUMNS ---
    const columns = [
        {
            header: "Image",
            accessor: "image",
            render: (row) => (
                <div className="w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                    <img src={getImageUrlByCategory(row)} alt={row.name} className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            header: "Category",
            accessor: "name",
            render: (row) => (
                <span className="font-medium text-foreground">{row.name}</span>
            )
        },
        {
            header: "Product Count",
            accessor: "productCount",
            sortable: true,
            render: (row) => <span className="text-foreground">{row.productCount}</span>
        }
    ];

    return (
        <div className="space-y-6 relative">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Category Modal */}
            <EditCategoryModal
                isOpen={isEditCategoryModalOpen}
                onClose={() => { setIsEditCategoryModalOpen(false); setCategoryToEdit(null); }}
                onSave={handleSaveCategory}
                category={categoryToEdit}
                isEditMode={isEditMode}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Category</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Category</span>
                    </div>
                </div>
                <button
                    onClick={handleAddCategory}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                {/* <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={selectedCategoryFilter}
                            onChange={(e) => { setSelectedCategoryFilter(e.target.value); setCurrentPage(1); }}
                            className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
                        >
                            {categoryFilterOptions.map((cat, index) => (
                                <option key={index} value={cat}>{cat === "All" ? "Category" : cat}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                    </div>
                </div> */}
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={currentData}
                showNumber={true}
                onEdit={handleEditCategory}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                isLoading={isLoading}
            />
        </div>
    );
};

export default Category;

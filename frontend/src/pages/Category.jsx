import React, { useState, useEffect } from "react";
import DataTable from "../components/ui/DataTable";
import CategoryModal from "../components/ui/CategoryModal";
import DeleteModal from "../components/ui/DeleteModal";
import Toast from "../components/ui/Toast";
import { Plus, Search, Filter } from "lucide-react";
import { productsData as initialData } from "../data/mockData";

const Category = () => {
    // --- STATE ---
    const [products, setProducts] = useState(initialData);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal & Toast State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [toast, setToast] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // --- COMPUTE CATEGORIES FROM PRODUCT DATA ---
    useEffect(() => {
        const categoryMap = {};
        
        products.forEach(product => {
            if (!categoryMap[product.category]) {
                categoryMap[product.category] = {
                    id: product.category.toLowerCase().replace(/\s+/g, '-'),
                    name: product.category,
                    image: product.image, // Use first product's image as category image
                    productCount: 0
                };
            }
            categoryMap[product.category].productCount++;
        });

        const categoryList = Object.values(categoryMap);
        setCategories(categoryList);
    }, [products]);

    // --- HANDLERS ---

    const handleAddCategory = () => {
        setCategoryToEdit(null);
        setIsEditMode(false);
        setIsCategoryModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setCategoryToEdit(category);
        setIsEditMode(true);
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = (categoryData) => {
        if (isEditMode && categoryToEdit) {
            // Update category name in all products with this category
            const oldCategoryName = categoryToEdit.name;
            const newCategoryName = categoryData.name;
            
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.category === oldCategoryName 
                        ? { 
                            ...product, 
                            category: newCategoryName, 
                            image: categoryData.imagePreview || categoryData.image || product.image 
                          }
                        : product
                )
            );
            
            showToast(`Updated category "${newCategoryName}" successfully.`, "success");
        } else {
            // Add new category (this would typically add products, but for now just show success)
            showToast(`Added category "${categoryData.name}" successfully.`, "success");
        }
        setIsCategoryModalOpen(false);
        setCategoryToEdit(null);
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            // Remove all products with this category
            setProducts(prevProducts => 
                prevProducts.filter(product => product.category !== categoryToDelete.name)
            );
            showToast(`Deleted category "${categoryToDelete.name}" and all its products successfully.`, "success");
            setCategoryToDelete(null);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    // --- FILTERING ---
    const categoryFilterOptions = ["All", ...new Set(categories.map(cat => cat.name))];

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategoryFilter === "All" || category.name === selectedCategoryFilter;
        return matchesSearch && matchesCategory;
    });

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    // --- COLUMNS ---
    const columns = [
        {
            header: "Image",
            accessor: "image",
            render: (row) => (
                <div className="w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                    <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
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
            render: (row) => (
                <span className="text-foreground">{row.productCount}</span>
            )
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

            {/* Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryToEdit(null);
                }}
                onSave={handleSaveCategory}
                category={categoryToEdit}
                isEditMode={isEditMode}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? This will also delete all products in this category.`}
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
                    <Plus className="w-4 h-4" />
                    Add Category
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
                            value={selectedCategoryFilter}
                            onChange={(e) => {
                                setSelectedCategoryFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
                        >
                            {categoryFilterOptions.map((cat, index) => (
                                <option key={index} value={cat}>{cat === "All" ? "Category" : cat}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
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
                onItemsPerPageChange={(val) => setItemsPerPage(val)}
            />
        </div>
    );
};

export default Category;


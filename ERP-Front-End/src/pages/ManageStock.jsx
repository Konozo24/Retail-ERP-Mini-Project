import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal"; 
import Toast from "../components/ui/Toast"; 
import EditManageStock from "./EditManageStock";
import { Plus, Search, Filter, Package, Upload, Download, Edit } from "lucide-react"; 
import { productsData as initialProductData } from "../data/mockData";

// --- MOCK DATA FOR STOCK ---
const initialStockData = initialProductData.map(product => ({
    ...product,
    current_qty: product.stock_qty, 
    status: product.stock_qty > 50 ? 'In Stock' : product.stock_qty > 0 ? 'Low Stock' : 'Out of Stock',
    last_updated: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }),
}));


const ManageStock = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [stockItems, setStockItems] = useState(initialStockData);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- Modal & Toast State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); 
    const [toast, setToast] = useState(null);

    // 🚀 EDIT MODAL STATE
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stockItemToEdit, setStockItemToEdit] = useState(null);


    // --- HANDLERS ---

    const handleDeleteClick = (row) => {
        setItemToDelete(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setStockItems(stockItems.filter((item) => item.id !== itemToDelete.id));
            showToast(`Deleted stock record for ${itemToDelete.name} successfully.`, "success");
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    // 🚀 MODIFIED: handleEdit now opens the modal
    const handleEdit = (row) => {
        setStockItemToEdit(row);
        setIsEditModalOpen(true);
    };

    const handleAddAdjustment = () => {
        navigate("/stock/adjust"); 
    };

    // 🚀 NEW: Handle saving changes from the modal
    const handleSaveStockChanges = (updatedItem) => {
        setStockItems(stockItems.map(item => 
            item.id === updatedItem.id ? updatedItem : item
        ));
        showToast(`Stock for ${updatedItem.name} updated successfully!`, "success");
        setIsEditModalOpen(false);
        setStockItemToEdit(null);
    };
    
    const renderStatusBadge = (status) => {
        let bgColor = 'bg-gray-200 text-gray-800';
        if (status === 'In Stock') {
            bgColor = 'bg-green-100 text-green-700';
        } else if (status === 'Low Stock') {
            bgColor = 'bg-yellow-100 text-yellow-700';
        } else if (status === 'Out of Stock') {
            bgColor = 'bg-red-100 text-red-700';
        }

        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
                {status}
            </span>
        );
    };


    // --- FILTERING & PAGINATION (Logic unchanged) ---
    const categories = ["All", ...new Set(initialProductData.map(item => item.category))];

    const filteredStock = stockItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredStock.slice(startIndex, startIndex + itemsPerPage);

    // --- COLUMNS (MODIFIED: Added Responsible Person) ---
    const columns = [
        { header: "SKU", accessor: "sku", sortable: true },
        {
            header: "Product Name",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-foreground">{row.name}</span>
                </div>
            )
        },
        { header: "Category", accessor: "category" },
        { 
            header: "Current Qty", 
            accessor: "current_qty", 
            sortable: true,
            render: (row) => <span className="font-bold text-lg">{row.current_qty}</span>
        },
        // 🚀 RESPONSIBLE PERSON COLUMN ADDED HERE
        { 
            header: "Responsible Person", 
            accessor: "created_by.name", 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2">
                    {/* Accesses the created_by object to get the person's avatar and name */}
                    <img 
                        src={row.created_by?.avatar} 
                        alt={row.created_by?.name || 'N/A'} 
                        className="w-6 h-6 rounded-full object-cover" 
                    />
                    <span className="text-sm font-medium">{row.created_by?.name || 'Unknown'}</span>
                </div>
            )
        },
        { 
            header: "Status", 
            accessor: "status",
            render: (row) => renderStatusBadge(row.status)
        },
        { 
            header: "Last Updated", 
            accessor: "last_updated",
            sortable: true,
            render: (row) => <span className="text-sm text-muted-foreground">{row.last_updated}</span>
        },
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
                title="Delete Stock Item"
                message={`Are you sure you want to remove the stock record for ${itemToDelete?.name}?`}
            />

            {/* 🚀 EDIT STOCK MODAL (Using the correct component name and props) */}
            <EditManageStock 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveStockChanges}
                stockItem={stockItemToEdit}
            />

            {/* Header, Filter Bar, and DataTable rendering remain the same... */}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary"/> Manage Stock
                    </h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Manage Stock</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => console.log('Import Stock Data')}
                        className="bg-muted border border-input text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm hover:bg-muted/80"
                    >
                        <Upload className="w-4 h-4" /> Import
                    </button>
                    <button
                        onClick={() => console.log('Export Stock Data')}
                        className="bg-muted border border-input text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm hover:bg-muted/80"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button
                        onClick={handleAddAdjustment}
                        className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Stock Adjustment
                    </button>
                </div>
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
                                <option key={index} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
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
                onEdit={handleEdit}
                onDelete={handleDeleteClick} 
                
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

export default ManageStock;
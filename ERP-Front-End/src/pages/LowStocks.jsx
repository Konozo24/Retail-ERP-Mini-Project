import React, { useState } from "react";
import DataTable from "../components/ui/DataTable";
import EditStockModal from "../components/ui/EditStockModal";
import DeleteModal from "../components/ui/DeleteModal"; // Import Delete Modal
import Toast from "../components/ui/Toast";
import { Search, Mail, Filter } from "lucide-react";
import { productsData as initialData } from "../data/mockData";

const LowStocks = () => {
    // --- STATE ---
    const [products, setProducts] = useState(
        initialData.map(item => ({ ...item, qty_alert: 10 }))
    );

    const [activeTab, setActiveTab] = useState("Low Stocks");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isNotifyEnabled, setIsNotifyEnabled] = useState(true);

    // Modal & Toast State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const uniqueCategories = ["All", ...new Set(products.map(p => p.category))];

    // --- HANDLERS ---

    // 1. Trigger Delete Modal
    const handleDeleteClick = (row) => {
        setSelectedItem(row);
        setIsDeleteModalOpen(true);
    };

    // 2. Confirm Delete Action
    const confirmDelete = () => {
        if (selectedItem) {
            setProducts(prev => prev.filter(item => item.id !== selectedItem.id));
            showToast(`Deleted ${selectedItem.name} successfully.`, "success");
            setSelectedItem(null);
        }
    };

    const handleEdit = (row) => {
        setSelectedItem(row);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedProduct) => {
        setProducts(prev =>
            prev.map(item => (item.id === updatedProduct.id ? updatedProduct : item))
        );
        setIsEditModalOpen(false);
        showToast(`Updated ${updatedProduct.name} successfully.`, "success");
    };

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    // --- FILTERING LOGIC ---
    const displayedData = products.filter(item => {
        const isLowStock = item.stock_qty > 0 && item.stock_qty <= 40;
        const isOutOfStock = item.stock_qty === 0;

        if (activeTab === "Low Stocks" && !isLowStock) return false;
        if (activeTab === "Out of Stocks" && !isOutOfStock) return false;

        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(displayedData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = displayedData.slice(startIndex, startIndex + itemsPerPage);

    // --- COLUMNS ---
    const columns = [
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
        { header: "SKU", accessor: "sku", sortable: true },
        { header: "Qty", accessor: "stock_qty" },
        {
            header: "Qty Alert",
            accessor: "qty_alert",
            render: (row) => <span className="text-destructive font-medium">{row.qty_alert}</span>
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

            {/* Edit Modal */}
            <EditStockModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
                product={selectedItem}
                categories={uniqueCategories.filter(c => c !== "All")}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete ${selectedItem?.name} from low stock?`}
            />

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Low Stocks</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Low Stocks</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm">
                        <Mail className="w-4 h-4" />
                        Send Email
                    </button>
                    <button
                        onClick={() => setIsNotifyEnabled(!isNotifyEnabled)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isNotifyEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isNotifyEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-sm font-medium">Notify</span>
                </div>
            </div>

            {/* --- TABS --- */}
            <div className="flex items-center gap-4 border-b border-border">
                {["Low Stocks", "Out of Stocks"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                        className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        {tab}
                        {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-t-md"></span>}
                    </button>
                ))}
            </div>

            {/* --- FILTERS --- */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
                        >
                            {uniqueCategories.map((cat, index) => (
                                <option key={index} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* --- TABLE --- */}
            <DataTable
                columns={columns}
                data={currentData}
                showNumber={false}
                onEdit={handleEdit}
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

export default LowStocks;
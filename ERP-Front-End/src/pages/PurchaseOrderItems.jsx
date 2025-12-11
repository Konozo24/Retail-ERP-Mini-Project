import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal"; // Import Delete Modal
import Toast from "../components/ui/Toast"; // Import Toast
import { Plus, Search, Calendar } from "lucide-react";
import { purchaseOrderItemsData as initialData } from "../data/mockData";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PurchaseOrderItems = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [purchaseOrderItems, setPurchaseOrderItems] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- NEW: Modal & Toast State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [purchaseOrderItemToDelete, setPurchaseOrderItemToDelete] = useState(null);
    const [toast, setToast] = useState(null);

    // --- HANDLERS ---

    // 1. Trigger Delete Modal (Replaces window.confirm)
    const handleDeleteClick = (row) => {
        setPurchaseOrderItemToDelete(row);
        setIsDeleteModalOpen(true);
    };

    // 2. Confirm Delete Action (Executes deletion)
    const confirmDelete = () => {
        if (purchaseOrderItemToDelete) {
            setPurchaseOrderItems(purchaseOrderItems.filter((item) => item.id !== purchaseOrderItemToDelete.id));
            showToast(`Deleted ${purchaseOrderItemToDelete.name} successfully.`, "success");
            setPurchaseOrderItemToDelete(null);
        }
    };

    // 3. Helper for Toast
    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleEdit = (row) => {
        navigate("/create-purchaseOrderItem", { state: { purchaseOrderItemToEdit: row } });
    };

    // --- FILTERING ---
    const filteredPurchaseOrderItems = purchaseOrderItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredPurchaseOrderItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredPurchaseOrderItems.slice(startIndex, startIndex + itemsPerPage);

    // --- COLUMNS ---
    const columns = [
        {
            header: "PurchaseOrderItem",
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
        { header: "Phone", accessor: "phone" },
        { header: "Email", accessor: "email" },
        { header: "Address", accessor: "address" },
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
                title="Delete PurchaseOrderItem"
                message={`Are you sure you want to delete ${purchaseOrderItemToDelete?.name}?`}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">PurchaseOrderItems</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">PurchaseOrderItems</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/create-suppliers")}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Suppliers
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search Name or email..."
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
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
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
                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={currentData}
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

export default PurchaseOrderItems;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal"; // Import Delete Modal
import Toast from "../components/ui/Toast"; // Import Toast
import { Plus, Search } from "lucide-react";
import { suppliersData as initialData } from "../data/mockData";

const Suppliers = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [suppliers, setSuppliers] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- NEW: Modal & Toast State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [toast, setToast] = useState(null);

    // --- HANDLERS ---

    // 1. Trigger Delete Modal (Replaces window.confirm)
    const handleDeleteClick = (row) => {
        setSupplierToDelete(row);
        setIsDeleteModalOpen(true);
    };

    // 2. Confirm Delete Action (Executes deletion)
    const confirmDelete = () => {
        if (supplierToDelete) {
            setSuppliers(suppliers.filter((item) => item.id !== supplierToDelete.id));
            showToast(`Deleted ${supplierToDelete.name} successfully.`, "success");
            setSupplierToDelete(null);
        }
    };

    // 3. Helper for Toast
    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleEdit = (row) => {
        navigate("/create-supplier", { state: { supplierToEdit: row } });
    };

    // --- FILTERING ---
    const filteredSuppliers = suppliers.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

    // --- COLUMNS ---
    const columns = [
        {
            header: "Supplier",
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
                title="Delete Supplier"
                message={`Are you sure you want to delete ${supplierToDelete?.name}?`}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Suppliers</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/create-supplier")}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Supplier
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

export default Suppliers;
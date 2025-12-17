import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal";
import Toast from "../components/ui/Toast";
import { Plus, Search } from "lucide-react";
import EditCustomersModal from "../components/ui/EditCustomersModal";

import {
    useGetCustomersPage,
    useCreateCustomer,
    useUpdateCustomer,
    useDeleteCustomer
} from "../api/customers.api";

const Customers = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- Modal & Toast State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // --- MODAL STATE ---
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);

    // --- DATA ---
    const { data: customersPage, isLoading } =
        useGetCustomersPage(debouncedSearchQuery, currentPage - 1, itemsPerPage);

    const customers = customersPage?.content ?? [];

    // --- DATA MUTATIONS ---
    const { mutateAsync: createCustomer } = useCreateCustomer();
    const { mutateAsync: updateCustomer } = useUpdateCustomer();
    const { mutateAsync: deleteCustomer } = useDeleteCustomer();

    // --- Helper: Toast ---
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    // --- HANDLERS ---
    const handleAddClick = () => {
        setCurrentCustomer(null);
        setIsCustomerModalOpen(true);
    };

    const handleEditClick = (row) => {
        setCurrentCustomer(row);
        setIsCustomerModalOpen(true);
    };

    const handleDeleteClick = (row) => {
        setCustomerToDelete(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(customerToDelete.id);
                showToast(`Deleted ${customerToDelete.name} successfully.`, "success");
                setCustomerToDelete(null);
            } catch (error) {
                showToast("Failed to delete customer.", "error");
            }
        }
    };

    const handleSaveCustomer = async (formData) => {
        const payload = {
            name: formData.name, // backend expects name
            email: formData.email,
            phone: formData.phone,
        };

        if (currentCustomer) {
            await updateCustomer({
                customerId: currentCustomer.id,
                payload,
            });
            showToast("Customer details updated successfully!", "success");
        } else {
            await createCustomer(payload);
            showToast("New customer added successfully!", "success");
        }
    };

    // --- PAGINATION ---
    const totalPages = customersPage?.totalPages ?? 0;

    // --- COLUMNS ---
    const columns = [
        {
            header: "Customer",
            accessor: "name",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                        <img
                            src={row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`}
                            alt={row.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-medium text-foreground">{row.name}</span>
                </div>
            ),
        },
        { header: "Phone", accessor: "phone" },
        { header: "Email", accessor: "email", sortable: true },
    ];

    return (
        <div className="space-y-6 w-full relative">

            {/* Toast Notification */}
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
                    <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Customers</span>
                    </div>
                </div>

                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Customer
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-card border border-border rounded-lg shadow-sm p-4 space-y-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search Name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#F69C3C]/50 transition-all"
                    />
                </div>

                <DataTable
                    showNumber={true}
                    columns={columns}
                    data={customers}
                    isLoading={isLoading}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Customer"
                message={`Are you sure you want to delete ${customerToDelete?.name}?`}
            />

            {/* Add/Edit Modal */}
            <EditCustomersModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSubmit={handleSaveCustomer}
                initialData={currentCustomer}
                title={currentCustomer ? "Edit Customer" : "Add Customer"}
            />
        </div>
    );
};

export default Customers;

import React, { useState } from "react";
import { useDebounce } from 'use-debounce';
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal"; // Import Delete Modal
import Toast from "../components/ui/Toast"; // Import Toast
import { Plus, Search } from "lucide-react";
import EditSuppliersModal from "../components/ui/EditSuppliersModal";

import {
	useGetSuppliersPage,
	useCreateSupplier,
	useUpdateSupplier,
	useDeleteSupplier
} from "../api/suppliers.api";

const Suppliers = () => {
	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Modal & Toast State
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [supplierToDelete, setSupplierToDelete] = useState(null);
	const [toast, setToast] = useState({ show: false, message: "", type: "success" });

	// Modal State
	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [currentSupplier, setCurrentSupplier] = useState(null);

	// Data
	const { data: suppliersPage, isLoading } = useGetSuppliersPage(debouncedSearchQuery, currentPage - 1, itemsPerPage);
	const suppliers = suppliersPage?.content ?? [];

	// Data Mutations
	const { mutateAsync: createSupplier } = useCreateSupplier();
	const { mutateAsync: updateSupplier } = useUpdateSupplier();
	const { mutateAsync: deleteSupplier } = useDeleteSupplier();

	// Helper: Toast ---
	const showToast = (message, type = "success") => {
		setToast({ show: true, message, type });
	};

	// Handlers
	const handleAddClick = () => {
		setCurrentSupplier(null);
		setIsSupplierModalOpen(true);
	};

	const handleEditClick = (row) => {
		setCurrentSupplier(row);
		setIsSupplierModalOpen(true);
	};

	const handleDeleteClick = (row) => {
		setSupplierToDelete(row);
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (supplierToDelete) {
			try {
				await deleteSupplier(supplierToDelete.id);
				showToast(`Deleted ${supplierToDelete.name} successfully.`, "success");
				setSupplierToDelete(null);
			} catch (error) {
				showToast("Failed to delete supplier.", "error");
			}
		}
	};

	const handleSaveSupplier = async (formData) => {
		const payload = {
			name: formData.name,
			phone: formData.phone,
			email: formData.email,
			address: formData.address,
		};

		if (currentSupplier) {
			await updateSupplier({
				supplierId: currentSupplier.id,
				payload: payload
			});
			showToast("Supplier details updated successfully!", "success");
		} else {
			await createSupplier(payload);
			showToast("New supplier added successfully!", "success");
		}
	};

	// Pagination
	const totalPages = suppliersPage?.totalPages ?? 0;

	// Columns
	const columns = [
		{
			header: "Supplier",
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
			)
		},
		{ header: "Phone", accessor: "phone" },
		{ header: "Email", accessor: "email", sortable: true, },
		{ header: "Address", accessor: "address" },
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
					<h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
					<div className="text-sm text-muted-foreground mt-1">
						Dashboard {'>'} <span className="text-primary">Suppliers</span>
					</div>
				</div>

				<button
					onClick={handleAddClick}
					className="flex items-center gap-2 px-4 py-2 bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white rounded-lg transition-colors font-medium shadow-sm"
				>
					<Plus className="w-4 h-4" />
					Add Supplier
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
					data={suppliers}
					isLoading={isLoading}
					onEdit={handleEditClick}
					onDelete={handleDeleteClick}

					currentPage={currentPage}
					totalPages={totalPages}
					itemsPerPage={itemsPerPage}
					onPageChange={setCurrentPage}
					onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
				/>
			</div>

			{/* Delete Modal */}
			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				title="Delete Supplier"
				message={`Are you sure you want to delete ${supplierToDelete?.name}?`}
			/>

			{/* Add/Edit Modal */}
			<EditSuppliersModal
				isOpen={isSupplierModalOpen}
				onClose={() => setIsSupplierModalOpen(false)}
				onSubmit={handleSaveSupplier}
				initialData={currentSupplier}
				title={currentSupplier ? "Edit Supplier" : "Add Supplier"}
			/>
		</div>
	);
};

export default Suppliers;
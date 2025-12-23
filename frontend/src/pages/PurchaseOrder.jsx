import React, { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import Toast from "../components/ui/Toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Search, ClipboardList, CheckCircle, RotateCcw, FilePlus2, Download, History as HistoryIcon, Trash2, Plus } from 'lucide-react';
import DataTable from '../components/ui/DataTable';

import {
	useGetSuppliersPage,
} from "../api/suppliers.api";

import {
	useGetProductsPage,
} from "../api/products.api";

import {
	useGetPurchaseOrdersPage,
	useCreatePurchaseOrder,
	useUpdatePurchaseOrder,
} from "../api/purchase-order.api";

{/* Main Content Card (The List Table) */ }
const CreationFormTable = ({ showToast }) => {
	// Form State
	const [formData, setFormData] = useState({
		supplierId: null,
		productId: null,
		quantity: 1,
		costPrice: 0,
	});
	const [items, setItems] = useState([]);
	const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.product.costPrice, 0);

	// Data
	const { data: suppliersPage, isSuppliersLoading } = useGetSuppliersPage("", 0, 1000);
	const suppliers = suppliersPage?.content ?? [];

	const { data: productsPage, isProductsLoading } = useGetProductsPage("", 0, 1000);
	const products = productsPage?.content ?? [];

	// Data Mutations
	const { mutateAsync: createPurchaseOrder } = useCreatePurchaseOrder();

	// Handlers
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleProductChange = (productId) => {
		const product = products.find(p => p.id === Number(productId));

		setFormData((prev) => ({
			...prev,
			productId: productId,
			costPrice: product.costPrice
		}));
	};

	const handleAddItem = () => {
		if (!formData.supplierId) {
			showToast("Please select a supplier.", "error"); 
			return
		};
		if (!formData.productId) {
			showToast("Please select a product.", "error"); 
			return
		}
			if (!formData.quantity < 0) {
			showToast("Quantity cant be less than 1.", "error"); 
			return
		}

		const product = products.find(p => p.id === Number(formData.productId));

		setItems((prev) => {
			let found = false;

			const updated = prev.map((i) => {
				if (i.product.id === product.id) {
					found = true;
					return { ...i, quantity: i.quantity + formData.quantity };
				}
				return i;
			});

			return found
				? updated
				: [
					...prev,
					{
						supplierId: formData.supplierId,
						product: product,
						quantity: formData.quantity,
					}
				];
		});

		setFormData((prev) => {
			return {
				...prev,
				//supplierId: null,
				productId: null,
				quantity: 1,
				costPrice: 0,
			}
		});
	}

	const handleRemoveItem = (productId) => {
		setItems((prev) => prev.filter((i) => i.product.id !== productId));
	}

	const handleUpdateItemQuantity = (productId, value) => {
		if (value == 0) {
			handleRemoveItem(productId);
			return;
		}

		setItems((prev) =>
			prev.map((i) =>
				i.product.id === productId
					? { ...i, quantity: value }
					: i
			)
		);
	};

	const handleSubmitOrder = async () => {
		if (!formData.supplierId) {
			showToast("Please select a supplier.", "error");
			return;
		}
		if (!items.length) {
			showToast("Add at least one product to the order.", "error");
			return;
		}

		const payload = {
			supplierId: Number(formData.supplierId),
			items: items.map(i => ({
				productId: i.product.id,
				quantity: i.quantity
			}))
		}

		try {
			await createPurchaseOrder(payload);
			setFormData({
				supplierId: null,
				productId: null,
				quantity: 1,
				costPrice: 0,
			});
			setItems([]);
			showToast("New purchase order added successfully!", "success");
		} catch (error) {
			showToast("Failed to create purchase order.\n" + error, "error");
		}

	};

	return (
		<div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-1">
					<label className="text-sm font-medium">Supplier <span className="text-destructive">*</span></label>
					<select
						name='supplierId'
						value={formData.supplierId || ''}
						onChange={handleChange}
						className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
					>
						<option value="">Select supplier</option>
						{suppliers.map((s) => (
							<option key={s.id} value={s.id}>{s.name}</option>
						))}
					</select>
				</div>
			</div>

			<div hidden={!formData.supplierId} className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Product</label>
					<select
						name='productId'
						value={formData.productId || ''}
						onChange={e => handleProductChange(e.target.value)}
						className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
					>
						<option value="">Select product</option>
						{products.map((p) => (
							<option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
						))}
					</select>
				</div>
				<div>
					<label className="text-sm font-medium">Quantity</label>
					<input
						disabled={!formData.productId}
						name='quantity'
						type="number"
						min="1"
						step="1"
						value={formData.quantity}
						onChange={handleChange}
						className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
					/>
				</div>
				<div>
					<label className="text-sm font-medium">Cost Price</label>
					<input
						type="number"
						disabled={true}
						value={formData.costPrice}
						placeholder="Auto from product price"
						className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
					/>
				</div>
			</div>

			<button
				disabled={!formData.supplierId || !formData.productId}
				onClick={handleAddItem}
				className={
					`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm 
					${!formData.supplierId || !formData.productId 
						? "bg-gray-300 text-gray-500 cursor-not-allowed" 
						: "bg-primary text-primary-foreground hover:bg-primary/90"
					}`
				}
			>
				<Plus className="w-4 h-4" /> Add Item
			</button>

			{/* Items table */}
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-border">
					<thead className="bg-muted">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Product</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Qty</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cost Price</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Subtotal</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Action</th>
						</tr>
					</thead>
					<tbody className="bg-background divide-y divide-border">
						{items.length ? items.map((it) => (
							<tr key={it.product.id}>
								<td className="px-4 py-3 text-sm font-medium">{it.product.name}</td>
								<td className="px-4 py-3 text-sm">
									<input
										type="number"
										min="0"
										value={it.quantity}
										onChange={(e) => handleUpdateItemQuantity(it.product.id, e.target.value)}
										className="w-20 h-9 rounded-md border border-input bg-background px-2 text-sm focus:ring-1 focus:ring-primary"
									/>
								</td>
								<td className="px-4 py-3 text-sm">
									<input
										type="number"
										min="0"
										disabled={true}
										value={it.product.costPrice}
										className="w-28 h-9 rounded-md border border-input bg-background px-2 text-sm focus:ring-1 focus:ring-primary"
									/>
								</td>
								<td className="px-4 py-3 text-sm font-semibold">
									{((it.quantity * it.product.costPrice || 0)).toLocaleString("en-MY")}
								</td>
								<td className="px-4 py-3 text-right">
									<button
										onClick={() => handleRemoveItem(it.product.id)}
										className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</td>
							</tr>
						)) : (
							<tr>
								<td colSpan="5" className="px-4 py-6 text-center text-muted-foreground text-sm">
									No items added. Select a product to begin.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex justify-between items-center pt-2">
				<div className="text-sm text-muted-foreground">
					Items: {items.length}
				</div>
				<div className="text-lg font-bold">
					Total: RM {((itemsTotal)).toLocaleString("en-MY")}
				</div>
			</div>

			<div className="flex gap-3">
				<button
					onClick={handleSubmitOrder}
					className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm"
				>
					Submit Order
				</button>
			</div>
		</div>
	);
}

{/* Existing list */ }
const PurchaseOrderList = ({ showToast }) => {
	const navigate = useNavigate();

	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Data
	const { data: purchaseOrderPage, isLoading } = useGetPurchaseOrdersPage(debouncedSearchQuery, currentPage - 1, itemsPerPage);
	const purchaseOrders = purchaseOrderPage?.content ?? [];
	const totalPages = purchaseOrderPage?.totalPages ?? 0;
	const { data: allPurchaseOrdersPage } = useGetPurchaseOrdersPage(debouncedSearchQuery, 0, 1000);
	const allPurchaseOrders = allPurchaseOrdersPage?.content ?? [];

	// Data Mutations
	const { mutateAsync: updatePurchaseOrder } = useUpdatePurchaseOrder();

	const StatusBadge = ({ status }) => {
		let colorClass = '';
		switch (status) {
			case 'Received':
				colorClass = 'bg-primary-100 text-primary';
				break;
			case 'DELIVERED':
				colorClass = 'bg-green-100 text-green-700';
				break;
			case 'CANCELLED':
				colorClass = 'bg-blue-100 text-red-600';
				break;
			case 'PENDING':
				colorClass = 'bg-yellow-100 text-yellow-700';
				break;
			default:
				colorClass = 'bg-gray-100 text-gray-700';
		}
		return (
			<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
				{status}
			</span>
		);
	};

	const handleToggleDelivered = async (purchaseOrderId) => {
		const purchaseOrder = purchaseOrders.find(po => po.id === Number(purchaseOrderId));
		const newStatus = purchaseOrder.status === 'DELIVERED' ? 'PENDING' : 'DELIVERED'

		try {
			await updatePurchaseOrder({
				purchaseOrderId: purchaseOrderId,
				payload: { status: newStatus }
			})
		} catch (error) {

		}
	};

	const handleGenerateReport = () => {
		if (isLoading) return;

		const currencyFormatter = new Intl.NumberFormat("en-MY", {
			style: "currency",
			currency: "MYR",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});

		const doc = new jsPDF();

		doc.setFontSize(20);
		doc.text("Purchase Orders Report", 14, 22);

		doc.setFontSize(11);
		doc.setTextColor(100);
		doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
		doc.text(`Total Purchase Orders: ${allPurchaseOrders.length}`, 14, 36);

		doc.setDrawColor(200);
		doc.line(14, 42, 196, 42);

		doc.setFontSize(12);
		doc.setTextColor(0);
		doc.text("Purchase Orders Summary:", 14, 50);

		const summaryData = [
			["Total Orders", allPurchaseOrders.length.toLocaleString()],
			["Total Cost", currencyFormatter.format(allPurchaseOrders.reduce((sum, po) => sum + (po.items.reduce((itemSum, i) => itemSum + i.subtotal, 0) || 0), 0))],
			["Pending Orders", allPurchaseOrders.filter(po => po.status === 'PENDING').length.toLocaleString()],
			["Delivered Orders", allPurchaseOrders.filter(po => po.status === 'DELIVERED').length.toLocaleString()],
		];

		autoTable(doc, {
			startY: 54,
			head: [["Metric", "Value"]],
			body: summaryData,
			theme: "plain",
			styles: { fontSize: 10, cellPadding: 2 },
			headStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: "bold" },
			columnStyles: { 0: { fontStyle: "bold", width: 60 } },
			margin: { left: 14 },
		});

		doc.text("Detailed Purchase Orders:", 14, doc.lastAutoTable.finalY + 10);

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 14,
			head: [["PO ID", "Date", "Supplier", "Items", "Total Cost", "Status"]],
			body: allPurchaseOrders.map((po) => [
				`PO-${String(po.id).padStart(5, '0')}`,
				po.createdAt || "",
				po.supplier || "",
				po.items.length.toString(),
				currencyFormatter.format(po.items.reduce((sum, i) => sum + i.subtotal, 0) || 0),
				po.status || "",
			]),
			theme: "striped",
			headStyles: { fillColor: [66, 66, 66] },
			styles: { fontSize: 9 },
		});

		doc.save(`Purchase_Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`);
	};

	const columns = [
		{
			header: "PO ID",
			accessor: "id",
			render: (row) => <span className="font-semibold text-primary">PO-{String(row.id).padStart(5, '0')}</span>,
		},
		{
			header: "Date",
			accessor: "createdAt",
			render: (row) => <span className="text-muted-foreground">{row.createdAt}</span>,
		},
		{
			header: "Supplier",
			accessor: "supplier",
			render: (row) => <span className="font-medium">{row.supplier}</span>,
		},
		{
			header: "Items",
			accessor: "items.length",
			render: (row) => <span>{row.items.length}</span>,
		},
		{
			header: "Total Cost",
			accessor: "total_cost",
			render: (row) => {
				const currencyFormatter = new Intl.NumberFormat("en-MY", {
					style: "currency",
					currency: "MYR",
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				});
				return <span className="font-medium">
					{currencyFormatter.format(row.items.reduce((sum, i) => sum + i.subtotal, 0) || 0)}
				</span>;
			},
		},
		{
			header: "Status",
			accessor: "status",
			render: (row) => <StatusBadge status={row.status} />,
		},
		{
			header: "Action",
			accessor: "action",
			render: (row) => (
				<div className="flex justify-end gap-2">
					<button
						hidden={row.status === "DELIVERED"}
						onClick={() => handleToggleDelivered(row.id)}
						className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors flex items-center gap-2"
						title={row.status === 'Received' ? 'Mark as Pending' : 'Mark as Delivered'}
					>
						{row.status === 'DELIVERED' ? (
							<>
								<RotateCcw className="w-4 h-4" />
								Pending
							</>
						) : (
							<>
								<CheckCircle className="w-4 h-4 text-green-600" />
								Delivered
							</>
						)}
					</button>
					<button
						onClick={() => navigate('/purchase-order-details', { state: row.id })}
						className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors flex items-center gap-2"
						title="View details"
					>
						<HistoryIcon className="w-4 h-4 text-primary" />
						View Details
					</button>
				</div>
			),
		},
	];

	return (
		<div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
			{/* Search and Generate Report */}
			<div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
				<div className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search by PO ID or Supplier..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setCurrentPage(1);
						}}
						className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>
				<button
					onClick={handleGenerateReport}
					className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white px-6 h-10 rounded-md font-medium text-sm transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
				>
					<Download className="w-4 h-4" />
					Generate Report
				</button>
			</div>

			<DataTable
				showNumber={true}
				columns={columns}
				data={purchaseOrders}
				isLoading={isLoading}
				actions={false}

				currentPage={currentPage}
				totalPages={totalPages}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
				onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
			/>
		</div>
	);
}
const PurchaseOrder = () => {
	// Helper: Toast Notification
	const [toast, setToast] = useState({ show: false, message: "", type: "success" });
	const showToast = (message, type = "success") => {
		setToast({ show: true, message, type });
	};

	return (
		<div className="space-y-6">
			{/* Toast Notification */}
			{toast.show && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast({ ...toast, show: false })}
				/>
			)}

			{/* Header and Actions */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
					<ClipboardList className="w-6 h-6 text-primary" /> Purchase Orders
				</h1>
			</div>

			{/* Path */}
			<div className="text-sm text-muted-foreground mt-1">
				Dashboard {'>'} Stock {'>'} <span className="text-primary">Purchase Orders</span>
			</div>

			<CreationFormTable showToast={showToast} />

			<PurchaseOrderList showToast={showToast} />
		</div>
	);
};

export default PurchaseOrder;
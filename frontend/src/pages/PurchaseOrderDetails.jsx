import React, { useEffect, useMemo, useState } from 'react';
import { useDebounce } from "use-debounce";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Filter, ClipboardList, MoveLeft } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import ProductNameCell from "../components/ui/ProductNameCell";

import { useGetCategoriesName } from "../api/categories.api";

import {
	useGetPurchaseOrderItems
} from "../api/purchase-order.api";


const PurchaseOrderDetails = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const purchaseOrderId = location.state || null;

	useEffect(() => {
		if (!purchaseOrderId) navigate('/purchase-order');
	}, [purchaseOrderId, navigate]);

	// State
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

	const [selectedCategoryName, setSelectedCategoryName] = useState("All");

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Data
	const { data: categoriesNameData } = useGetCategoriesName();
	const categoriesName = ["All", ...(categoriesNameData || [])];

	const { data: purchaseOrderItemsPage, isLoading } = useGetPurchaseOrderItems(
		purchaseOrderId, debouncedSearchQuery, selectedCategoryName, currentPage - 1, itemsPerPage
	);
	const items = purchaseOrderItemsPage?.content ?? [];
	const totalPages = purchaseOrderItemsPage?.totalPages ?? 0;

	const columns = [
		{ header: "Product Name", accessor: "name", render: (row) => <ProductNameCell product={row.product} /> },
		{
			header: "Quantity",
			accessor: "quantity",
			render: (row) => <span>{row.quantity}</span>,
		},
		{
			header: "Unit Cost",
			accessor: "unitCost",
			render: (row) => <span className="font-medium">
				RM {(row.unitCost || 0).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
			</span>,
		},
		{
			header: "Total Cost",
			accessor: "subtotal",
			render: (row) => <span className="font-medium">
				RM {(row.subtotal || 0).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
			</span>,
		},
	];

	return (
		<div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
					<ClipboardList className="w-6 h-6 text-primary" /> Purchase Order Items
				</h1>
				<div className="flex gap-2">
					<Link
						to={"/purchase-order"}
						className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium text-sm border border-input">
						<MoveLeft className="w-4 h-4" /> Back
					</Link>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
				{/* Search */}
				<div className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search by product name..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							setCurrentPage(1);
						}}
						className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>

				{/* Category */}
				<div className="relative w-full sm:w-auto">
					<select
						value={selectedCategoryName}
						onChange={(e) => {
							setSelectedCategoryName(e.target.value);
							setCurrentPage(1);
						}}
						className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
					>
						{categoriesName.map((cat, index) => (
							<option key={index} value={cat}>
								{cat === "All" ? "All Categories" : cat}
							</option>
						))}
					</select>
					<Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
				</div>
			</div>

			<DataTable
				showNumber={true}
				columns={columns}
				data={items}
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
};

export default PurchaseOrderDetails;

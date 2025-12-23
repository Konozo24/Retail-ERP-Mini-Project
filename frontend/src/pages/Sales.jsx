import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "../components/ui/DataTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
	Wallet,
	ShoppingBag,
	FileText,
	CircleDollarSign,
	Filter,
	Calendar as CalendarIcon,
	Download
} from "lucide-react";
import { useGetSalesStatistics } from "../api/dashboard.api";
import { useGetCategoriesName } from "../api/categories.api";

const currencyFormatter = new Intl.NumberFormat("en-MY", {
	style: "currency",
	currency: "MYR",
	maximumFractionDigits: 2,
});

const dateFormatter = (date) => {
	return date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
};

const Sales = () => {

	// State
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [startDate, setStartDate] = useState("2024-01-01");
	const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Debounced Dates
	const [fromDate, toDate] = useMemo(() => {
		if (startDate && endDate && startDate > endDate) {
			return [endDate, startDate];
		}
		return [startDate, endDate];
	}, [startDate, endDate]);
	const [debouncedFromDate] = useDebounce(fromDate, 500);
	const [debouncedToDate] = useDebounce(toDate, 500);

	// Data
	const { data: statisticData, isLoading, isError } = useGetSalesStatistics(selectedCategory, currentPage - 1, itemsPerPage,
		dateFormatter(debouncedFromDate), dateFormatter(debouncedToDate)
	);
	const productsStatistic = statisticData?.productsStatistic?.content ?? [];

	const { data: categoriesNameData } = useGetCategoriesName();
	const categoriesName = ["All", ...(categoriesNameData || [])];

	const totalPages = statisticData?.productsStatistic?.totalPages ?? 0;

	// Handler: Generate PDF Report
	const handleGenerateReport = () => {
		if (isLoading) return;

		const doc = new jsPDF();

		doc.setFontSize(20);
		doc.text("Sales Report", 14, 22);

		doc.setFontSize(11);
		doc.setTextColor(100);
		doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
		doc.text(`Period: ${dateFormatter(fromDate)} to ${dateFormatter(toDate)}`, 14, 36);
		doc.text(`Category Filter: ${selectedCategory}`, 14, 42);

		doc.setDrawColor(200);
		doc.line(14, 48, 196, 48);

		doc.setFontSize(12);
		doc.setTextColor(0);
		doc.text("Summary Overview:", 14, 56);

		const summaryData = [
			["Total Revenue", currencyFormatter.format(statisticData.totalRevenue)],
			["Total Orders", statisticData.totalOrders.toLocaleString()],
			["Item Sold", statisticData.totalItemSold.toLocaleString()],
			["Avg Order Value", currencyFormatter.format(statisticData.averageOrderValue)],
		];

		autoTable(doc, {
			startY: 60,
			head: [["Metric", "Value"]],
			body: summaryData,
			theme: "plain",
			styles: { fontSize: 10, cellPadding: 2 },
			headStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: "bold" },
			columnStyles: { 0: { fontStyle: "bold", width: 50 } },
			margin: { left: 14 },
		});

		doc.text("Detailed Sales Data:", 14, doc.lastAutoTable.finalY + 10);

		autoTable(doc, {
			startY: doc.lastAutoTable.finalY + 14,
			head: [["SKU", "Product", "Category", "Sold Qty", "Amount", "Instock Qty"]],
			body: productsStatistic.map((item) => [
				item.sku || "",
				item.productName,
				item.categoryName || "",
				item.soldQty,
				currencyFormatter.format(Number(item.soldAmount || 0)),
				item.stockQty,
			]),
			theme: "striped",
			headStyles: { fillColor: [66, 66, 66] },
			styles: { fontSize: 9 },
		});

		doc.save(`Sales_Report_${startDate}_${endDate}.pdf`);
	};

	const columns = [
		{
			header: "SKU",
			accessor: "sku",
			render: (row) => <span className="text-muted-foreground">{row.sku || ""}</span>,
		},
		{
			header: "Product",
			accessor: "product",
			render: (row) => (
				<div className="flex flex-col">
					<span className="font-medium text-foreground">{row.productName}</span>
					<span className="text-xs text-muted-foreground">{row.categoryName || "Uncategorized"}</span>
				</div>
			),
		},
		{
			header: "Sold Qty",
			accessor: "soldQty",
			sortable: true,
			render: (row) => <span className="font-medium text-center block w-full">{row.soldQty}</span>,
		},
		{
			header: "Sold Amount",
			accessor: "soldAmount",
			sortable: true,
			render: (row) => <span className="font-medium text-foreground">{currencyFormatter.format(Number(row.soldAmount || 0))}</span>,
		},
		{
			header: "Instock Qty",
			accessor: "instockQty",
			render: (row) => <span className="text-muted-foreground">{row.stockQty}</span>,
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Sales</h1>
				<div className="text-sm text-muted-foreground mt-1">
					Dashboard {'>'} <span className="text-primary">Sales</span>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-card p-5 rounded-lg border border-green-500/50 shadow-sm flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
						<Wallet className="w-6 h-6" />
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Total Revenue</p>
						<h3 className="text-xl font-bold text-foreground">{currencyFormatter.format(statisticData?.totalRevenue || 0)}</h3>
					</div>
				</div>

				<div className="bg-card p-5 rounded-lg border border-blue-500/50 shadow-sm flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
						<FileText className="w-6 h-6" />
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Total Orders</p>
						<h3 className="text-xl font-bold text-foreground">{(statisticData?.totalOrders || 0).toLocaleString()}</h3>
					</div>
				</div>

				<div className="bg-card p-5 rounded-lg border border-orange-500/50 shadow-sm flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
						<ShoppingBag className="w-6 h-6" />
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Item Sold</p>
						<h3 className="text-xl font-bold text-foreground">{(statisticData?.totalItemSold || 0).toLocaleString()}</h3>
					</div>
				</div>

				<div className="bg-card p-5 rounded-lg border border-red-400/50 shadow-sm flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
						<CircleDollarSign className="w-6 h-6" />
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Average Order Value</p>
						<h3 className="text-xl font-bold text-foreground">{currencyFormatter.format(statisticData?.averageOrderValue || 0)}</h3>
					</div>
				</div>
			</div>

			<div className="bg-card p-4 rounded-lg border border-border shadow-sm">
				<div className="flex flex-col lg:flex-row gap-4 lg:items-end">
					<div className="flex-1">
						<label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
							Date Range
						</label>
						<div className="flex items-center gap-2">
							<div className="relative w-full">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
									<CalendarIcon className="w-4 h-4" />
								</div>
								<input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} max={endDate} className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none" />
							</div>
							<span className="text-muted-foreground">-</span>
							<div className="relative w-full">
								<input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} min={startDate} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none" />
							</div>
						</div>
					</div>

					<div className="flex-1">
						<label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
							Category
						</label>
						<div className="relative">
							<select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }} className="w-full h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer">
								{categoriesName.map((cat, idx) => (
									<option key={idx} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
								))}
							</select>
							<Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
						</div>
					</div>

					<div className="flex-none">
						<label className="text-xs font-semibold text-transparent uppercase mb-1 block select-none">
							Action
						</label>
						<button onClick={handleGenerateReport} className="w-full lg:w-auto bg-accent hover:bg-accent/90 text-white px-6 h-10 rounded-md font-medium text-sm transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2">
							<Download className="w-4 h-4" />
							Generate Report
						</button>
					</div>
				</div>
			</div>

			{isError && (
				<div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2 rounded-md">
					Unable to load sales data. Please try again.
				</div>
			)}

			<div className="bg-card rounded-lg border border-border shadow-sm flex flex-col">
				<div className="p-4 border-b border-border flex justify-between items-center bg-card rounded-t-lg">
					<h3 className="font-bold text-lg text-foreground">Product Sales Summary</h3>
				</div>

				<DataTable
					columns={columns}
					data={productsStatistic}
					showNumber={true}
					actions={false}
					currentPage={currentPage}
					totalPages={totalPages}
					itemsPerPage={itemsPerPage}
					onPageChange={setCurrentPage}
					onItemsPerPageChange={(value) => { setItemsPerPage(value); setCurrentPage(1); }}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};

export default Sales;

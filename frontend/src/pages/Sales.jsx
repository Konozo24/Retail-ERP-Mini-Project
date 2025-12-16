import React, { useState, useMemo } from "react";
import DataTable from "../components/ui/DataTable";
import { productsData } from "../data/mockData";
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

const Sales = () => {
    // --- 1. PREPARE DATA ---
    const initialSalesData = useMemo(() => {
        return productsData.map(product => {
            const price = parseFloat(product.unit_price.replace(/,/g, ''));
            const soldQty = Math.floor(Math.random() * 50) + 1; 
            const soldAmount = (soldQty * price).toFixed(2);

            return {
                ...product,
                sold_qty: soldQty,
                sold_amount: soldAmount,
                instock_qty: product.stock_qty 
            };
        });
    }, []);

    // --- STATE ---
    const [sales, setSales] = useState(initialSalesData);
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    // Date State (Defaults to today)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- FILTER LOGIC ---
    const categories = ["All", ...new Set(productsData.map(item => item.category))];

    const filteredData = sales.filter((item) => {
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesCategory;
    });

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // --- PDF GENERATION LOGIC ---
    const handleGenerateReport = () => {
        const doc = new jsPDF();

        // 1. Add Title
        doc.setFontSize(20);
        doc.text("Sales Report", 14, 22);

        // 2. Add Date Range & Metadata
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text(`Period: ${startDate} to ${endDate}`, 14, 36);
        doc.text(`Category Filter: ${selectedCategory}`, 14, 42);

        // 3. Add Summary Metrics (Manual positioning)
        doc.setDrawColor(200);
        doc.line(14, 48, 196, 48); // Horizontal Line

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Summary Overview:", 14, 56);
        
        // Mock calculations for the report (same as cards)
        const summaryData = [
            ["Total Revenue", "$4,56,000"],
            ["Total Orders", "25,642"],
            ["Item Sold", "15,245"],
            ["Avg Order Value", "$256.12"]
        ];

        autoTable(doc, {
            startY: 60,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: 'bold' },
            columnStyles: { 0: { fontStyle: 'bold', width: 50 } },
            margin: { left: 14 }
        });

        // 4. Add Main Sales Table
        doc.text("Detailed Sales Data:", 14, doc.lastAutoTable.finalY + 10);

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 14,
            head: [['SKU', 'Product Name', 'Category', 'Sold Qty', 'Amount ($)', 'Instock']],
            body: filteredData.map(item => [
                item.sku,
                item.name,
                item.category,
                item.sold_qty,
                item.sold_amount,
                item.instock_qty
            ]),
            theme: 'striped',
            headStyles: { fillColor: [66, 66, 66] }, // Dark Grey Header
            styles: { fontSize: 9 },
        });

        // 5. Save PDF
        doc.save(`Sales_Report_${startDate}_${endDate}.pdf`);
    };

    // --- COLUMNS ---
    const columns = [
        { 
            header: "SKU", 
            accessor: "sku", 
            sortable: true,
            render: (row) => <span className="text-muted-foreground">{row.sku}</span>
        },
        {
            header: "Product Name",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-muted flex items-center justify-center overflow-hidden border border-border">
                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-foreground">{row.name}</span>
                </div>
            )
        },
        { 
            header: "Category", 
            accessor: "category",
            render: (row) => <span className="text-muted-foreground">{row.category}</span>
        },
        { 
            header: "Sold Qty", 
            accessor: "sold_qty", 
            sortable: true,
            render: (row) => <span className="font-medium text-center block w-full">{row.sold_qty}</span>
        },
        {
            header: "Sold Amount",
            accessor: "sold_amount",
            sortable: true,
            render: (row) => <span className="font-medium text-foreground">${Number(row.sold_amount).toLocaleString()}</span>
        },
        { 
            header: "Instock Qty", 
            accessor: "instock_qty",
            render: (row) => <span className="text-muted-foreground">{row.instock_qty}</span>
        }
    ];

    return (
        <div className="space-y-6">
            
            {/* --- HEADER --- */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
                <div className="text-sm text-muted-foreground mt-1">
                    Dashboard {'>'} <span className="text-primary">Sales</span>
                </div>
            </div>

            {/* --- SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card p-5 rounded-lg border border-green-500/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <h3 className="text-xl font-bold text-foreground">$4,56,000</h3>
                    </div>
                </div>

                <div className="bg-card p-5 rounded-lg border border-blue-500/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Order</p>
                        <h3 className="text-xl font-bold text-foreground">$2,56,42</h3>
                    </div>
                </div>

                <div className="bg-card p-5 rounded-lg border border-orange-500/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Item Sold</p>
                        <h3 className="text-xl font-bold text-foreground">$1,52,45</h3>
                    </div>
                </div>

                <div className="bg-card p-5 rounded-lg border border-red-400/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                        <CircleDollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Average Order Value</p>
                        <h3 className="text-xl font-bold text-foreground">$2,56,12</h3>
                    </div>
                </div>
            </div>

            {/* --- FILTERS SECTION --- */}
            <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                    
                    {/* Date Picker Group */}
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                            Date Range
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                    <CalendarIcon className="w-4 h-4" />
                                </div>
                                <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                />
                            </div>
                            <span className="text-muted-foreground">-</span>
                            <div className="relative w-full">
                                <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Select */}
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                            Category
                        </label>
                        <div className="relative">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                            >
                                {categories.map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex-none">
                        <label className="text-xs font-semibold text-transparent uppercase mb-1 block select-none">
                            Action
                        </label>
                        <button 
                            onClick={handleGenerateReport}
                            className="w-full lg:w-auto bg-accent hover:bg-accent/90 text-white px-6 h-10 rounded-md font-medium text-sm transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-card rounded-lg border border-border shadow-sm flex flex-col">
                <div className="p-4 border-b border-border flex justify-between items-center bg-card rounded-t-lg">
                    <h3 className="font-bold text-lg text-foreground">Sales Report</h3>
                </div>

                <DataTable
                    columns={columns}
                    data={currentData}
                    showNumber={false} 
                    actions={false}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    );
};

export default Sales;
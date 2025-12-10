import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/ui/DataTable";
import { Plus, Search, Filter } from "lucide-react";
import { productsData as initialData } from "../data/mockData";

const Products = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [products, setProducts] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // --- HANDLERS ---
    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            setProducts(products.filter((item) => item.id !== row.id));
        }
    };

    const handleEdit = (row) => {
        navigate("/create-product", { state: { productToEdit: row } });
    };

    // --- FILTERING ---
    const categories = ["All", ...new Set(initialData.map(item => item.category))];

    const filteredProducts = products.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // --- COLUMNS ---
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
            header: "Price",
            accessor: "unit_price",
            sortable: true,
            render: (row) => <span>RM {row.unit_price.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
        },
        { header: "Qty", accessor: "stock_qty" },
        {
            header: "Created By",
            accessor: "created_by",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <img src={row.created_by.avatar} alt="User" className="w-6 h-6 rounded-full object-cover border border-border" />
                    <span className="text-sm font-medium text-muted-foreground">{row.created_by.name}</span>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <div className="text-sm text-muted-foreground mt-1">
                        Dashboard {'>'} <span className="text-primary">Products</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/create-product")}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
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
                showNumber={true} // Enables the # column
                onEdit={handleEdit}
                onDelete={handleDelete}

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

export default Products;
import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import DataTable from "../components/ui/DataTable";
import EditStockModal from "../components/ui/EditStockModal";
import DeleteModal from "../components/ui/DeleteModal";
import Toast from "../components/ui/Toast";
import { Search, Mail, Filter } from "lucide-react";

import { useGetCategoriesName } from "../api/categories.api";
import {
  useGetLowStockProducts,
  useGetOutOfStockProducts,
  useUpdateProduct,
  useDeleteProduct
} from "../api/products.api";
import { getImageUrlByProduct } from "../data/categoryImages";

const LowStocks = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("Low Stocks");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedCategory] = useDebounce(selectedCategory, 300);
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(true);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- DATA ---
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesName();
  const categories = categoriesData ?? [];

  const { data: lowStockData, isLoading: isLowStockLoading } = useGetLowStockProducts(
    debouncedSearchQuery,
    currentPage - 1,
    itemsPerPage,
    debouncedCategory,
    { enabled: activeTab === "Low Stocks" }
  );

  const { data: outOfStockData, isLoading: isOutStockLoading } = useGetOutOfStockProducts(
    debouncedSearchQuery,
    currentPage - 1,
    itemsPerPage,
    debouncedCategory,
    { enabled: activeTab === "Out of Stocks" }
  );

  const productsData = activeTab === "Low Stocks" ? lowStockData : outOfStockData;
  const products = productsData?.content ?? [];
  const totalPages = productsData?.totalPages ?? 1;

  // --- DATA MUTATIONS ---
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  // --- HELPER: Toast ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // --- HANDLERS ---
  const handleEdit = (row) => {
    setSelectedItem({...row, categoryId: row.category.id});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const payload = {
        ...formData,
        stockQty: Math.max(0, formData.stockQty || 0),
        reorderLevel: Math.max(0, formData.reorderLevel || 0)
      };
      await updateProduct({ productId: formData.id, payload });
      setIsEditModalOpen(false);
      setSelectedItem(null);
      showToast(`Updated ${formData.name} successfully!`, "success");
    } catch {
      showToast("Failed to update product.", "error");
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedItem(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteProduct(selectedItem.id);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
      showToast(`Deleted ${selectedItem.name} successfully!`, "success");
    } catch {
      showToast("Failed to delete product.", "error");
    }
  };

  // --- COLUMNS ---
  const columns = [
    {
      header: "Product Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md border border-border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
            <img src={getImageUrlByProduct(row)} alt={row.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      )
    },
    { header: "Category", accessor: "category.name" },
    { header: "SKU", accessor: "sku", sortable: true },
    { header: "Qty", accessor: "stockQty" },
    {
      header: "Reorder Level",
      accessor: "reorderLevel",
      render: (row) => <span className="text-destructive font-medium">{row.reorderLevel}</span>
    },
  ];

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      {/* Modals */}
      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        product={selectedItem}
        categories={categories}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${selectedItem?.name}?`}
      />

      {/* Header */}
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
            role="switch"
            aria-checked={isNotifyEnabled}
            onClick={() => setIsNotifyEnabled(!isNotifyEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isNotifyEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isNotifyEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm font-medium">Notify</span>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Name or SKU..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              disabled={isCategoriesLoading}
              className="appearance-none h-10 pl-3 pr-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer min-w-[150px]"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={products}
        showNumber={false}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        isLoading={activeTab === "Low Stocks" ? isLowStockLoading : isOutStockLoading}
      />
    </div>
  );
};

export default LowStocks;

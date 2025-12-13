import React, { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "../components/ui/DataTable";
import DeleteModal from "../components/ui/DeleteModal";
import Toast from "../components/ui/Toast";
import EditCustomersModal from "../components/ui/EditCustomersModal";

const Customers = () => {
  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // --- Modal State ---
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  // --- Data (Cleaned up Address Fields) ---
  const [data, setData] = useState([
    { 
      id: 1, 
      code: "CU001", 
      name: "Carl Evans", 
      email: "carlevans@example.com", 
      phone: "+12163547758", 
      createdAt: "2023-12-01", 
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    { 
      id: 2, 
      code: "CU002", 
      name: "Minerva Rameriz", 
      email: "rameriz@example.com", 
      phone: "+11367529510", 
      createdAt: "2024-01-15", 
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    { 
      id: 3, 
      code: "CU003", 
      name: "Robert Lamon", 
      email: "robert@example.com", 
      phone: "+15362789414", 
      createdAt: "2024-02-20", 
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    { 
      id: 4, 
      code: "CU004", 
      name: "Patricia Lewis", 
      email: "patricia@example.com", 
      phone: "+18513094627", 
      createdAt: "2024-03-10", 
      avatar: "https://i.pravatar.cc/150?u=4",
    },
  ]);

  // --- Helper: Toast ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // --- Handlers ---
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

  const confirmDelete = () => {
    if (customerToDelete) {
      setData(data.filter((item) => item.id !== customerToDelete.id));
      showToast(`${customerToDelete.name} has been deleted successfully.`, "success");
      setCustomerToDelete(null);
    }
  };

  const handleSaveCustomer = (formData) => {
    if (currentCustomer) {
      // Update Existing
      setData(data.map(item => 
        item.id === currentCustomer.id 
          ? { ...item, ...formData } 
          : item
      ));
      showToast("Customer details updated successfully!", "success");
    } else {
      // Create New
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
      const newCode = `CU${String(newId).padStart(3, '0')}`;
      const today = new Date().toISOString().split('T')[0];

      const newCustomer = {
        id: newId,
        code: newCode,
        createdAt: today, 
        ...formData
      };
      setData([...data, newCustomer]);
      showToast("New customer added successfully!", "success");
    }
  };

  // --- Columns ---
  const columns = [
    { header: "Code", accessor: "code", sortable: true },
    { 
      header: "Customer", 
      accessor: "name", 
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.avatar || `https://ui-avatars.com/api/?name=${row.name}`} 
            alt={row.name} 
            className="w-9 h-9 rounded-full object-cover border border-border" 
          />
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Phone", accessor: "phone", sortable: false },
    { 
      header: "Joined", 
      accessor: "createdAt", 
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground text-sm">
          {row.createdAt}
        </span>
      )
    },
  ];

  // --- Filter & Pagination ---
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="hover:text-primary cursor-pointer">Dashboard</span>
            <span>/</span>
            <span className="text-foreground">Customers</span>
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
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#F69C3C]/50 transition-all"
          />
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          showNumber={false}
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
import React, { useEffect, useMemo, useState } from 'react';
import { Search, History, Eye, Send } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import { purchaseOrdersList } from '../data/PurchaseData';

const PurchaseOrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const storageKey = "purchaseOrders";
  const loadOrders = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to parse purchase orders from storage", e);
    }
    return purchaseOrdersList;
  };
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    const handleStorage = () => setOrders(loadOrders());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.po_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [orders, searchTerm]
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / entriesPerPage));

  const StatusBadge = ({ status }) => {
    let colorClass = '';
    switch (status) {
      case 'Received':
        colorClass = 'bg-primary/10 text-primary';
        break;
      case 'Completed':
        colorClass = 'bg-green-100 text-green-700';
        break;
      case 'In Transit':
        colorClass = 'bg-blue-100 text-blue-700';
        break;
      case 'Pending':
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

  const columns = [
    {
      header: 'PO ID',
      accessor: 'po_id',
      render: (row) => <span className="font-semibold text-primary">{row.po_id}</span>,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span className="text-muted-foreground">{row.date}</span>,
    },
    {
      header: 'Supplier',
      accessor: 'supplier',
      render: (row) => <span className="font-medium">{row.supplier.name}</span>,
    },
    {
      header: 'Items',
      accessor: 'items_count',
    },
    {
      header: 'Total Cost',
      accessor: 'total_cost',
      render: (row) => <span className="font-medium">${row.total_cost.toFixed(2)}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      accessor: 'action',
      render: () => (
        <div className="flex justify-end gap-2">
          <button className="p-2 border border-border rounded hover:bg-muted transition-colors" title="View Details">
            <Eye className="w-4 h-4 text-primary" />
          </button>
          <button className="p-2 border border-border rounded hover:bg-muted transition-colors" title="Send/Email PO">
            <Send className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-primary" /> Purchase Order History
        </h1>
      </div>

      {/* Path */}
      <div className="text-sm text-muted-foreground mt-1">
        Dashboard {'>'} Stock {'>'} <span className="text-primary">Purchase Order History</span>
      </div>

      {/* Main Content Card */}
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by PO ID or Supplier..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <DataTable
          columns={columns}
          data={currentEntries}
          showNumber={true}
          actions={false}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={entriesPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(val) => {
            setEntriesPerPage(val);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default PurchaseOrderHistory;

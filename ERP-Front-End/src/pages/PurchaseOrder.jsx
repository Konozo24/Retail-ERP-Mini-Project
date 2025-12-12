import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, CheckCircle, RotateCcw, FilePlus2, Download, History as HistoryIcon, Trash2, Plus } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import { purchaseOrdersList, suppliersData } from '../data/PurchaseData';
import { productsData } from '../data/mockData';

const PurchaseOrder = () => {
    const navigate = useNavigate();
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
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [orderDate, setOrderDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [selectedProduct, setSelectedProduct] = useState("");
    const [itemQty, setItemQty] = useState(1);
    const [itemCost, setItemCost] = useState("");
    const [items, setItems] = useState([]);

    // Placeholder functions for the buttons (Necessary to prevent errors)
    const handleSubmitOrder = () => {
        if (!selectedSupplier) {
            alert("Please select a supplier.");
            return;
        }
        if (!items.length) {
            alert("Add at least one product to the order.");
            return;
        }

        const supplierObj = suppliersData.find((s) => String(s.id) === String(selectedSupplier));
        const total_cost = items.reduce((sum, it) => sum + it.quantity * it.unit_cost, 0);
        const newOrder = {
            po_id: `PO-${Date.now()}`,
            date: orderDate,
            supplier: supplierObj,
            total_cost,
            items_count: items.length,
            status: "Pending",
        };

        setOrders((prev) => [newOrder, ...prev]);
        setSelectedSupplier("");
        setOrderDate(new Date().toISOString().slice(0, 10));
        setItems([]);
        setSelectedProduct("");
        setItemQty(1);
        setItemCost("");
        alert("Purchase order created (demo).");
    };

    const handleAddPurchase = () => {
        alert("Add Purchase button clicked! (This functionality belongs on the PO Create page.)");
    };
    // --- END PLACEHOLDER FUNCTIONS ---


    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(orders));
        } catch (e) {
            console.warn("Failed to save purchase orders", e);
        }
    }, [orders]);

    const filteredOrders = useMemo(
        () =>
            orders.filter((order) =>
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
                colorClass = 'bg-primary-100 text-primary';
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

    const handleToggleDelivered = (po_id) => {
        setOrders((prev) =>
            prev.map((o) =>
                o.po_id === po_id
                    ? {
                        ...o,
                        status: o.status === 'Received' ? 'Pending' : 'Received',
                    }
                    : o
            )
        );
    };

    const columns = [
        {
            header: "PO ID",
            accessor: "po_id",
            render: (row) => <span className="font-semibold text-primary">{row.po_id}</span>,
        },
        {
            header: "Date",
            accessor: "date",
            render: (row) => <span className="text-muted-foreground">{row.date}</span>,
        },
        {
            header: "Supplier",
            accessor: "supplier",
            render: (row) => <span className="font-medium">{row.supplier.name}</span>,
        },
        {
            header: "Items",
            accessor: "items_count",
        },
        {
            header: "Total Cost",
            accessor: "total_cost",
            render: (row) => <span className="font-medium">${row.total_cost.toFixed(2)}</span>,
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
                        onClick={() => handleToggleDelivered(row.po_id)}
                        className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        title={row.status === 'Received' ? 'Mark as Pending' : 'Mark as Delivered'}
                    >
                        {row.status === 'Received' ? (
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
                        onClick={() => navigate('/purchase-order-history')}
                        className="px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        title="View history"
                    >
                        <HistoryIcon className="w-4 h-4 text-primary" />
                        History
                    </button>
                </div>
            ),
        },
    ];

    const addItem = () => {
        if (!selectedProduct) return;
        const product = productsData.find((p) => String(p.id) === String(selectedProduct));
        if (!product) return;
        const unitCost = itemCost ? parseFloat(itemCost) : parseFloat((product.unit_price || "0").replace(/,/g, ""));
        if (!unitCost || unitCost <= 0) {
            alert("Please enter a valid unit cost.");
            return;
        }
        setItems((prev) => {
            const exists = prev.find((i) => i.product.id === product.id);
            if (exists) {
                return prev.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + itemQty }
                        : i
                );
            }
            return [...prev, { product, quantity: itemQty, unit_cost: unitCost }];
        });
        setItemQty(1);
        setItemCost("");
        setSelectedProduct("");
    };

    const updateItemField = (productId, field, value) => {
        setItems((prev) =>
            prev.map((i) =>
                i.product.id === productId
                    ? { ...i, [field]: value }
                    : i
            )
        );
    };

    const removeItem = (productId) => {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
    };

    const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.unit_cost, 0);

    return (
        <div className="space-y-6">
            
            {/* Header and Actions */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-primary"/> Purchase Orders
                </h1>
                <div className="flex gap-2">
                    <button className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium text-sm border border-input">
                        <FilePlus2 className="w-4 h-4"/> New PO
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium text-sm">
                        <Download className="w-4 h-4"/> Export
                    </button>
                </div>
            </div>

            {/* Path */}
            <div className="text-sm text-muted-foreground mt-1">
                Dashboard {'>'} Stock {'>'} <span className="text-primary">Purchase Orders</span>
            </div>

            {/* Main Content Card (The List Table) */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Supplier <span className="text-destructive">*</span></label>
                        <select
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select supplier</option>
                            {suppliersData.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Order Date</label>
                        <input
                            type="date"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">Product</label>
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select product</option>
                            {productsData.map((p) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={itemQty}
                            onChange={(e) => setItemQty(Math.max(1, Number(e.target.value)))}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Unit Cost</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={itemCost}
                            onChange={(e) => setItemCost(e.target.value)}
                            placeholder="Auto from product price"
                            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
                <button
                    onClick={addItem}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm hover:bg-primary/90"
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Unit Cost</th>
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
                                            min="1"
                                            value={it.quantity}
                                            onChange={(e) => updateItemField(it.product.id, "quantity", Math.max(1, Number(e.target.value)))}
                                            className="w-20 h-9 rounded-md border border-input bg-background px-2 text-sm focus:ring-1 focus:ring-primary"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={it.unit_cost}
                                            onChange={(e) => updateItemField(it.product.id, "unit_cost", Math.max(0, Number(e.target.value)))}
                                            className="w-28 h-9 rounded-md border border-input bg-background px-2 text-sm focus:ring-1 focus:ring-primary"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold">
                                        ${(it.quantity * it.unit_cost).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => removeItem(it.product.id)}
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
                        Total: ${itemsTotal.toFixed(2)}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSubmitOrder}
                        className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm"
                    >
                        Submit Order
                    </button>
                    <button
                        onClick={handleAddPurchase}
                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 px-4 rounded-md transition-colors shadow-sm"
                    >
                        Add Purchase
                    </button>
                </div>
            </div>

            {/* Existing list */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm space-y-4">
                {/* Search */}
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

export default PurchaseOrder;
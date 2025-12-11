// PurchaseOrderList.jsx (Updated with action buttons at the bottom)

import React, { useState } from 'react';
import { Search, History, Eye, Send, FilePlus2, Download } from 'lucide-react';
import { purchaseOrdersList } from '../data/PurchaseData'; // Import the PO List

const PurchaseOrder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // Placeholder functions for the buttons (Necessary to prevent errors)
    const handleSubmitOrder = () => {
        alert("Submit Order button clicked! (This functionality belongs on the PO Create page.)");
    };

    const handleAddPurchase = () => {
        alert("Add Purchase button clicked! (This functionality belongs on the PO Create page.)");
    };
    // --- END PLACEHOLDER FUNCTIONS ---


    // --- FILTERING AND PAGINATION LOGIC ---
    const filteredOrders = purchaseOrdersList.filter(order => 
        order.po_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    return (
        <div className="space-y-6">
            
            {/* Header and Actions */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <History className="w-6 h-6 text-primary"/> Purchase Order History
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
                
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by PO ID or Supplier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                {/* PO List Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">PO ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Supplier</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Total Cost</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                            {currentEntries.length > 0 ? (
                                currentEntries.map((order) => (
                                    <tr key={order.po_id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary">{order.po_id}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{order.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{order.supplier.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">{order.items_count}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">${order.total_cost.toFixed(2)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button title="View Details" className="text-primary hover:text-primary/80 p-1 rounded transition-colors">
                                                    <Eye className="w-4 h-4"/>
                                                </button>
                                                <button title="Send/Email PO" className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors">
                                                    <Send className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-muted-foreground">
                                        No Purchase Orders found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredOrders.length)} of {filteredOrders.length} entries
                    </div>
                    <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                    currentPage === index + 1 ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ACTION BUTTONS ADDED HERE (Bottom Left) --- */}
            <div className="flex gap-4 pt-4">
                <button 
                    onClick={handleSubmitOrder} 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-lg"
                >
                    Submit Order
                </button>
                <button 
                    onClick={handleAddPurchase} 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-lg"
                >
                    Add Purchase
                </button>
            </div>
            {/* ------------------------------------------------ */}
        </div>
    );
};

export default PurchaseOrder;
import React, { useState } from 'react';
import Barcode from 'react-barcode';
import { FaSearch, FaFileAlt, FaSync, FaChevronUp, FaPrint, FaUndo, FaTimes } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import { productsData } from '../data/mockData';
import DeleteModal from '../components/ui/DeleteModal'; // Ensure you have the DeleteModal file saved

const PrintBarcode = () => {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Settings & Preview
    const [paperSize, setPaperSize] = useState('A4');
    const [settings, setSettings] = useState({
        showProductName: true,
        showPrice: true,
    });
    const [showPreview, setShowPreview] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // --- Search & Add Logic ---
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const filtered = productsData.filter((product) =>
                product.name.toLowerCase().includes(value.toLowerCase()) ||
                product.sku.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filtered);
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    };

    const addProduct = (product) => {
        const existing = selectedProducts.find(p => p.id === product.id);
        if (existing) {
            // If product exists, we increment the qty automatically by 1 (simulating a scan)
            const updatedProducts = selectedProducts.map(p =>
                p.id === product.id ? { ...p, qty: p.qty + 1 } : p
            );
            setSelectedProducts(updatedProducts);
        } else {
            // New product default quantity (e.g., 10)
            setSelectedProducts([...selectedProducts, { ...product, qty: 10 }]);
        }
        setSearchTerm('');
        setIsDropdownOpen(false);
    };

    // --- Delete Logic ---
    const initiateDelete = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            setSelectedProducts(selectedProducts.filter(p => p.id !== productToDelete));
            setProductToDelete(null);
        }
    };

    // --- Settings Logic ---
    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleReset = () => {
        setSelectedProducts([]);
        setSearchTerm('');
        setShowPreview(false);
    };

    const handlePrintTrigger = () => {
        if (selectedProducts.length === 0) {
            alert("Please select at least one product.");
            return;
        }
        setShowPreview(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-700">

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Print Barcode</h1>
                    <div className="text-sm text-gray-500 mt-1">
                        <span>Dashboard</span> <span className="mx-1">&gt;</span> <span>Print Barcode</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">

                {/* 1. Search Section */}
                <div className="mb-6 relative">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Product <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                            placeholder="Scan/Search Product by Name or Code"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => searchTerm && setIsDropdownOpen(true)}
                        />
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                    <div
                                        key={product.id}
                                        className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => addProduct(product)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                                            <div>
                                                <div className="font-medium text-gray-800">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.sku}</div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-orange-500">${product.unit_price}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Table Section */}
                <div className="mb-8">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">SKU</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3 text-center">Qty</th>
                                    <th className="px-6 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <FaFileAlt className="text-3xl mb-2 text-gray-300" />
                                                <span>No Data Available</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    selectedProducts.map((product) => (
                                        <tr key={product.id} className="bg-white hover:bg-gray-50">
                                            <td className="px-6 py-3 font-medium text-gray-800">{product.name}</td>
                                            <td className="px-6 py-3 text-gray-500">{product.sku}</td>
                                            <td className="px-6 py-3 text-gray-500">{product.category}</td>
                                            {/* Qty Column: View Only */}
                                            <td className="px-6 py-3 text-center font-medium text-gray-700">
                                                {product.qty}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => initiateDelete(product.id)}
                                                        className="p-2 border border-gray-300 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-b border-gray-100 pb-8 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Paper Size <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                            value={paperSize}
                            onChange={(e) => setPaperSize(e.target.value)}
                        >
                            <option value="A4">A4 (Standard)</option>
                            <option value="Label">Label Sticker (4x6)</option>
                        </select>
                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button onClick={handleReset} className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition">
                        <FaUndo className="mr-2" /> Reset
                    </button>
                    <button onClick={handlePrintTrigger} className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition shadow-sm font-medium">
                        <FaPrint className="mr-2" /> Print Barcode
                    </button>
                </div>

            </div>

            {/* --- PREVIEW MODAL / AREA --- */}
            {showPreview && (
                <div className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">

                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Print Preview ({paperSize})</h2>
                            <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-red-500 transition">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Grid for Barcodes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 print:block">
                            {selectedProducts.flatMap((product) =>
                                // Create an array of length 'qty' to map over
                                Array.from({ length: product.qty }).map((_, idx) => (
                                    <div key={`${product.id}-${idx}`} className="border border-gray-200 p-4 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm break-inside-avoid">
                                        {settings.showProductName && (
                                            <div className="font-bold text-sm mb-2 text-center text-gray-800 truncate w-full">{product.name}</div>
                                        )}

                                        <Barcode
                                            value={product.sku}
                                            width={1.5}
                                            height={50}
                                            fontSize={14}
                                        />

                                        {settings.showPrice && (
                                            <div className="font-bold text-lg mt-2 text-gray-800">${product.unit_price}</div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-8 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 font-bold flex items-center"
                            >
                                <FaPrint className="mr-2" /> Print Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Remove Product"
                message="Are you sure you want to remove this product from the print list?"
            />

        </div>
    );
};

export default PrintBarcode;
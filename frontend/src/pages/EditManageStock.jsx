// src/components/modals/EditStockModal.jsx

import React, { useState, useEffect } from "react";
import { X, Search, Monitor, Minus, Plus } from "lucide-react";

const EditManageStock = ({ isOpen, onClose, onSave, stockItem }) => {
    
    // Local state to manage form inputs
    const [currentQty, setCurrentQty] = useState(0);
    const [responsiblePerson, setResponsiblePerson] = useState("James Kirwin"); // Default or fetched value

    // Sync local state when the modal opens with a new item
    useEffect(() => {
        if (stockItem) {
            setCurrentQty(stockItem.current_qty);
            // Reset or fetch responsible person if needed
        }
    }, [stockItem]);

    if (!isOpen || !stockItem) return null;

    const handleSave = () => {
        const updatedItem = {
            ...stockItem,
            current_qty: parseInt(currentQty, 10),
            // Optionally update last_updated here
            last_updated: new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }),
            // Recalculate status based on new quantity
            status: currentQty > 50 ? 'In Stock' : currentQty > 0 ? 'Low Stock' : 'Out of Stock',
        };
        onSave(updatedItem);
    };

    const handleQtyChange = (e) => {
        // Ensure input is a valid number
        const value = Math.max(0, parseInt(e.target.value, 10) || 0);
        setCurrentQty(value);
    };
    
    const handleQtyIncrement = (amount) => {
        setCurrentQty(prev => Math.max(0, prev + amount));
    };

    // Style classes for reusability
    const inputClass = "w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50";
    const labelClass = "block text-sm font-medium text-foreground mb-1";
    
    const responsiblePersons = ["James Kirwin", "Francis Chang", "Antonio Engle", "Leo Kelly", "Annette Walker"]; // Mock list

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="bg-card rounded-lg shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-300 transform scale-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="text-xl font-semibold">Edit Stock</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    
                    {/* Responsible Person Dropdown */}
                    <div>
                        <label htmlFor="responsiblePerson" className={labelClass}>Responsible Person <span className="text-destructive">*</span></label>
                        <select
                            id="responsiblePerson"
                            value={responsiblePerson}
                            onChange={(e) => setResponsiblePerson(e.target.value)}
                            className={inputClass}
                        >
                            {responsiblePersons.map((person, index) => (
                                <option key={index} value={person}>{person}</option>
                            ))}
                        </select>
                    </div>

                    {/* Product Display (Similar to image_6e5362.png) */}
                    <div>
                        <label className={labelClass}>Product <span className="text-destructive">*</span></label>
                        <div className="border border-border rounded-md p-3 flex flex-col gap-3">
                            {/* Static Search-like input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    defaultValue={stockItem.name}
                                    readOnly
                                    className={`${inputClass} pl-9 bg-muted/50 cursor-not-allowed`}
                                />
                            </div>

                            {/* Product Info Row */}
                            <div className="grid grid-cols-4 items-center text-sm border-t border-border pt-3">
                                <div className="font-medium text-muted-foreground">Product</div>
                                <div className="font-medium text-muted-foreground">SKU</div>
                                <div className="font-medium text-muted-foreground">Category</div>
                                <div className="font-medium text-muted-foreground text-center">Qty</div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center text-sm py-2 bg-muted/20 rounded-md px-1">
                                <div className="flex items-center gap-2">
                                    <img src={stockItem.image} alt={stockItem.name} className="w-8 h-8 rounded-sm object-cover" />
                                    <span>{stockItem.name}</span>
                                </div>
                                <span className="text-muted-foreground">{stockItem.sku}</span>
                                <span>{stockItem.category}</span>
                                
                                {/* Quantity Adjuster */}
                                <div className="flex items-center justify-center gap-1">
                                    <button 
                                        onClick={() => handleQtyIncrement(-1)}
                                        className="p-1 rounded-full border border-input bg-background hover:bg-muted transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentQty}
                                        onChange={handleQtyChange}
                                        className="w-12 text-center text-sm font-medium border border-input rounded-md bg-white"
                                    />
                                    <button 
                                        onClick={() => handleQtyIncrement(1)}
                                        className="p-1 rounded-full border border-input bg-background hover:bg-muted transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-border bg-muted/50">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditManageStock;
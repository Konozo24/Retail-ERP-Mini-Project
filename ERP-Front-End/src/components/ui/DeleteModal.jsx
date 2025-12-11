import React from "react";
import { Trash2 } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to delete this item?" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col items-center text-center">
        
        {/* Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 text-sm px-4">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white font-medium transition-colors min-w-[100px]"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium transition-colors shadow-sm min-w-[100px]"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteModal;
import { X } from "lucide-react";

const BaseEditModal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    formId,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* --- Header --- */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* --- Scrollable Content --- */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form
                        id={formId}
                        onSubmit={onSubmit}
                        className="space-y-6"
                    >
                        {children}
                    </form>
                </div>

                {/* --- Footer Actions --- */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form={formId}
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white font-medium transition-colors shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BaseEditModal;

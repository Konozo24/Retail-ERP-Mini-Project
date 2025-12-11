import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";

const EditCustomersModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: null, // Stores the preview URL
  });

  // --- Reset/Populate Form on Open ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const nameParts = initialData.name ? initialData.name.split(" ") : ["", ""];
        setFormData({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          avatar: initialData.avatar || null,
        });
      } else {
        // Add Mode: Reset to empty
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          avatar: null,
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
    };
    onSubmit(submissionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Section */}
            <div className="flex flex-row items-center gap-6 p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                {formData.avatar && (
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, avatar: null})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-4 py-2 bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors shadow-sm w-fit">
                  Change Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                <span className="text-xs text-muted-foreground">JPEG, PNG up to 2 MB</span>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all" placeholder="Enter first name" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all" placeholder="Enter last name" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all" placeholder="example@email.com" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
                <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all" placeholder="+1 123 456 7890" />
              </div>

            </div>
          </form>
        </div>

        {/* --- Footer Actions --- */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white font-medium transition-colors">
            Cancel
          </button>
          <button form="customer-form" type="submit" className="px-6 py-2.5 rounded-lg bg-[#F69C3C] hover:bg-[#F69C3C]/90 text-white font-medium transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomersModal;
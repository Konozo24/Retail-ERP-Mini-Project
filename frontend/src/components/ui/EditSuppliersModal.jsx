import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import BaseEditModal from "./BaseEditModal";

const EditSuppliersModal = ({ isOpen, onClose, onSubmit, initialData, title }) => {

	const [errors, setErrors] = useState(null);

	// Form State
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		address: "",
	});

	// Reset/Populate Form on Open
	useEffect(() => {
		if (!isOpen) return;

		if (initialData) {
			setFormData({
				name: initialData.name || "",
				email: initialData.email || "",
				phone: initialData.phone || "",
				address: initialData.address || ""
			});
		} else {
			setFormData({
				name: "",
				email: "",
				phone: "",
				address: ""
			});
		}

		setErrors(null);
	}, [isOpen, initialData]);

	// Handlers
	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors?.[name]) {
			setErrors((prev) => {
				const { [name]: _, ...rest } = prev;
				return rest;
			});
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setFormData((prev) => ({ ...prev, avatar: imageUrl }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			if (error?.response?.data?.message) {
				showToast(error.response.data.message, "error");
			} else if (error?.response?.data) {
				setErrors(error.response.data);
			}
		}
	};

	return (
		<BaseEditModal
			isOpen={isOpen}
			title={title}
			onClose={onClose}
			onSubmit={handleSubmit}
			formId="supplier-form"
		>


			{/* Form Fields Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

				<div className="space-y-2 md:col-span-2">
					<label className="text-sm font-medium text-gray-700">
						Name <span className="text-red-500">*</span>
					</label>
					<input
						required
						name="name"
						value={formData.name}
						onChange={handleChange}
						className={`${errors?.name ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						placeholder="Enter name"
					/>
					{errors?.name && (
						<p className="text-sm text-red-500">{errors.name}</p>
					)}
				</div>

				<div className="space-y-2 md:col-span-2">
					<label className="text-sm font-medium text-gray-700">
						Email <span className="text-red-500">*</span>
					</label>
					<input
						required
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className={`${errors?.email ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						placeholder="example@email.com"
					/>
					{errors?.email && (
						<p className="text-sm text-red-500">{errors.email}</p>
					)}
				</div>

				<div className="space-y-2 md:col-span-2">
					<label className="text-sm font-medium text-gray-700">
						Phone <span className="text-red-500">*</span>
					</label>
					<input
						required
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						className={`${errors?.phone ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						placeholder="+1 123 456 7890"
					/>
					{errors?.phone && (
						<p className="text-sm text-red-500">{errors.phone}</p>
					)}
				</div>

				<div className="space-y-2 md:col-span-2">
					<label className="text-sm font-medium text-gray-700">
						Address <span className="text-red-500">*</span>
					</label>
					<input
						required
						name="address"
						value={formData.address}
						onChange={handleChange}
						className={`${errors?.address ? "border-red-400 " : "border-gray-200 "}
                          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						placeholder="Sesame Street 123"
					/>
					{errors?.address && (
						<p className="text-sm text-red-500">{errors.address}</p>
					)}
				</div>

			</div>

		</BaseEditModal>
	);
};

export default EditSuppliersModal;

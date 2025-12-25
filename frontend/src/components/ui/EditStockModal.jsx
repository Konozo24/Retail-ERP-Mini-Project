import React, { useState, useEffect } from "react";
import BaseEditModal from "./BaseEditModal";
import { useCategoriesOptions } from "../../hooks/useCategoriesOptions"

const EditStockModal = ({ isOpen, onClose, onSave, product }) => {

	const categoriesOptions = useCategoriesOptions();

	const [formData, setFormData] = useState({
		sku: "",
		categoryId: "",
		name: "",
		stockQty: 0,
		reorderLevel: 10,
	});

	const [errors, setErrors] = useState(null);

	// Reset/Populate Form on Open
	useEffect(() => {
		if (!isOpen) return;

		if (product) {
			setFormData({
				sku: product.sku || "",
				categoryId: product.category?.id || "",
				name: product.name || "",
				stockQty: product.stockQty || 0,
				reorderLevel: product.reorderLevel || 10,
			});
		} else {
			setFormData({
				sku: "",
				categoryId: "",
				name: "",
				stockQty: 0,
				reorderLevel: 10,
			});
		}

		setErrors(null);
	}, [isOpen, product]);

	// Handlers
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors?.[name]) {
			setErrors((prev) => {
				const { [name]: _, ...rest } = prev;
				return rest;
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			onSave({ ...product, ...formData });
			onClose();
		} catch (error) {
			if (error?.response?.data) {
				setErrors(error.response.data);
			}
		}
	};

	return (
		<BaseEditModal
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			title="Edit Stock"
			formId="stock-form"
		>
			{/* Row 1: SKU & Category */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">
						SKU <span className="text-red-500">*</span>
					</label>
					<input
						name="sku"
						value={formData.sku}
						onChange={handleChange}
						className={`${errors?.sku ? "border-red-400" : "border-gray-200"} 
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						placeholder="Enter SKU"
						required
					/>
					{errors?.sku && <p className="text-sm text-red-500">{errors.sku}</p>}
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">
						Category <span className="text-red-500">*</span>
					</label>
					<select
						name="categoryId"
						value={formData.categoryId}
						onChange={handleChange}
						className={`${errors?.categoryId ? "border-red-400" : "border-gray-200"} 
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						required
					>
						<option value="">Select Category</option>
						{categoriesOptions.map((cat, index) => (
							<option key={index} value={cat.id}>
								{cat.name === "All" ? "All Categories" : cat.name}
							</option>
						))}
					</select>
					{errors?.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
				</div>
			</div>

			{/* Row 2: Product Name */}
			<div className="space-y-2 mt-4">
				<label className="text-sm font-medium">
					Product Name <span className="text-red-500">*</span>
				</label>
				<input
					name="name"
					value={formData.name}
					onChange={handleChange}
					className={`${errors?.name ? "border-red-400" : "border-gray-200"} 
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
					placeholder="Enter product name"
					required
				/>
				{errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
			</div>

			{/* Row 3: Qty & Qty Alert */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">
						Current Stock <span className="text-red-500">*</span>
					</label>
					<input
						type="number"
						name="stockQty"
						value={formData.stockQty}
						onChange={handleChange}
						disabled={true}
						className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
						required
					/>
					<p className="text-xs text-gray-500 mt-1">
						Stock is managed through Purchase Orders. Mark PO as Delivered to increase stock.
					</p>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">
						Qty Alert <span className="text-red-500">*</span>
					</label>
					<input
						type="number"
						name="reorderLevel"
						value={formData.reorderLevel}
						onChange={handleChange}
						className={`${errors?.reorderLevel ? "border-red-400" : "border-gray-200"} 
              w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F69C3C]/20 focus:border-[#F69C3C] outline-none transition-all`}
						required
					/>
					{errors?.reorderLevel && <p className="text-sm text-red-500">{errors.reorderLevel}</p>}
				</div>
			</div>
		</BaseEditModal>
	);
};

export default EditStockModal;

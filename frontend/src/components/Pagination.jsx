import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
	currentPage = 1,
	totalPages = 10,
	onPageChange,
	itemsPerPage = 10,
	onItemsPerPageChange
}) => {
	// Helper to generate page numbers (simple version)
	const getPageNumbers = () => {
		const pages = [];
		// Always show first 3 pages and the last page
		for (let i = 1; i <= Math.min(3, totalPages); i++) {
			pages.push(i);
		}
		if (totalPages > 3) pages.push("...");
		if (totalPages > 1 && totalPages > 3) pages.push(totalPages);
		return pages;
	};

	return (
		<div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground bg-card">

			{/* Left Side: Rows Selector */}
			<div className="flex items-center gap-2">
				<span>Row Per Page</span>
				<select
					value={itemsPerPage}
					onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
					className="border border-input bg-background rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
				>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
				<span>Entries</span>
			</div>

			{/* Right Side: Page Buttons */}
			<div className="flex items-center gap-1">

				{/* Previous Button */}
				<button
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<ChevronLeft className="w-4 h-4" />
				</button>

				{/* Page Numbers */}
				{getPageNumbers().map((page, index) => {
					if (page === "...") {
						return <span key={`ellipsis-${index}`} className="px-2">...</span>;
					}

					const isActive = page === currentPage;

					return (
						<button
							key={page}
							onClick={() => onPageChange(page)}
							className={`
                        px-3 py-1 rounded border transition-colors
                        ${isActive
									? "bg-accent text-white border-accent"  // Active: Orange (matches screenshot)
									: "bg-transparent border-border hover:bg-muted text-foreground" // Inactive
								}
                    `}
						>
							{page}
						</button>
					);
				})}

				{/* Next Button */}
				<button
					onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
					className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
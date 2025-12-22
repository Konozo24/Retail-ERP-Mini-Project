/**
 * @returns {{
 *   searchQuery: string,
 *   category: string,
 *   pageNum: number,
 *   pageSize: number,
 *   sortItem: string|null,
 *   sortDir: string,
 *   startDate: string|null,
 *   endDate: string|null,
 *   setSearchQuery: import('react').Dispatch<import('react').SetStateAction<string>>,
 *   setCategory: import('react').Dispatch<import('react').SetStateAction<string>>,
 *   setPageNum: import('react').Dispatch<import('react').SetStateAction<number>>,
 *   setPageSize: import('react').Dispatch<import('react').SetStateAction<number>>,
 *   setSortItem: import('react').Dispatch<import('react').SetStateAction<string|null>>,
 *   setSortDir: import('react').Dispatch<import('react').SetStateAction<string>>,
 *   setStartDate: import('react').Dispatch<import('react').SetStateAction<string|null>>,
 *   setEndDate: import('react').Dispatch<import('react').SetStateAction<string|null>>,
 *   payload: import('../types/QuerySpecsPayload').QuerySpecsPayload
 * }}
 */
export const useQuerySpecs = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [category, setCategory] = useState("All");
	const [pageNum, setPageNum] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [sortItem, setSortItem] = useState(null);
	const [sortDir, setSortDir] = useState("asc");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);

	const payload = useMemo(() => ({
		search: searchQuery,
		category,
		page: pageNum - 1,
		size: pageSize,
		sort: sortItem ? `${sortItem},${sortDir}` : undefined,
		...(startDate && { startDate }),
		...(endDate && { endDate }),
	}), [searchQuery, category, pageNum, pageSize, sortItem, sortDir, startDate, endDate]);

	return {
		// state
		searchQuery,
		category,
		pageNum,
		pageSize,
		sortItem,
		sortDir,
		startDate,
		endDate,

		// setters
		setSearchQuery,
		setCategory,
		setPageNum,
		setPageSize,
		setSortItem,
		setSortDir,
		setStartDate,
		setEndDate,

		// API payload
		payload,
	};
};

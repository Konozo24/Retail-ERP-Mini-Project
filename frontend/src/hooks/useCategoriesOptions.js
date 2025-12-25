import { useMemo } from "react";
import { useGetCategories } from "../api/categories.api";

export const useCategoriesOptions = () => {
  const { data: categories } = useGetCategories();

  const categoriesFilter = useMemo(() => [
	{ id: null, name: "All" },
	...(categories?.map(({ id, name }) => ({ id, name })) ?? []),
  ], [categories]);

  return categoriesFilter;
};
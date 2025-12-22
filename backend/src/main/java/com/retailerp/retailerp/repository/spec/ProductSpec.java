package com.retailerp.retailerp.repository.spec;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale.Category;
import org.springframework.data.jpa.domain.Specification;
import com.retailerp.retailerp.model.Product;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductSpec {

	// Common predicates for active products and categories
	private static void addCommonPredicates(
		Root<Product> root,
		Join<Product, Category> categoryJoin,
		CriteriaBuilder cb,
		String search,
		Long categoryId,
		List<Predicate> predicates)
	{
		predicates.add(cb.isFalse(root.get("inactive"))); // active product
		predicates.add(cb.isFalse(categoryJoin.get("inactive"))); // active category

		if (search != null && !search.trim().isEmpty()) {
			String pattern = "%" + search.toLowerCase() + "%";
			Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
			Predicate skuLike = cb.like(cb.lower(root.get("sku")), pattern);
			predicates.add(cb.or(nameLike, skuLike));
		}

		if (categoryId != null) {
			predicates.add(cb.equal(categoryJoin.get("id"), categoryId));
		}
	}

	// General spec (any product, with optional search/category)
	public static Specification<Product> getSpec(String search, Long categoryId)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			Join<Product, Category> categoryJoin = root.join("category");

			addCommonPredicates(root, categoryJoin, cb, search, categoryId, predicates);
			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}

	// Low stock spec (stockQty between 1 and reorderLevel, inclusive)
	public static Specification<Product> getLowStockSpec(String search, Long categoryId)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			Join<Product, Category> categoryJoin = root.join("category");

			addCommonPredicates(root, categoryJoin, cb, search, categoryId, predicates);
			predicates.add(cb.between(root.get("stockQty"), cb.literal(1), root.get("reorderLevel")));
			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}

	// Out of stock spec (stockQty = 0)
	public static Specification<Product> getOutOfStockSpec(String search, Long categoryId)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			Join<Product, Category> categoryJoin = root.join("category");

			addCommonPredicates(root, categoryJoin, cb, search, categoryId, predicates);
			predicates.add(cb.equal(root.get("stockQty"), cb.literal(0)));
			return cb.and(predicates.toArray(new Predicate[0]));
		};
	}

}

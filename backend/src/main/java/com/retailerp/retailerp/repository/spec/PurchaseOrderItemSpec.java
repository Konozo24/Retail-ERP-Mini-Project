package com.retailerp.retailerp.repository.spec;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.retailerp.retailerp.model.Category;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class PurchaseOrderItemSpec {

	public static Specification<PurchaseOrderItem> getItemsSpec(
		Long purchaseOrderId,
		String search,
		Long categoryId)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			Join<PurchaseOrderItem, Product> productJoin = root.join("product");
			Join<Product, Category> categoryJoin = productJoin.join("category");

			// Search by id
			predicates.add(cb.equal(root.get("purchaseOrder").get("id"), purchaseOrderId));

			// Search by name
			if (search != null && !search.trim().isEmpty()) {
				String pattern = "%" + search.toLowerCase() + "%";
				Predicate nameLike = cb.like(cb.lower(productJoin.get("name")), pattern);
				predicates.add(nameLike);
			}

			// Filter by category
			if (categoryId != null) {
				predicates.add(cb.equal(categoryJoin.get("id"), categoryId));
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};

	};

}

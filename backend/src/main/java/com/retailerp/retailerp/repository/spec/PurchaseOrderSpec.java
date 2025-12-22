package com.retailerp.retailerp.repository.spec;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.Supplier;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class PurchaseOrderSpec {

	public static Specification<PurchaseOrder> getSpec(String search)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			Join<PurchaseOrder, Supplier> supplierJoin = root.join("supplier");

			// Filter out inactive products
			predicates.add(cb.isFalse(root.get("inactive")));

			// Search by name
			if (search != null && !search.trim().isEmpty()) {
				String pattern = "%" + search.toLowerCase() + "%";
				Predicate nameLike = cb.like(cb.lower(supplierJoin.get("name")), pattern);
				predicates.add(nameLike);
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};

	};

}

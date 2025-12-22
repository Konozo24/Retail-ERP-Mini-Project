package com.retailerp.retailerp.repository.spec;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.retailerp.retailerp.model.Supplier;
import jakarta.persistence.criteria.Predicate;

public class SupplierSpec {

	public static Specification<Supplier> getSpec(String search)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			// Filter out inactive products
			predicates.add(cb.isFalse(root.get("inactive")));

			// Search by name or email
			if (search != null && !search.trim().isEmpty()) {
				String pattern = "%" + search.toLowerCase() + "%";
				Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
				Predicate emailLike = cb.like(cb.lower(root.get("email")), pattern);
				predicates.add(cb.or(nameLike, emailLike));
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};

	};

}

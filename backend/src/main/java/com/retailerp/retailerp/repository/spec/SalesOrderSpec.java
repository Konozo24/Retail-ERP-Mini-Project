package com.retailerp.retailerp.repository.spec;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.retailerp.retailerp.model.Customer;
import com.retailerp.retailerp.model.SalesOrder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class SalesOrderSpec {

	public static Specification<SalesOrder> getSpec(
		String search,
		String startDate,
		String endDate)
	{
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			Join<SalesOrder, Customer> customerJoin = root.join("customer");

			// Filter out inactive products
			// predicates.add(cb.isFalse(root.get("inactive")));

			// Search by name
			if (search != null && !search.trim().isEmpty()) {
				String pattern = "%" + search.toLowerCase() + "%";
				Predicate nameLike = cb.like(cb.lower(customerJoin.get("name")), pattern);
				predicates.add(nameLike);
			}

			// Date range filtering
			if (startDate != null && !startDate.trim().isEmpty()) {
				try {
					LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE);
					predicates.add(cb.greaterThanOrEqualTo(
						cb.function("DATE", LocalDate.class, root.get("createdAt")), start));
				} catch (Exception e) {
					// Invalid date format, ignore
				}
			}

			if (endDate != null && !endDate.trim().isEmpty()) {
				try {
					LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE);
					predicates.add(cb.lessThanOrEqualTo(
						cb.function("DATE", LocalDate.class, root.get("createdAt")), end));
				} catch (Exception e) {
					// Invalid date format, ignore
				}
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};

	};

}

package com.retailerp.retailerp.repository.spec;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.SalesOrder;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class SalesOrderSpec {
    public static Specification<SalesOrder> getSpecification(String search) {
        return getSpecification(search, null, null);
    }

    public static Specification<SalesOrder> getSpecification(String search, String startDate, String endDate) {
        return new Specification<SalesOrder>() {
            @Override
            public Predicate toPredicate(Root<SalesOrder> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                // Filter out inactive products
                //predicates.add(criteriaBuilder.isFalse(root.get("inactive")));

                // Search by name
                if (search != null && !search.trim().isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                    predicates.add(nameLike);
                }

                // Date range filtering
                if (startDate != null && !startDate.trim().isEmpty()) {
                    try {
                        LocalDate start = LocalDate.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE);
                        predicates.add(criteriaBuilder.greaterThanOrEqualTo(criteriaBuilder.function("DATE", LocalDate.class, root.get("createdAt")), start));
                    } catch (Exception e) {
                        // Invalid date format, ignore
                    }
                }

                if (endDate != null && !endDate.trim().isEmpty()) {
                    try {
                        LocalDate end = LocalDate.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE);
                        predicates.add(criteriaBuilder.lessThanOrEqualTo(criteriaBuilder.function("DATE", LocalDate.class, root.get("createdAt")), end));
                    } catch (Exception e) {
                        // Invalid date format, ignore
                    }
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}

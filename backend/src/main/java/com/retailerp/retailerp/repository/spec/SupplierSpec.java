package com.retailerp.retailerp.repository.spec;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.Supplier;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class SupplierSpec {
    public static Specification<Supplier> getSpecification(String search) {
        return new Specification<Supplier>() {
            @Override
            public Predicate toPredicate(Root<Supplier> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                // Filter out inactive products
                predicates.add(criteriaBuilder.isFalse(root.get("inactive")));

                // Search by name or email
                if (search != null && !search.trim().isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                    Predicate emailLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern);
                    predicates.add(criteriaBuilder.or(nameLike, emailLike));
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}

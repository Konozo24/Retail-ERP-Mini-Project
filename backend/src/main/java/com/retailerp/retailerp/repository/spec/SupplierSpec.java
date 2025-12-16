package com.retailerp.retailerp.repository.spec;


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
                                Predicate activePredicate = criteriaBuilder.isFalse(root.get("inactive"));

                Predicate searchPredicate = null;
                if (search != null && !search.isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                    Predicate emailLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern);

                    searchPredicate = criteriaBuilder.or(nameLike, emailLike);
                }

                if (searchPredicate != null) {
                    return criteriaBuilder.and(activePredicate, searchPredicate);
                } else {
                    return activePredicate;
                }
            }
        };
    }
}

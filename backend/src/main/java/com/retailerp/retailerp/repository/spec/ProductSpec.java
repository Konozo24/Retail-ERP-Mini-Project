package com.retailerp.retailerp.repository.spec;


import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.Product;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductSpec {
    public static Specification<Product> getSpecification(String search) {
        return new Specification<Product>() {
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                Predicate activePredicate = criteriaBuilder.isFalse(root.get("inactive"));

                Predicate searchPredicate = null;
                if (search != null && !search.isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                    searchPredicate = criteriaBuilder.or(nameLike);
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

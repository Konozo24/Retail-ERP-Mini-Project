package com.retailerp.retailerp.repository.spec;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.Product;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ProductSpec {
    public static Specification<Product> getSpecification(String search, String category) {
        return new Specification<Product>() {
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                // Filter out inactive products
                predicates.add(criteriaBuilder.isFalse(root.get("inactive")));

                // Search by name
                if (search != null && !search.trim().isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                    Predicate skuLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("sku")), pattern);
                    predicates.add(criteriaBuilder.or(nameLike, skuLike));
                }

                // Filter by category
                if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("ALL")) {
                    String pattern = category.toLowerCase();
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), pattern));
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}

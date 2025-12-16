package com.retailerp.retailerp.repository.spec;


import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.SalesOrder;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class SalesOrderSpec {
    public static Specification<SalesOrder> getSpecification(String search) {
        return new Specification<SalesOrder>() {
            @Override
            public Predicate toPredicate(Root<SalesOrder> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                Predicate activePredicate = criteriaBuilder.conjunction(); //criteriaBuilder.isFalse(root.get("inactive"));

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

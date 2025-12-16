package com.retailerp.retailerp.repository.spec;


import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.User;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class UserSpec {
    public static Specification<User> getSpecification(String search) {
        return new Specification<User>() {
            @Override
            public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
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

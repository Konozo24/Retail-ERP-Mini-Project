package com.retailerp.retailerp.repository.spec;


import java.util.ArrayList;
import java.util.List;

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
                List<Predicate> predicates = new ArrayList<>();

                // Filter out inactive products
                predicates.add(criteriaBuilder.isFalse(root.get("inactive")));

                // Search by email
                if (search != null && !search.trim().isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate emailLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), pattern);
                    predicates.add(emailLike);
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}

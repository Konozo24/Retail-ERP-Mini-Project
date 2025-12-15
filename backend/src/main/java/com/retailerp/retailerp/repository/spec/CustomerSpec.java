package com.retailerp.retailerp.repository.spec;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.Customer;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class CustomerSpec {
    public static Specification<Customer> getSpecification(String search) {
        return new Specification<Customer>() {
            @Override
            public Predicate toPredicate(Root<Customer> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                if (search == null || search.isEmpty()) {
                    return criteriaBuilder.conjunction();
                }
                
                List<Predicate> list = new ArrayList<>();
                list.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")), 
                        "%" + search.toLowerCase() + "%"
                    )
                );

                return criteriaBuilder.or(list.toArray(new Predicate[0]));
            }
        };
    }
}

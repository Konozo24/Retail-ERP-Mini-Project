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
                list.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")), 
                        "%" + search.toLowerCase() + "%"
                    )
                );

                return criteriaBuilder.or(list.toArray(new Predicate[0]));
            }
        };
    }
}

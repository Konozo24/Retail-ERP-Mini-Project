package com.retailerp.retailerp.repository.spec;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.PurchaseOrder;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class PurchaseOrderSpec {
    public static Specification<PurchaseOrder> getSpecification(String search) {
        return new Specification<PurchaseOrder>() {
            @Override
            public Predicate toPredicate(Root<PurchaseOrder> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
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

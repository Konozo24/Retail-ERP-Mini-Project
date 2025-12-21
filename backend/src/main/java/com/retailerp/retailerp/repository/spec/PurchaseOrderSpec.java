package com.retailerp.retailerp.repository.spec;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class PurchaseOrderSpec {
    public static Specification<PurchaseOrder> getSpecification(String search) {
        return new Specification<PurchaseOrder>() {
            @Override
            public Predicate toPredicate(Root<PurchaseOrder> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                var supplierVar = root.join("supplier");
                
                // Filter out inactive products
                predicates.add(criteriaBuilder.isFalse(root.get("inactive")));

                // Search by name
                if (search != null && !search.trim().isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(supplierVar.get("name")), pattern);
                    predicates.add(nameLike);
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }

    public static Specification<PurchaseOrderItem> getItemsSpecification(Long purchaseOrderId, String search, String category) {
        return new Specification<PurchaseOrderItem>() {
            @Override
            public Predicate toPredicate(Root<PurchaseOrderItem> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();

                var productVar = root.join("product");
                var categoryVar = productVar.join("category");

                // Filter out inactive products
                // predicates.add(criteriaBuilder.isFalse(root.get("inactive")));

                // Search by id
                predicates.add(criteriaBuilder.equal(root.get("purchaseOrder").get("id"), purchaseOrderId));
         
                // Search by name
                if (search != null && !search.trim().isEmpty()) {
                    String pattern = "%" + search.toLowerCase() + "%";
                    Predicate nameLike = criteriaBuilder.like(criteriaBuilder.lower(productVar.get("name")), pattern);
                    predicates.add(nameLike);
                }

                // Filter by category
                if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("ALL")) {
                    String pattern = category.toLowerCase();
                    predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(categoryVar.get("name")), pattern));
                }

                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }
        };
    }
}

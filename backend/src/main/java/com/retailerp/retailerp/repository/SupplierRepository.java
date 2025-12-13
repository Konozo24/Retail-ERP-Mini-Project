package com.retailerp.retailerp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    // Find supplier name (useful for search)
    Supplier findByName(String name);
    
}
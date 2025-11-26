package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    // Find supplier name (useful for search)
    Supplier findByName(String name);
}
package com.retailerp.retailerp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find all products where Stock Quantity is LESS than Reorder Level     |
    @Query("SELECT p FROM Product p WHERE p.stockQty <= p.reorderLevel")
    List<Product> findLowStockProducts();

    // Search products by SKU (Exact match)                                  |
    Optional<Product> findBySku(String sku);

    // Search products by Name (Case Insensitive, partial match)             |
    List<Product> findByNameContainingIgnoreCase(String name);

}

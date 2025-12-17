package com.retailerp.retailerp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Find all distinct product categories
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL")
    List<String> findAllCategories();

    // Search products by SKU (Exact match)
    Optional<Product> findBySku(String sku);

    // Search products by Name (Case Insensitive, partial match)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Low stock: stockQty <= reorderLevel
    @Query("""
        SELECT p FROM Product p
        WHERE p.stockQty <= p.reorderLevel AND p.stockQty > 0
        AND p.inactive = false
        AND (:search IS NULL 
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))
      AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
    """)
    Page<Product> findLowStock(String search, String category, Pageable pageable);


    // Out of stock: stockQty == 0
    @Query("""
        SELECT p FROM Product p
        WHERE p.stockQty = 0
        AND p.inactive = false
        AND (:search IS NULL 
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
    """)
    Page<Product> findOutOfStock(String search, String category, Pageable pageable);


    // DASHBOARD
    @Query("""
        SELECT COUNT(p)
        FROM Product p
        WHERE p.stockQty <= p.reorderLevel
          AND p.inactive = false
    """)
    int countLowStockItems();
}

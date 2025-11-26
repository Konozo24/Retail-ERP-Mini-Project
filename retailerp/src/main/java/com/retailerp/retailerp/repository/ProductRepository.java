package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    //+-----------------------------------------------------------------------+
    //| Find all products where Stock Quantity is LESS than Reorder Level     |
    //| Used for the "Low Stock Report" in Admin Dashboard                    |
    //+-----------------------------------------------------------------------+
    @Query("SELECT p FROM Product p WHERE p.stockQty <= p.reorderLevel")
    List<Product> findLowStockProducts();

    //+-----------------------------------------------------------------------+
    //| Search products by SKU (Exact match)                                  |
    //+-----------------------------------------------------------------------+
    Optional<Product> findBySku(String sku);

    //+-----------------------------------------------------------------------+
    //| Search products by Name (Case Insensitive, partial match)             |
    //| Example: Searching "mouse" finds "Wireless Mouse"                     |
    //+-----------------------------------------------------------------------+
    List<Product> findByNameContainingIgnoreCase(String name);
}
package com.retailerp.retailerp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.retailerp.retailerp.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

	@Query("""
		    SELECT COUNT(p)
		    FROM Product p
		    WHERE p.stockQty <= p.reorderLevel
		      AND p.inactive = false
		""")
	Integer countLowStockItems();

}

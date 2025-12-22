package com.retailerp.retailerp.repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.retailerp.retailerp.dto.statistic.dashboard.MonthlyStatDTO;
import com.retailerp.retailerp.dto.statistic.dashboard.TopCategoryDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesProductDTO;
import com.retailerp.retailerp.model.SalesOrder;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long>, JpaSpecificationExecutor<SalesOrder> {

	// STATISTICS
	@Query("""
		    SELECT COUNT(DISTINCT so)
		    FROM SalesOrder so
		    JOIN so.items si
		    JOIN si.product p
		    WHERE so.createdAt BETWEEN :start AND :end
		    AND (:categoryId IS NULL OR p.category.id= :categoryId)
		""")
	Integer countOrdersBetween(
		Long categoryId,
		OffsetDateTime start,
		OffsetDateTime end);

	@Query("""
		    SELECT COALESCE(SUM(item.quantity), 0)
		    FROM SalesOrder so
		    JOIN so.items item
		    JOIN item.product p
		    WHERE so.createdAt BETWEEN :start AND :end
		    AND (:categoryId IS NULL OR p.category.id= :categoryId)
		""")
	Integer countItemsSoldBetween(
		Long categoryId,
		OffsetDateTime start,
		OffsetDateTime end);

	@Query("""
		    SELECT COALESCE(SUM(so.totalAmount), 0)
		    FROM SalesOrder so
		    JOIN so.items si
		    JOIN si.product p
		    WHERE so.createdAt BETWEEN :start AND :end
		    AND (:categoryId IS NULL OR p.category.id= :categoryId)
		""")
	BigDecimal getRevenueBetween(
		Long categoryId,
		OffsetDateTime start,
		OffsetDateTime end);

	@Query("""
		    SELECT new com.retailerp.retailerp.dto.statistic.dashboard.MonthlyStatDTO(
				MONTH(so.createdAt),
				CAST(COALESCE(SUM(so.totalAmount), 0) AS java.math.BigDecimal)
			)
		    FROM SalesOrder so
		    WHERE YEAR(so.createdAt) = :year
		    GROUP BY MONTH(so.createdAt)
			ORDER BY MONTH(so.createdAt)
		""")
	List<MonthlyStatDTO> getMonthlyRevenue(Integer year);

	@Query("""
		    SELECT new com.retailerp.retailerp.dto.statistic.dashboard.TopCategoryDTO(
		        soi.product.category.name,
		        soi.product.category.color,
				CAST(COALESCE(SUM(soi.quantity), 0) AS Integer)
		    )
		    FROM SalesOrderItem soi
		    JOIN soi.salesOrder so
		    WHERE FUNCTION('YEAR', so.createdAt) = :year
		    GROUP BY soi.product.category.name
		    ORDER BY COALESCE(SUM(soi.quantity), 0) DESC
		""")
	List<TopCategoryDTO> getTopCategories(Integer year);

	@Query("""
		    SELECT new com.retailerp.retailerp.dto.statistic.sales.SalesProductDTO(
		        p.id,
		        p.name,
		        p.sku,
		        p.category.name,
		        p.stockQty,
		        CAST(COALESCE(SUM(soi.quantity), 0) AS Integer),
		        CAST(COALESCE(SUM(soi.subtotal), 0) AS java.math.BigDecimal)
		    )
		    FROM SalesOrderItem soi
		    JOIN soi.salesOrder so
		    JOIN soi.product p
		    WHERE so.createdAt BETWEEN :start AND :end
		    AND (:categoryId IS NULL OR p.category.id= :categoryId)
		    GROUP BY so.id, p.id
		""")
	Page<SalesProductDTO> getProductSalesSummary(
		Long categoryId,
		OffsetDateTime start,
		OffsetDateTime end,
		Pageable pageable);

}

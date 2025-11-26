package com.retailerp.retailerp.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.math.BigDecimal;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "TB_PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "P_PRODUCT_ID")
    private Long productId;

    @Column(name = "P_SKU", nullable = false, unique = true, length = 50)
    private String sku;

    @Column(name = "P_NAME", nullable = false, length = 150)
    private String name;

    @Column(name = "P_CATEGORY", length = 100)
    private String category;

    @Column(name = "P_UNIT_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "P_COST_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "P_STOCK_QTY", nullable = false)
    private Integer stockQty;

    @Column(name = "P_REORDER_LEVEL", nullable = false)
    private Integer reorderLevel;

    // --- Audit Fields ---
    @Column(name = "P_CREATED_BY")
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "P_CREATED_AT", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "P_UPDATED_AT")
    private OffsetDateTime updatedAt;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public BigDecimal getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(BigDecimal unitPrice) {
		this.unitPrice = unitPrice;
	}

	public BigDecimal getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(BigDecimal costPrice) {
		this.costPrice = costPrice;
	}

	public Integer getStockQty() {
		return stockQty;
	}

	public void setStockQty(Integer stockQty) {
		this.stockQty = stockQty;
	}

	public Integer getReorderLevel() {
		return reorderLevel;
	}

	public void setReorderLevel(Integer reorderLevel) {
		this.reorderLevel = reorderLevel;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(OffsetDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@Override
	public String toString() {
		return "Product [" + (productId != null ? "productId=" + productId + ", " : "")
				+ (sku != null ? "sku=" + sku + ", " : "") + (name != null ? "name=" + name + ", " : "")
				+ (category != null ? "category=" + category + ", " : "")
				+ (unitPrice != null ? "unitPrice=" + unitPrice + ", " : "")
				+ (costPrice != null ? "costPrice=" + costPrice + ", " : "")
				+ (stockQty != null ? "stockQty=" + stockQty + ", " : "")
				+ (reorderLevel != null ? "reorderLevel=" + reorderLevel + ", " : "")
				+ (createdBy != null ? "createdBy=" + createdBy + ", " : "")
				+ (createdAt != null ? "createdAt=" + createdAt + ", " : "")
				+ (updatedAt != null ? "updatedAt=" + updatedAt : "") + "]";
	}
    
}
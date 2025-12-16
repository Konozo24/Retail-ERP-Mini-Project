package com.retailerp.retailerp.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
    name = "PRODUCTS",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "UK_PRODUCT_SKU",
            columnNames = "SKU"
        ),
        @UniqueConstraint(
            name = "UK_PRODUCT_NAME",
            columnNames = "NAME"
        )
    }
)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROD_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CREATED_BY", referencedColumnName = "USER_ID", nullable = false)
    private User createdBy;

    @Column(name = "SKU", nullable = false, length = 50)
    private String sku;

    @Column(name = "NAME", nullable = false, length = 150)
    private String name;

    @Column(name = "CATEGORY", length = 100, nullable = false)
    private String category;

    @Column(name = "UNIT_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "COST_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "STOCK_QTY", nullable = false)
    private Integer stockQty;

    @Column(name = "REORDER_LEVEL", nullable = false)
    private Integer reorderLevel;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UPDATED_AT")
    private OffsetDateTime updatedAt;
    
    @Column(name = "INACTIVE", nullable = false)
    private boolean inactive = false;
    
    // Require calling setCreatedBy(), Default stockQty = 0
    public Product(String sku, String name, String category, BigDecimal unitPrice, BigDecimal costPrice, Integer reorderLevel) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.costPrice = costPrice;
        this.stockQty = 0;
        this.reorderLevel = reorderLevel;
    }
}

package com.retailerp.retailerp.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "PURCHASE_ORDER_ITEM")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POI_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PO_ID", referencedColumnName = "PO_ID", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROD_ID", referencedColumnName = "PROD_ID", nullable = false)
    private Product product;

    @Column(name = "QUANTITY", nullable = false)
    private Integer quantity;

    @Column(name = "UNIT_COST", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(name = "SUBTOTAL", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;
    
    // Require calling setProduct(), default subtotal = unitCost * quantity
    public PurchaseOrderItem(Integer quantity, BigDecimal unitCost) {
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.subtotal = unitCost.multiply(BigDecimal.valueOf(quantity));
    }
}

package com.retailerp.retailerp.model;

import java.io.Serializable;
import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_SALES_ORDER_ITEM")
public class SalesOrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SOI_ID")
    private Long id;

    // Link to Parent Sales Order 
    @ManyToOne
    @JoinColumn(name = "SO_ID", referencedColumnName = "SO_ID", nullable = false)
    private SalesOrder salesOrder;

    // Link to Product
    @ManyToOne
    @JoinColumn(name = "P_PRODUCT_ID", referencedColumnName = "P_PRODUCT_ID", nullable = false)
    private Product product;

    @Column(name = "SOI_QUANTITY", nullable = false)
    private Integer quantity;

    // Changed to BigDecimal to match your Product.java precision
    @Column(name = "SOI_UNIT_PRICE", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "SOI_SUBTOTAL", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SalesOrder getSalesOrder() {
        return salesOrder;
    }

    public void setSalesOrder(SalesOrder salesOrder) {
        this.salesOrder = salesOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    @Override
    public String toString() {
        return "SalesOrderItem [id=" + id + ", salesOrder=" + salesOrder + ", product=" + product + ", quantity="
                + quantity + ", unitPrice=" + unitPrice + ", subtotal=" + subtotal + "]";
    }

    
    
}
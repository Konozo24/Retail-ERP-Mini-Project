package com.retailerp.retailerp.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_PURCHASE_ORDER_ITEM")
public class PurchaseOrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POI_ID") // Prefix POI_
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PO_ID", referencedColumnName = "PO_ID", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "P_ID", nullable = false)
    private Product product;

    @Column(name = "POI_QUANTITY")
    private Integer quantity;

    @Column(name = "POI_UNIT_COST")
    private Double unitCost;

    @Column(name = "POI_SUBTOTAL")
    private Double subtotal;

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
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

    public Double getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(Double unitCost) {
        this.unitCost = unitCost;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    @Override
    public String toString() {
        return "PurchaseOrderItem [id=" + id + ", purchaseOrder=" + purchaseOrder + ", product=" + product
                + ", quantity=" + quantity + ", unitCost=" + unitCost + ", subtotal=" + subtotal + "]";
    }

    
}

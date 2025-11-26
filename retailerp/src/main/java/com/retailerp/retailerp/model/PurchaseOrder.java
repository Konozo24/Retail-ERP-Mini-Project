package com.retailerp.retailerp.model;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_PURCHASE_ORDER")
public class PurchaseOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PO_ID") // Prefix PO_
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SUP_ID", referencedColumnName = "SUP_ID")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "U_ID", referencedColumnName = "U_ID")
    private User user;

    @Column(name = "PO_STATUS")
    private String status;

    @Column(name = "PO_CREATED_AT")
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL)
    private List<PurchaseOrderItem> items;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<PurchaseOrderItem> getItems() {
        return items;
    }

    public void setItems(List<PurchaseOrderItem> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "PurchaseOrder [id=" + id + ", supplier=" + supplier + ", user=" + user + ", status=" + status
                + ", createdAt=" + createdAt + ", items=" + items + "]";
    }

    
    
}
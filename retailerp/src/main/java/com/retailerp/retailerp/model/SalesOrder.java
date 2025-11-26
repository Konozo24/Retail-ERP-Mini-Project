package com.retailerp.retailerp.model;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_SALES_ORDER")
public class SalesOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SO_ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "U_ID", referencedColumnName = "U_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "C_CUSTOMER_ID", referencedColumnName = "C_CUSTOMER_ID")
    private Customer customer;

    @Column(name = "SO_TOTAL_AMOUNT")
    private Double totalAmount;

    @Column(name = "SO_PAYMENT_METHOD")
    private String paymentMethod;

    @Column(name = "SO_CREATED_AT")
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL)
    private List<SalesOrderItem> items;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<SalesOrderItem> getItems() {
        return items;
    }

    public void setItems(List<SalesOrderItem> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "SalesOrder [id=" + id + ", user=" + user + ", customer=" + customer + ", totalAmount=" + totalAmount
                + ", paymentMethod=" + paymentMethod + ", createdAt=" + createdAt + ", items=" + items + "]";
    }

    
}
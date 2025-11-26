package com.retailerp.retailerp.model;


import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "TB_CUSTOMER")
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_CUSTOMER_ID")
    private Long customerId;

    @Column(name = "C_NAME", nullable = false, length = 150)
    private String name;

    @Column(name = "C_PHONE", length = 30)
    private String phone;

    @Column(name = "C_EMAIL", length = 150)
    private String email;

    @Column(name = "C_CREATED_AT", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
	public String toString() {
		return "Customer [" + (customerId != null ? "customerId=" + customerId + ", " : "")
				+ (name != null ? "name=" + name + ", " : "") + (phone != null ? "phone=" + phone + ", " : "")
				+ (email != null ? "email=" + email + ", " : "") + (createdAt != null ? "createdAt=" + createdAt : "")
				+ "]";
	}


}

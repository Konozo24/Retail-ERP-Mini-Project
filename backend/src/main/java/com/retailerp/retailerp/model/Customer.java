package com.retailerp.retailerp.model;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
    name = "CUSTOMERS",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "UK_CUSTOMER_PHONE",
            columnNames = "PHONE"
        ),
        @UniqueConstraint(
            name = "UK_CUSTOMER_EMAIL",
            columnNames = "EMAIL"
        )
    }
)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CUST_ID")
    private Long id;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "PHONE", nullable = false, length = 20)
    private String phone;

    @Column(name = "EMAIL", nullable = false)
    private String email;

    @CreationTimestamp
    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    
    @Column(name = "INACTIVE", nullable = false)
    private boolean inactive = false;
    
    public Customer(String name, String phone, String email) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}

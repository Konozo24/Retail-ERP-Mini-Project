package com.retailerp.retailerp.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "SUPPLIERS")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Supplier{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPP_ID") 
    private Long id;

    @Column(name = "NAME", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "PHONE", nullable = false, unique = true, length = 20)
    private String phone;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "ADDRESS", nullable = false, unique = true, length = 60)
    private String address;
    
    @Column(name = "INACTIVE", nullable = false)
    private boolean inactive = false;

    public Supplier(String name, String phone, String email, String address) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }
}

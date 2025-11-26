package com.retailerp.retailerp.model;

import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name = "TB_SUPPLIER")
public class Supplier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUP_ID") 
    private Long id;

    @Column(name = "SUP_NAME", nullable = false)
    private String name;

    @Column(name = "SUP_PHONE")
    private String phone;

    @Column(name = "SUP_EMAIL")
    private String email;

    @Column(name = "SUP_ADDRESS")
    private String address;

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Supplier [" 
                + (id != null ? "id=" + id + ", " : "")
                + (name != null ? "name=" + name + ", " : "")
                + (phone != null ? "phone=" + phone + ", " : "")
                + (email != null ? "email=" + email + ", " : "")
                + (address != null ? "address=" + address : "")
                + "]";
    }
    
}

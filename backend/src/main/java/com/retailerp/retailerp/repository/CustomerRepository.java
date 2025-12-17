package com.retailerp.retailerp.repository;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    // Find by phone number (useful for identifying customers at POS)
    Optional<Customer> findByPhone(String phone);

    // Find by email
    Optional<Customer> findByEmail(String email);

    // DASHBOARD
    @Query("""
        SELECT COUNT(c)
        FROM Customer c
        WHERE c.createdAt BETWEEN :start AND :end
    """)
    long countCustomersBetween(
        OffsetDateTime start,
        OffsetDateTime end
    );
}
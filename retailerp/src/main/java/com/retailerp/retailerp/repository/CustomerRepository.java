package com.retailerp.retailerp.repository;

import com.retailerp.retailerp.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find by phone number (useful for identifying customers at POS)
    Optional<Customer> findByPhone(String phone);

    // Find by email
    Optional<Customer> findByEmail(String email);
}
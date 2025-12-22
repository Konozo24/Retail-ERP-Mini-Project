package com.retailerp.retailerp.repository;

import java.time.OffsetDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.retailerp.retailerp.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

	@Query("""
		    SELECT COUNT(c)
		    FROM Customer c
		    WHERE c.createdAt BETWEEN :start AND :end
		""")
	Long countCustomersBetween(
		OffsetDateTime start,
		OffsetDateTime end);

}

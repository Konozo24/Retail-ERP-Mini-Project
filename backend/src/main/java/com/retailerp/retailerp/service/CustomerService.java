package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.customer.CustomerDTO;
import com.retailerp.retailerp.dto.customer.CustomerRequestDTO;
import com.retailerp.retailerp.model.Customer;
import com.retailerp.retailerp.repository.CustomerRepository;
import com.retailerp.retailerp.repository.spec.CustomerSpec;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

	private final CustomerRepository customerRepository;

	@Transactional(readOnly = true)
	public Page<CustomerDTO> getCustomersPage(String search, Pageable pageable)
	{
		Specification<Customer> spec = CustomerSpec.getSpec(search);
		return customerRepository.findAll(spec, pageable)
			.map(CustomerDTO::fromEntity);
	}

	@Transactional
	public CustomerDTO createCustomer(CustomerRequestDTO request)
	{
		Customer newCustomer = customerRepository.save(
			new Customer(request.getName(), request.getPhone(), request.getEmail()));
		return CustomerDTO.fromEntity(newCustomer);
	}

	@Transactional
	public void updateCustomer(Long customerId, CustomerRequestDTO request)
	{
		Customer existing = getCustomerEntitiy(customerId);

		if (existing.isInactive()) {
			throw new IllegalStateException("Inactive customer cannot be updated.");
		}

		existing.setName(request.getName());
		existing.setPhone(request.getPhone());
		existing.setEmail(request.getEmail());
		customerRepository.save(existing);
	}

	@Transactional
	public void removeCustomer(Long customerId)
	{
		Customer existing = getCustomerEntitiy(customerId);
		if (!existing.isInactive()) {
			existing.setInactive(true);
			customerRepository.save(existing);
		}
	}

	public Customer getCustomerEntitiy(Long customerId)
	{
		return customerRepository.findById(customerId).orElseThrow(
			() -> new NoSuchElementException("Customer with id, " + customerId + " doesn't exist!"));
	}

}

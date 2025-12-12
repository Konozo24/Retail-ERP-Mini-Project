package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.customer.CustomerDTO;
import com.retailerp.retailerp.dto.customer.CustomerRequestDTO;
import com.retailerp.retailerp.model.Customer;
import com.retailerp.retailerp.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CustomerService {
    
    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public Page<CustomerDTO> getCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
            .map(CustomerDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
            () -> new NoSuchElementException(customerId + ". deosnt exist!")
        );
        return CustomerDTO.fromEntity(customer);
    }

    public CustomerDTO createCustomer(CustomerRequestDTO request) {
        Customer newCustomer = customerRepository.save(
            new Customer(request.getName(), request.getPhone(), request.getEmail())
        );
        return CustomerDTO.fromEntity(newCustomer);
    }

    @Transactional
    public void updateCustomer(Long customerId, CustomerRequestDTO request) {
        Customer existing = customerRepository.findById(customerId).orElseThrow(
            () -> new NoSuchElementException(customerId + ". deosnt exist!")
        );

        existing.setName(request.getName());
        existing.setPhone(request.getPhone());
        existing.setEmail(request.getEmail());
        customerRepository.save(existing);
    }

    @Transactional
    public void removeCustomer(Long customerId) {
        customerRepository.findById(customerId).orElseThrow(
            () -> new NoSuchElementException(customerId + ". deosnt exist!")
        );
        customerRepository.deleteById(customerId);
    }
}

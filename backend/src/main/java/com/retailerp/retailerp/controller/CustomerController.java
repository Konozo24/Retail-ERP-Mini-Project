package com.retailerp.retailerp.controller;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.customer.CustomerDTO;
import com.retailerp.retailerp.dto.customer.CustomerRequestDTO;
import com.retailerp.retailerp.service.CustomerService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {
    
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<Page<CustomerDTO>> getCustomers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CustomerDTO> dtoPage = customerService.getCustomers(pageable);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerDTO> getCustomer(
        @PathVariable Long customerId
    ) {
        CustomerDTO dto = customerService.getCustomer(customerId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(
        @Valid @RequestBody CustomerRequestDTO request
    ) {
        CustomerDTO dto = customerService.createCustomer(request);
        URI location = URI.create("/customers/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<Void> updateCustomer(
        @PathVariable Long customerId,
        @Valid @RequestBody CustomerRequestDTO request
    ) {
        customerService.updateCustomer(customerId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> removeCustomer(
        @PathVariable Long customerId
    ) {
        customerService.removeCustomer(customerId);
        return ResponseEntity.noContent().build();
    }
}

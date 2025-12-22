package com.retailerp.retailerp.controller;

import java.net.URI;
import org.springdoc.core.converters.models.PageableAsQueryParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

	private final CustomerService customerService;

	@GetMapping
	@PageableAsQueryParam
	public ResponseEntity<Page<CustomerDTO>> getCustomersPage(
		@RequestParam(defaultValue = "") String search,
		@Parameter(hidden = true) Pageable pageable)
	{
		Page<CustomerDTO> dtoPage = customerService.getCustomersPage(search, pageable);
		return ResponseEntity.ok(dtoPage);
	}

	@PostMapping
	public ResponseEntity<CustomerDTO> createCustomer(
		@Valid @RequestBody CustomerRequestDTO request)
	{
		CustomerDTO dto = customerService.createCustomer(request);
		URI location = URI.create("/customers/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	@PutMapping("/{customerId}")
	public ResponseEntity<String> updateCustomer(
		@PathVariable Long customerId,
		@Valid @RequestBody CustomerRequestDTO request)
	{
		customerService.updateCustomer(customerId, request);
		return ResponseEntity.ok("Update was succesful");
	}

	@DeleteMapping("/{customerId}")
	public ResponseEntity<String> removeCustomer(
		@PathVariable Long customerId)
	{
		customerService.removeCustomer(customerId);
		return ResponseEntity.ok("Delete was succesful");
	}

}

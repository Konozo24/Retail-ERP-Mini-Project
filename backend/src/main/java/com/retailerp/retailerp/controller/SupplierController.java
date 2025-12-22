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
import com.retailerp.retailerp.dto.supplier.SupplierDTO;
import com.retailerp.retailerp.dto.supplier.SupplierRequestDTO;
import com.retailerp.retailerp.service.SupplierService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {

	private final SupplierService supplierService;

	@GetMapping
	@PageableAsQueryParam
	public ResponseEntity<Page<SupplierDTO>> getSuppliersPage(
		@RequestParam(defaultValue = "") String search,
		@Parameter(hidden = true) Pageable pageable)
	{
		Page<SupplierDTO> dtoPage = supplierService.getSuppliersPage(search, pageable);
		return ResponseEntity.ok(dtoPage);
	}

	@PostMapping
	public ResponseEntity<SupplierDTO> createSupplier(
		@Valid @RequestBody SupplierRequestDTO request)
	{
		SupplierDTO dto = supplierService.createSupplier(request);
		URI location = URI.create("/suppliers/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	@PutMapping("/{supplierId}")
	public ResponseEntity<String> updateSupplier(
		@PathVariable Long supplierId,
		@Valid @RequestBody SupplierRequestDTO request)
	{
		supplierService.updateSupplier(supplierId, request);
		return ResponseEntity.ok("Update was succesful");
	}

	@DeleteMapping("/{supplierId}")
	public ResponseEntity<String> removeSupplier(
		@PathVariable Long supplierId)
	{
		supplierService.removeSupplier(supplierId);
		return ResponseEntity.ok("Delete was succesful");
	}

}

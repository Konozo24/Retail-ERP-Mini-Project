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

import com.retailerp.retailerp.dto.PageDTO;
import com.retailerp.retailerp.dto.supplier.SupplierDTO;
import com.retailerp.retailerp.dto.supplier.SupplierRequestDTO;
import com.retailerp.retailerp.service.SupplierService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
public class SupplierController {

	private final SupplierService supplierService;

	@GetMapping
	public ResponseEntity<PageDTO<SupplierDTO>> getSuppliers(
			@RequestParam(defaultValue = "") String search,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<SupplierDTO> dtoPage = supplierService.getSuppliers(search, pageable);
		return ResponseEntity.ok(PageDTO.fromEntity(dtoPage));
	}

	@GetMapping("/{supplierId}")
	public ResponseEntity<SupplierDTO> getSupplier(
			@PathVariable Long supplierId) {
		SupplierDTO dto = supplierService.getSupplier(supplierId);
		return ResponseEntity.ok(dto);
	}

	@PostMapping
	public ResponseEntity<SupplierDTO> createSupplier(
			@Valid @RequestBody SupplierRequestDTO request) {
		SupplierDTO dto = supplierService.createSupplier(request);
		URI location = URI.create("/suppliers/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	@PutMapping("/{supplierId}")
	public ResponseEntity<String> updateSupplier(
			@PathVariable Long supplierId,
			@Valid @RequestBody SupplierRequestDTO request) {
		supplierService.updateSupplier(supplierId, request);
		return ResponseEntity.ok("Update was succesful");
	}

	@DeleteMapping("/{supplierId}")
	public ResponseEntity<String> removeSupplier(
			@PathVariable Long supplierId) {
		supplierService.removeSupplier(supplierId);
		return ResponseEntity.ok("Delete was succesful");
	}
}

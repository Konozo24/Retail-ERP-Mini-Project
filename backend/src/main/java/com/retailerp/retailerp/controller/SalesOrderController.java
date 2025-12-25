package com.retailerp.retailerp.controller;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.PageDTO;
import com.retailerp.retailerp.dto.sales.SalesOrderCreationDTO;
import com.retailerp.retailerp.dto.sales.SalesOrderDTO;
import com.retailerp.retailerp.service.SalesOrderService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/api/sales-order")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
public class SalesOrderController {

	private final SalesOrderService salesOrderService;

	@GetMapping
	public ResponseEntity<PageDTO<SalesOrderDTO>> getSalesOrders(
			@RequestParam(defaultValue = "") String search,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate) {
		Pageable pageable = PageRequest.of(page, size);
		Page<SalesOrderDTO> dtoPage = salesOrderService.getSalesOrders(search, pageable, startDate, endDate);
		return ResponseEntity.ok(PageDTO.fromEntity(dtoPage));
	}

	@GetMapping("/{salesOrderId}")
	public ResponseEntity<SalesOrderDTO> getSalesOrder(
			@PathVariable Long salesOrderId) {
		SalesOrderDTO dto = salesOrderService.getSalesOrder(salesOrderId);
		return ResponseEntity.ok(dto);
	}

	@PostMapping
	public ResponseEntity<SalesOrderDTO> createSalesOrder(
			@Valid @RequestBody SalesOrderCreationDTO request) {
		SalesOrderDTO dto = salesOrderService.createSalesOrder(request);
		URI location = URI.create("/salesOrder/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	// @DeleteMapping("/{salesOrderId}")
	// public ResponseEntity<String> removeSalesOrder(
	// @PathVariable Long salesOrderId
	// ) {
	// salesOrderService.removeSalesOrder(salesOrderId);
	// return ResponseEntity.ok().build("Delete was succesful");
	// }
}

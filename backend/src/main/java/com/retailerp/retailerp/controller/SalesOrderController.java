package com.retailerp.retailerp.controller;

import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.retailerp.retailerp.dto.sales.SalesOrderCreationDTO;
import com.retailerp.retailerp.dto.sales.SalesOrderDTO;
import com.retailerp.retailerp.service.SalesOrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAnyAuthority('ADMIN', 'CASHIER')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/sales-order")
@RequiredArgsConstructor
public class SalesOrderController {

	private final SalesOrderService salesOrderService;

	@PostMapping
	public ResponseEntity<SalesOrderDTO> createSalesOrder(
		@Valid @RequestBody SalesOrderCreationDTO request)
	{
		SalesOrderDTO dto = salesOrderService.createSalesOrder(request);
		URI location = URI.create("/salesOrder/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

}

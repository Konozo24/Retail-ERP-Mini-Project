package com.retailerp.retailerp.controller;

import java.net.URI;
import org.springdoc.core.converters.models.PageableAsQueryParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderCreationDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderItemDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderUpdateDTO;
import com.retailerp.retailerp.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/purchase-order")
@RequiredArgsConstructor
public class PurchaseOrderController {

	private final PurchaseOrderService purchaseOrderService;

	@GetMapping
	@PageableAsQueryParam
	public ResponseEntity<Page<PurchaseOrderDTO>> getPurchaseOrdersPage(
		@RequestParam(defaultValue = "") String search,
		@Parameter(hidden = true) Pageable pageable)
	{
		Page<PurchaseOrderDTO> dtoPage = purchaseOrderService.getPurchaseOrdersPage(search, pageable);
		return ResponseEntity.ok(dtoPage);
	}

	@GetMapping("/{purchaseOrderId}/items-page")
	@PageableAsQueryParam
	public ResponseEntity<Page<PurchaseOrderItemDTO>> getPurchaseOrderItemsPage(
		@PathVariable Long purchaseOrderId,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(required = false) Long categoryId,
		@Parameter(hidden = true) Pageable pageable)
	{
		Page<PurchaseOrderItemDTO> dto = purchaseOrderService.getPurchaseOrderItemPage(purchaseOrderId, search, categoryId, pageable);
		return ResponseEntity.ok(dto);
	}

	@PostMapping
	public ResponseEntity<PurchaseOrderDTO> createPurchaseOrder(
		@Valid @RequestBody PurchaseOrderCreationDTO request)
	{
		PurchaseOrderDTO dto = purchaseOrderService.createPurchaseOrder(request);
		URI location = URI.create("/purchaseOrder/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	@PutMapping("/{purchaseOrderId}")
	public ResponseEntity<String> updatePurchaseOrder(
		@PathVariable Long purchaseOrderId,
		@Valid @RequestBody PurchaseOrderUpdateDTO request)
	{
		purchaseOrderService.updatePurchaseOrder(purchaseOrderId, request);
		return ResponseEntity.ok("Update was succesful");
	}

}

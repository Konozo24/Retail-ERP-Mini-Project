package com.retailerp.retailerp.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.purchases.PurchaseOrderDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderUpdateDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderCreationDTO;
import com.retailerp.retailerp.service.PurchaseOrderService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/purchase-order")
@RequiredArgsConstructor
public class PurchaseOrderController {
    
    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrder() {
        List<PurchaseOrderDTO> dtoList = purchaseOrderService.getPurchaseOrders();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{purchaseOrderId}")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrder(
        @PathVariable Long purchaseOrderId
    ) {
        PurchaseOrderDTO dto = purchaseOrderService.getPurchaseOrder(purchaseOrderId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderDTO> createPurchaseOrder(
        @Valid @RequestBody PurchaseOrderCreationDTO request
    ) {
        PurchaseOrderDTO dto = purchaseOrderService.createPurchaseOrder(request);
        URI location = URI.create("/purchaseOrder/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @PutMapping("/{purchaseOrderId}")
    public ResponseEntity<Void> updatePurchaseOrder(
        @PathVariable Long purchaseOrderId,
        @Valid @RequestBody PurchaseOrderUpdateDTO request
    ) {
        purchaseOrderService.updatePurchaseOrder(purchaseOrderId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{purchaseOrderId}")
    public ResponseEntity<Void> removePurchaseOrder(
        @PathVariable Long purchaseOrderId
    ) {
        purchaseOrderService.removePurchaseOrder(purchaseOrderId);
        return ResponseEntity.noContent().build();
    }
}

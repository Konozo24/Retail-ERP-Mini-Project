package com.retailerp.retailerp.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.sales.SalesOrderCreationDTO;
import com.retailerp.retailerp.dto.sales.SalesOrderDTO;
import com.retailerp.retailerp.service.SalesOrderService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/sales-order")
@RequiredArgsConstructor
public class SalesOrderController {
    
    private final SalesOrderService salesOrderService;

    @GetMapping
    public ResponseEntity<List<SalesOrderDTO>> getSalesOrder() {
        List<SalesOrderDTO> dtoList = salesOrderService.getSalesOrders();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{salesOrderId}")
    public ResponseEntity<SalesOrderDTO> getSalesOrder(
        @PathVariable Long salesOrderId
    ) {
        SalesOrderDTO dto = salesOrderService.getSalesOrder(salesOrderId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<SalesOrderDTO> createSalesOrder(
        @Valid @RequestBody SalesOrderCreationDTO request
    ) {
        SalesOrderDTO dto = salesOrderService.createSalesOrder(request);
        URI location = URI.create("/salesOrder/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @DeleteMapping("/{salesOrderId}")
    public ResponseEntity<Void> removeSalesOrder(
        @PathVariable Long salesOrderId
    ) {
        salesOrderService.removeSalesOrder(salesOrderId);
        return ResponseEntity.noContent().build();
    }
}

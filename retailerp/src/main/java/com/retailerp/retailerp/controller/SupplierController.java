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

import com.retailerp.retailerp.dto.supplier.SupplierDTO;
import com.retailerp.retailerp.dto.supplier.SupplierRequestDTO;
import com.retailerp.retailerp.service.SupplierService;

import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    
    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<SupplierDTO>> getSuppliers() {
        List<SupplierDTO> dtoList = supplierService.getSuppliers();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{supplierId}")
    public ResponseEntity<SupplierDTO> getSupplier(
        @PathVariable Long supplierId
    ) {
        SupplierDTO dto = supplierService.getSupplier(supplierId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<SupplierDTO> createSupplier(
        @Valid @RequestBody SupplierRequestDTO request
    ) {
        SupplierDTO dto = supplierService.createSupplier(request);
        URI location = URI.create("/suppliers/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @PutMapping("/{supplierId}")
    public ResponseEntity<Void> updateSupplier(
        @PathVariable Long supplierId,
        @Valid @RequestBody SupplierRequestDTO request
    ) {
        supplierService.updateSupplier(supplierId, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{supplierId}")
    public ResponseEntity<Void> removeSupplier(
        @PathVariable Long supplierId
    ) {
        supplierService.removeSupplier(supplierId);
        return ResponseEntity.noContent().build();
    }
}

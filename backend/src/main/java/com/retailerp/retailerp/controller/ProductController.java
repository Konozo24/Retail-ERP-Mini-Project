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

import com.retailerp.retailerp.dto.product.ProductCreationDTO;
import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.dto.product.ProductUpdateDTO;
import com.retailerp.retailerp.service.ProductService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
        @RequestParam(defaultValue = "") String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> dtoPage = productService.getProducts(search, pageable);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProduct(
        @PathVariable Long productId
    ) {
        ProductDTO dto = productService.getProduct(productId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
        @Valid @RequestBody ProductCreationDTO request
    ) {
        ProductDTO dto = productService.createProduct(request);
        URI location = URI.create("/products/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<String> updateProduct(
        @PathVariable Long productId,
        @Valid @RequestBody ProductUpdateDTO request
    ) {
        productService.updateProduct(productId, request);
        return ResponseEntity.ok("Update was succesful");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeProduct(
        @PathVariable Long productId
    ) {
        productService.removeProduct(productId);
        return ResponseEntity.ok("Delete was succesful");
    }
}

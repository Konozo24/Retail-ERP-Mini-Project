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
import com.retailerp.retailerp.dto.product.ProductCreationDTO;
import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.dto.product.ProductUpdateDTO;
import com.retailerp.retailerp.service.ProductService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	@GetMapping
	@PageableAsQueryParam
	public ResponseEntity<Page<ProductDTO>> getProductsPage(
		@RequestParam(defaultValue = "") String search,
		@RequestParam(required = false) Long categoryId,
		@Parameter(hidden = true) Pageable pageable)
	{
		Page<ProductDTO> dtoPage = productService.getProductsPage(search, categoryId, pageable);
		return ResponseEntity.ok(dtoPage);
	}

	// Get all low stock products
	@GetMapping("/low-stock")
	public ResponseEntity<Page<ProductDTO>> getLowStockProducts(
		@RequestParam(defaultValue = "") String search,
		@RequestParam(required = false) Long categoryId,
		Pageable pageable)
	{
		Page<ProductDTO> dtoPage = productService.getLowStockProducts(search, categoryId, pageable);
		return ResponseEntity.ok(dtoPage);
	}

	// Get all out of stock products
	@GetMapping("/out-of-stock")
	public ResponseEntity<Page<ProductDTO>> getOutOfStockProducts(
		@RequestParam(defaultValue = "") String search,
		@RequestParam(required = false) Long categoryId,
		Pageable pageable)
	{
		Page<ProductDTO> dtoPage = productService.getOutOfStockProducts(search, categoryId, pageable);
		return ResponseEntity.ok(dtoPage);
	}

	@GetMapping("/generate-sku")
	public ResponseEntity<String> getNewSKUById(
		@RequestParam(required = false) Long categoryId)
	{
		return ResponseEntity.ok(productService.generateSKUById(categoryId));
	}

	@PostMapping
	public ResponseEntity<ProductDTO> createProduct(
		@Valid @RequestBody ProductCreationDTO request)
	{
		ProductDTO dto = productService.createProduct(request);
		URI location = URI.create("/products/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	@PutMapping("/{productId}")
	public ResponseEntity<String> updateProduct(
		@PathVariable Long productId,
		@Valid @RequestBody ProductUpdateDTO request)
	{
		productService.updateProduct(productId, request);
		return ResponseEntity.ok("Update was succesful");
	}

	@DeleteMapping("/{productId}")
	public ResponseEntity<String> removeProduct(
		@PathVariable Long productId)
	{
		productService.removeProduct(productId);
		return ResponseEntity.ok("Delete was succesful");
	}

}

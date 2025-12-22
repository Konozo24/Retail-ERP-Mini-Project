package com.retailerp.retailerp.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.category.CategoryDTO;
import com.retailerp.retailerp.dto.category.CategoriesNameDTO;
import com.retailerp.retailerp.dto.category.CategoryRequestDTO;
import com.retailerp.retailerp.service.CategoryService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
public class CategoryController {

	private final CategoryService categoryService;

	@GetMapping
	@PreAuthorize("hasAnyAuthority('ADMIN','CASHIER')")
	public ResponseEntity<List<CategoryDTO>> getCategories() {
		List<CategoryDTO> dtoPage = categoryService.getCategories();
		return ResponseEntity.ok(dtoPage);
	}

	@GetMapping("/name-list")
	@PreAuthorize("hasAnyAuthority('ADMIN','CASHIER')")
	public ResponseEntity<CategoriesNameDTO> getCategoriesName() {
		CategoriesNameDTO dto = categoryService.getCategoriesName();
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/{categoryId}")
	@PreAuthorize("hasAnyAuthority('ADMIN','CASHIER')")
	public ResponseEntity<CategoryDTO> getCategory(
			@PathVariable Long categoryId) {
		CategoryDTO dto = categoryService.getCategory(categoryId);
		return ResponseEntity.ok(dto);
	}

	@PostMapping
	public ResponseEntity<CategoryDTO> createCategory(
			@Valid @RequestBody CategoryRequestDTO request) {
		CategoryDTO dto = categoryService.createCategory(request);
		URI location = URI.create("/categories/" + dto.getId());
		return ResponseEntity.created(location).body(dto);
	}

	@PutMapping("/{categoryId}")
	public ResponseEntity<String> updateCategory(
			@PathVariable Long categoryId,
			@Valid @RequestBody CategoryRequestDTO request) {
		categoryService.updateCategory(categoryId, request);
		return ResponseEntity.ok("Update was succesful");
	}

	@DeleteMapping("/{categoryId}")
	public ResponseEntity<String> removeCategory(
			@PathVariable Long categoryId) {
		categoryService.removeCategory(categoryId);
		return ResponseEntity.ok("Delete was succesful");
	}
}

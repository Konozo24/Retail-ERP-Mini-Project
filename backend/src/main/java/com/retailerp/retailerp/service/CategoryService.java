package com.retailerp.retailerp.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.category.CategoriesNameDTO;
import com.retailerp.retailerp.dto.category.CategoryDTO;
import com.retailerp.retailerp.dto.category.CategoryRequestDTO;
import com.retailerp.retailerp.model.Category;
import com.retailerp.retailerp.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public List<CategoryDTO> getCategories() {
		return categoryRepository.findAll()
				.stream()
				.filter(category -> !category.isInactive())
				.map(CategoryDTO::fromEntity)
				.toList();
	}

	@Transactional(readOnly = true)
	public CategoriesNameDTO getCategoriesName() {
		List<Category> activeCategories = categoryRepository.findAll()
				.stream()
				.filter(category -> !category.isInactive())
				.toList();
		return CategoriesNameDTO.fromEntity(activeCategories);
	}

	@Transactional(readOnly = true)
	public CategoryDTO getCategory(Long categoryId) {
		Category category = categoryRepository.findById(categoryId).orElseThrow(
				() -> new NoSuchElementException("Category with id, " + categoryId + " doesn't exist!"));
		return CategoryDTO.fromEntity(category);
	}

	@Transactional
	public CategoryDTO createCategory(CategoryRequestDTO request) {
		Category category = new Category(request.getName(), request.getPrefix());
		if (request.getColor() != null)
			category.setColor(request.getColor());
		if (request.getImage() != null)
			category.setImage(request.getImage());
		return CategoryDTO.fromEntity(categoryRepository.save(category));
	}

	@Transactional
	public void updateCategory(Long categoryId, CategoryRequestDTO request) {
		Category existing = categoryRepository.findById(categoryId).orElseThrow(
				() -> new NoSuchElementException("Category with id, " + categoryId + " doesn't exist!"));

		existing.setName(request.getName());
		existing.setPrefix(request.getPrefix().toUpperCase());
		existing.setColor(request.getColor() != null ? request.getColor() : existing.getColor());
		existing.setImage(request.getImage() != null ? request.getImage() : existing.getImage());
		categoryRepository.save(existing);
	}

	@Transactional
	public void removeCategory(Long categoryId) {
		Category existing = categoryRepository.findById(categoryId).orElseThrow(
				() -> new NoSuchElementException("Category with id, " + categoryId + " doesn't exist!"));

		if (!existing.isInactive()) {
			existing.setInactive(true);
			categoryRepository.save(existing);
		}
	}

}

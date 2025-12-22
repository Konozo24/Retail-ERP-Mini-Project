package com.retailerp.retailerp.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	public List<CategoryDTO> getCategories()
	{
		return categoryRepository.findAll()
			.stream()
			.map(CategoryDTO::fromEntity)
			.toList();
	}

	@Transactional
	public CategoryDTO createCategory(CategoryRequestDTO request)
	{
		Category category = new Category(
			request.getName(),
			request.getPrefix(),
			request.getImage());
		return CategoryDTO.fromEntity(categoryRepository.save(category));
	}

	@Transactional
	public void updateCategory(Long categoryId, CategoryRequestDTO request)
	{
		Category existing = getCategoryEntitiy(categoryId);

		if (existing.isInactive()) {
			throw new IllegalStateException("Inactive category cannot be updated.");
		}

		existing.setName(request.getName());
		existing.setPrefix(request.getPrefix().toUpperCase());
		if (request.getImage() != null && !request.getImage().trim().isEmpty()) {
			existing.setImage(request.getImage());
		}

		categoryRepository.save(existing);
	}

	@Transactional
	public void removeCategory(Long categoryId)
	{
		Category existing = getCategoryEntitiy(categoryId);

		if (!existing.isInactive()) {
			existing.setInactive(true);
			categoryRepository.save(existing);
		}
	}

	public Category getCategoryEntitiy(Long categoryId)
	{
		return categoryRepository.findById(categoryId).orElseThrow(
			() -> new NoSuchElementException("Category with id, " + categoryId + " doesn't exist!"));
	}

}

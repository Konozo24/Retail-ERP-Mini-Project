package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;
import java.util.Random;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.retailerp.retailerp.auth.JwtUtil;
import com.retailerp.retailerp.dto.product.ProductCreationDTO;
import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.dto.product.ProductUpdateDTO;
import com.retailerp.retailerp.model.Category;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.spec.ProductSpec;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;

	private final CategoryService categoryService;

	private final JwtUtil jwtUtil;

	@Transactional(readOnly = true)
	public Page<ProductDTO> getProductsPage(
		String search,
		Long categoryId,
		Pageable pageable)
	{
		Specification<Product> spec = ProductSpec.getSpec(search, categoryId);
		return productRepository.findAll(spec, pageable)
			.map(ProductDTO::fromEntity);
	}

	@Transactional(readOnly = true)
	public Page<ProductDTO> getLowStockProducts(String search, Long categoryId, Pageable pageable)
	{
		Specification<Product> lowStockSpec = ProductSpec.getLowStockSpec(search, categoryId);
		return productRepository.findAll(lowStockSpec, pageable)
			.map(ProductDTO::fromEntity);
	}

	@Transactional(readOnly = true)
	public Page<ProductDTO> getOutOfStockProducts(String search, Long categoryId, Pageable pageable)
	{
		Specification<Product> outOfStockSpec = ProductSpec.getOutOfStockSpec(search, categoryId);
		return productRepository.findAll(outOfStockSpec, pageable)
			.map(ProductDTO::fromEntity);
	}

	@Transactional(readOnly = true)
	public String generateSKUById(Long categoryId)
	{
		String categoryPrefix = "PROD";
		if (categoryId != null) {
			try {
				categoryPrefix = categoryService.getCategoryEntitiy(categoryId).getPrefix();
			} catch (Exception e) {
			}
		}

		Integer randomNum = 1000 + new Random().nextInt(9000); // 4-digit number
		String randomSuffix = Long.toString(Math.abs(new Random().nextLong()), 36).substring(0, 3).toUpperCase(); // 3 chars
		return String.format("%s%d-%s", categoryPrefix, randomNum, randomSuffix);
	}

	@Transactional
	public ProductDTO createProduct(ProductCreationDTO request)
	{
		Category category = categoryService.getCategoryEntitiy(request.getCategoryId());
		User createdBy = jwtUtil.getAuthenticatedUser();

		Product newProduct = new Product(
			request.getSku(),
			request.getName(),
			request.getUnitPrice(),
			request.getCostPrice(),
			request.getReorderLevel(),
			request.getImage());
		newProduct.setCategory(category);
		newProduct.setCreatedBy(createdBy);
		productRepository.save(newProduct);
		return ProductDTO.fromEntity(newProduct);
	}

	@Transactional
	public void updateProduct(Long productId, ProductUpdateDTO request)
	{
		Product existing = getProductEntity(productId);
		Category category = categoryService.getCategoryEntitiy(request.getCategoryId());

		if (existing.isInactive()) {
			throw new IllegalStateException("Inactive product cannot be updated.");
		}
		if (category.isInactive()) {
			throw new IllegalStateException("Product with inactive category cannot be updated.");
		}

		existing.setSku(request.getSku());
		existing.setName(request.getName());
		existing.setCategory(category);
		existing.setUnitPrice(request.getUnitPrice());
		existing.setCostPrice(request.getCostPrice());
		existing.setReorderLevel(request.getReorderLevel());
		existing.setImage(request.getImage());
		productRepository.save(existing);
	}

	@Transactional
	public void removeProduct(Long productId)
	{
		Product existing = getProductEntity(productId);
		if (!existing.isInactive()) {
			existing.setInactive(true);
			productRepository.save(existing);
		}
	}

	public Product getProductEntity(Long productId)
	{
		return productRepository.findById(productId).orElseThrow(
			() -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));
	}

}

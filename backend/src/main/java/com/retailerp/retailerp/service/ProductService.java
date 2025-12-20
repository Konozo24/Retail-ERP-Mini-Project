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
import com.retailerp.retailerp.enums.PurchaseOrderStatus;
import com.retailerp.retailerp.model.Category;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.CategoryRepository;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.spec.ProductSpec;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final JwtUtil jwtUtil;

    @Transactional(rollbackFor = Exception.class)
    public void completePurchaseOrder(PurchaseOrder purchaseOrder) {
        if (purchaseOrder.getStatus() != PurchaseOrderStatus.DELIVERED) {
            throw new IllegalStateException("Purchase order is not completed yet.");
        }

        for (PurchaseOrderItem item : purchaseOrder.getItems()) {
            Product product = item.getProduct();
            product.setStockQty(product.getStockQty() + item.getQuantity());
            productRepository.save(product);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void checkAndReduceStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));

        if (product.getStockQty() < quantity) {
            throw new IllegalArgumentException(
                    "Not enough stock for product " + product.getName() + ". Available: " + product.getStockQty());
        }

        product.setStockQty(product.getStockQty() - quantity);
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(String search, String category, Pageable pageable) {
        // Get the existing search specification (Name/SKU)
        Specification<Product> spec = ProductSpec.getSpecification(search, category);

        return productRepository.findAll(spec, pageable)
            .map(ProductDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Product getProductEntity(Long productId) {
        return productRepository.findById(productId).orElseThrow(
                () -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));
    }

    @Transactional(readOnly = true)
    public ProductDTO getProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));
        return ProductDTO.fromEntity(product);
    }

    // Fetch all low stock products
    @Transactional(readOnly = true)
    public Page<ProductDTO> getLowStockProducts(String search, String category, Pageable pageable) {
        Long categoryId = null;
        if (!category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            categoryId = categoryRepository.findByName(category).orElseThrow(
                () -> new NoSuchElementException("Category with name, " + category + " doesn't exist!"))
                .getId();
        }


        return productRepository.findLowStock(search, categoryId, pageable)
                .map(ProductDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public String generateSKUById(Long categoryId) {
        String categoryPrefix = categoryId == null
            ? "PROD"
            : categoryRepository.findById(categoryId)
                    .map(Category::getPrefix)
                    .orElse("PROD");

        int randomNum = 1000 + new Random().nextInt(9000); // 4-digit number

        String randomSuffix = Long.toString(
                Math.abs(new Random().nextLong()), 36
        ).substring(0, 3).toUpperCase(); // 3 chars

        return String.format("%s%d-%s", categoryPrefix, randomNum, randomSuffix);
    }


    // Fetch all out of stock products
    @Transactional(readOnly = true)
    public Page<ProductDTO> getOutOfStockProducts(String search, String category, Pageable pageable) {
        Long categoryId = null;
        if (!category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            categoryId = categoryRepository.findByName(category).orElseThrow(
                () -> new NoSuchElementException("Category with name, " + category + " doesn't exist!"))
                .getId();
        }
        return productRepository.findOutOfStock(search, categoryId, pageable)
                .map(ProductDTO::fromEntity);
    }

    @Transactional
    public ProductDTO createProduct(ProductCreationDTO request) {
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(
                () -> new NoSuchElementException("Category with id, " + request.getCategoryId() + " doesn't exist!"));

        User createdBy = jwtUtil.getAuthenticatedUser();
        Product newProduct = new Product(
                request.getSku(),
                request.getName(),
                request.getUnitPrice(),
                request.getCostPrice(),
                request.getReorderLevel(),
                request.getImage()
            );
        newProduct.setCategory(category);
        newProduct.setCreatedBy(createdBy);
        productRepository.save(newProduct);
        return ProductDTO.fromEntity(newProduct);
    }

    @Transactional
    public void updateProduct(Long productId, ProductUpdateDTO request) {
        Product existing = productRepository.findById(productId).orElseThrow(
                () -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));

        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(
            () -> new NoSuchElementException("Category with id, " + request.getCategoryId() + " doesn't exist!"));

        existing.setSku(request.getSku());
        existing.setName(request.getName());
        existing.setCategory(category);
        existing.setUnitPrice(request.getUnitPrice());
        existing.setCostPrice(request.getCostPrice());
        existing.setStockQty(request.getStockQty());
        existing.setReorderLevel(request.getReorderLevel());
        existing.setImage(request.getImage());
        productRepository.save(existing);
    }

    @Transactional
    public void removeProduct(Long productId) {
        Product existing = productRepository.findById(productId).orElseThrow(
                () -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));

        if (!existing.isInactive()) {
            existing.setInactive(true);
            productRepository.save(existing);
        }
    }
}

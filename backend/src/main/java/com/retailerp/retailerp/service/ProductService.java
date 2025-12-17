package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;
import java.util.List;

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
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.spec.ProductSpec;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;

    @Transactional(rollbackFor = Exception.class)
    public void completePurchaseOrder(PurchaseOrder purchaseOrder) {
        if (purchaseOrder.getStatus() != PurchaseOrderStatus.COMPLETED) {
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
    public List<String> getCategories() {
        return productRepository.findAllCategories();
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(String search, String category, Pageable pageable) {
        // Get the existing search specification (Name/SKU)
        Specification<Product> spec = ProductSpec.getSpecification(search);

        // Append Category filter if it exists and isn't "All"
        if (category != null && !category.isEmpty() && !"All".equalsIgnoreCase(category)) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }

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

    @Transactional
    public ProductDTO createProduct(ProductCreationDTO request) {
        User createdBy = jwtUtil.getAuthenticatedUser();
        Product newProduct = new Product(
                request.getSku(),
                request.getName(),
                request.getCategory(),
                request.getUnitPrice(),
                request.getCostPrice(),
                request.getReorderLevel());
        newProduct.setCreatedBy(createdBy);
        newProduct.setImage(request.getImage());
        productRepository.save(newProduct);
        return ProductDTO.fromEntity(newProduct);
    }

    @Transactional
    public void updateProduct(Long productId, ProductUpdateDTO request) {
        Product existing = productRepository.findById(productId).orElseThrow(
                () -> new NoSuchElementException("Product with id, " + productId + " doesn't exist!"));

        existing.setSku(request.getSku());
        existing.setName(request.getName());
        existing.setCategory(request.getCategory());
        existing.setUnitPrice(request.getUnitPrice());
        existing.setCostPrice(request.getCostPrice());
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

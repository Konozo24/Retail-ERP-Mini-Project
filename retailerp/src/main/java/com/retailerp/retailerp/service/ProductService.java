package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.auth.JwtUtil;
import com.retailerp.retailerp.dto.product.ProductCreationDTO;
import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.dto.product.ProductUpdateDTO;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.ProductRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(ProductDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(
            () -> new NoSuchElementException(productId + ". deosnt exist!")
        );
        return ProductDTO.fromEntity(product);
    }

    public ProductDTO createProduct(ProductCreationDTO request) {
        Product newProduct = productRepository.save(
            new Product(
                request.getSku(),
                request.getName(), 
                request.getCategory(), 
                request.getUnitPrice(), 
                request.getCostPrice(), 
                request.getReorderLevel()
            )
        );
        User createdBy = jwtUtil.getAuthenticatedUser();
        newProduct.setCreatedBy(createdBy);
        return ProductDTO.fromEntity(newProduct);
    }

    @Transactional
    public void updateProduct(Long productId, ProductUpdateDTO request) {
        Product existing = productRepository.findById(productId).orElseThrow(
            () -> new NoSuchElementException(productId + ". deosnt exist!")
        );

        existing.setSku(request.getSku());
        existing.setName(request.getName());
        existing.setCategory(request.getCategory());
        existing.setUnitPrice(request.getUnitPrice());
        existing.setCostPrice(request.getCostPrice());
        existing.setStockQty(request.getStockQty());
        existing.setReorderLevel(request.getReorderLevel());
        productRepository.save(existing);
    }

    @Transactional
    public void removeProduct(Long productId) {
        productRepository.findById(productId).orElseThrow(
            () -> new NoSuchElementException(productId + ". deosnt exist!")
        );
        productRepository.deleteById(productId);
    }
}

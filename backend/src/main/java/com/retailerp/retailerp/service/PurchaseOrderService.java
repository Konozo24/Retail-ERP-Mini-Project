package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.auth.JwtUtil;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderCreationDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderUpdateDTO;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import com.retailerp.retailerp.model.Supplier;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.PurchaseOrderRepository;
import com.retailerp.retailerp.repository.SupplierRepository;
import com.retailerp.retailerp.repository.spec.PurchaseOrderSpec;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PurchaseOrderService {
    
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public Page<PurchaseOrderDTO> getPurchaseOrders(String search, Pageable pageable) {
        Specification<PurchaseOrder> spec = PurchaseOrderSpec.getSpecification(search);
        return purchaseOrderRepository.findAll(spec, pageable)
            .map(PurchaseOrderDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public PurchaseOrderDTO getPurchaseOrder(Long purchaseOrderId) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(purchaseOrderId).orElseThrow(
            () -> new NoSuchElementException(purchaseOrderId + ". deosnt exist!")
        );
        return PurchaseOrderDTO.fromEntity(purchaseOrder);
    }

    public PurchaseOrderDTO createPurchaseOrder(PurchaseOrderCreationDTO request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId()).orElseThrow(
            () -> new IllegalArgumentException("Supplier doesnt exist")
        );

        User user = jwtUtil.getAuthenticatedUser();
        
        PurchaseOrder newPurchaseOrder = new PurchaseOrder();
        newPurchaseOrder.setSupplier(supplier);
        newPurchaseOrder.setUser(user);
        
        request.getItems().forEach(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId()).orElseThrow(
                () -> new NoSuchElementException(itemDTO.getProductId() + ". deosnt exist!")
            );

            PurchaseOrderItem newPurchaseOrderItem = new PurchaseOrderItem(itemDTO.getQuantity(), itemDTO.getUnitCost());
            newPurchaseOrderItem.setProduct(product);
            newPurchaseOrder.addItem(newPurchaseOrderItem);
        }); 
        return PurchaseOrderDTO.fromEntity(newPurchaseOrder);
    }

    @Transactional
    public void updatePurchaseOrder(Long purchaseOrderId, PurchaseOrderUpdateDTO request) {
        PurchaseOrder existing = purchaseOrderRepository.findById(purchaseOrderId).orElseThrow(
            () -> new NoSuchElementException(purchaseOrderId + ". deosnt exist!")
        );
        existing.setStatus(request.getStatus());
        purchaseOrderRepository.save(existing);
    }

    @Transactional
    public void removePurchaseOrder(Long purchaseOrderId) {
        purchaseOrderRepository.findById(purchaseOrderId).orElseThrow(
            () -> new NoSuchElementException(purchaseOrderId + ". deosnt exist!")
        );
        purchaseOrderRepository.deleteById(purchaseOrderId);
    }
}

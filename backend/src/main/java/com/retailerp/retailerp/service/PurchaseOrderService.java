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
import com.retailerp.retailerp.enums.PurchaseOrderStatus;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import com.retailerp.retailerp.model.Supplier;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.PurchaseOrderRepository;
import com.retailerp.retailerp.repository.SupplierRepository;
import com.retailerp.retailerp.repository.spec.PurchaseOrderSpec;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class PurchaseOrderService {
    
    private final ProductService productService;

    private final PurchaseOrderRepository purchaseOrderRepository;
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
            () -> new NoSuchElementException("Purchase order with id, " + purchaseOrderId + " doesn't exist!")
        );
        return PurchaseOrderDTO.fromEntity(purchaseOrder);
    }

    @Transactional
    public PurchaseOrderDTO createPurchaseOrder(PurchaseOrderCreationDTO request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
            .orElseThrow(() -> new IllegalArgumentException("Supplier with id, " + request.getSupplierId() + " doesn't exist"));

        User user = jwtUtil.getAuthenticatedUser();

        PurchaseOrder newPurchaseOrder = new PurchaseOrder();
        newPurchaseOrder.setSupplier(supplier);
        newPurchaseOrder.setUser(user);

        newPurchaseOrder = purchaseOrderRepository.save(newPurchaseOrder);

        for (var itemDTO : request.getItems()) {
            Product product = productService.getProductEntity(itemDTO.getProductId());

            PurchaseOrderItem newItem = new PurchaseOrderItem(itemDTO.getQuantity(), product.getCostPrice());
            newItem.setProduct(product);
            newPurchaseOrder.addItem(newItem);
        }
        return PurchaseOrderDTO.fromEntity(purchaseOrderRepository.save(newPurchaseOrder));
    }

    @Transactional(rollbackFor = Exception.class)
    public void updatePurchaseOrder(Long purchaseOrderId, PurchaseOrderUpdateDTO request) {
        PurchaseOrder existing = purchaseOrderRepository.findById(purchaseOrderId)
            .orElseThrow(() -> new NoSuchElementException("Purchase order with id " + purchaseOrderId + " doesn't exist!"));

        if (existing.getStatus() == PurchaseOrderStatus.COMPLETED) {
            throw new IllegalStateException("Cannot update a completed purchase order");
        }

        if (existing.getStatus() != request.getStatus()) {
            existing.setStatus(request.getStatus());

            if (request.getStatus() == PurchaseOrderStatus.COMPLETED) {
                productService.completePurchaseOrder(existing);
            }
        }
    }


    @Transactional
    public void removePurchaseOrder(Long purchaseOrderId) {
        purchaseOrderRepository.findById(purchaseOrderId).orElseThrow(
            () -> new NoSuchElementException("Purchase order with id, " + purchaseOrderId + " doesn't exist!")
        );
        purchaseOrderRepository.deleteById(purchaseOrderId);
    }
}

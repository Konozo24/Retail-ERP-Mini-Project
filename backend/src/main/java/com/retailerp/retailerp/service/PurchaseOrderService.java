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
import com.retailerp.retailerp.dto.purchases.PurchaseOrderItemDTO;
import com.retailerp.retailerp.dto.purchases.PurchaseOrderUpdateDTO;
import com.retailerp.retailerp.enums.PurchaseOrderStatus;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.PurchaseOrder;
import com.retailerp.retailerp.model.PurchaseOrderItem;
import com.retailerp.retailerp.model.Supplier;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.PurchaseOrderItemRepository;
import com.retailerp.retailerp.repository.PurchaseOrderRepository;
import com.retailerp.retailerp.repository.spec.PurchaseOrderItemSpec;
import com.retailerp.retailerp.repository.spec.PurchaseOrderSpec;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

	private final PurchaseOrderRepository purchaseOrderRepository;

	private final PurchaseOrderItemRepository purchaseOrderItemRepository;

	private final ProductService productService;

	private final SupplierService supplierService;

	private final JwtUtil jwtUtil;

	@Transactional(readOnly = true)
	public Page<PurchaseOrderDTO> getPurchaseOrdersPage(String search, Pageable pageable)
	{
		Specification<PurchaseOrder> spec = PurchaseOrderSpec.getSpec(search);
		return purchaseOrderRepository.findAll(spec, pageable)
			.map(PurchaseOrderDTO::fromEntity);
	}

	@Transactional(readOnly = true)
	public Page<PurchaseOrderItemDTO> getPurchaseOrderItemPage(
		Long purchaseOrderId,
		String search,
		Long categoryId,
		Pageable pageable)
	{
		getPurchaseOrderEntity(purchaseOrderId); // Exist validation

		Specification<PurchaseOrderItem> spec = PurchaseOrderItemSpec.getItemsSpec(purchaseOrderId, search, categoryId);
		return purchaseOrderItemRepository.findAll(spec, pageable)
			.map(PurchaseOrderItemDTO::fromEntity);
	}

	@Transactional(rollbackFor = Exception.class)
	public PurchaseOrderDTO createPurchaseOrder(PurchaseOrderCreationDTO request)
	{
		Supplier supplier = supplierService.getSupplierEntitiy(request.getSupplierId());
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

	@Transactional
	public void updatePurchaseOrder(Long purchaseOrderId, PurchaseOrderUpdateDTO request)
	{
		PurchaseOrder existing = purchaseOrderRepository.findById(purchaseOrderId)
			.orElseThrow(
				() -> new NoSuchElementException("Purchase order with id " + purchaseOrderId + " doesn't exist!"));

		if (existing.getStatus() == PurchaseOrderStatus.DELIVERED) {
			throw new IllegalStateException("Cannot update a completed purchase order");
		}

		if (existing.getStatus() != request.getStatus()) {
			existing.setStatus(request.getStatus());

			if (request.getStatus() == PurchaseOrderStatus.DELIVERED) {
				completePurchaseOrder(existing);
			}
		}
	}

	public PurchaseOrder getPurchaseOrderEntity(Long purchaseOrderId)
	{
		return purchaseOrderRepository.findById(purchaseOrderId).orElseThrow(
			() -> new NoSuchElementException("Purchase order with id, " + purchaseOrderId + " doesn't exist!"));
	}

	private void completePurchaseOrder(PurchaseOrder purchaseOrder)
	{
		if (purchaseOrder.getStatus() != PurchaseOrderStatus.DELIVERED) {
			throw new IllegalStateException("Purchase order is not completed yet.");
		}

		for (PurchaseOrderItem item : purchaseOrder.getItems()) {
			Product product = item.getProduct();
			product.setStockQty(product.getStockQty() + item.getQuantity());
		}
	}
}

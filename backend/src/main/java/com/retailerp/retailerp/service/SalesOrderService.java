package com.retailerp.retailerp.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.retailerp.retailerp.auth.JwtUtil;
import com.retailerp.retailerp.dto.sales.SalesOrderCreationDTO;
import com.retailerp.retailerp.dto.sales.SalesOrderDTO;
import com.retailerp.retailerp.model.Customer;
import com.retailerp.retailerp.model.Product;
import com.retailerp.retailerp.model.SalesOrder;
import com.retailerp.retailerp.model.SalesOrderItem;
import com.retailerp.retailerp.model.User;
import com.retailerp.retailerp.repository.SalesOrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalesOrderService {

	private final SalesOrderRepository salesOrderRepository;

	private final CustomerService customerService;

	private final ProductService productService;

	private final JwtUtil jwtUtil;

	@Transactional(rollbackFor = Exception.class)
	public SalesOrderDTO createSalesOrder(SalesOrderCreationDTO request)
	{
		Customer customer = customerService.getCustomerEntitiy(request.getCustomerId());
		User user = jwtUtil.getAuthenticatedUser();

		SalesOrder newSalesOrder = new SalesOrder(request.getPaymentMethod());
		newSalesOrder.setCustomer(customer);
		newSalesOrder.setUser(user);
		newSalesOrder = salesOrderRepository.save(newSalesOrder);

		for (var itemDTO : request.getItems()) {
			Product product = productService.getProductEntity(itemDTO.getProductId());

			checkAndReduceStock(itemDTO.getProductId(), itemDTO.getQuantity());

			SalesOrderItem newItem = new SalesOrderItem(itemDTO.getQuantity(), product.getUnitPrice());
			newItem.setProduct(product);
			newSalesOrder.addItem(newItem);
		}
		return SalesOrderDTO.fromEntity(salesOrderRepository.save(newSalesOrder));
	}

	private void checkAndReduceStock(Long productId, Integer quantity)
	{
		Product existing = productService.getProductEntity(productId);
		if (existing.getStockQty() < quantity) {
			throw new IllegalArgumentException(
				"Not enough stock for product " + existing.getName() + ". Available: " + existing.getStockQty());
		}
		existing.setStockQty(existing.getStockQty() - quantity);
	}

}

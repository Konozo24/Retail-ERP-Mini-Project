package com.retailerp.retailerp.service;

import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
import com.retailerp.retailerp.repository.CustomerRepository;
import com.retailerp.retailerp.repository.SalesOrderRepository;
import com.retailerp.retailerp.repository.spec.SalesOrderSpec;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SalesOrderService {
    
    private final ProductService productService;

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public Page<SalesOrderDTO> getSalesOrders(String search, Pageable pageable) {
        return getSalesOrders(search, pageable, null, null);
    }

    @Transactional(readOnly = true)
    public Page<SalesOrderDTO> getSalesOrders(String search, Pageable pageable, String startDate, String endDate) {
        Specification<SalesOrder> spec = SalesOrderSpec.getSpecification(search, startDate, endDate);
        return salesOrderRepository.findAll(spec, pageable)
            .map(SalesOrderDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public SalesOrderDTO getSalesOrder(Long salesOrderId) {
        SalesOrder salesOrder = salesOrderRepository.findById(salesOrderId).orElseThrow(
            () -> new NoSuchElementException("Sales order with id, " + salesOrderId + " doesn't exist!")
        );
        return SalesOrderDTO.fromEntity(salesOrder);
    }

    @Transactional(rollbackFor = Exception.class)
    public SalesOrderDTO createSalesOrder(SalesOrderCreationDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId()).orElseThrow(
            () -> new IllegalArgumentException("Customer doesnt exist")
        );

        User user = jwtUtil.getAuthenticatedUser();
        
        SalesOrder newSalesOrder = new SalesOrder(request.getPaymentMethod());
        newSalesOrder.setCustomer(customer);
        newSalesOrder.setUser(user);
        
        newSalesOrder = salesOrderRepository.save(newSalesOrder);

        for (var itemDTO : request.getItems()) {
            Product product = productService.getProductEntity(itemDTO.getProductId());

            productService.checkAndReduceStock(itemDTO.getProductId(), itemDTO.getQuantity());

            SalesOrderItem newItem = new SalesOrderItem(itemDTO.getQuantity(), product.getUnitPrice());
            newItem.setProduct(product);
            newSalesOrder.addItem(newItem);
        }
        return SalesOrderDTO.fromEntity(salesOrderRepository.save(newSalesOrder));
    }

    @Transactional
    public void removeSalesOrder(Long salesOrderId) {
        salesOrderRepository.findById(salesOrderId).orElseThrow(
            () -> new NoSuchElementException("Sales order with id, " + salesOrderId + " doesn't exist!")
        );
        salesOrderRepository.deleteById(salesOrderId);
    }
}

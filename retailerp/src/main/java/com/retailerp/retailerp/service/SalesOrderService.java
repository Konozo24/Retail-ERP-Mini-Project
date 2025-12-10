package com.retailerp.retailerp.service;

import java.util.List;
import java.util.NoSuchElementException;

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
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.SalesOrderRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SalesOrderService {
    
    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public List<SalesOrderDTO> getSalesOrders() {
        return salesOrderRepository.findAll()
            .stream()
            .map(SalesOrderDTO::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public SalesOrderDTO getSalesOrder(Long salesOrderId) {
        SalesOrder salesOrder = salesOrderRepository.findById(salesOrderId).orElseThrow(
            () -> new NoSuchElementException(salesOrderId + ". deosnt exist!")
        );
        return SalesOrderDTO.fromEntity(salesOrder);
    }

    public SalesOrderDTO createSalesOrder(SalesOrderCreationDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId()).orElseThrow(
            () -> new IllegalArgumentException("Customer doesnt exist")
        );

        User user = jwtUtil.getAuthenticatedUser();
        
        SalesOrder newSalesOrder = new SalesOrder();
        newSalesOrder.setCustomer(customer);
        newSalesOrder.setUser(user);
        
        request.getItems().forEach(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId()).orElseThrow(
                () -> new NoSuchElementException(itemDTO.getProductId() + ". deosnt exist!")
            );

            SalesOrderItem newSalesOrderItem = new SalesOrderItem(itemDTO.getQuantity(), itemDTO.getUnitPrice());
            newSalesOrderItem.setProduct(product);
            newSalesOrder.addItem(newSalesOrderItem);
        }); 
        return SalesOrderDTO.fromEntity(newSalesOrder);
    }

    @Transactional
    public void removeSalesOrder(Long salesOrderId) {
        salesOrderRepository.findById(salesOrderId).orElseThrow(
            () -> new NoSuchElementException(salesOrderId + ". deosnt exist!")
        );
        salesOrderRepository.deleteById(salesOrderId);
    }
}

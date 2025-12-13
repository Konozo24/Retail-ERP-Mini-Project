package com.retailerp.retailerp.dto.sales;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import com.retailerp.retailerp.model.Customer;
import com.retailerp.retailerp.model.SalesOrder;
import com.retailerp.retailerp.model.SalesOrderItem;
import com.retailerp.retailerp.model.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SalesOrderDTO {
    
    private Long id;
    private User user;
    private Customer customer;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private OffsetDateTime createdAt;
    private List<SalesOrderItem> items;

    public static SalesOrderDTO fromEntity(SalesOrder order) {
        return SalesOrderDTO.builder()
            .id(order.getId())
            .user(order.getUser())
            .customer(order.getCustomer())
            .totalAmount(order.getTotalAmount())
            .paymentMethod(order.getPaymentMethod())
            .createdAt(order.getCreatedAt())
            .items(order.getItems())
            .build();
    }
}

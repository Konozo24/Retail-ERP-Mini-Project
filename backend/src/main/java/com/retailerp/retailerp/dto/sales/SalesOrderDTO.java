package com.retailerp.retailerp.dto.sales;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import com.retailerp.retailerp.model.SalesOrder;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SalesOrderDTO {
    
    private Long id;
    private String user;
    private String customer;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private OffsetDateTime createdAt;
    private List<SalesOrderItemDTO> items;

    public static SalesOrderDTO fromEntity(SalesOrder order) {
        return SalesOrderDTO.builder()
            .id(order.getId())
            .user(order.getUser().getEmail())
            .customer(order.getCustomer().getName())
            .totalAmount(order.getTotalAmount())
            .paymentMethod(order.getPaymentMethod())
            .createdAt(order.getCreatedAt())
            .items(SalesOrderItemDTO.fromEntities(order.getItems()))
            .build();
    }
}

package com.retailerp.retailerp.dto.sales;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SalesOrderCreationDTO {
 
    @NotNull
    private Long customerId;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    private BigDecimal totalAmount;

    @NotBlank
    @Max(20)
    private String paymentMethod;

    @NotNull
    @NotBlank
    @Valid
    private List<SalesOrderItemCreationDTO> items;
    
}

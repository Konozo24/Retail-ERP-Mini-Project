package com.retailerp.retailerp.dto.sales;

import java.util.List;

import com.retailerp.retailerp.enums.PaymentMethod;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SalesOrderCreationDTO {
 
    @NotNull
    private Long customerId;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    @NotEmpty
    @Valid
    private List<SalesOrderItemCreationDTO> items;
    
}

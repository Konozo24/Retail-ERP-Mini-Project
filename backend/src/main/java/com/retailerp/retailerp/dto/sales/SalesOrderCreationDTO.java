package com.retailerp.retailerp.dto.sales;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SalesOrderCreationDTO {
 
    @NotNull
    private Long customerId;

    @NotBlank
    @Size(max = 20)
    private String paymentMethod;

    @NotNull
    @NotEmpty
    @Valid
    private List<SalesOrderItemCreationDTO> items;
    
}

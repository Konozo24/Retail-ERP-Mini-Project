package com.retailerp.retailerp.dto.purchases;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PurchaseOrderUpdateDTO {
    
    @NotBlank
    @Max(20)
    private String status;

}

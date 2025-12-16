package com.retailerp.retailerp.dto.purchases;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class PurchaseOrderUpdateDTO {
    
    @NotBlank
    @Size(max = 20)
    private String status;

}

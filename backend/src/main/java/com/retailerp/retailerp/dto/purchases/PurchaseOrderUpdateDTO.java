package com.retailerp.retailerp.dto.purchases;

import com.retailerp.retailerp.enums.PurchaseOrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PurchaseOrderUpdateDTO {
    
    @NotNull
    private PurchaseOrderStatus status;

}

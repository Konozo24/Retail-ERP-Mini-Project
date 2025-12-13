package com.retailerp.retailerp.dto.purchases;

import java.math.BigDecimal;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class PurchaseOrderItemCreationDTO {

    @NotNull
    private Long productId;

    @NotNull
    @Size(min = 1)
    private Integer quantity;

    @NotNull
    @Digits(integer = 8, fraction = 2)
    private BigDecimal unitCost;

}

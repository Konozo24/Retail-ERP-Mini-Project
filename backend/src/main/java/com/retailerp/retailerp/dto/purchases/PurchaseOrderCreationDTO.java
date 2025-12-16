package com.retailerp.retailerp.dto.purchases;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PurchaseOrderCreationDTO {
    
    @NotNull
    private Long supplierId;

    @NotNull
    @NotEmpty
    @Valid
    private List<PurchaseOrderItemCreationDTO> items;

}

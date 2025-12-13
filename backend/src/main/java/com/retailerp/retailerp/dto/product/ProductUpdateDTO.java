package com.retailerp.retailerp.dto.product;

import java.math.BigDecimal;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ProductUpdateDTO {

    @NotBlank
    private String sku;

    @NotBlank
    @Max(150)
    private String name;

    @NotBlank
    @Max(100)
    private String category;

    @NotNull
    @Digits(integer = 8, fraction = 2)
    private BigDecimal unitPrice;

    @NotNull
    @Digits(integer = 8, fraction = 2)
    private BigDecimal costPrice;

    @Nullable
    @Min(0)
    private Integer stockQty;

    @NotNull
    @Min(0)
    private Integer reorderLevel;
    
}

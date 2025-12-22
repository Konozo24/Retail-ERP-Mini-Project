package com.retailerp.retailerp.dto.product;

import java.math.BigDecimal;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ProductCreationDTO {

	@NotBlank
	private String sku;

	@NotBlank
	@Size(max = 150)
	private String name;

	@NotNull
	private Long categoryId;

	@NotNull
	@Digits(integer = 8, fraction = 2)
	private BigDecimal unitPrice;

	@NotNull
	@Digits(integer = 8, fraction = 2)
	private BigDecimal costPrice;

	@NotNull
	@Min(0)
	private Integer reorderLevel;

	// Base64 encoded image (optional)
	@Nullable
	private String image;

}

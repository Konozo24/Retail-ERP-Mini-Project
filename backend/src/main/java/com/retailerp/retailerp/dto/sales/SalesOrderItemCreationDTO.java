package com.retailerp.retailerp.dto.sales;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SalesOrderItemCreationDTO {

	@NotNull
	private Long productId;

	@NotNull
	@Min(1)
	private Integer quantity;

}

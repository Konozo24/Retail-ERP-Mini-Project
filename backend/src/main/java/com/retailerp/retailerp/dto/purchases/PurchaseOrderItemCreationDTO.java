package com.retailerp.retailerp.dto.purchases;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PurchaseOrderItemCreationDTO {

	@NotNull
	private Long productId;

	@NotNull
	@Min(1)
	private Integer quantity;

}

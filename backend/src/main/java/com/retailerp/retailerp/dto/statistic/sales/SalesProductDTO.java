package com.retailerp.retailerp.dto.statistic.sales;

import java.math.BigDecimal;
import lombok.Getter;

@Getter
public class SalesProductDTO {

	private Long productId;

	private String productName;

	private String sku;

	private String categoryName;

	private Integer stockQty;

	private Integer soldQty;

	private BigDecimal soldAmount;

	public SalesProductDTO(
		Long productId, String productName, String sku,
		String categoryName, Integer stockQty,
		Integer soldQty, BigDecimal soldAmount) {
		this.productId = productId;
		this.productName = productName;
		this.sku = sku;
		this.categoryName = categoryName;
		this.stockQty = stockQty;
		this.soldQty = soldQty;
		this.soldAmount = soldAmount;
	}

}

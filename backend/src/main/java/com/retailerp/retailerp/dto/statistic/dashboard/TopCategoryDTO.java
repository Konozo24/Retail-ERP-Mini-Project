package com.retailerp.retailerp.dto.statistic.dashboard;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopCategoryDTO {

	private String categoryName;

	private String color;

	private Integer totalQuantity;

	private BigDecimal percentage;

	public TopCategoryDTO(String categoryName, String color, Integer totalQuantity) {
		this.categoryName = categoryName;
		this.color = color;
		this.totalQuantity = totalQuantity;
		this.percentage = BigDecimal.ZERO;
	}

		public TopCategoryDTO(String categoryName, String color, Integer totalQuantity, BigDecimal percentage) {
		this.categoryName = categoryName;
		this.color = color;
		this.totalQuantity = totalQuantity;
		this.percentage = percentage;
	}
}

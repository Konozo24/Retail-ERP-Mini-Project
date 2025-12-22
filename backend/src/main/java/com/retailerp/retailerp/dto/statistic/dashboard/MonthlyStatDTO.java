package com.retailerp.retailerp.dto.statistic.dashboard;

import java.math.BigDecimal;
import java.time.Month;
import lombok.Getter;

@Getter
@SuppressWarnings("unused")
public class MonthlyStatDTO {

	private Integer month;
	private String monthName;
	private BigDecimal total;

	public MonthlyStatDTO(Integer month, BigDecimal total) {
		this.month = month;
		this.monthName = getMonthName();
		this.total = total;
	}

	public String getMonthName() {
        return Month.of(this.month).name().substring(0, 3).toUpperCase();
    }
}

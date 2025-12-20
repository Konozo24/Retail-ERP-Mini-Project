package com.retailerp.retailerp.dto.statistic;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatisticRequestDTO {

    @Schema(example = "01/01/2024")
    @NotBlank(message = "Start date is required")
    @Pattern(regexp = "\\d{2}/\\d{2}/\\d{4}", message = "Start date must be in dd/MM/yyyy format")
    private String startDate;

    @Schema(example = "30/12/2026")
    @NotBlank(message = "End date is required")
    @Pattern(regexp = "\\d{2}/\\d{2}/\\d{4}", message = "End date must be in dd/MM/yyyy format")
    private String endDate;
    
}

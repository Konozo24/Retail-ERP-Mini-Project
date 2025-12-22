package com.retailerp.retailerp.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.dashboard.DashboardDTO;
import com.retailerp.retailerp.dto.statistic.StatisticDTO;
import com.retailerp.retailerp.dto.statistic.StatisticRequestDTO;
import com.retailerp.retailerp.service.DashboardService;
import com.retailerp.retailerp.service.StatisticsService;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
public class DashboardController {

	private final DashboardService dashboardService;
	private final StatisticsService statisticsService;

	@GetMapping("/statistics")
	public ResponseEntity<DashboardDTO> getDashboardStatistics() {
		DashboardDTO dto = dashboardService.getDashboardStatistics();
		return ResponseEntity.ok(dto);
	}

	@GetMapping("/sales")
	public ResponseEntity<StatisticDTO> getSalesStatistics(
			@RequestParam(defaultValue = "") String category,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@Schema(example = "01/01/2024") @RequestParam String startDate,
			@Schema(example = "01/01/2026") @RequestParam String endDate) {
		Pageable pageable = PageRequest.of(page, size);
		StatisticRequestDTO request = new StatisticRequestDTO();
		request.setStartDate(startDate);
		request.setEndDate(endDate);

		StatisticDTO dto = statisticsService.getSalesSatistics(category, pageable, request);
		return ResponseEntity.ok(dto);
	}
}

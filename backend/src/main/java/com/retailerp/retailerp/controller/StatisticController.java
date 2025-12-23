package com.retailerp.retailerp.controller;

import org.springdoc.core.converters.models.PageableAsQueryParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.retailerp.retailerp.dto.statistic.dashboard.DashboardStatDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesProductDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesStatsRequestDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesSummaryDTO;
import com.retailerp.retailerp.service.StatisticService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@PreAuthorize("hasAuthority('ADMIN')")
@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticController {

	private final StatisticService statisticService;

	@GetMapping("/dashboard")
	public ResponseEntity<DashboardStatDTO> getDashboardStats()
	{
		DashboardStatDTO dto = statisticService.getDashboardStats();
		return ResponseEntity.ok(dto);
	}

	@PostMapping("/sales/summary")
	public ResponseEntity<SalesSummaryDTO> getSalesSummaryStats(@Valid @RequestBody SalesStatsRequestDTO request)
	{
		SalesSummaryDTO dto = statisticService.getSalesSummary(request);
		return ResponseEntity.ok(dto);
	}

	@PostMapping("/sales/products")
	@PageableAsQueryParam
	public ResponseEntity<Page<SalesProductDTO>> getSalesProductsPageStats(
		@Valid @RequestBody SalesStatsRequestDTO request,
		@Parameter(hidden = true) Pageable pageable)
	{
		Page<SalesProductDTO> dto = statisticService.getSalesProducts(request, pageable);
		return ResponseEntity.ok(dto);
	}

}

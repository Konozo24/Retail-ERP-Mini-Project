package com.retailerp.retailerp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.dashboard.DashboardDTO;
import com.retailerp.retailerp.dto.statistic.StatisticDTO;
import com.retailerp.retailerp.dto.statistic.StatisticRequestDTO;
import com.retailerp.retailerp.service.DashboardService;
import com.retailerp.retailerp.service.StatisticsService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
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
        @Valid @RequestBody StatisticRequestDTO request
    ) {
        StatisticDTO dto = statisticsService.getSalesSatistics(request);
        return ResponseEntity.ok(dto);
    }
}

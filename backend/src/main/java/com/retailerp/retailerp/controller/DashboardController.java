package com.retailerp.retailerp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.retailerp.retailerp.dto.dashboard.DashboardDTO;
import com.retailerp.retailerp.service.DashboardService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "JWTAuth")
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;

    @GetMapping("/statistics")
    public ResponseEntity<DashboardDTO> getStatistics() {
        DashboardDTO dto = dashboardService.getDashboardStatistics();
        return ResponseEntity.ok(dto);
    }
}

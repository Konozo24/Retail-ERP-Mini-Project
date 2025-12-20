package com.retailerp.retailerp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.statistic.StatisticDTO;
import com.retailerp.retailerp.dto.statistic.StatisticProductDTO;
import com.retailerp.retailerp.dto.statistic.StatisticRequestDTO;
import com.retailerp.retailerp.repository.SalesOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    
    private final SalesOrderRepository salesOrderRepository;

    @Transactional(readOnly = true)
    public StatisticDTO getSalesSatistics(String category, Pageable pageable, StatisticRequestDTO request) {
        if (category != null && category.trim().isEmpty() || category.equalsIgnoreCase("ALL")) {
            category = null;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate startLocal = LocalDate.parse(request.getStartDate(), formatter);
        LocalDate endLocal = LocalDate.parse(request.getEndDate(), formatter);

        OffsetDateTime startDate = startLocal.atStartOfDay().atOffset(ZoneOffset.ofHours(8)); // Malaysia UTC+8
        OffsetDateTime endDate = endLocal.atTime(23, 59, 59).atOffset(ZoneOffset.ofHours(8));

        BigDecimal totalRevenue = salesOrderRepository.getRevenueBetween(category, startDate, endDate).orElse(BigDecimal.ZERO);
        Long totalOrders = salesOrderRepository.countOrdersBetween(category, startDate, endDate);
        Long totalItemSold = salesOrderRepository.getItemsSoldBetween(category, startDate, endDate);
        BigDecimal averageOrderValue = (totalOrders > 0) ? totalRevenue.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
    
        Page<StatisticProductDTO> productsStatistic = salesOrderRepository.getProductSalesSummary(category, startDate, endDate, pageable);
        return StatisticDTO.builder()
            .totalRevenue(totalRevenue)
            .totalOrders(totalOrders)
            .totalItemSold(totalItemSold)
            .averageOrderValue(averageOrderValue)
            .productsStatistic(productsStatistic)
            .build();
    }
}

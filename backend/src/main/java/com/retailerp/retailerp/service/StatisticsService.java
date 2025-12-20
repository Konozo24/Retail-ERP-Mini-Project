package com.retailerp.retailerp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.product.ProductDTO;
import com.retailerp.retailerp.dto.statistic.ProductStatisticProjection;
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
    public StatisticDTO getSalesSatistics(StatisticRequestDTO request) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate startLocal = LocalDate.parse(request.getStartDate(), formatter);
        LocalDate endLocal = LocalDate.parse(request.getEndDate(), formatter);

        OffsetDateTime startDate = startLocal.atStartOfDay().atOffset(ZoneOffset.ofHours(8)); // Malaysia UTC+8
        OffsetDateTime endDate = endLocal.atTime(23, 59, 59).atOffset(ZoneOffset.ofHours(8));

        BigDecimal totalRevenue = salesOrderRepository.getRevenueBetween(startDate, endDate).orElse(BigDecimal.ZERO);
        Long totalOrders = salesOrderRepository.countOrdersBetween(startDate, endDate);
        Long totalItemSold = salesOrderRepository.getItemsSoldBetween(startDate, endDate);
        BigDecimal averageOrderValue = (totalOrders > 0) ? totalRevenue.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        List<StatisticProductDTO> productsStatistic = salesOrderRepository.getProductSalesSummary(startDate, endDate)
            .stream()
            .map(row -> StatisticProductDTO.builder()
                .product(ProductDTO.fromEntity(row.getProduct()))
                .soldQty(row.getSoldQty())
                .soldAmount(row.getSoldAmount())
                .build()
            )
            .collect(Collectors.toList());

        // Filter by category if not empty
        if (request.getCategory() != null && !request.getCategory().isEmpty() && !"All".equalsIgnoreCase(request.getCategory())) {
            productsStatistic = productsStatistic.stream()
                    .filter(p -> p.getProduct().getCategory() != null &&
                                 request.getCategory().equalsIgnoreCase(p.getProduct().getCategory().getName()))
                    .collect(Collectors.toList());
        }

        // Apply pagination
        int pageNum = Math.max(0, request.getPageNum());
        int pageSize = Math.max(1, request.getPageSize());
        int startIndex = pageNum * pageSize;
        int endIndex = Math.min(startIndex + pageSize, productsStatistic.size());
        List<StatisticProductDTO> pagedProducts = startIndex < productsStatistic.size() ? productsStatistic.subList(startIndex, endIndex) : List.of();

        return StatisticDTO.builder()
            .totalRevenue(totalRevenue)
            .totalOrders(totalOrders)
            .totalItemSold(totalItemSold)
            .averageOrderValue(averageOrderValue)
            .productsStatistic(pagedProducts)
            .build();
    }
}

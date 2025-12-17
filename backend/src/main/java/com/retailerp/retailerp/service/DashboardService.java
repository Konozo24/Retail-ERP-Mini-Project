package com.retailerp.retailerp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retailerp.retailerp.dto.dashboard.*;
import com.retailerp.retailerp.repository.CustomerRepository;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.SalesOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public DashboardDTO getDashboardStatistics() {

        YearMonth currentMonth = YearMonth.now();
        YearMonth lastMonth = currentMonth.minusMonths(1);

        // ================= TOTAL REVENUE =================
        BigDecimal currentRevenue = getRevenueForMonth(currentMonth);
        BigDecimal lastRevenue = getRevenueForMonth(lastMonth);

        MetricDTO totalRevenue = MetricDTO.builder()
            .value(currentRevenue)
            .changePercentage(calculatePercentageChange(currentRevenue, lastRevenue))
            .build();

        // ================= SALES COUNT =================
        long currentSales = getSalesCountForMonth(currentMonth);
        long lastSales = getSalesCountForMonth(lastMonth);

        MetricDTO sales = MetricDTO.builder()
            .value(BigDecimal.valueOf(currentSales))
            .changePercentage(
                calculatePercentageChange(
                    BigDecimal.valueOf(currentSales),
                    BigDecimal.valueOf(lastSales)
                )
            )
            .build();

        // ================= NEW CUSTOMERS =================
        long currentCustomers = getCustomersForMonth(currentMonth);
        long lastCustomers = getCustomersForMonth(lastMonth);

        MetricDTO newCustomers = MetricDTO.builder()
            .value(BigDecimal.valueOf(currentCustomers))
            .changePercentage(
                calculatePercentageChange(
                    BigDecimal.valueOf(currentCustomers),
                    BigDecimal.valueOf(lastCustomers)
                )
            )
            .build();

        // ================= LOW STOCK =================
        long lowStockCount = productRepository.countLowStockItems();

        SimpleMetricDTO lowStockItems = SimpleMetricDTO.builder()
            .value(lowStockCount)
            .message("Requires attention immediately")
            .build();

        // ================= MONTHLY OVERVIEW =================
        List<MonthlyMetricDTO> overview = getMonthlyRevenueOverview();

        // ================= TOP CATEGORIES =================
        List<CategoryMetricDTO> topCategories = getTopCategories();

        return DashboardDTO.builder()
            .totalRevenue(totalRevenue)
            .sales(sales)
            .newCustomers(newCustomers)
            .lowStockItems(lowStockItems)
            .overview(overview)
            .topCategories(topCategories)
            .build();
    }

    // =====================================================
    // Helpers
    // =====================================================

    private BigDecimal getRevenueForMonth(YearMonth month) {
        OffsetDateTime start = month.atDay(1).atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = month.atEndOfMonth().atTime(23, 59, 59)
            .atOffset(OffsetDateTime.now().getOffset());

        return salesOrderRepository.getRevenueBetween(start, end)
            .orElse(BigDecimal.ZERO);
    }

    private long getSalesCountForMonth(YearMonth month) {
        OffsetDateTime start = month.atDay(1).atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = month.atEndOfMonth().atTime(23, 59, 59)
            .atOffset(OffsetDateTime.now().getOffset());

        return salesOrderRepository.countOrdersBetween(start, end);
    }

    private long getCustomersForMonth(YearMonth month) {
        OffsetDateTime start = month.atDay(1).atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = month.atEndOfMonth().atTime(23, 59, 59)
            .atOffset(OffsetDateTime.now().getOffset());

        return customerRepository.countCustomersBetween(start, end);
    }

    private List<MonthlyMetricDTO> getMonthlyRevenueOverview() {
        int year = Year.now().getValue();
        List<Object[]> raw = salesOrderRepository.getMonthlyRevenue(year);

        List<MonthlyMetricDTO> result = new ArrayList<>();
        Map<Integer, BigDecimal> revenueByMonth = raw.stream()
            .collect(Collectors.toMap(
                r -> (Integer) r[0],
                r -> (BigDecimal) r[1]
            ));

        for (int month = 1; month <= 12; month++) {
            result.add(
                MonthlyMetricDTO.builder()
                    .month(YearMonth.of(year, month).getMonth().name())
                    .value(revenueByMonth.getOrDefault(month, BigDecimal.ZERO))
                    .build()
            );
        }
        return result;
    }

    private List<CategoryMetricDTO> getTopCategories() {
    List<Object[]> raw = salesOrderRepository.getTopCategories(Year.now().getValue());

        // Convert raw data to a map: category -> amount
        List<Map.Entry<String, BigDecimal>> sortedCategories = raw.stream()
            .map(r -> Map.entry((String) r[0], ((Number) r[1]).doubleValue()))
            .map(e -> Map.entry(e.getKey(), BigDecimal.valueOf(e.getValue())))
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .toList();

        List<CategoryMetricDTO> result = new ArrayList<>();
        BigDecimal othersTotal = BigDecimal.ZERO;

        for (int i = 0; i < sortedCategories.size(); i++) {
            Map.Entry<String, BigDecimal> entry = sortedCategories.get(i);
            if (i < 4) {
                // Top 4 categories
                result.add(CategoryMetricDTO.builder()
                        .category(entry.getKey())
                        .total(entry.getValue())
                        .build());
            } else {
                // Sum the rest
                othersTotal = othersTotal.add(entry.getValue());
            }
        }

        if (othersTotal.compareTo(BigDecimal.ZERO) > 0) {
            result.add(CategoryMetricDTO.builder()
                    .category("Others")
                    .total(othersTotal)
                    .build());
        }

        return result;
    }

    private BigDecimal calculatePercentageChange(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(100);
        }
        return current.subtract(previous)
            .divide(previous, 2, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100));
    }
}

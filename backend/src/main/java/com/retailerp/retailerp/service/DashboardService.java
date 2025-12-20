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

import com.retailerp.retailerp.dto.dashboard.DashboardCategoryMetricDTO;
import com.retailerp.retailerp.dto.dashboard.DashboardDTO;
import com.retailerp.retailerp.dto.dashboard.DashboardMetricDTO;
import com.retailerp.retailerp.dto.dashboard.DashboardMonthlyMetricDTO;
import com.retailerp.retailerp.dto.dashboard.TopCategoryDTO;
import com.retailerp.retailerp.repository.CustomerRepository;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.SalesOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboardStatistics() {

        YearMonth currentMonth = YearMonth.now();
        YearMonth lastMonth = currentMonth.minusMonths(1);

        // ================= TOTAL REVENUE =================
        BigDecimal currentRevenue = getRevenueForMonth(currentMonth);
        BigDecimal lastRevenue = getRevenueForMonth(lastMonth);

        DashboardMetricDTO totalRevenue = DashboardMetricDTO.builder()
            .value(currentRevenue)
            .changePercentage(calculatePercentageChange(currentRevenue, lastRevenue))
            .build();

        // ================= SALES COUNT =================
        long currentSales = getSalesCountForMonth(currentMonth);
        long lastSales = getSalesCountForMonth(lastMonth);

        DashboardMetricDTO sales = DashboardMetricDTO.builder()
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

        DashboardMetricDTO newCustomers = DashboardMetricDTO.builder()
            .value(BigDecimal.valueOf(currentCustomers))
            .changePercentage(
                calculatePercentageChange(
                    BigDecimal.valueOf(currentCustomers),
                    BigDecimal.valueOf(lastCustomers)
                )
            )
            .build();

        // ================= LOW STOCK =================
        int lowStockCount = productRepository.countLowStockItems();

        // ================= MONTHLY OVERVIEW =================
        List<DashboardMonthlyMetricDTO> overview = getMonthlyRevenueOverview();

        // ================= TOP CATEGORIES =================
        List<DashboardCategoryMetricDTO> topCategories = getTopCategories();

        return DashboardDTO.builder()
            .totalRevenue(totalRevenue)
            .sales(sales)
            .newCustomers(newCustomers)
            .lowStockItems(lowStockCount)
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

        return salesOrderRepository.getRevenueBetween(null, start, end)
            .orElse(BigDecimal.ZERO);
    }

    private long getSalesCountForMonth(YearMonth month) {
        OffsetDateTime start = month.atDay(1).atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = month.atEndOfMonth().atTime(23, 59, 59)
            .atOffset(OffsetDateTime.now().getOffset());

        return salesOrderRepository.countOrdersBetween(null, start, end);
    }

    private long getCustomersForMonth(YearMonth month) {
        OffsetDateTime start = month.atDay(1).atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = month.atEndOfMonth().atTime(23, 59, 59)
            .atOffset(OffsetDateTime.now().getOffset());

        return customerRepository.countCustomersBetween(start, end);
    }

    private List<DashboardMonthlyMetricDTO> getMonthlyRevenueOverview() {
        int year = Year.now().getValue();
        List<Object[]> raw = salesOrderRepository.getMonthlyRevenue(year);

        List<DashboardMonthlyMetricDTO> result = new ArrayList<>();
        Map<Integer, BigDecimal> revenueByMonth = raw.stream()
            .collect(Collectors.toMap(
                r -> (Integer) r[0],
                r -> (BigDecimal) r[1]
            ));

        for (int month = 1; month <= 12; month++) {
            result.add(
                DashboardMonthlyMetricDTO.builder()
                    .month(YearMonth.of(year, month).getMonth().name().substring(0, 3))
                    .total(revenueByMonth.getOrDefault(month, BigDecimal.ZERO))
                    .build()
            );
        }
        return result;
    }

    private List<DashboardCategoryMetricDTO> getTopCategories() {
        List<TopCategoryDTO> raw = salesOrderRepository.getTopCategories(Year.now().getValue());

        // Calculate total quantity for percentages
        BigDecimal totalSum = raw.stream()
                .map(TopCategoryDTO::getTotalQuantity)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<DashboardCategoryMetricDTO> result = new ArrayList<>();
        BigDecimal othersTotal = BigDecimal.ZERO;

        for (int i = 0; i < raw.size(); i++) {
            TopCategoryDTO dto = raw.get(i);

            if (i < 4) { // Top 4 categories
                BigDecimal percentage = totalSum.compareTo(BigDecimal.ZERO) > 0
                        ? dto.getTotalQuantity()
                            .multiply(BigDecimal.valueOf(100))
                            .divide(totalSum, 2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO;

                result.add(DashboardCategoryMetricDTO.builder()
                        .category(dto.getCategoryName())
                        .total(dto.getTotalQuantity())
                        .percentage(percentage)
                        .color(dto.getColor())
                        .build());
            } else { // Rest go into "Others"
                othersTotal = othersTotal.add(dto.getTotalQuantity());
            }
        }

        // Add "Others" if any
        if (othersTotal.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal othersPercentage = totalSum.compareTo(BigDecimal.ZERO) > 0
                    ? othersTotal.multiply(BigDecimal.valueOf(100))
                            .divide(totalSum, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            result.add(DashboardCategoryMetricDTO.builder()
                    .category("Others")
                    .total(othersTotal)
                    .percentage(othersPercentage)
                    .color("#CCCCCC") // Optional: fixed color for Others
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

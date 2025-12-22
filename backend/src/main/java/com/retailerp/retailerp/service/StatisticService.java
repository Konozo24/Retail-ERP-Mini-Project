package com.retailerp.retailerp.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.Year;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.retailerp.retailerp.dto.statistic.dashboard.DashboardStatDTO;
import com.retailerp.retailerp.dto.statistic.dashboard.MetricDTO;
import com.retailerp.retailerp.dto.statistic.dashboard.MonthlyStatDTO;
import com.retailerp.retailerp.dto.statistic.dashboard.TopCategoryDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesProductDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesStatsRequestDTO;
import com.retailerp.retailerp.dto.statistic.sales.SalesSummaryDTO;
import com.retailerp.retailerp.repository.CustomerRepository;
import com.retailerp.retailerp.repository.ProductRepository;
import com.retailerp.retailerp.repository.SalesOrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticService {

	private final ZoneOffset ZONE_OFFSET = ZoneOffset.ofHours(8);

	private final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZONE_OFFSET);

	private final SalesOrderRepository salesOrderRepository;

	private final CustomerRepository customerRepository;

	private final ProductRepository productRepository;

	@Transactional(readOnly = true)
	public DashboardStatDTO getDashboardStats()
	{
		OffsetDateTime now = OffsetDateTime.now(ZONE_OFFSET);

		OffsetDateTime currMonthStart = now.with(TemporalAdjusters.firstDayOfMonth()).truncatedTo(ChronoUnit.DAYS);
		OffsetDateTime currMonthEnd = now.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX);

		OffsetDateTime lastMonthStart = currMonthStart.minusMonths(1);
		OffsetDateTime lastMonthEnd = currMonthStart.minusNanos(1);

		// ================= TOTAL REVENUE =================
		BigDecimal currentRevenue = salesOrderRepository.getRevenueBetween(null, currMonthStart, currMonthEnd);
		BigDecimal lastRevenue = salesOrderRepository.getRevenueBetween(null, lastMonthStart, lastMonthEnd);

		MetricDTO totalRevenue = MetricDTO.builder()
			.value(currentRevenue)
			.changePercentage(
				calculatePercentageChange(
					currentRevenue,
					lastRevenue))
			.build();

		// ================= SALES COUNT =================
		Integer currentSalesCount = salesOrderRepository.countOrdersBetween(null, currMonthStart, currMonthEnd);
		Integer lastSalesCount = salesOrderRepository.countOrdersBetween(null, lastMonthStart, lastMonthEnd);

		MetricDTO sales = MetricDTO.builder()
			.value(BigDecimal.valueOf(currentSalesCount))
			.changePercentage(
				calculatePercentageChange(
					BigDecimal.valueOf(currentSalesCount),
					BigDecimal.valueOf(lastSalesCount)))
			.build();

		// ================= NEW CUSTOMERS =================
		Long currentCustomers = customerRepository.countCustomersBetween(currMonthStart, currMonthEnd);
		Long lastCustomers = customerRepository.countCustomersBetween(lastMonthStart, lastMonthEnd);

		MetricDTO newCustomers = MetricDTO.builder()
			.value(BigDecimal.valueOf(currentCustomers))
			.changePercentage(
				calculatePercentageChange(
					BigDecimal.valueOf(currentCustomers),
					BigDecimal.valueOf(lastCustomers)))
			.build();

		// ================= LOW STOCK =================
		Integer lowStockCount = productRepository.countLowStockItems();

		// ================= MONTHLY OVERVIEW =================
		Integer year = Year.now().getValue();
		List<MonthlyStatDTO> overview = salesOrderRepository.getMonthlyRevenue(year);

		// Convert list to map for easier lookup
		Map<Integer, BigDecimal> monthToTotal = overview.stream()
			.collect(Collectors.toMap(MonthlyStatDTO::getMonth, MonthlyStatDTO::getTotal));

		// Build final list with all 12 months
		List<MonthlyStatDTO> filledOverview = IntStream.rangeClosed(1, 12)
			.mapToObj(month -> new MonthlyStatDTO(
				month,
				monthToTotal.getOrDefault(month, BigDecimal.ZERO)))
			.collect(Collectors.toList());

		// ================= TOP CATEGORIES =================
		List<TopCategoryDTO> topCategories = getTopCategories(year);

		return DashboardStatDTO.builder()
			.totalRevenue(totalRevenue)
			.sales(sales)
			.newCustomers(newCustomers)
			.lowStockItems(lowStockCount)
			.overview(filledOverview)
			.topCategories(topCategories)
			.build();
	}

	@Transactional(readOnly = true)
	public SalesSummaryDTO getSalesSummary(SalesStatsRequestDTO request)
	{
		Long categoryId = request.getCategoryId();

		OffsetDateTime startDate = LocalDate.parse(request.getStartDate(), FORMATTER)
			.atStartOfDay().atOffset(ZONE_OFFSET);

		OffsetDateTime endDate = LocalDate.parse(request.getEndDate(), FORMATTER)
			.atTime(23, 59, 59, 999_999_999).atOffset(ZONE_OFFSET);

		BigDecimal totalRevenue = salesOrderRepository.getRevenueBetween(categoryId, startDate, endDate);

		Integer totalOrders = salesOrderRepository.countOrdersBetween(categoryId, startDate, endDate);
		Integer totalItemSold = salesOrderRepository.countItemsSoldBetween(categoryId, startDate, endDate);

		BigDecimal averageOrderValue =
			(totalOrders > 0) ? totalRevenue.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP)
				: BigDecimal.ZERO;

		return SalesSummaryDTO.builder()
			.totalRevenue(totalRevenue)
			.totalOrders(totalOrders)
			.totalItemSold(totalItemSold)
			.averageOrderValue(averageOrderValue)
			.build();
	}

	@Transactional(readOnly = true)
	public Page<SalesProductDTO> getSalesProducts(
		SalesStatsRequestDTO request,
		Pageable pageable)
	{
		OffsetDateTime startDate = LocalDate.parse(request.getStartDate(), FORMATTER)
			.atStartOfDay().atOffset(ZONE_OFFSET);

		OffsetDateTime endDate = LocalDate.parse(request.getEndDate(), FORMATTER)
			.atTime(23, 59, 59, 999_999_999).atOffset(ZONE_OFFSET);

		return salesOrderRepository.getProductSalesSummary(request.getCategoryId(), startDate, endDate, pageable);
	}

	// =====================================================
	// Helpers
	// =====================================================

	private List<TopCategoryDTO> getTopCategories(Integer year)
	{
		List<TopCategoryDTO> raw = salesOrderRepository.getTopCategories(year);

		// Calculate total quantity for percentages
		BigDecimal totalSum = BigDecimal.valueOf(raw.stream().map(TopCategoryDTO::getTotalQuantity).reduce(0, Integer::sum));

		List<TopCategoryDTO> result = new ArrayList<>();
		Integer othersTotal = 0;

		for (Integer i = 0; i < raw.size(); i++) {
			TopCategoryDTO dto = raw.get(i);

			if (i < 4) { // Top 4 categories
				BigDecimal percentage = totalSum.compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.valueOf(dto.getTotalQuantity())
					.multiply(BigDecimal.valueOf(100)).divide(totalSum, 2, RoundingMode.HALF_UP)
					: BigDecimal.ZERO;

				result.add(new TopCategoryDTO(
					dto.getCategoryName(), dto.getColor(), dto.getTotalQuantity(), percentage));
			} else { // Rest go into "Others"
				othersTotal = othersTotal + dto.getTotalQuantity();
			}
		}

		// Add "Others" if any
		if (othersTotal > 0) {
			BigDecimal othersPercentage = totalSum.compareTo(BigDecimal.ZERO) > 0
				? BigDecimal.valueOf(othersTotal).multiply(BigDecimal.valueOf(100)).divide(totalSum, 2, RoundingMode.HALF_UP)
				: BigDecimal.ZERO;

			result.add(new TopCategoryDTO(
				"Others", "#CCCCCC", othersTotal, othersPercentage));
		}

		return result;
	}

	private BigDecimal calculatePercentageChange(BigDecimal current, BigDecimal previous)
	{
		if (previous.compareTo(BigDecimal.ZERO) == 0) {
			return current.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO : BigDecimal.valueOf(100);
		}
		return current.subtract(previous).divide(previous, 2, RoundingMode.HALF_UP)
			.multiply(BigDecimal.valueOf(100));
	}

}

package com.example.demo.finance.controller;

import com.example.demo.finance.dto.response.CategorySummaryResponse;
import com.example.demo.finance.dto.response.FinanceSummaryResponse;
import com.example.demo.finance.dto.response.MonthlyTrendResponse;
import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.service.FinanceAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class FinanceAnalyticsController {

    private final FinanceAnalyticsService analyticsService;

    public FinanceAnalyticsController(FinanceAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public FinanceSummaryResponse getSummary(
            @RequestParam int month,
            @RequestParam int year) {
        return analyticsService.getSummary(month, year);
    }

    @GetMapping("/analytics/category-summary")
    public List<CategorySummaryResponse> getCategorySummary(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam TransactionType type) {
        return analyticsService.getCategorySummary(month, year, type);
    }

    @GetMapping("/analytics/monthly-trend")
    public List<MonthlyTrendResponse> getMonthlyTrend(@RequestParam int year) {
        return analyticsService.getMonthlyTrend(year);
    }
}

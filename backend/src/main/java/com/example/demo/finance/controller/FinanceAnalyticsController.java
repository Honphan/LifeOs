package com.example.demo.finance.controller;

import com.example.demo.finance.enums.TransactionType;
import com.example.demo.finance.service.FinanceAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceAnalyticsController {

    private final FinanceAnalyticsService analyticsService;

    public FinanceAnalyticsController(FinanceAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(
            @RequestParam int month,
            @RequestParam int year) {
        return analyticsService.getSummary(month, year);
    }

    @GetMapping("/analytics/category-summary")
    public ResponseEntity<?> getCategorySummary(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam TransactionType type) {
        return analyticsService.getCategorySummary(month, year, type);
    }

    @GetMapping("/analytics/monthly-trend")
    public ResponseEntity<?> getMonthlyTrend(@RequestParam int year) {
        return analyticsService.getMonthlyTrend(year);
    }
}

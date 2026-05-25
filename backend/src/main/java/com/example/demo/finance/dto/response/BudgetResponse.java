package com.example.demo.finance.dto.response;

import java.math.BigDecimal;

public record BudgetResponse(
        Long id,
        String name,
        Long categoryId,
        String categoryName,
        BigDecimal amountLimit,
        BigDecimal spentAmount,
        BigDecimal remainingAmount,
        double percentageUsed,
        int month,
        int year
) {}

package com.example.demo.finance.dto.response;

import java.math.BigDecimal;

public record FinanceSummaryResponse(
        BigDecimal currentBalance,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal netBalance,
        long transactionCount
) {}

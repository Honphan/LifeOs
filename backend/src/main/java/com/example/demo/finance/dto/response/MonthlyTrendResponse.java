package com.example.demo.finance.dto.response;

import java.math.BigDecimal;

public record MonthlyTrendResponse(
        int month,
        BigDecimal income,
        BigDecimal expense
) {}

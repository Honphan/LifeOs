package com.example.demo.finance.dto.response;

import java.math.BigDecimal;

public record CategorySummaryResponse(
        String categoryName,
        BigDecimal totalAmount,
        double percentage,
        String categoryColor
) {}

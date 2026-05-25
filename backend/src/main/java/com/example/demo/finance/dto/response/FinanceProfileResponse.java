package com.example.demo.finance.dto.response;

import java.math.BigDecimal;

public record FinanceProfileResponse(
        BigDecimal currentBalance,
        BigDecimal initialBalance,
        String currency
) {}

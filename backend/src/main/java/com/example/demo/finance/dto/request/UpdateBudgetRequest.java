package com.example.demo.finance.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateBudgetRequest(
        @Size(max = 200) String name,
        Long categoryId,
        @DecimalMin("0.01") BigDecimal amountLimit,
        @Min(1) @Max(12) Integer month,
        @Min(2000) Integer year
) {}

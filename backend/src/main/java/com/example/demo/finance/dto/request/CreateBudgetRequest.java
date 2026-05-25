package com.example.demo.finance.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateBudgetRequest(
        @NotBlank @Size(max = 200) String name,
        @NotNull Long categoryId,
        @NotNull @DecimalMin("0.01") BigDecimal amountLimit,
        @NotNull @Min(1) @Max(12) Integer month,
        @NotNull @Min(2000) Integer year
) {}

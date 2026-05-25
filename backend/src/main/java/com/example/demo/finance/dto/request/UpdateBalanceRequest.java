package com.example.demo.finance.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateBalanceRequest(
        @NotNull @DecimalMin("0.0") BigDecimal currentBalance
) {}

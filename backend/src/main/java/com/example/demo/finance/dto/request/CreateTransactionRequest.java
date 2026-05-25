package com.example.demo.finance.dto.request;

import com.example.demo.finance.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateTransactionRequest(
        @NotBlank @Size(max = 200) String name,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotNull TransactionType type,
        @NotNull Long categoryId,
        @Size(max = 500) String note,
        @NotNull LocalDate transactionDate
) {}

package com.example.demo.finance.dto.request;

import com.example.demo.finance.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateTransactionRequest(
        @Size(max = 200) String name,
        @DecimalMin("0.01") BigDecimal amount,
        TransactionType type,
        Long categoryId,
        @Size(max = 500) String note,
        LocalDate transactionDate
) {}

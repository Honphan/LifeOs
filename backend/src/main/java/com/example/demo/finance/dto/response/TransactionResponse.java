package com.example.demo.finance.dto.response;

import com.example.demo.finance.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TransactionResponse(
        Long id,
        String name,
        BigDecimal amount,
        TransactionType type,
        Long categoryId,
        String categoryName,
        String categoryColor,
        String categoryIcon,
        String note,
        LocalDate transactionDate,
        List<AttachmentResponse> attachments,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

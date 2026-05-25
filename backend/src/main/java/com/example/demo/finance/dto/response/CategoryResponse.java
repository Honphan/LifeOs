package com.example.demo.finance.dto.response;

import com.example.demo.finance.enums.TransactionType;

public record CategoryResponse(
        Long id,
        String name,
        TransactionType type,
        String icon,
        String color,
        boolean isDefault
) {}

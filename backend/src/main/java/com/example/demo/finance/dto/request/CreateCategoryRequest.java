package com.example.demo.finance.dto.request;

import com.example.demo.finance.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCategoryRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull TransactionType type,
        @Size(max = 50) String icon,
        @Size(max = 20) String color
) {}

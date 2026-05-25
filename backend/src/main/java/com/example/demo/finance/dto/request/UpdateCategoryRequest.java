package com.example.demo.finance.dto.request;

import jakarta.validation.constraints.Size;

public record UpdateCategoryRequest(
        @Size(max = 100) String name,
        @Size(max = 50) String icon,
        @Size(max = 20) String color
) {}

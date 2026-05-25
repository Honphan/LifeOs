package com.example.demo.finance.dto.response;

import java.time.LocalDateTime;

public record AttachmentResponse(
        Long id,
        String imageUrl,
        String fileName,
        String fileType,
        long fileSize,
        LocalDateTime createdAt
) {}

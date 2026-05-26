package com.example.demo.common.dto;

public record UploadResponse(
        String url,
        String publicId,
        String fileName,
        String fileType,
        long fileSize
) {}
package com.example.demo.common.dto;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public record ApiResponse<T>(int statusCode, String message, T data) {

    private static final int OK_STATUS = 200;
    private static final int NOT_FOUND_STATUS = 404;

    public static <T> ApiResponse<T> of(HttpStatusCode statusCode, String message, T data) {
        int bodyStatus = statusCode.is2xxSuccessful() ? OK_STATUS : NOT_FOUND_STATUS;
        return new ApiResponse<>(bodyStatus, message, data);
    }

    public static <T> ApiResponse<T> success(HttpStatus status, String message, T data) {
        return new ApiResponse<>(OK_STATUS, message, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(OK_STATUS, message, data);
    }

    public static ApiResponse<Void> error(HttpStatusCode statusCode, String message) {
        return new ApiResponse<>(NOT_FOUND_STATUS, message, null);
    }

    public static ApiResponse<Void> error(String message) {
        return new ApiResponse<>(NOT_FOUND_STATUS, message, null);
    }
}
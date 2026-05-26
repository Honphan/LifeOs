package com.example.demo.auth;

import com.example.demo.auth.dto.AuthRequest;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ApiResponse<AuthResponse>> login(AuthRequest request);
    ResponseEntity<ApiResponse<AuthResponse>> register(AuthRequest request);
}

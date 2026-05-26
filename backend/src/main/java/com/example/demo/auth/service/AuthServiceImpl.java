package com.example.demo.auth.service;

import com.example.demo.auth.AuthService;
import com.example.demo.auth.dto.AuthRequest;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.common.dto.ApiResponse;
import com.example.demo.security.JwtProvider;
import com.example.demo.user.UserService;
import com.example.demo.user.dto.UserAuthDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(UserService userService, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Override
    public ResponseEntity<ApiResponse<AuthResponse>> login(AuthRequest request) {
        if (!userService.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai mật khẩu hoặc tên đăng nhập!");
        }

        UserAuthDto user = userService.getByUsername(request.username());
        if (!passwordEncoder.matches(request.password(), user.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai mật khẩu hoặc tên đăng nhập!");
        }

        String token = jwtProvider.createToken(request.username());
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", new AuthResponse(token)));
    }

    @Override
    public ResponseEntity<ApiResponse<AuthResponse>> register(AuthRequest request) {
        if (userService.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên đăng nhập đã tồn tại!");
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        userService.createUser(request.username(), encodedPassword);
        String token = jwtProvider.createToken(request.username());
        return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công", new AuthResponse(token)));
    }
}
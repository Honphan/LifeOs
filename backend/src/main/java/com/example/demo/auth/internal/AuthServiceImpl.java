package com.example.demo.auth.internal;

import com.example.demo.auth.AuthService;
import com.example.demo.auth.dto.AuthRequest;
import com.example.demo.auth.dto.AuthResponse;
import com.example.demo.security.internal.JwtProvider;
import com.example.demo.user.UserService;
import com.example.demo.user.dto.UserAuthDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public ResponseEntity<AuthResponse> login(AuthRequest request) {
        if (!userService.existsByUsername(request.username())) {
            return ResponseEntity.status(401).body(new AuthResponse("", "Sai mật khẩu hoặc tên đăng nhập!"));
        }

        UserAuthDto user = userService.getByUsername(request.username());
        if (!passwordEncoder.matches(request.password(), user.password())) {
            return ResponseEntity.status(401).body(new AuthResponse("", "Sai mật khẩu hoặc tên đăng nhập!"));
        }

        String token = jwtProvider.createToken(request.username());
        return ResponseEntity.ok(new AuthResponse(token, "Đăng nhập thành công!"));
    }

    @Override
    public ResponseEntity<AuthResponse> register(AuthRequest request) {
        if (userService.existsByUsername(request.username())) {
            return ResponseEntity.status(400).body(new AuthResponse("", "Tên đăng nhập đã tồn tại!"));
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        userService.createUser(request.username(), encodedPassword);
        String token = jwtProvider.createToken(request.username());
        return ResponseEntity.ok(new AuthResponse(token, "Đăng ký thành công!"));
    }
}

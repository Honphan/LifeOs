package com.example.demo.user.dto;

public record UserAuthDto(
        Long id,
        String username,
        String password
) {}
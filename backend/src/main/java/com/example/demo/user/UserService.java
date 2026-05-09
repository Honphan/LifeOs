package com.example.demo.user;

public interface UserService {
    void processOAuthPostLogin(String email, String name, String picture);
    UserDto getUserByEmail(String email);
}
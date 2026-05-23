package com.example.demo.user;

import com.example.demo.user.dto.UserAuthDto;
import com.example.demo.user.dto.UserDto;

public interface UserService {
    void processOAuthPostLogin(String email, String name, String picture);
    UserDto getUserByEmail(String email);
    UserAuthDto getByUsername(String username);
    boolean existsByUsername(String username);
    void createUser(String username, String encodedPassword);
}
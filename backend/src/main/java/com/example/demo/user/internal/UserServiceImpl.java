package com.example.demo.user.internal;

import com.example.demo.user.UserDto;
import com.example.demo.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void processOAuthPostLogin(String email, String name, String picture) {
        User user = userRepository.findByEmail(email).orElse(new User());
        user.setEmail(email);
        user.setName(name);
        user.setPicture(picture);
        userRepository.save(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(u -> new UserDto(u.getId(), u.getEmail(), u.getName(), u.getPicture()))
                .orElse(null);
    }
}
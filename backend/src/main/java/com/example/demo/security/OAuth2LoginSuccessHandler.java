package com.example.demo.security;

import com.example.demo.config.FrontendProperties;
import com.example.demo.security.internal.JwtProvider;
import com.example.demo.user.UserService;
import com.example.demo.user.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final FrontendProperties frontendProperties;

    OAuth2LoginSuccessHandler(
            UserService userService,
            JwtProvider jwtProvider,
            FrontendProperties frontendProperties) {
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.frontendProperties = frontendProperties;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        userService.processOAuthPostLogin(email, name, picture);

        String token = jwtProvider.createToken(email);
        UserDto user = userService.getUserByEmail(email);

        UriComponentsBuilder redirect = UriComponentsBuilder
                .fromUriString(frontendProperties.getUrl())
                .path(frontendProperties.getOauthSuccessPath())
                .queryParam("token", token);

        if (user != null) {
            if (user.email() != null) {
                redirect.queryParam("email", user.email());
            }
            if (user.name() != null) {
                redirect.queryParam("name", user.name());
            }
            if (user.picture() != null) {
                redirect.queryParam("picture", user.picture());
            }
        }

        response.sendRedirect(redirect.encode(StandardCharsets.UTF_8).build().toUriString());
    }
}

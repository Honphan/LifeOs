package com.example.demo.security;

import com.example.demo.user.UserService;
import com.example.demo.security.internal.JwtProvider; // Giả sử bạn để JwtProvider ở internal
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           UserService userService,
                                           JwtProvider jwtProvider) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login/**", "/oauth2/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .successHandler((request, response, authentication) -> {
                           OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

                            assert oauth2User != null;
                            String email = oauth2User.getAttribute("email");
                            String name = oauth2User.getAttribute("name");
                            String picture = oauth2User.getAttribute("picture");
                            System.out.println("Đăng nhập thành công: " + email);

                            userService.processOAuthPostLogin(email, name, picture);

                            String token = jwtProvider.createToken(email);

                            response.sendRedirect("http://localhost:3000/callback?token=" + token);
                        })
                );

        return http.build();
    }
}
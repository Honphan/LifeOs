package com.example.demo.security;



import com.example.demo.security.internal.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfigurationSource;



@Configuration

public class SecurityConfig {



    @Bean

    public SecurityFilterChain filterChain(

            HttpSecurity http,

            JwtAuthenticationFilter jwtAuthenticationFilter,

            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,

            CorsConfigurationSource corsConfigurationSource) throws Exception {

        http

                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/oauth2/**", "/uploads/**", "/api/uploads/**", "/api/finance/**").permitAll()

                        .anyRequest().authenticated()

                )

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .oauth2Login(oauth -> oauth.successHandler(oAuth2LoginSuccessHandler));



        return http.build();

    }



    @Bean

    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

}


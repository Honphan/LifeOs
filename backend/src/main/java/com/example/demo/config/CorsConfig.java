package com.example.demo.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableConfigurationProperties({CorsProperties.class, FrontendProperties.class})
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource(CorsProperties corsProperties) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(nonBlank(corsProperties.getAllowedOrigins()));
        configuration.setAllowedMethods(nonBlank(corsProperties.getAllowedMethods()));
        configuration.setAllowedHeaders(nonBlank(corsProperties.getAllowedHeaders()));
        List<String> exposedHeaders = nonBlank(corsProperties.getExposedHeaders());
        if (!exposedHeaders.isEmpty()) {
            configuration.setExposedHeaders(exposedHeaders);
        }
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        configuration.setMaxAge(corsProperties.getMaxAge());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private static List<String> nonBlank(List<String> values) {
        return values.stream()
                .filter(value -> value != null && !value.isBlank())
                .toList();
    }
}

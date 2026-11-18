
package com.hostelhub.config;

import com.hostelhub.component.AuthEntryPointJwt;
import com.hostelhub.component.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthEntryPointJwt authEntryPointJwt;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                authEntryPointJwt
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow Spring Boot error dispatch
                        .requestMatchers("/error").permitAll()

                        // Public authentication
                        .requestMatchers("/api/auth/**").permitAll()

                        // First-time installation setup
                        .requestMatchers("/api/setup/**").permitAll()

                        // Allow Swagger UI and OpenAPI documentation
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Student personal APIs
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/me"
                        ).hasRole("STUDENT")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/allocations/my"
                        ).hasRole("STUDENT")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/maintenance/my"
                        ).hasRole("STUDENT")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/maintenance/my"
                        ).hasRole("STUDENT")

                        // Maintenance staff personal APIs
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/maintenance/my-assigned"
                        ).hasRole("MAINTENANCE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/maintenance/*/my-status/*"
                        ).hasRole("MAINTENANCE")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/maintenance"
                        ).hasRole("MAINTENANCE")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/student"
                        ).hasRole("STUDENT")

                        // Existing Admin APIs
                        .requestMatchers("/api/roles/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/hostels/**").hasRole("ADMIN")
                        .requestMatchers("/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers("/api/allocations/**").hasRole("ADMIN")
                        .requestMatchers("/api/maintenance/**").hasRole("ADMIN")
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/admin"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/rooms/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/dashboard/hostels/**"
                        ).hasRole("ADMIN")

                        // Deny everything else
                        .anyRequest().denyAll()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}


package com.hostelhub.component;

import com.hostelhub.serviceImpl.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("\n===== JWT FILTER START =====");
        System.out.println("REQUEST: " + request.getMethod()
                + " " + request.getRequestURI());

        String authorizationHeader =
                request.getHeader("Authorization");

        System.out.println("BEARER TOKEN PRESENT: "
                + (authorizationHeader != null
                && authorizationHeader.startsWith("Bearer ")));

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        try {
            if (jwtTokenProvider.validateToken(token)) {

                String email =
                        jwtTokenProvider.getEmailFromToken(token);

                System.out.println("JWT EMAIL: " + email);

                if (SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

                    UserDetails userDetails =
                            userDetailsService.loadUserByUsername(email);

                    System.out.println("LOADED USER: "
                            + userDetails.getUsername());

                    System.out.println("LOADED AUTHORITIES: "
                            + userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    Authentication currentAuthentication =
                            SecurityContextHolder.getContext()
                                    .getAuthentication();

                    System.out.println("CONTEXT AUTHENTICATION: "
                            + currentAuthentication);

                    System.out.println("IS AUTHENTICATED: "
                            + currentAuthentication.isAuthenticated());

                    System.out.println("FINAL AUTHORITIES: "
                            + currentAuthentication.getAuthorities());

                } else {
                    System.out.println("AUTHENTICATION ALREADY EXISTS: "
                            + SecurityContextHolder.getContext()
                            .getAuthentication());
                }
            }

        } catch (Exception exception) {

            System.out.println("JWT AUTHENTICATION ERROR: "
                    + exception.getClass().getName());

            System.out.println("ERROR MESSAGE: "
                    + exception.getMessage());

            exception.printStackTrace();

            SecurityContextHolder.clearContext();
        }

        System.out.println("BEFORE FILTER CHAIN: "
                + SecurityContextHolder.getContext()
                .getAuthentication());

        filterChain.doFilter(request, response);

        System.out.println("RESPONSE STATUS: " + response.getStatus());
        System.out.println("===== JWT FILTER END =====\n");
    }
}

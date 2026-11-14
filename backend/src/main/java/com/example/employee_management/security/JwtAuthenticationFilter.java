package com.example.employee_management.security;

import com.example.employee_management.config.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        System.out.println("=================================");
        System.out.println("Request: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("Authorization Header: " + authHeader);

        // No Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("NO JWT TOKEN FOUND");

            filterChain.doFilter(request, response);
            return;
        }

        // Extract JWT
        String token = authHeader.substring(7);

        System.out.println("JWT TOKEN FOUND");

        try {

            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            System.out.println("JWT EMAIL: " + email);
            System.out.println("JWT ROLE: " + role);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + role);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(authority)
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println("AUTHENTICATION SET SUCCESSFULLY");
                System.out.println("AUTHORITY: " + authority.getAuthority());

            }

        } catch (Exception e) {

            System.out.println("JWT ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}
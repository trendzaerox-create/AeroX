

package com.mydev.ecommerce.auth.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("JWT PATH = " + request.getRequestURI());
        // System.out.println("JWT HEADER = " + authHeader);

        System.out.println("JWT HEADER PRESENT = " + (authHeader != null));

        if (authHeader != null
                && authHeader.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            String token = authHeader.substring(7);

            try {
                Claims claims = jwtService.parseClaims(token);

                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);

                System.out.println("JWT EMAIL = " + email);
                System.out.println("JWT ROLE = " + role);

                if (email != null && !email.isBlank()) {
                    String safeRole = (role == null || role.isBlank()) ? "USER" : role.trim();

                    var authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + safeRole)
                    );

                    var authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("JWT AUTH SET = " + email);
                }

            } catch (Exception e) {
                System.out.println("JWT ERROR = " + e.getClass().getName() + " :: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
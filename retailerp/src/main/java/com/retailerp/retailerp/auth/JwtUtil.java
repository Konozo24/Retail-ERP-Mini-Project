package com.retailerp.retailerp.auth;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.retailerp.retailerp.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final int TOKEN_LIFETIME = 1000 * 60 * 6; // 1 hour
    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); //"AOI9D3S2DDSIID3ASDDAPSJDJD41656C6JF22l20Al56E67";

    SecretKey getSigningKey() {
        //byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        //return Keys.hmacShaKeyFor(keyBytes);
        return SECRET_KEY;
    }

    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_LIFETIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Long extractUserId(String token) {
        return Long.valueOf(
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject()
        );
    }

    public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
            throw new UnauthorizedException("User is not authenticated");
        }

        AuthUser authUser = (AuthUser) auth.getPrincipal();
        return authUser.getUser();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
            .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
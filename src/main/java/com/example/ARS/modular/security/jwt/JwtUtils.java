package com.example.ARS.modular.security.jwt;

import com.example.ARS.modular.security.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${application.jwt.secretKey}")
    private String jwtSecrete;

    @Value("${application.jwt.tokenExpirationAfterDays}")
    private int jwtExpirationDays;

    public String generateJwtToken(Authentication authentication){

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        return Jwts.builder().setSubject((userPrincipal.getUsername())).setIssuedAt(new Date())
                .setExpiration(java.sql.Date.valueOf(LocalDate.now().plusDays(jwtExpirationDays)))
                .signWith(Keys.hmacShaKeyFor(jwtSecrete.getBytes()))
                .compact();
    }

    public String getNameFromJwtToken(String token){
        return Jwts.parser().setSigningKey(Keys.hmacShaKeyFor(jwtSecrete.getBytes())).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validJwtToken(String jwt) {
        try{
            Jwts.parser().setSigningKey(Keys.hmacShaKeyFor(jwtSecrete.getBytes())).parseClaimsJws(jwt);
            return true;
        } catch (SignatureException e){
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;

    }
}
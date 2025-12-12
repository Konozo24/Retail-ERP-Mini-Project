package com.retailerp.retailerp.auth;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.retailerp.retailerp.model.User;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthUser implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getCipherText();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }
    
    public Long getId() {
        return user.getId();
    }

    public User getUser() {
        return user;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}

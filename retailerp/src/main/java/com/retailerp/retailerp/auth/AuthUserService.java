package com.retailerp.retailerp.auth;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.retailerp.retailerp.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthUserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public AuthUser loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
            .map(AuthUser::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public AuthUser loadUserByUserId(Long userId) throws UsernameNotFoundException {
        return userRepository.findById(userId)
            .map(AuthUser::new)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}